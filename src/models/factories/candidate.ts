import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { CandidateCreationAttribute } from '../candidate';

export const candidateFactory = Factory.define<CandidateCreationAttribute>(() => ({
  name: faker.name.findName(),
  bio: faker.lorem.sentence(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  openToWork: faker.datatype.boolean()
}))