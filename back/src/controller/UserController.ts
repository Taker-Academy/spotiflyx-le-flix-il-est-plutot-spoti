import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository } from 'typeorm';
import { User } from "../entity/User"
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
const saltRounds = 10;
const nodemailer = require('nodemailer');

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async register(request: Request, response: Response) {
        try {
            console.log("database | Catch request register")
            const { firstName, lastName, email, password } = request.body;
            if (!firstName || !lastName || !email || !password) {
                response.status(400).json({ error: 'Mauvaise requête, paramètres manquants ou invalides.' });
                return;
            }
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                response.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });

            // Configuration nodemailer
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", // Remplacez par l'adresse SMTP de votre fournisseur d'email
                port: 465, // Port standard pour SMTP
                secure: true, // Vrai pour le port 465, faux pour les autres ports
                auth: {
                    user: "contact.spotiflyx@gmail.com", // Remplacez par votre adresse email
                    pass: "xdsr kvyu lkaw qnwx", // Remplacez par votre mot de passe
                },
            });
            // Configuration de l'email à envoyer
            let mailOptions = {
                from: `"Spotiflyx" <contact.spotiflyx@gmail.com>`,
                to: "juleslordet@gmail.com",
                subject: `Confirme ton adresse e-mail`,
                text: `pas html`,
                html: `
                <html>
                <body style="font-family: Noto Sans, sans-serif; margin: 0; padding: 0px; background-color: white; margin-top: 50px; margin-bottom: 50px">
                    <div style="max-width: 500px; margin: auto; background-color: white; padding: 20px; padding-left: 30px; border: 0.5px solid #ececec; border-radius: 7px">
                        <div style="font-size: 26px; color: #020202; font-weight: 600; margin-bottom: 30px; margin-top: 40px">
                            <strong>👋 Coucou</strong>
                            <a style="text-decoration:underline; color:rgb(0, 47, 255)">${email}</a>
                        </div>
                        <div style="margin-top: 20px; font-size: 15px; line-height: 1.6; color: #858585">
                            On est très heureux de t'avoir sur Spotiflyx 💜. Merci de confirmer ton email 👇
                        </div>
                        <div style="margin-top: 30px; text-align: start;">
                            <a href="http://localhost:4200/home" style="font-weight: 700;background-color: #000000; color: white; padding: 12px 22px; text-decoration: none; font-size: 13px; border-radius: 5px; display: inline-block;">
                                CONFIRMER MON E-MAIL
                            </a>
                        </div>
                        <div style="padding-top: 50px; margin-top: 50px; font-size: 13px; text-align: start; color: #999; border-top: 2px solid #ececec; display: flex; flex-direction: column">
                            Spotiflyx, SAS<br>
                            2 Rue du Professeur Charles Appleton<br>
                            69007 Lyon
                        </div>
                    </div>
                </body>
                </html>
                `, // Corps de l'email
            };    
            // Envoyer l'email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(`Error: ${error}`);
                }
                console.log(`Message sent: ${info.messageId}`);
            });
            

            console.log("database | Register request OK")
            const token = jwt.sign({ email: user.email, id: user.id, firstName: user.firstName, lastName: user.lastName }, '1234', { expiresIn: '1h' });
            response.status(200).json({ token: token });
            return;
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }
    }

    async login(request: Request, response: Response) {
        try {
            console.log("database | Catch request Login")
            const { email, password } = request.body;
            if (!email || !password) {
                response.status(400).json({ error: 'Mauvaise requête, paramètres manquants ou invalides.' });
                return;
            }
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                response.status(401).json({ error: 'Mauvais identifiants.' });
                return;
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                response.status(401).json({ error: 'Mauvais identifiants.' });
                return;
            }
            console.log("database | request OK")
            const token = jwt.sign({ email: user.email, id: user.id, firstName: user.firstName }, '1234', { expiresIn: '1h' });
            response.status(200).json({ token: token });
            return;
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }
    }

    async updateProfile(request, response, next) {
        try {
            const id = parseInt(request.params.id) || 1;
            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user) {
                response.status(404).json({ message: "Utilisateur non trouvé." });
                return;
            }
            const { username, firstName, email, company } = request.body;
            if (!username && !firstName && !email && !company) {
                response.status(400).json({ message: "Aucun champ à mettre à jour." });
                return;
            }
            if (username) user.username = username;
            if (firstName) user.firstName = firstName;
            if (email) user.email = email;
            if (company) user.company = company;
            const updatedUser = await this.userRepository.save(user);
            response.status(200).json(updatedUser);
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Erreur interne du serveur." });
            return;
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

    async supportMail(request: Request, response: Response)
    {
        try {
            console.log("database | Catch request post mail");
            const { object, message, firstName, lastName, email} = request.body; // Ajout de l'email ici
            if (!object || !message || !email || !firstName || !lastName) { // Vérifiez aussi que l'email est présent
                response.status(400).json({ error: 'Mauvaise requête, paramètres manquants ou invalides.' });
                return;
            }

            // Configuration nodemailer
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", // Remplacez par l'adresse SMTP de votre fournisseur d'email
                port: 465, // Port standard pour SMTP
                secure: true, // Vrai pour le port 465, faux pour les autres ports
                auth: {
                    user: "contact.spotiflyx@gmail.com", // Remplacez par votre adresse email
                    pass: "xdsr kvyu lkaw qnwx", // Remplacez par votre mot de passe
                },
            });
            // Configuration de l'email à envoyer
            let mailOptions = {
                from: `"${firstName} ${lastName}" <${email}>`, // Expéditeur formé par les variables firstName, lastName et email
                to: "juleslordet@gmail.com", // Destinataire fixe
                subject: `Support : ${object}`, // Sujet de l'email, formé dynamiquement
                text: `${message}`, // Corps de l'email en texte simple, inséré dynamiquement
            };    
            // Envoyer l'email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(`Error: ${error}`);
                }
                console.log(`Message sent: ${info.messageId}`);
            });

            console.log("database | Post mail OK");
            response.status(200).json({ token: "OK" });
            return;
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }
    }
}