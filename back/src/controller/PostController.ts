import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository,  getRepository } from 'typeorm';
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

    async createPost(request: Request, response: Response) {
      try {
          console.log("database | Catch request createPost")
          const { Title, Link, Content } = request.body;
          if (!Title || !Link || !Content) {
              response.status(400).json({ ok: false, message: 'Mauvaise requête, paramètres manquants ou invalides.' });
              return;
          }
          const token = request.headers.authorization;
          console.log("database | Token:", token)
          if (!token || !token.startsWith('Bearer ')) {
              response.status(401).json({ ok: false, message: "Mauvais token JWT" });
              return;
          }
          const accessToken = token.split(' ')[1];
          const decodedToken = jwt.verify(accessToken, '1234');
          const userId = decodedToken.id;
          const user = await this.userRepository.findOne({ where: { id: userId } });
          if (!user) {
              response.status(404).json({ ok: false, message: 'Utilisateur non trouvé.' });
              return;
          }
          const newPost = new Post();
          newPost.Title = Title;
          newPost.Link = Link;
          newPost.Content = Content;
          newPost.user = user;
          await this.PostRepository.save(newPost);
          const newToken = jwt.sign({ postId: newPost.id.toString() }, '1234');
          const responseData = {
              ok: true,
              data: newPost,
              token: newToken
          };
          console.log("database | createPost request OK")
          response.status(201).json(responseData);
          return;
      } catch (error) {
        console.error("Erreur lors de la création du post:", error);
        if (!response.headersSent) {
            response.status(500).json({ ok: false, message: "Erreur interne du serveur" });
            return;
        }
      }
    }
}