import { AnyAction } from 'redux';
import { UserRole } from '../../definitions/user';

export type UserState = {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	avatar?: string;
	role: { name: UserRole };
	useOTP: boolean;
	age?: number;
	country: string;
};

const initialState: UserState = {
	id: '',
	firstName: '',
	lastName: '',
	fullName: '',
	email: '',
	role: { name: UserRole.UNKNOWN },
	useOTP: false,
	age: null,
	country: '',
};

const userReducer = (state = initialState, action: AnyAction): UserState => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_USER_DATA': {
			return { ...state, ...payload };
		}
		case 'SET_USER_OTP_DATA': {
			return { ...state, useOTP: payload };
		}
		case 'CLEAR_USER_DATA': {
			return initialState;
		}
		default:
			return state;
	}
};

export const setUserData = (payload: UserState): AnyAction => {
	return {
		type: 'SET_USER_DATA',
		payload,
	};
};

export const setOTP = (payload: boolean): AnyAction => {
	return {
		type: 'SET_USER_OTP_DATA',
		payload,
	};
};

export const clearUserData = (): AnyAction => {
	return {
		type: 'CLEAR_USER_DATA',
	};
};

export default userReducer;
