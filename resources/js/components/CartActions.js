import React from "react";
import PropTypes from 'prop-types';
import { addToCart, removeFromCart } from "../actions/shoppingCart";
import { ADDED_TO_CART_SNACKBAR } from "../api/strings";
import Snackbar from '@material-ui/core/Snackbar';

class CartActions extends React.Component {

    state = {
        snackbarOpen: false,
        addedToCartProductId: null
    }

    componentDidMount() {
        if (this.props.product.id) {
            this.handleAddToCart(this.props.product);
        }

    }

    componentWillReceiveProps(nextProps){
        if (nextProps.product.id &&
            (! this.props.product.id ||
                this.props.product.id !== nextProps.product.id)
        ) {
            this.handleAddToCart(nextProps.product);
        }
    }

    handleAddToCart = (product) => {
        const { id, name, price, currency } = product;
        let quantity = 1;

        if (product.quantity &&
            parseInt(product.quantity) == product.quantity
        ) {
            quantity = product.quantity;
        }

        // Dispatch the cart add redux store action.
        this.props.dispatch(addToCart({
            productId: id,
            name,
            quantity,
            price,
            currency: currency.abbreviation
        }));

        // Set the snackbar state to allow undo of the cart add action.
        this.setState({
            snackbarOpen: true,
            addedToCartProductId: id
        });
    };

    handleSnackbarClose = () => {
        this.setState({
            snackbarOpen: false,
            addedToCartProductId: null
        });
    };

    handleSnackbarUndo = () => {
        if (this.state.addedToCartProductId !== null) {
            this.props.dispatch(
                removeFromCart({ productId: this.state.addedToCartProductId })
            );

            this.props.onUndone();
        }

        this.handleSnackbarClose();
    };

    render() {

        return (
                <Snackbar
                    open={this.state.snackbarOpen}
                    message={ADDED_TO_CART_SNACKBAR}
                    action="undo"
                    autoHideDuration={3000}
                    onClick={this.handleSnackbarUndo}
                    onClose={this.handleSnackbarClose}
                />
        )
    }
}

CartActions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    onUndone: PropTypes.func.isRequired,
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
        currency: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            abbreviation: PropTypes.string.isRequired
        }),
        quantity: PropTypes.number
    })
};

export default CartActions;
