import React from "react";
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { ROUTES } from "../api/strings";
import styleVariables from '../../sass/base/_variables.scss';

const listItemStyle = {
    borderColor: styleVariables.darken10
}

class CustomListGroupItemOrder extends React.Component{

    viewClickHandler = () => {
        this.props.history.push(
            ROUTES.products.show.replace(':id', this.props.productId)
        );
    };

    render() {
        return (
            <li
                className="list-group-item"
                style={listItemStyle}
            >
                <div className="media-body">
                    <Row>
                        <Col lg={7} md={7} sm={12} xs={12}>
                            <h4 className="media-heading">
                                {this.props.children}
                            </h4>
                            <div className="margin-b-s">
                                {this.props.productName}
                            </div>
                            <div>
                                <span className="text-green">
                                    ${this.props.pricePaid}
                                </span>
                            </div>
                        </Col>

                        <Col lg={3} md={3} sm={12} xs={12}>
                            Quantity: {this.props.quantity}
                        </Col>

                        <Col md={2} lg={2} sm={12} xs={12}>
                            <Button
                                bsStyle="default"
                                className="btn-sm btn-block margin-b-s"
                                onClick={this.viewClickHandler}
                            >
                                View
                            </Button>
                            <Button
                                bsStyle="primary"
                                className="btn-sm btn-block"
                                onClick={this.props.handleAddToCart}
                            >
                                Buy Again
                            </Button>
                        </Col>
                    </Row>
                </div>
            </li>
        )
    }
}

CustomListGroupItemOrder.propTypes = {
    children: PropTypes.string.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    productName: PropTypes.string.isRequired,
    pricePaid: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
};

export default withRouter(CustomListGroupItemOrder);
