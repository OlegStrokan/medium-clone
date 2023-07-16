import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('interactions')
export class InteractionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArticleEntity, (article) => article.interactions)
  article: ArticleEntity;

  @Column({ nullable: true })
  rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readAt: Date;
}
