import { Bill } from './bill';

export class User {
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public location?: Location;
  public bills?: Bill[];
  public id?: string;
  public token?: string;
}
