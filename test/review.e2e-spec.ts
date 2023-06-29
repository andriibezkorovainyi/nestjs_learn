import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';

const product = new Types.ObjectId().toHexString();

const testReview: CreateReviewDto = {
  name: 'name',
  title: 'someTitle',
  description: 'description',
  rating: 5,
  product,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (GET)', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testReview)
      .expect(201)
      .expect((dto) => {
        const { body } = dto;
        expect(body).toBeDefined();
        createdId = body._id;
      });
  });

  it('/review/byProduct/:productId (GET)', () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + product)
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/ (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
