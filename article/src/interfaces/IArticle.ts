export interface IArticle {
	id: string
	title: string
	description: string
	body: string
	ownerId: string
	tags?: string[]
}
