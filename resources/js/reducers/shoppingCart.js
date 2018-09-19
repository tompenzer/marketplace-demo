// default state
import {
    ADD_TO_CART,
    EDIT_CART,
    EMPTY_CART,
    REMOVE_FROM_CART
} from "../api/strings";

const shoppingCartReducerDefaultState = [];

// reducer which is a pure function
export default (state = shoppingCartReducerDefaultState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            let idAlreadyExists = state.some(el => (el.productId.toString() === action.shoppingCart.productId.toString()));

            if (idAlreadyExists) {
                return state;
            }

            return [
                ...state,
                action.shoppingCart
            ];
        case REMOVE_FROM_CART:
            return state.filter(({ productId }) => productId.toString() !== action.productId.toString());
        case EDIT_CART:
            return state.map((shoppingCart) => {
                if (shoppingCart.productId.toString() === action.productId.toString()) {
                    return {
                        ...shoppingCart,
                        ...action.updates
                    };
                } else {
                    return shoppingCart;
                }
            });
        case EMPTY_CART:
            return shoppingCartReducerDefaultState;
        default:
            return state;
    }
};
