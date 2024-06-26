import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository } from 'typeorm';
import { User } from "../entity/User"
import axios from 'axios';
const Spotify = require('node-spotify-api');
import * as jwt from 'jsonwebtoken';
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Utiliser les variables d'environnement
const client_id: string = process.env.SPOTIFY_CLIENT_ID || '';
const client_secret: string = process.env.SPOTIFY_CLIENT_SECRET || '';

const player = require('play-sound')();

const spotify = new Spotify({
    id: client_id,
    secret: client_secret
});

export class SpotifyController {
    private userRepository = AppDataSource.getRepository(User)

    async connectSpotifyAPI(request: Request, response: Response)  {
        try {
            const authOptions = {
                method: 'POST',
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                  'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'grant_type=client_credentials'
              };
            const res = await axios(authOptions);
            const token = res.data.access_token;
            response.json({token});
        } catch(error) {
            console.error('Error fetching token:', error);
            response.status(500).json({ error: 'Erreur interne du serveur.' });
        }
    }

    async popularContent(request: Request, response: Response) {
        const tokenSpotify = request.query.tokenSpotify as string;
        if (!tokenSpotify) {
            return response.status(400).send('Spotify access token is required');
        }
        try {
            const spotifyResponse = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
                headers: {
                    'Authorization': `Bearer ${tokenSpotify}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    country: 'US',
                    limit: 5
                }
            });
            const popularTracks = spotifyResponse.data.albums.items.map(item => ({
                title: item.name,
                artist: item.artists.map(artist => artist.name).join(', '),
                releaseDate: item.release_date,
                trackUrl: item.external_urls.spotify,
                albumImage: item.images[0].url
            }));
            response.json(popularTracks);
        } catch (error) {
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async allCategories(request: Request, response: Response) {
        const tokenSpotify = request.query.tokenSpotify as string;
        if (!tokenSpotify) {
            return response.status(400).send('Spotify access token is required');
        }
        const url = 'https://api.spotify.com/v1/browse/categories';
        const headers = {
            'Authorization': `Bearer ${tokenSpotify}`,  // Authentification avec le token OAuth
            'Content-Type': 'application/json'
        };
        try {
            const spotifyResponse = await axios.get(url, { headers });  // Envoi de la requête à Spotify
            const categories = spotifyResponse.data.categories.items;  // Extraction des catégories
            response.send(categories);  // Envoi des catégories au client
        } catch (error) {
            response.status(500).send('Failed to fetch categories from Spotify');
        }
    }

    async categoryTracks(request: Request, response: Response) {
        const tokenSpotify = request.query.tokenSpotify;
        const categories = request.query.category;
        // s'assurer que categories est toujours un tableau
        const categoriesArray = Array.isArray(categories) ? categories : [categories];
        try {
            let tracksPerCategory = [];
            for (let category of categoriesArray) {
                // Obtenir les playlists pour chaque catégorie
                const playlistsUrl = `https://api.spotify.com/v1/browse/categories/${category}/playlists`;
                const playlistsRes = await axios.get(playlistsUrl, {
                    headers: { 'Authorization': `Bearer ${tokenSpotify}` }
                });
                let tracks = [];
                // Parcourir les playlists et obtenir les tracks
                for (let playlist of playlistsRes.data.playlists.items) {
                    if (tracks.length >= 5) break;
                    const tracksUrl = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
                    const trackRes = await axios.get(tracksUrl, {
                        headers: { 'Authorization': `Bearer ${tokenSpotify}` }
                    });
                    trackRes.data.items.forEach(item => {
                        if (tracks.length < 5 && item.track) {
                            tracks.push({
                                name: item.track.name,
                                id: item.track.id,
                                artists: item.track.artists.map(artist => artist.name),
                                albumName: item.track.album.name,
                                albumImageUrl: item.track.album.images[0]?.url,
                                duration_ms: item.track.duration_ms,
                                popularity: item.track.popularity,
                                preview_url: item.track.preview_url,
                                explicit: item.track.explicit,
                                uri: item.track.uri
                            });
                        }
                    });
                }
                tracksPerCategory.push({
                    category: category,
                    tracks: tracks
                });
            }
            response.json(tracksPerCategory);
        } catch (error) {
            console.error('Error fetching category tracks:', categories ,error);
            response.status(500).send('Failed to fetch tracks');
        }
    }
    async searchTrack(request: Request, response: Response) {
        try {
            spotify.search({ type: 'track', query: request.query.input, limit: 15 }, function(err, data) {
                if (err) {
                  return console.log('Erreur lors de la récupération des données : ' + err);
                }
                response.json(data.tracks.items.map(track => track))
            });
        } catch (error) {
            response.status(500).send('Failed to fetch research')
        }
    }

    async listenTrack(request: Request, response: Response) {
        const trackId = request.body.params.input

        spotify
        .request(`https://api.spotify.com/v1/tracks/${trackId}`)
        .then(function(data) {

            const previewUrl = data.preview_url;
            if (previewUrl) {
            player.play(previewUrl, function(err) {
                if (err) {
                    console.error('Erreur lors de la lecture de l\'extrait audio :', err);
                } else {
                    response.json({previewUrl})
                }
            });
            } else {
                console.log('Aucun extrait disponible pour cette piste.');
            }
        })
        .catch(function(err) {
            console.error('Une erreur est survenue !', err);
        });
    }

    async delFavoriteMusic(request, response, next) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.HASH_PASSWORD);
            const userId = decodedToken.id;
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                response.status(404).json({ message: "Utilisateur non trouvé." });
                return;
            }

            const favoriteMusicId = request.body.favoriteMusicId;
            if (!favoriteMusicId) {
                response.status(400).json({ error: 'Mauvaise requête, paramètres manquants ou invalides.' });
                return;
            }

            user.favoriteMusicId = user.favoriteMusicId.filter(music => music !== favoriteMusicId);
            await this.userRepository.save(user);

            response.status(200).json({ message: 'Musique retirée des favoris.' });
            return;
        } catch (error) {
            response.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }
    }

}
