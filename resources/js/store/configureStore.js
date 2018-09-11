import { createStore, combineReducers, applyMiddleware } from 'redux';
import shoppingCartReducer from '../reducers/shoppingCart';
import authenticationReducer from '../reducers/authentication';
import storesReducer from '../reducers/stores';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    shoppingCart: shoppingCartReducer,
    authentication: authenticationReducer,
    stores: storesReducer
});

export default () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk)
    );

    return store;
};
