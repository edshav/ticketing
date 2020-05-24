import request from 'supertest';
import { app } from '../../app';
import mongoose, { mongo } from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'svavdvf', price: 20 })
    .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'svavdvf', price: 20 })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const title = 'fsgsg';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'dsgdthrthreres', price: 3000 })
    .expect(401);

  const checkingResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(checkingResponse.body.title).toEqual(title);
  expect(checkingResponse.body.price).toEqual(price);
});
it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'vsvasvs', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 3000 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'sababab', price: -10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'nfnfdmym' })
    .expect(400);
});
it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const title = 'new title';
  const price = 100;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'vsvasvs', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(200);

  const checkingResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(checkingResponse.body.title).toEqual(title);
  expect(checkingResponse.body.price).toEqual(price);
});
