import supertest from 'supertest';
import { app } from '../../src/app';
import { Candidate, sequelize } from '../../src/models';
import { CandidateInstance } from '../../src/models/candidate';
import { candidateFactory } from '../../src/models/factories/candidate';

describe('Candidates endpoint', () => {
  let candidates: CandidateInstance[];

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    candidates = await Candidate.bulkCreate(candidateFactory.buildList(5));
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return all candidates on database', async () => {
    const response = await supertest(app).get('/candidates');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });

  it('should create a single candidate when given valid properties', async () => {
    const newCandidate = candidateFactory.build();

    const { body, statusCode } = await supertest(app).post('/candidates').send(newCandidate);

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(newCandidate.name);
    expect(body.bio).toBe(newCandidate.bio);
    expect(body.email).toBe(newCandidate.email);
    expect(body.phone).toBe(newCandidate.phone);
    expect(body.openToWork).toBe(newCandidate.openToWork);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it("should not create a candidate without a name", async () => {
    const { body, statusCode } = await supertest(app).post('/candidates').send({
      bio: 'Top test',
      email: 'test@email.com',
      phone: '666-3629'
    });

    expect(statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  it("should not create a candidate without an email", async () => {
    const { body, statusCode } = await supertest(app).post('/candidates').send({
      name: 'Test TT',
      bio: 'Top test',
      phone: '666-3629'
    });

    expect(statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  it("should not create a candidate with an already registered email", async () => {
    const newCandidate = candidateFactory.build();
    newCandidate.email = candidates[0].email;


    const { body, statusCode } = await supertest(app).post('/candidates').send(newCandidate);

    expect(statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  it("should return a specific candidate when given a valid candidateId", async () => {
    const { body, statusCode } = await supertest(app).get(`/candidates/${candidates[0].id}/`);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(candidates[0].name);
    expect(body.bio).toBe(candidates[0].bio);
    expect(body.email).toBe(candidates[0].email);
    expect(body.phone).toBe(candidates[0].phone);
    expect(body.openToWork).toBe(candidates[0].openToWork);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it("should update a specific candidate when given a valid candidateId", async () => {
    const { body, statusCode } = await supertest(app).put(`/candidates/${candidates[0].id}/`).send({
      name: 'Test TT',
      email: 'test@email.com'
    });
    console.log("bio",body);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Test TT');
    expect(body.bio).toBe(candidates[0].bio);
    expect(body.email).toBe('test@email.com');
    expect(body.phone).toBe(candidates[0].phone);
    expect(body.openToWork).toBe(candidates[0].openToWork);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  })
})