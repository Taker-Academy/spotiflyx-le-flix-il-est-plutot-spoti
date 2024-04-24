import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres", // Nom du service Docker pour PostgreSQL
    port: 5432,
    username: "pst_user",
    password: "pstservice123",
    database: "pst_db",
    synchronize: true, // Attention : à utiliser uniquement en développement
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
