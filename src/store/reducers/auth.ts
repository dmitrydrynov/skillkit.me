import { Dispatch } from 'react';
import { deleteCookie, setCookie } from '../../helpers/cookie';
import { RootState } from '../configure-store';
import { clearUserData, setUserData } from './user';
import jwtDecode from 'jwt-decode';
import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export interface ActionRes<P = unknown> {
  type: string;
  payload?: P;
}

export type AuthState = {
  loggedIn: boolean;
};

const initialState = {
  loggedIn: false,
};

const authReducer = (state = initialState, action: AnyAction): AuthState => {
  const { type, payload } = action;

  switch (type) {
    case 'LOGIN': {
      setCookie('jwt', payload.token);

      return { ...state, loggedIn: true };
    }
    case 'LOGOUT': {
      deleteCookie('jwt');

      return { ...state, loggedIn: false };
    }
    default:
      return state;
  }
};

export const setLogin = (payload: { token: string }): AppThunk => {
  const { id, role } = jwtDecode<{ id: number; role: string }>(payload.token);

  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: 'LOGIN', payload });
    dispatch(setUserData({ id, role }));
  };
};

export const setLogout = (): AppThunk => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: 'LOGOUT' });
    dispatch(clearUserData());
  };
};

export default authReducer;
