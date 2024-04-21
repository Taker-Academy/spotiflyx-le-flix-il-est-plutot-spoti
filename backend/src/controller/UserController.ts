import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import * as jwt from 'jsonwebtoken';

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async register(request: Request, response: Response) {
        const { firstname, lastname, email, password } = request.body;

        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            return response.status(400).json({ message: 'User already exists' });
        }

        const newUser = Object.assign(new User(), {
            firstname,
            lastname,
            email,
            password
        });
        await this.userRepository.save(newUser);
        const token = jwt.sign({ userId: newUser.id }, '1234');

        response.json({ token });
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
