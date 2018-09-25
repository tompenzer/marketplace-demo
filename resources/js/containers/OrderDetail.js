import React from "react";
import { Grid, Row, Col, Panel, ListGroup, Glyphicon } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { ROUTES } from "../api/strings";
import { getOrderInfo } from "../actions/users";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CartActions from '../components/CartActions';
import CustomListGroupItem from '../components/CustomListGroupItemOrder';
import InformationPanel from "../components/InformationPanel";
import LoadingScreen from "../components/LoadingScreen";
import styleVariables from '../../sass/base/_variables.scss';

const headingLabelStyle = {
    color: styleVariables.grayDark,
    fontSize: styleVariables.textSizeS,
    fontWeight: 700
};

const headingTextStyle = {
    color: styleVariables.gray,
    fontSize: styleVariables.textSizeS
};

class OrderDetail extends React.Component{

    state = {
      cartProduct: {}
    };

    componentDidMount() {
        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }

        this.props.dispatch(getOrderInfo(this.props.match.params.orderId));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }

        if (this.props.match.params.orderId !== nextProps.match.params.orderId) {
            this.props.dispatch(getOrderInfo(nextProps.match.params.orderId));
        }
    }

    // Pass the product added to cart from the ProductList to its sibling
    // component CartActions.
    handleAddToCart = (product) => {
        this.setState({ cartProduct: product });
    }

    handleUnAddedToCart = () => {
        this.setState({ cartProduct: {} });
    }

    render() {

        if (this.props.users.orderInfoError) {
            return <InformationPanel
                panelTitle="Invalid Order"
                informationHeading="You are on invalid order page!"
                message="Please try viewing the order details again."
            />
        }

        if (this.props.users.orderInfoRequested || ! this.props.users.order.id) {
            return <LoadingScreen/>
        }

        return (
            <Grid>
                <Row>
                    <Col lgOffset={1} mdOffset={1} md={10} lg={10}>
                        <Row>
                            <Col lg={4} md={4}>
                                <h2 className="page-heading">
                                    <Link to={ROUTES.orders.index}>
                                        <Glyphicon glyph="chevron-left"/>
                                        My Orders
                                    </Link>
                                </h2>
                            </Col>

                            <Col lg={6} md={6}>
                                <p>
                                    <span style={headingLabelStyle}>
                                        Order Identification:
                                    </span>{' '}
                                    <span className="order-panel-attributes">
                                        {this.props.match.params.orderId}
                                    </span>
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col lgOffset={1} mdOffset={1} md={10} lg={10}>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title componentClass="h4">
                                    Order Details
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <Row>
                                    <Col lg={2} md={2}>
                                        <span style={headingLabelStyle}>
                                            Order Date:
                                        </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span style={headingTextStyle}>
                                            {this.props.users.order.created_at
                                                .split(" ")[0]}
                                        </span>
                                    </Col>

                                    <Col lg={2} md={2}>
                                        <span style={headingLabelStyle}>
                                            Order Time:
                                        </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span style={headingTextStyle}>
                                            {this.props.users.order.created_at
                                                .split(" ")[1]} EST
                                        </span>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={2} md={2}>
                                        <span style={headingLabelStyle}>
                                            Total Amount:
                                        </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span style={headingTextStyle}>
                                            ${parseFloat(this.props.users.order.total)
                                                .toFixed(2)}
                                        </span>
                                    </Col>

                                    <Col lg={2} md={2}>
                                        <span style={headingLabelStyle}>
                                            Total items:
                                        </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span style={headingTextStyle}>
                                            {this.props.users.order.items.length}
                                        </span>
                                    </Col>
                                </Row>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>

                <Row>
                    <Col lgOffset={1} mdOffset={1} md={10} lg={10}>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title componentClass="h4">
                                    Order Status
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <Stepper activeStep={1}>
                                    <Step>
                                        <StepLabel>Order Received</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Shipped</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>In Transit</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Delivered</StepLabel>
                                    </Step>
                                </Stepper>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>

                <Row>
                    <Col lgOffset={1} mdOffset={1} md={10} lg={10}>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title componentClass="h4">Products purchased</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <ListGroup>
                                    {this.props.users.order.items.map(item => (
                                        <CustomListGroupItem
                                            key={'orderItem' + item.product.id}
                                            productName={item.product.name}
                                            productId={item.product.id}
                                            currentPrice={item.product.price}
                                            currency={item.product.currency.abbreviation}
                                            quantity={item.quantity}
                                            pricePaid={item.price}
                                            handleAddToCart={() => this.handleAddToCart({
                                                ...item.product,
                                                quantity: item.quantity
                                            })}
                                        >
                                            {item.product.name}
                                        </CustomListGroupItem>
                                    ))}
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>

                <CartActions
                    product={this.state.cartProduct}
                    onUndone={this.handleUnAddedToCart}
                    dispatch={this.props.dispatch}
                />
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    authentication: state.authentication,
    users: state.users
});

export default connect(mapStateToProps)(withRouter(OrderDetail));
