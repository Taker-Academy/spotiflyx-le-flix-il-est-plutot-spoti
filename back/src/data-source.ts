import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true, // Attention : à utiliser uniquement en développement
    logging: false,
    entities: [User, Post],
    migrations: [],
    subscribers: [],
});
