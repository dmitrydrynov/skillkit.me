import { Store, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import initialState from './initial-state';
import rootReducer from './reducers';

export type RootState = ReturnType<typeof rootReducer>;

export const store: Store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)));
