import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from 'src/services/article.service';
import { ArticleContoller } from './article.controller';

describe('AppController', () => {
  let appController: ArticleContoller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ArticleContoller],
      providers: [ArticleService],
    }).compile();

    appController = app.get<ArticleContoller>(ArticleContoller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
