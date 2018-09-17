import { createStore, combineReducers, applyMiddleware } from 'redux';
import shoppingCartReducer from '../reducers/shoppingCart';
import authenticationReducer from '../reducers/authentication';
import storesReducer from '../reducers/stores';
import productsReducer from '../reducers/products';
import usersReducer from '../reducers/users';
import utilitiesReducer from '../reducers/utilities';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    shoppingCart: shoppingCartReducer,
    authentication: authenticationReducer,
    stores: storesReducer,
    products: productsReducer,
    users: usersReducer,
    utilities: utilitiesReducer
});

export default () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk)
    );

    return store;
};
