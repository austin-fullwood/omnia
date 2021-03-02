import { Bill } from './bill';

export class User {
  firstName: string;
  lastName: string;
  email: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: number;
  };
  bills: Bill[];
  id: string;
  token?: string;
}
