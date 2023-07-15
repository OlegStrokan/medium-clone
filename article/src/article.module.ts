import { Module } from '@nestjs/common'
import { ArticleContoller } from './controllers/article.controller'
import { ArticleService } from './services/article.service'

@Module({
	imports: [],
	controllers: [ArticleContoller],
	providers: [ArticleService],
})
export class AppModule {}
