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
    @Column({ type: 'int' })
    postsCount: number;
    @Column({ type: 'int' })
    topicsCount: number;
    @Column({ default: '' })
    lastPostTitle: string;
    @Column({ default: '' })
    lastPostAuthor: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastPostDate: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
