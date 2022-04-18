from flask import abort, Flask,  render_template, redirect, request, session, make_response, session, redirect
from neo4j import GraphDatabase, basic_auth
import os

import spotipy
import requests
import pandas as pd
import spotipy.util as util
import uuid
import flask_session
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
import logging
import sys

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
logging.getLogger("neo4j").addHandler(handler)
logging.getLogger("neo4j").setLevel(logging.DEBUG)

app = Flask(__name__)

# Spotify client ID.
client = "fa3d536582f44c219b86b4f107e7e37b"

# Spotify client secret.
secret = "15c93a44798a43009fdd48f6517894a0"
app.secret_key = secret
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
    client_id=client, client_secret=secret))

# Spotify API endpoints
API_BASE = 'https://accounts.spotify.com'
REDIRECT_URI = 'http://127.0.0.1:5000/api_callback'

SCOPE = 'playlist-modify-private,playlist-modify-public,user-top-read'

SHOW_DIALOG = True

playlist_uri = "37i9dQZF1EIX9R1g2WoGUL"


def recreate_contraints(neo4j):
    # recreate constraints / indices and clear existing database.
    results = neo4j.run("CALL db.constraints")
    for constraint in results:
        result = neo4j.run("DROP " + constraint['description'])
    neo4j.run("CREATE CONSTRAINT ON (g:Genre) ASSERT g.name IS UNIQUE")
    neo4j.run("CREATE CONSTRAINT ON (p:Playlist) ASSERT p.name IS UNIQUE")
    neo4j.run("CREATE CONSTRAINT ON (a:Album) ASSERT a.id IS UNIQUE")
    neo4j.run("CREATE CONSTRAINT ON (s:SuperGenre) ASSERT s.id IS UNIQUE")
    neo4j.run("CREATE CONSTRAINT ON (a:Artist) ASSERT a.id IS UNIQUE")
    neo4j.run("CREATE CONSTRAINT ON (t:Track) ASSERT t.id IS UNIQUE")
    neo4j.run("MATCH (n) DETACH DELETE n;")

def create_neo4j_session(url, user, password):
    driver = GraphDatabase.driver(url, auth=(user, password))
    return driver.session()


session = create_neo4j_session(
    url="bolt://localhost:7687", user="neo4j", password="M0ng0k1ss24@")

recreate_contraints(session)



def get_tracks():
    results = spotify.playlist(playlist_uri)['tracks']
    items = {}
    while results['next'] or results['previous'] is None:
        for track in results["items"]:
            if track['track']['id']:
                track['track']['artists'] = [artist if type(artist) == str else artist['id'] for artist in
                                             track['track']['artists']]
                track['track']['album'] = track['track']['album'] if type(track['track']['album']) == str else \
                    track['track']['album']['id']
                items[track['track']['id']] = track['track']
            for field in track['track']:
                if track is not None and type(track['track'][field]) == dict:
                    track['track'][field] = None
        if not results['next']:
            break
        results = spotify.next(results)
    return items


def get_track_audio_features(tracks, page_size=100):
    page_count = len(tracks) / page_size
    for i in range(int(page_count) + 1):
        ids = list(tracks.keys())[i * page_size:(i + 1) * page_size]
        if len(ids) == 0:
            break
        audio_features = spotify.audio_features(tracks=ids)
        for track_features in audio_features:
            if track_features is None:
                continue
            track_id = track_features['id']
            for feature, value in track_features.items():
                if feature != 'type':
                    tracks[track_id][feature] = value
    return tracks



tracks = get_tracks()
tracks = get_track_audio_features(tracks)
session.run("UNWIND $tracks as track CREATE (t:Track{id: track.id}) SET t = track",
          parameters={'tracks': list(tracks.values())})


def get_album_info(tracks, page_size=20):
    album_ids = set()
    for track_id in tracks.keys():
        album_ids.add(tracks[track_id]['album'])

    all_albums = {}
    page_count = len(album_ids) / page_size
    for i in range(int(page_count) + 1):
        ids = list(album_ids)[i * page_size:(i + 1) * page_size]
        results = spotify.albums(ids)

        for album in results['albums']:
            album['artists'] = [artist['id'] for artist in album['artists']]
            album['images'] = album['images'][1]['url']
            album['external_ids'] = None
            album['external_urls'] = None
            album['tracks'] = len(album['tracks'])
            album['copyrights'] = len(album['copyrights'])
            all_albums[album['id']] = album
    return all_albums


albums = get_album_info(tracks)
session.run("UNWIND $albums as album CREATE (a:Album{id: a.id}) SET a = album",
          parameters={'albums': list(albums.values())})

def get_artist_info(items, page_size=50):
    all_artists = {}
    artist_ids = set()
    for track_id in items.keys():
        for artist_nr in items[track_id]['artists']:
            artist_id = artist_nr
            artist_ids.add(artist_id)

    # after we have a list of all artists, get the details from the API
    page_count = len(artist_ids) / page_size
    for i in range(int(page_count) + 1):
        ids = list(artist_ids)[i * page_size:(i + 1) * page_size]
        results = spotify.artists(ids)
        for artist in results['artists']:
            if artist["images"]:
                artist['images'] = artist['images'][1]['url']
            artist['followers'] = artist['followers']['total']
            artist['external_urls'] = None
            all_artists[artist['id']] = artist
    return all_artists

artists = get_artist_info(tracks)
session.run("UNWIND $artists as artist CREATE (a:Artist{id: a.id}) SET a = artist",
            parameters={'artists': list(artists.values())})

def get_genres(albums, artists):
    genres = set()
    for item in albums:
        for genre in albums[item]['genres']:
            genres.add(genre)
    for item in artists:
        for genre in artists[item]['genres']:
            genres.add(genre)
    return genres


genres = get_genres(albums, artists)
session.run("UNWIND $genres as genre MERGE (g:Genre{name: genre})",
          parameters={'genres': list(genres)})

session.run(
    "MATCH (t:Track), (a:Album{id: t.album}) CREATE (t)-[:IN_ALBUM]->(a);")
session.run(
    "MATCH (t:Track) UNWIND t.artists as artist MATCH (a:Artist{id: artist}) CREATE (t)-[:HAS_ARTIST]->(a)")
session.run(
    "MATCH (a:Artist) UNWIND a.genres as genre MATCH (g:Genre{name: genre}) CREATE (a)-[:HAS_GENRE]->(g)")


def cluster_genres_with_gds(session):
    result = session.run("""
    CALL gds.graph.exists($name) YIELD exists WHERE exists CALL gds.graph.drop($name) YIELD graphName
    RETURN graphName + " was dropped." as message
    """, name='genre-has-artist')

    result = session.run("""
    CALL gds.graph.exists($name) YIELD exists WHERE exists CALL gds.graph.drop($name) YIELD graphName
    RETURN graphName + " was dropped." as message
    """, name='genre-similar-to-genre')

    result = session.run("""CALL gds.graph.project.cypher(
          'genre-has-artist',
          'MATCH (p) WHERE p:Artist OR p:Genre RETURN id(p) as id',
          'MATCH (t:Artist)-[:HAS_GENRE]->(g:Genre) RETURN id(g) AS source, id(t) AS target')
    """)
    result = session.run("""CALL gds.nodeSimilarity.write('genre-has-artist', {
                 writeRelationshipType: 'SIMILAR_TO',
                 writeProperty: 'score' })
    """)
    result = session.run("""CALL gds.graph.project(
                'genre-similar-to-genre',
                'Genre',{SIMILAR_TO: {orientation: 'NATURAL'}},
                { relationshipProperties: 'score'})
    """)
    result = session.run("""CALL gds.louvain.write('genre-similar-to-genre', 
    { relationshipWeightProperty: 'score', writeProperty: 'community' })
    """)

    # Post-processing -a decent playlist should have at least 40 songs. The rest we cluster together as 'misc'.
    result = session.run("""
            MATCH (g:Genre)<-[:HAS_GENRE]-(a:Artist)<-[:HAS_ARTIST]-(t:Track)
            WITH g.community as community, collect(g) as genres, count(DISTiNCT t) as trackCount
            WHERE trackCount < """ + str(30) + """
            UNWIND genres as g
            SET g.community = -1
    """)

    # Create "superGenre" nodes as parents of genres.
    session.run("""
    MATCH (g:Genre)
    WITH DISTINCT g.community as community
    CREATE (s:SuperGenre{id: community})
    WITH s
    MATCH (g:Genre{community: s.id})
    CREATE (g)-[:PART_OF]->(s)
    """)

    session.run("""
    MATCH (t:Track)-[:HAS_ARTIST]->()-[:HAS_GENRE]->()-[:PART_OF]->(s:SuperGenre)
    WITH DISTINCT t,s
    CREATE (t)-[:HAS_SUPER_GENRE]->(s)
    """)

    session.run("""
    MATCH (s:SuperGenre)--(t:Track)
    WITH s, avg(t.valence) as valence, avg(t.energy) as energy
    SET s.valence = valence, s.energy = energy
    """)

cluster_genres_with_gds(session)

@app.route("/")
def index():
    return render_template("index.html")


# authorization-code-flow Step 1. Have your application request authorization;
# the user logs in and authorizes access
@app.route("/login")
def verify():
    auth_url = f'{API_BASE}/authorize?client_id={client}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}'
    print(auth_url)
    return redirect(auth_url)


# authorization-code-flow Step 2.
# Have your application request refresh and access tokens;
# Spotify returns access and refresh tokens
@app.route("/api_callback")
def api_callback():
    session.clear()
    code = request.args.get('code')

    auth_token_url = f"{API_BASE}/api/token"
    res = requests.post(auth_token_url, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:5000/api_callback",
        "client_id": client,
        "client_secret": secret
    })

    res_body = res.json()
    print(res.json())
    session["toke"] = res_body.get("access_token")

    return redirect("/")


# authorization-code-flow Step 3.
# Use the access token to access the Spotify Web API;
# Spotify returns requested data
@app.route("/go", methods=['POST'])
def go():
    data = request.form
    sp = spotipy.Spotify(auth=session['toke'])
    response = sp.current_user_top_artists(
        limit=data['num_tracks'], time_range=data['time_range'])
    return render_template("index.html", data=data)


# add song to db
@app.route("/create/<string:name>&<int:id>", methods=["GET", "POST"])
def create_node(name, id):
    q1 = """
    create (n:Song{NAME:$name,ID:$id})
    """
    map = {"name": name, "id": id}
    try:
        session.run(q1, map)
        return redirect('/')
    except Exception as e:
        return (str(e))




@app.route("/delete/<string:name>", methods=["GET", "POST"])
def delete_node(name):
    q1 = """
    match(n: Song{NAME: $name})
    DELETE n
    """
    map = {"name": name}
    try:
        session.run(q1, map)
        return index()
    except Exception as e:
        return (str(e))



if __name__ == "__main__":
    app.run(debug=True)
    
    
    

