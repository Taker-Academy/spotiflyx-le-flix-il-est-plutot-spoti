import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository } from 'typeorm';
import { User } from "../entity/User"
import { Post } from "../entity/Post"
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path'
import { profile } from "console";

export class PostController {
    private userRepository = AppDataSource.getRepository(User)
    private PostRepository = AppDataSource.getRepository(Post)

    async createPost(request, response, next) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, '1234');
            const userId = decodedToken.id;
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
              response.status(404).json({ message: "Utilisateur non trouvé." });
              return;
            }
            const { Title, Content, Link } = request.body;
            if (!Title || !Content || !Link) {
              response.status(400).json({ message: "Tous les champs sont requis." });
              return;
            }
            const post = new Post();
            post.Title = Title;
            post.Content = Content;
            post.Link = Link;
            post.user = user;
            const createdPost = await this.PostRepository.save(post);
            response.status(201).json(createdPost);
            return;
          } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Erreur interne du serveur." });
            return;
          }
    }
}