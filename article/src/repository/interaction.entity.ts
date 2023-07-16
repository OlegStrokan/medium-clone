import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity('interactions')
export class InteractionEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: true })
	rating: number

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	readAt: Date
}
