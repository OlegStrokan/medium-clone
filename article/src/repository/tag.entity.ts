import { Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm'

export interface ITagCreationAttributes {
	name: string
}

@Entity('tags')
export class TagEntity
	extends Repository<TagEntity>
	implements ITagCreationAttributes
{
	@PrimaryGeneratedColumn()
	id: string

	@Column({ nullable: false })
	name: string
}
