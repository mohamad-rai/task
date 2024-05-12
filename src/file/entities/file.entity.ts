import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from '../interface/file.interface';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;

  @Column()
  savedName: string;

  // @OneToOne(() => User)
  // @JoinColumn()
  @Column({ nullable: true })
  creator: string;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.PROFILE,
  })
  fileType: FileType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
