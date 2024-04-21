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
        const { firstName, lastName, email, password } = request.body;
        console.log(firstName, lastName, email, password);
        console.log("------------------------------------------------------------------------------");
        console.log(request.body);
        console.log("------------------------------------------------------------------------------");

        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            return response.status(400).json({ message: 'User already exists' });
        }

        const newUser = Object.assign(new User(), {
            firstName,
            lastName,
            email,
            password
        });
        await this.userRepository.save(newUser);
        const token = jwt.sign({ userId: newUser.id }, '1234');

        response.json({ token });
    }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     const {firstName, lastName, email, password} = request.body;

    //     const user = Object.assign(new User(), {
    //         firstName,
    //         lastName,
    //         email,
    //         password
    //     })

    //     return this.userRepository.save(user)
    // }

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
