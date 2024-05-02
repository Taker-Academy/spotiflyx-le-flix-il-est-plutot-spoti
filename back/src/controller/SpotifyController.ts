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
            console.log("backend | connexion a l'api spotify");

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
}