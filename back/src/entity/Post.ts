import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    Title: string;
    @Column({ type: 'text' })
    Content: string;
    @Column({ type: 'text' })
    Link: string;
    @Column({ type: 'int' })
    postsCount: number;
    @Column({ type: 'int' })
    topicsCount: number;
    @Column({ type: 'text' })
    lastPostTitle: string;
    @Column({ type: 'text' })
    lastPostAuthor: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastPostDate: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
