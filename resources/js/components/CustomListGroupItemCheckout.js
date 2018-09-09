import React from "react";
import { Link } from 'react-router-dom';
import { Row, Col, Button, FormControl, Popover, ButtonToolbar, Overlay } from "react-bootstrap";
import ProductInfo from "./ProductInfo";
import { connect } from 'react-redux';
import { editCart } from "../actions/shoppingCart";

const listItemStyle = {
    borderColor: 'rgba(0, 0, 0, 0.1)'
}

const quantityFieldStyle = {
    width: '45px'
}

class CustomListGroupItemCheckout extends React.Component{

    state = {
        quantity: this.props.quantity,
        productId: this.props.productId,
        showRemoveConfirmation: false
    };

    handleRemoveClick = e => {
        this.setState({ target: e.target, showRemoveConfirmation: !this.state.showRemoveConfirmation });
    };

    handleConfirmationCancel = () => {
        this.setState({showRemoveConfirmation: false})
    };

    editCart = (quantity) => {
        let updates = {
          quantity
        };
        this.props.dispatch(editCart(this.state.productId, updates));
    };

    onQuantityChange = (e) => {
        let quantity = e.target.value;
        if(quantity.length < 3){
            this.setState(() => ({quantity}));
        }
    };

    onQuantityBlur = (e) => {
        let quantity = e.target.value;
        if(quantity.length > 0 && parseInt(quantity) > 0 && parseInt(quantity) < 100){
            this.setState(() => ({quantity}));
            this.editCart(parseInt(quantity));
        }
        else{
            this.setState(() => ({quantity: 1}));
            this.editCart(1);
        }
    };

    removeFromCart = () => {
        ProductInfo.removeItemFromCart(this.state.productId, this.props);
    };

    render() {
        return (
            <li style={listItemStyle} className="list-group-item">
                <div className={"media-body"}>
                    <Row>
                        <Col lg={5} md={5} sm={12} xs={12}>
                            <h4 className={"media-heading"}><Link to={'/product/' + this.props.productId}>{this.props.name}</Link></h4>
                            <div>
                                <ButtonToolbar>
                                    <Button onClick={this.handleRemoveClick} bsStyle={"link"} className={"btn-sm"}>Remove</Button>

                                    <Overlay
                                        show={this.state.showRemoveConfirmation}
                                        target={this.state.target}
                                        placement="right"
                                        container={this}
                                        containerPadding={20}
                                    >
                                        <Popover id="popover-contained" title="Are you sure?">
                                            <span>
                                                Remove item from your cart?

                                                <br />
                                                <br />

                                                <Button className={"btn-sm"} bsStyle={"danger"} onClick={this.removeFromCart}>Remove</Button>
                                                <Button className={"btn-sm"} bsStyle={"link"} onClick={this.handleConfirmationCancel}>Cancel</Button>
                                            </span>
                                        </Popover>
                                    </Overlay>
                                </ButtonToolbar>
                            </div>
                        </Col>

                        <Col lg={4} md={4} sm={12} xs={12} className="text-right">
                            <div className={"checkout-quantity-div"}>
                                <span>Quantity: </span>
                                <span>
                                    <FormControl
                                        type="number"
                                        className="d-inline"
                                        value={this.state.quantity}
                                        onChange={this.onQuantityChange}
                                        onBlur={this.onQuantityBlur}
                                        style={quantityFieldStyle}
                                    />
                                </span>
                            </div>
                        </Col>

                        <Col md={3} lg={3} sm={12} xs={12} className="text-right">
                            <div className={"checkout-price-div"}>
                              <span className={"cart-price"}>
                                  ${parseFloat(parseFloat(this.props.price) * parseInt(this.state.quantity)).toFixed(2)}
                              </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </li>
        )
    }
}

export default connect()(CustomListGroupItemCheckout);
