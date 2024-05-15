import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    Title: string;
    @Column({ default: '' })
    Content: string;
    @Column({ default: '' })
    Link: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastPostDate: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
