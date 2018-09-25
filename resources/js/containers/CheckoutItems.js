import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import {
    getCartTotals,
    editCart,
    removeFromCart
} from "../actions/shoppingCart";
import CustomListGroupItem from "../components/CustomListGroupItemCheckout";
import LoadingScreen from "../components/LoadingScreen";

class CheckoutItems extends React.Component{

    componentDidMount() {
        this.props.dispatch(getCartTotals());
    }

    componentWillReceiveProps(nextProps) {
        // Refresh cart totals after an item quantity is changed.
        if (this.props.users.cartEditRequested !== nextProps.users.cartEditRequested &&
            ! nextProps.users.cartEditRequested
        ) {
            this.props.dispatch(getCartTotals());
        }

        // Refresh cart totals after an item is removed from the cart.
        if (this.props.users.cartRemoveRequested !== nextProps.users.cartRemoveRequested &&
            ! nextProps.users.cartRemoveRequested
        ) {
            this.props.dispatch(getCartTotals());
        }
    }

    handleChangeCartQuantity = (productId, quantity) => {
        this.props.dispatch(editCart(productId, { quantity }));
    };

    handleRemoveFromCart = productId => {
        this.props.dispatch(removeFromCart({ productId }));
    };


    render() {
        if (this.props.users.cartRequested) {
            return <LoadingScreen/>
        }

        return (
            <div>
                <h4>Item(s) for checkout: </h4>
                <br/>
                <ListGroup className="checkout-items-listgroup">
                    {this.props.shoppingCart.map(item => (
                        <CustomListGroupItem
                            key={item.productId}
                            {...item}
                            onChangeCartQuantity={this.handleChangeCartQuantity}
                            onRemoveFromCart={
                                () => this.handleRemoveFromCart(item.productId)}
                         />
                    ))}
                </ListGroup>
                <hr/>
                {this.props.users.cartTotals &&
                <div>
                    <div className="subtotals-cart-div text-right">
                        <Row>
                            <Col lg={9} md={9}>
                                <span className="subtotal-cart-label">
                                    Subtotal:
                                </span>
                            </Col>

                            <Col lg={3} md={3}>
                                <span className="subtotal-cart-amount">
                                    ${parseFloat(this.props.users.cartTotals.subtotal)
                                        .toFixed(2)}
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={9} md={9}>
                                <span className="subtotal-cart-label">
                                    Shipping:
                                </span>
                            </Col>

                            <Col lg={3} md={3}>
                                <span className="subtotal-cart-amount">
                                    ${parseFloat(this.props.users.cartTotals.shipping)
                                        .toFixed(2)}
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={9} md={9}>
                                <span className="subtotal-cart-label">
                                    Taxes:
                                </span>
                            </Col>

                            <Col lg={3} md={3}>
                                <span className="subtotal-cart-amount">
                                    ${parseFloat(this.props.users.cartTotals.taxes)
                                        .toFixed(2)}
                                </span>
                            </Col>
                        </Row>
                    </div>
                    <Row className="text-right">
                        <Col lg={9} md={9}>
                            <span className="total-cart-label bold text-xl">
                                Total:
                            </span>
                        </Col>

                        <Col lg={3} md={3}>
                            <span className="total-cart-amount bold text-xl">
                                ${parseFloat(this.props.users.cartTotals.total)
                                    .toFixed(2)}
                            </span>
                        </Col>
                    </Row>
                </div>}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart,
    users: state.users
});

export default connect(mapStateToProps)(CheckoutItems);
