export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  PARTNER = 'partner',
  USER = 'user',
  UNKNOWN = 'unknown',
}

export type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  verificationLevel?: string;
};
