import React from "react";
import { Modal, Button, ListGroup, Row, Col } from "react-bootstrap";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { removeFromCart, editCart } from "../actions/shoppingCart";
import { ROUTES } from "../api/strings";
import CustomListGroupItem from "../components/CustomListGroupItemCart";
import styleVariables from '../../sass/base/_variables.scss';

export const totalReducer = (accumulator, item) => {
    return accumulator + (item.quantity * item.price);
};

const cartTotalLabelStyle = {
    fontSize: styleVariables.textSizeL,
    fontWeight: 700,
    marginRight: styleVariables.spacingL
}

const cartTotalAmountStyle = {
    fontSize: styleVariables.textSizeL,
    fontWeight: 700,
    marginRight: styleVariables.spacingL
}

class ShoppingCart extends React.Component {

    handleCheckoutClick = () => {
      this.props.handleClose();
      this.props.history.push(ROUTES.orders.checkout);
    };

    handleChangeCartQuantity = (productId, quantity) => {
        this.props.dispatch(editCart(productId, { quantity }));
    };

    handleRemoveFromCart = productId => {
        this.props.dispatch(removeFromCart({ productId }));
    };

    render() {
        let cartContent;

        if (this.props.shoppingCart.length > 0) {
            let total = this.props.shoppingCart.reduce(totalReducer, 0);
            cartContent = (
                <div>
                    <ListGroup>
                        {this.props.shoppingCart.map(item => (
                            <CustomListGroupItem
                                key={item.productId}
                                {...item}
                                {...this.props}
                                onChangeCartQuantity={this.handleChangeCartQuantity}
                                onRemoveFromCart={() => this.handleRemoveFromCart(item.productId)}
                            />
                        ))}
                    </ListGroup>

                    <hr/>

                    <Row className="text-right">
                        <Col lg={9} md={9}>
                            <span style={cartTotalLabelStyle}>Total:</span>
                        </Col>

                        <Col lg={3} md={3}>
                            <span style={cartTotalAmountStyle}>
                                ${parseFloat(total).toFixed(2)}
                            </span>
                        </Col>
                    </Row>
                </div>);
        } else {
            cartContent = (
                <div>
                    <span>
                        You have no items in your cart. Please select from our
                        wide range of products and add them to your cart to
                        purchase.
                    </span>
                </div>
            )
        }
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.handleClose}
                bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Shopping Cart</Modal.Title>
                </Modal.Header>

                <Modal.Body>{cartContent}</Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.handleClose}>
                        Continue Shopping
                    </Button>
                    {this.props.shoppingCart.length > 0 &&
                        <Button
                            bsStyle="primary"
                            onClick={this.handleCheckoutClick}>
                            Checkout
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({ shoppingCart: state.shoppingCart });

export default connect(mapStateToProps)(withRouter(ShoppingCart));
