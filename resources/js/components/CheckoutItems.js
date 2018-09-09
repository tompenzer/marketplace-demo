import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import CustomListGroupItem from "../components/CustomListGroupItemCheckout";
import { totalReducer } from "./ShoppingCart";
import axios from "../api/axiosInstance";
import { userCartTotalsApi } from "../api/apiURLs";
import { cartUid } from "../actions/shoppingCart";
import LoadingScreen from "../components/LoadingScreen";

class CheckoutItems extends React.Component{
    state = {
        cart: [],
        subtotal: '',
        shipping: '',
        taxes: '',
        total: '',
        isLoading: false
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        axios.get(userCartTotalsApi(cartUid))
            .then((response) => {
                this.setState({ ...response.data, isLoading: false });
            });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }

        return (
            <div>
                <h4>Item(s) for checkout: </h4>
                <br/>
                <ListGroup className={"checkout-items-listgroup"}>
                    {
                        this.props.shoppingCart.map((item) => {
                            return <CustomListGroupItem key={item.productId} {...item} />
                        })
                    }
                </ListGroup>
                <hr/>
                <div className="subtotals-cart-div text-right">
                    <Row>
                        <Col lg={9} md={9}>
                            <span className={"subtotal-cart-label"}>Subtotal:</span>
                        </Col>

                        <Col lg={3} md={3}>
                            <span className={"subtotal-cart-amount"}>${parseFloat(this.state.subtotal).toFixed(2)}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={9} md={9}>
                            <span className={"subtotal-cart-label"}>Shipping:</span>
                        </Col>

                        <Col lg={3} md={3}>
                            <span className={"subtotal-cart-amount"}>${parseFloat(this.state.shipping).toFixed(2)}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={9} md={9}>
                            <span className={"subtotal-cart-label"}>Taxes:</span>
                        </Col>

                        <Col lg={3} md={3}>
                            <span className={"subtotal-cart-amount"}>${parseFloat(this.state.taxes).toFixed(2)}</span>
                        </Col>
                    </Row>
                </div>
                <Row className="text-right">
                    <Col lg={9} md={9}>
                        <span className={"total-cart-label bold text-xl"}>Total:</span>
                    </Col>

                    <Col lg={3} md={3}>
                        <span className={"total-cart-amount bold text-xl"}>${parseFloat(this.state.total).toFixed(2)}</span>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart
    };
};

export default connect(mapStateToProps)(CheckoutItems);
