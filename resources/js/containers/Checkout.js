import React from "react";
import { Grid, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import CheckoutItems from "../containers/CheckoutItems";
import CheckoutNoItems from "../components/CheckoutNoItems";
import CheckoutInformation from "../containers/CheckoutInformation";

const Checkout = props => (
    <Grid className="page-min-height">
        <h2 className="page-title">Checkout</h2>

        <hr/>

        {props.shoppingCart.length === 0 && <CheckoutNoItems/> }

        {props.shoppingCart.length > 0 &&
        <Row>
            <Col lg={6} md={6}>
                <CheckoutItems/>
            </Col>
            <Col lg={6} md={6}>
                <CheckoutInformation/>
            </Col>
        </Row>
        }
    </Grid>
);

const mapStateToProps = state => ({ shoppingCart: state.shoppingCart });

export default connect(mapStateToProps)(Checkout);
