/* eslint-disable no-unused-vars */
export enum UserRole {
	ADMIN = 'admin',
	OPERATOR = 'member',
	UNKNOWN = 'unknown',
}

export type User = {
	firstName?: string;
	lastName?: string;
	email?: string;
	country?: string;
	verificationLevel?: string;
};
