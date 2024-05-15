import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string
    @Column()
    lastName: string
    @Column()
    email: string
    @Column()
    password: string
    @Column({ default: '' })
    profileImage: string;
    @Column({ default: '' })
    username: string;
    @Column({ default: '' })
    company: string;
    @Column({ default: '' })
    phone: string;
    @Column({ default: '' })
    birthday: string;
    @Column({ default: '' })
    website: string;
    @Column({ default: '' })
    bio: string;
    @Column({ default: '' })
    Twitter: string;
    @Column({ default: '' })
    Facebook: string;
    @Column({ default: '' })
    Google: string;
    @Column({ default: '' })
    LinkedIn: string;
    @Column({ default: '' })
    Instagram: string;
    @Column("simple-array", { default: '{}' })
    favoriteMusicId: string[];
}
