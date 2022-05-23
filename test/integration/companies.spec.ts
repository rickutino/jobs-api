import supertest from 'supertest';
import { app } from '../../src/app';
import { Company, sequelize } from '../../src/models';
import { CompanyInstance } from '../../src/models/company';
import { companyFactory } from '../../src/models/factories/company';

describe('companies endpoint', () => {
  let companies: CompanyInstance[];

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    companies = await Company.bulkCreate(companyFactory.buildList(5));
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return all companies on database', async () => {
    const response = await supertest(app).get('/companies');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });

  it('should create a single company when given valid properties', async () => {
    const newCompany = companyFactory.build();

    const { body, statusCode } = await supertest(app).post('/companies').send(newCompany);

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(newCompany.name);
    expect(body.bio).toBe(newCompany.bio);
    expect(body.email).toBe(newCompany.email);
    expect(body.website).toBe(newCompany.website);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it("should not create a company without a name", async () => {
    const { body, statusCode } = await supertest(app).post('/companies').send({
      bio: 'Top test',
      email: 'test@email.com',
      phone: '666-3629'
    });

    expect(statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  it("should return a specific company when given a valid companyId", async () => {
    const { body, statusCode } = await supertest(app).get(`/companies/${companies[0].id}/`);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(companies[0].name);
    expect(body.bio).toBe(companies[0].bio);
    expect(body.email).toBe(companies[0].email);
    expect(body.website).toBe(companies[0].website);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it("should update a specific company when given a valid companyId", async () => {
    const { body, statusCode } = await supertest(app).put(`/companies/${companies[0].id}/`).send({
      name: 'Test TT',
      email: 'test@email.com'
    });

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Test TT');
    expect(body.bio).toBe(companies[0].bio);
    expect(body.email).toBe('test@email.com');
    expect(body.website).toBe(companies[0].website);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('should delete a specific company when given a valid companyId', async () => {
    const { body, statusCode } = await supertest(app).delete(`/companies/${companies[0].id}`);

    const deletedCompany = await Company.findByPk(companies[0].id);

    expect(statusCode).toBe(204);
    expect(body).toEqual({});
    expect(deletedCompany).toBeNull();
  });
})