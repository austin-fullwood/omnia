/**
 * Represents a senator
 */
export class Representative {
  // tslint:disable-next-line:variable-name
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  party?: string;
  imageURL?: string;
  votedSamePercentage?: number;
  votedAgainstPercentage?: number;
}
