import React from "react";
import { Link } from "react-router-dom";
import { Panel, Glyphicon } from "react-bootstrap";
import { ROUTES } from "../api/strings";

const iconStyle = {
    fontSize: '30px'
}

const NoCheckoutItems = () => (
    <div>
        <Panel bsStyle="primary">
            <Panel.Heading>
                <Panel.Title componentClass="h3">Your cart is empty</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <h4>There are no items to checkout.</h4>
                <p>Select from our wide range of productd and add them to your cart to purchase.</p>
                <div>
                    <Glyphicon glyph={"shopping-cart"} style={iconStyle}/>
                </div>
                <Link to={ROUTES.root}>Continue Shopping</Link>
            </Panel.Body>
        </Panel>
    </div>
);

export default NoCheckoutItems;
