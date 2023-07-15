import { IArticle } from './IArticle'

export interface ITag {
	id: string
	name: string
	articles?: IArticle[]
}
