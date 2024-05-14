import { File } from 'src/file/entities/file.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column('boolean', { default: false })
  isAdmin: boolean = false;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  profileImage: File;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
