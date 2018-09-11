import React from "react";
import {Link} from "react-router-dom";
import {Panel, Glyphicon} from "react-bootstrap";
import { ROUTES } from "../api/strings";

const OrderConfirmation = (props) => (
    <div>
        <Panel bsStyle="success">
            <Panel.Heading>
                <Panel.Title componentClass="h3">Order Placed Successfully</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <h4>Thank you for shopping with us.</h4>
                {!props.isAuthenticated &&
                <p>You will shortly receive an email with order details.</p>}
                <p>We look forward to providing you with the best-in-class
                    products you've come to expect here at Marketplace.
                </p>
                <div>
                    <Glyphicon glyph={"shopping-cart"} className={"empty-checkout-size"}/>
                </div>
                <Link to={ROUTES.root}>Continue Shopping</Link>
            </Panel.Body>
        </Panel>
    </div>
);

export default OrderConfirmation;
