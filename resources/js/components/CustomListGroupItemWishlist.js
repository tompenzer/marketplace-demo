import React from "react";
import {Button, Row, Col} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {image} from "./image";
import { connect } from 'react-redux';
import {addToCartFromWishlist, removeFromWishlist} from "../actions/wishlist";

class CustomListGroupItemWishlist extends React.Component{

    addToCartOnClick = (e) => {
        e.stopPropagation();
        // dispatching an action to redux store
        const product = {
            productName: this.props.children,
            productImage: this.props.image,
            sellerName: this.props.sellerName,
            quantity: 1,
            price: this.props.currentPrice,
            productID: this.props.productID,
            prevPrice: this.props.prevPrice
        };
        this.props.dispatch(addToCartFromWishlist(product));
    };

    viewClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    removeFromWishlistHandler = (e) => {
        e.stopPropagation();
        const productID = this.props.productID;
        this.props.dispatch(removeFromWishlist(productID));
    };

    render() {
        return (
            <li className="list-group-item" onClick={() => this.viewClickHandler(`/product/${this.props.productID}`)}>
                <div className={"media-left"}>
                    <img className="media-object" width={64} height={64} src={this.props.image ? this.props.image : image} alt="..." />
                </div>
                <div className={"media-body"}>
                    <Row>
                        <Col lg={9} md={9} sm={12} xs={12}>
                            <h4 className={"media-heading"}>{this.props.children}</h4>
                            <div className={"seller-name-div"}>
                                <span>{this.props.sellerName}</span>
                            </div>
                            <div>
                                {this.props.prevPrice && <span className={"subcategory-deal-price-st"}>${this.props.prevPrice} </span>}
                                <span className={"subcategory-deal-price"}>${this.props.currentPrice}</span>
                            </div>
                        </Col>

                        <Col md={3} lg={3} sm={12} xs={12}>
                            <div>
                              <span>
                                  <Button bsStyle={"default"} className={"btn-sm view-atc-button"} onClick={this.removeFromWishlistHandler}>Remove</Button>
                                  <Button bsStyle={"success"} className={"btn-sm view-atc-button"} onClick={this.addToCartOnClick}>Add to Cart</Button>
                              </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemWishlist));
