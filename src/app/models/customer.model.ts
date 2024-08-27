import { faker } from '@faker-js/faker/locale/pt_BR';

export type Customer = PouchDB.Core.IdMeta &
  Partial<PouchDB.Core.GetMeta> & {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };

export const getRandCustomer = (): Customer => ({
  _id: faker.string.uuid(),
  name: faker.person.firstName(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  notes: faker.lorem.lines(2),
});
