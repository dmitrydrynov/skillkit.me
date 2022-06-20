import { Dispatch } from 'react';
import { gtmEvent } from '@helpers/gtm';
import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { clearUserData } from './user';
import { deleteCookie } from '../../helpers/cookie';
import { RootState } from '../configure-store';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export interface ActionRes<P = unknown> {
	type: string;
	payload?: P;
}

export type AuthState = {
	loggedIn: boolean;
	logginingIn: boolean;
};

const initialState = {
	loggedIn: false,
	logginingIn: false,
};

const authReducer = (state = initialState, action: AnyAction): AuthState => {
	const { type, payload } = action;

	switch (type) {
		case 'LOGIN': {
			if (process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME) {
				gtmEvent('LoginEvent');
				return { ...state, loggedIn: true };
			}

			return state;
		}
		case 'LOGINING-IN': {
			return { ...state, logginingIn: payload };
		}
		case 'LOGOUT': {
			if (process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME) {
				deleteCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);
			}

			return { ...state, loggedIn: false };
		}
		default:
			return state;
	}
};

export const setLogin = (): AnyAction => {
	return { type: 'LOGIN' };
};

export const setLoginingIn = (payload: boolean): AnyAction => {
	return { type: 'LOGINING-IN', payload };
};

export const setLogout = (): AppThunk => {
	return (dispatch: Dispatch<AnyAction>) => {
		dispatch({ type: 'LOGOUT' });
		dispatch(clearUserData());
	};
};

export default authReducer;
