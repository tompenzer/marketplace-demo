import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Button, Form, FormGroup, FormControl, Glyphicon, Tooltip, OverlayTrigger } from "react-bootstrap";
import ProductInfo from "./ProductInfo";
import { connect } from 'react-redux';
import { removeFromCart, editCart } from "../actions/shoppingCart";
import styleVariables from '../../sass/base/_variables.scss';
import { ROUTES } from "../api/strings";

const cartListItemStyle = {
    borderColor: 'rgba(0, 0, 0, 0.1)'
};

const cartListGroupRowStyle = {
    display: 'table-cell',
    float: 'none',
    verticalAlign: 'middle'
}

const quantityInputStyle = {
    marginLeft: styleVariables.spacingS,
    marginRight: styleVariables.spacingS,
    width: '70px'
}

const tooltip = (
    <Tooltip id="tooltip">
        Remove Item
    </Tooltip>
);

class CustomListGroupItemCart extends React.Component{

    state = {
        quantity: this.props.quantity
    }

    setNewQuantity = (quantity) => {
        // Allow users to temporarily blank out the quantity, but don't update
        // the cart while it's in that state.
        if (quantity === '') {
            this.setState({ quantity });
            return;
        }

        quantity = parseInt(quantity);

        // If the user sets an invalid quantity, restore previous state.
        if (quantity < 1 || quantity > 999) {
            this.setState((prevState) => prevState);
            return;
        }

        this.props.dispatch(editCart(this.props.productId, { quantity }));
        this.setState({ quantity });
    }

    handleQuantityIncrease = () => {
        // Don't do anything when quantity is blank or non-integer.
        if (parseInt(this.state.quantity) == this.state.quantity) {
            this.setNewQuantity(parseInt(this.state.quantity) + 1);
        }
    }

    handleQuantityDecrease = () => {
        // Don't do anything when quantity is blank or non-integer.
        if (parseInt(this.state.quantity) == this.state.quantity) {
            this.setNewQuantity(parseInt(this.state.quantity) - 1);
        }
    }

    removeFromCart = () => {
        this.props.dispatch(removeFromCart({ productId: this.props.productId }));
    }

    render() {
        return (
            <li className="list-group-item" style={cartListItemStyle}>
                <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <h4><Link to={ROUTES.products.show.split(':')[0] + this.props.productId}>{this.props.name}</Link></h4>
                    </Col>

                    <Col lg={3} md={3} sm={12} xs={12}>
                        <div className="cart-quantity-div">
                            <Form inline onSubmit={(e) => { e.stopPropagation(); }}>
                                <FormGroup controlId="cartQuantityDecrease">
                                    <Button onClick={this.handleQuantityDecrease}>-</Button>
                                </FormGroup>{' '}
                                <FormGroup controlId="cartQuantity">
                                    <FormControl
                                        type="number"
                                        style={quantityInputStyle}
                                        value={this.state.quantity}
                                        onChange={(e) => this.setNewQuantity(e.target.value)}
                                        onBlur={(e) => this.setNewQuantity(e.target.value)}
                                        min={1}
                                        max={999}
                                    />
                                </FormGroup>{' '}
                                <FormGroup controlId="cartQuantityIncrease">
                                    <Button onClick={this.handleQuantityIncrease}>+</Button>
                                </FormGroup>
                            </Form>
                        </div>
                    </Col>

                    <Col md={2} lg={2} sm={12} xs={12}>
                        <div className={"cart-price-div"}>
                          <span className={"cart-price"}>
                              ${this.state.quantity && parseFloat(parseFloat(this.props.price) * parseInt(this.state.quantity)).toFixed(2)}
                          </span>
                        </div>
                    </Col>

                    <Col md={1} lg={1} sm={12} xs={12}>
                        <div className={"cart-remove-div"}>
                            <OverlayTrigger placement="top" overlay={tooltip}>
                                <span onClick={this.removeFromCart}><Glyphicon glyph={"remove"}/></span>
                            </OverlayTrigger>
                        </div>
                    </Col>
                </Row>
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemCart));
