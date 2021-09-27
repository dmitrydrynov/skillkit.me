import { AnyAction } from 'redux';
import { UserRole } from '../../definitions/user';

export type UserState = {
  id: string;
  name: string;
  email: string;
  avatar?: {
    src: string;
  }
  role: UserRole;
};

const initialState: UserState = {
  id: '',
  name: '',
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

export const setUserData = (payload): AnyAction => {
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
