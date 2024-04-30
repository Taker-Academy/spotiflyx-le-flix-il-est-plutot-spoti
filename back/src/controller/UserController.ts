import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Repository } from 'typeorm';
import { User } from "../entity/User"
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

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

}