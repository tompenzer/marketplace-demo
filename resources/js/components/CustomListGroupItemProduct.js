import React from "react";
import {Button, Row, Col} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {addToCart} from "../actions/shoppingCart";
import {image} from "./image";
import { connect } from 'react-redux';

class CustomListGroupItemProduct extends React.Component{

    addToCartOnClick = (e) => {
        e.stopPropagation();
        // dispatching an action to redux store
        const product = {
            productName: this.props.children,
            productImage: this.props.image,
            sellerName: this.props.sellerName,
            quantity: 1,
            price: this.props.currentPrice,
            productID: this.props.productID
        };
        this.props.dispatch(addToCart(product));
    };

    viewClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    render() {
        return (
            <li className="list-group-item" onClick={() => this.viewClickHandler(`/product/${this.props.productID}`)}>
                <div className={"media-left"}>
                    <img className="media-object" height={64} width={64} src={this.props.image ? this.props.image : image} alt="..." />
                </div>
                <div className={"media-body"}>
                    <Row>
                        <Col lg={9} md={9} sm={12} xs={12}>
                            <h4 className="media-heading">{this.props.children}</h4>
                            <div className="margin-b-s">{this.props.sellerName}</div>
                            <div>
                                {this.props.prevPrice && <span className={"subcategory-deal-price-st"}>${this.props.prevPrice} </span>}
                                <span className={"subcategory-deal-price"}>${this.props.currentPrice}</span>
                            </div>
                        </Col>

                        <Col md={3} lg={3} sm={12} xs={12}>
                            <div>
                              <span>
                                  <Button bsStyle={"default"} className={"btn-sm btn-block margin-b-s"} onClick={() => this.viewClickHandler(`/product/${this.props.productID}`)}>View</Button>
                                  <Button bsStyle={"primary"} className={"btn-sm btn-block"} onClick={this.addToCartOnClick}>Add to Cart</Button>
                              </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemProduct));
