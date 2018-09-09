import React from "react";
import { Grid, Row, Col, Panel, ListGroup, Glyphicon } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios, { getAuthHeaders } from "../api/axiosInstance";
import LoadingScreen from "../components/LoadingScreen";
import { ACCESS_TOKEN, ADDED_TO_CART_SNACKBAR } from "../api/strings";
import { userOrderApi } from "../api/apiURLs";
import InformationPanel from "../components/InformationPanel";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CustomListGroupItem from '../components/CustomListGroupItemOrder';
import { addToCart, removeFromCart } from "../actions/shoppingCart";
import Snackbar from '@material-ui/core/Snackbar';

class OrderDetail extends React.Component{

    state = {
        isLoading: true,
        orderDetail: {},
        snackbarOpen: false,
        snackbarMessage: '',
        addedToCartProductId: null,
        autoHideDuration: 3000,
        invalidOrder: false
    };

    getOrderDetail = () => {
        axios.get(userOrderApi(this.props.match.params.orderId), getAuthHeaders())
            .then((response) => {
                this.setState(() => ({ orderDetail: response.data, isLoading: false }));
            })
            .catch(() => {
                this.setState(() => ({ isLoading: false, invalidOrder: true }));
            });
    };

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.authenticated) {
            this.getOrderDetail();
        } else {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.state && nextProps.location.state.authenticated) {
            this.getOrderDetail();
        } else {
            this.props.history.push("/login");
        }
    }

    handleAddToCart = (product = {}) => {
        this.props.dispatch(addToCart(product));
        this.setState({
            snackbarOpen: true,
            snackbarMessage: ADDED_TO_CART_SNACKBAR,
            addedToCartProductId: product.productId
        });
    };

    handleSnackbarRequestClose = () => {
        this.setState({ snackbarOpen: false });
    };

    static removeItemFromCart = (productId, props) => {
        props.dispatch(removeFromCart({ productId }));
    };

    handleUndoAction = () => {
        if (this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR) {
            OrderDetail.removeItemFromCart(this.state.addedToCartProductId, this.props);
            this.setState({ addedToCartProductId: null });
        }

        this.handleSnackbarRequestClose();
    };

    render() {

        if (this.state.isLoading) {
            return <LoadingScreen/>
        } else if (this.state.invalidOrder) {
            return <InformationPanel
                panelTitle={"Invalid Order"}
                informationHeading={"You are on invalid order page!"}
                message={"Please try viewing the order details again."}
            />
        }

        const { orderDetail } = this.state;

        return (
            <Grid>
                <Row>
                    <Col lgOffset={1} mdOffset={1} md={10} lg={10}>
                        <Row className={"order-detail-heading"}>
                            <Col lg={4} md={4}>
                                <Link to={"/myorders"}><Glyphicon glyph={"chevron-left"}/>My Orders</Link>
                            </Col>

                            <Col lg={6} md={6}>
                                <p><span className={"order-panel-headings bold"}>Order Identification: </span><span className={"order-panel-attributes"}>EKDJFQYU{this.props.match.params.id}</span></p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col lgOffset={1} mdOffset={1} md={10} lg={10}>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title componentClass="h4">Order Details</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <Row>
                                    <Col lg={2} md={2}>
                                        <span className={"order-panel-headings bold"}>Order Date: </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span className={"order-panel-attributes"}>{orderDetail.created_at.split(" ")[0]}</span>
                                    </Col>

                                    <Col lg={2} md={2}>
                                        <span className={"order-panel-headings bold"}>Order Time: </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span className={"order-panel-attributes"}>{orderDetail.created_at.split(" ")[1]} EST</span>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={2} md={2}>
                                        <span className={"order-panel-headings bold"}>Total Amount: </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span className={"order-panel-attributes"}>${parseFloat(orderDetail.total).toFixed(2)}</span>
                                    </Col>

                                    <Col lg={2} md={2}>
                                        <span className={"order-panel-headings bold"}>Total items: </span>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <span className={"order-panel-attributes"}>{orderDetail.items.length}</span>
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
                                <Panel.Title componentClass="h4">Order Status</Panel.Title>
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
                            <Panel.Body className={"order-list-panel-body"}>
                                <ListGroup>
                                    {orderDetail.items.map((item) => (
                                        <CustomListGroupItem
                                            key={'orderItem' + item.product.id}
                                            productName={item.product.name}
                                            productId={item.product.id}
                                            currentPrice={item.product.price}
                                            currency={item.product.currency.abbreviation}
                                            quantity={item.quantity}
                                            pricePaid={item.price}
                                            handleAddToCart={() => this.handleAddToCart({
                                                name: item.product.name,
                                                quantity: item.quantity,
                                                price: item.product.price,
                                                currency: item.product.currency.abbreviation,
                                                productId: item.product.id
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

                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    action="undo"
                    autoHideDuration={this.state.autoHideDuration}
                    onClick={this.handleUndoAction}
                    onClose={this.handleSnackbarRequestClose}
                />
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(OrderDetail));
