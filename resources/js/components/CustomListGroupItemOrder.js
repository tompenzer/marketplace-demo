import React from "react";
import { Button, Row, Col } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class CustomListGroupItemOrder extends React.Component{

    viewClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    handleAddToCart = (e) => {
        e.stopPropagation();

        this.props.handleAddToCart();
    }

    render() {
        return (
            <li className="list-group-item" onClick={() => this.viewClickHandler(`/product/${this.props.productId}`)}>
                <div className={"media-body"}>
                    <Row>
                        <Col lg={7} md={7} sm={12} xs={12}>
                            <h4 className={"media-heading"}>{this.props.children}</h4>
                            <div className={"seller-name-div"}>
                                <span>{this.props.productName}</span>
                            </div>
                            <div>
                                <span className={"subcategory-deal-price"}>${this.props.pricePaid}</span>
                            </div>
                        </Col>

                        <Col lg={3} md={3} sm={12} xs={12}>
                            <div className={"star-rating-div"}>
                                <span>Quantity: {this.props.quantity}</span>
                            </div>
                        </Col>

                        <Col md={2} lg={2} sm={12} xs={12}>
                            <div>
                              <span>
                                  <Button bsStyle={"default"} className={"btn-sm view-atc-button"} onClick={this.removeFromWishlistHandler}>View</Button>
                                  <Button bsStyle={"primary"} className={"btn-sm view-atc-button"} onClick={this.handleAddToCart}>Buy Again</Button>
                              </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemOrder));
