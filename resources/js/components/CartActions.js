import React from "react";
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
        // Dispatch the cart add redux store action.
        this.props.dispatch(addToCart({
            productId: id,
            name,
            quantity: 1,
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

export default CartActions;
