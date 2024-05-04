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
        const tokenSpotify = request.query.tokenSpotify;

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
            console.error('Error fetching popular content from Spotify:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }
}