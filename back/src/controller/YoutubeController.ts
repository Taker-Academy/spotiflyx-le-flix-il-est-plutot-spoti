import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository } from 'typeorm';
import { User } from "../entity/User"
import axios from 'axios';
import * as querystring from 'querystring';

const apiKey: string = 'AIzaSyCV9lBY6woAh7yPvx5o_jNpeOzFXVCD7u8';

export class YoutubeController {
    private userRepository = AppDataSource.getRepository(User)

    // async connectYoutubeAPI(request: Request, response: Response) {
    //     const data = {
    //         client_id: '824180368949-tssbjqffhjmb43ft55udfdrq6etfj8ep.apps.googleusercontent.com',
    //         client_secret: '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',
    //         redirect_uri:'http://localhost:4200/home',
    //         grant_type: 'authorization_code',
    //         code: request.query.code,
    //     };

    //     try {
    //         const res = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify(data));
    //         const token = res.data.access_token;
    //         response.json({token});
    //     } catch(error) {
    //         console.error('Error fetching token:', error);
    //         response.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

    async getVideoDetails(request: Request, response: Response) {
        const videoId = request.query.videoId;
        try {
            const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    id: videoId,
                    key: apiKey
                }
            });
            if (res.data.items.length > 0) {
                const video = res.data.items[0];
                const details = {
                    title: video.snippet.title,
                    description: video.snippet.description,
                    videoId: video.id,
                    thumbnail: video.snippet.thumbnails.default.url,
                    viewCount: video.statistics.viewCount,
                    duration: video.contentDetails.duration
                };
                response.json(details);
            } else {
                response.status(404).json({ error: 'Video not found' });
            }
        } catch(error) {
            console.error('Error fetching video details:', error);
            response.status(500).json({ error: 'Failed to fetch video details' });
        }
    }

    async getPopularVideos(request: Request, response: Response) {
        try {
            const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    chart: 'mostPopular',
                    regionCode: 'FR',
                    maxResults: 5,
                    key: apiKey
                }
            });
            const videos = res.data.items.map(item => ({
                title: item.snippet.title,
                description: item.snippet.description,
                videoId: item.id,
                thumbnail: item.snippet.thumbnails.default.url,
                viewCount: item.statistics.viewCount
            }));
            response.json(videos);
        } catch(error) {
            console.error('Error fetching popular videos:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async allCategoriesYoutube(request: Request, response: Response) {
        try {
            const res = await axios.get('https://www.googleapis.com/youtube/v3/videoCategories', {
                params: {
                    part: 'snippet',
                    regionCode: 'FR',
                    key: apiKey
                }
            });
            let categories = res.data.items.map(item => ({
                id: item.id,
                title: item.snippet.title
            }));
            categories = categories.sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5);
            response.json(categories);
        } catch(error) {
            console.error('Error fetching categories:', error);
            response.status(500).json({ error: 'Failed to fetch categories from YouTube' });
        }
    }

    async categoryVideos(request: Request, response: Response) {
        const categoryId = request.query.categoryId;
        try {
            const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    maxResults: 5,
                    type: 'video',
                    videoCategoryId: categoryId,
                    key: apiKey
                }
            });
            const videos = res.data.items.map(item => ({
                title: item.snippet.title,
                description: item.snippet.description,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.default.url
            }));
            response.json(videos);
        } catch(error) {
            console.error('Error fetching videos:', error);
            response.status(500).json({ error: 'Failed to fetch videos' });
        }
    }

    async searchVideo(request: Request, response: Response) {
        try {
            const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    maxResults: 15,
                    q: request.query.input,
                    type: 'video',
                    key: apiKey
                }
            });
            const videos = res.data.items.map(item => ({
                title: item.snippet.title,
                description: item.snippet.description,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.default.url
            }));
            response.json(videos);
        } catch(error) {
            console.error('Error fetching videos:', error);
            response.status(500).json({ error: 'Failed to fetch videos' });
        }
    }

}
