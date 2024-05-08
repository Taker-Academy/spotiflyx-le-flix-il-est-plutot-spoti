import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository } from 'typeorm';
import { User } from "../entity/User"
import axios from 'axios';

const client_id: string = 'a82c9a8de55d4ade8fe892edad84ed6c';
const client_secret: string = 'd0097c1aa55e4e02af5695a3fd7aac63';

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

        console.log(categories)
    
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
                    if (tracks.length >= 5) break; // Arrêter si nous avons déjà 5 tracks
    
                    const tracksUrl = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
                    const trackRes = await axios.get(tracksUrl, {
                        headers: { 'Authorization': `Bearer ${tokenSpotify}` }
                    });
    
                    // Ajouter les tracks au tableau jusqu'à atteindre 5
                    trackRes.data.items.forEach(item => {
                        if (tracks.length < 5 && item.track) {
                            tracks.push({
                                name: item.track.name,
                                id: item.track.id,
                                artists: item.track.artists.map(artist => artist.name), // Liste des noms des artistes
                                albumName: item.track.album.name,
                                albumImageUrl: item.track.album.images[0]?.url, // Image de l'album
                                duration_ms: item.track.duration_ms,
                                popularity: item.track.popularity,
                                preview_url: item.track.preview_url,
                                explicit: item.track.explicit,
                                uri: item.track.uri
                            });
                        }
                    });
                }
    
                // Ajouter les résultats pour la catégorie actuelle
                tracksPerCategory.push({
                    category: category,
                    tracks: tracks
                });
            }
    
            // Envoyer la réponse avec les tracks par catégorie
            response.json(tracksPerCategory);
        } catch (error) {
            console.error('Error fetching category tracks:', categories ,error);
            response.status(500).send('Failed to fetch tracks');
        }
    }
}
