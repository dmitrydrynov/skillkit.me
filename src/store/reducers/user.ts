import { AnyAction } from 'redux';
import { UserRole } from '../../definitions/user';

export type UserState = {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	avatar?: {
		url: string;
	};
	role: UserRole;
};

const initialState: UserState = {
	id: '',
	firstName: '',
	lastName: '',
	fullName: '',
	email: '',
	role: UserRole.UNKNOWN,
};

const userReducer = (state = initialState, action: AnyAction): UserState => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_USER_DATA': {
			return { ...state, ...payload };
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

export const clearUserData = (): AnyAction => {
	return {
		type: 'CLEAR_USER_DATA',
	};
};

export default userReducer;
