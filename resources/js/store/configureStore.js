import { createStore, combineReducers, applyMiddleware } from 'redux';
import shoppingCartReducer from '../reducers/shoppingcart';
import authenticationReducer from '../reducers/authentication';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    shoppingCart: shoppingCartReducer,
    authentication: authenticationReducer
});

export default () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk)
    );

    return store;
};
