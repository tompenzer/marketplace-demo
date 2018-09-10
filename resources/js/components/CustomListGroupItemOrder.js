import React from "react";
import { Button, Row, Col } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const listItemStyle = {
    borderColor: 'rgba(0, 0, 0, 0.1)'
}

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
            <li
                className="list-group-item"
                style={listItemStyle}
            >
                <div className={"media-body"}>
                    <Row>
                        <Col lg={7} md={7} sm={12} xs={12}>
                            <h4 className="media-heading">{this.props.children}</h4>
                            <div className="margin-b-s">{this.props.productName}</div>
                            <div>
                                <span className="text-green">${this.props.pricePaid}</span>
                            </div>
                        </Col>

                        <Col lg={3} md={3} sm={12} xs={12}>
                            Quantity: {this.props.quantity}
                        </Col>

                        <Col md={2} lg={2} sm={12} xs={12}>
                          <Button bsStyle={"default"} className={"btn-sm btn-block margin-b-s"} onClick={() => this.viewClickHandler(`/product/${this.props.productId}`)}>View</Button>
                          <Button bsStyle={"primary"} className={"btn-sm btn-block"} onClick={this.handleAddToCart}>Buy Again</Button>
                        </Col>
                    </Row>
                </div>
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemOrder));
