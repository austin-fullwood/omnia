import { Bill } from './bill';

export class User {
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public address?: string;
  public city?: string;
  public zip?: string;
  public bills?: Bill[];
  public id?: string;
  public token?: string;
}
