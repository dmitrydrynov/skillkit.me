import { UserRole } from '../../definitions/user';
import { AnyAction } from 'redux';

export type UserState = {
  id: number;
  role: UserRole;
};

const initialState: UserState = {
  id: NaN,
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

export const setUserData = (payload: { id: number; role: string }): AnyAction => {
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
