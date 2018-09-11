import React from "react";
import { Grid, Row, Col, Panel, ListGroup } from "react-bootstrap";
import axios, { getAuthHeaders } from "../api/axiosInstance";
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import CustomListGroupItem from '../components/CustomListGroupItemOrder';
import { ACCESS_TOKEN, ADDED_TO_CART_SNACKBAR, ROUTES } from "../api/strings";
import { userOrdersApi } from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import { addToCart, removeFromCart } from "../actions/shoppingCart";
import Snackbar from '@material-ui/core/Snackbar';
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

const OrderPanels = (props) => (
    <Panel>
        <Panel.Heading>
            <Panel.Title>
                <Row>
                    <Col lg={3} md={3}>
                        <span style={headingLabelStyle}>Order Placed:</span>
                    </Col>
                    <Col lg={3} md={3}>
                        <span style={headingLabelStyle}>Total:</span>
                    </Col>
                    <Col lg={4} md={4}>
                        <span style={headingLabelStyle}>Items:</span>
                    </Col>
                    <Col lg={2} md={2}>
                        <Link to={{
                            pathname: ROUTES.orders.show.split(':')[0] + props.orderID,
                            state: { authenticated: true }
                        }}>
                            View details
                        </Link>
                    </Col>
                </Row>

                <Row>
                    <Col lg={3} md={3}>
                        <span style={headingTextStyle}>{props.orderDate.split(" ")[0]}</span>
                    </Col>
                    <Col lg={3} md={3}>
                        <span style={headingTextStyle}>${props.orderTotal}</span>
                    </Col>
                    <Col lg={3} md={3}>
                        <span style={headingTextStyle}>{props.itemCount}</span>
                    </Col>
                    <Col lg={3} md={3}>

                    </Col>
                </Row>
            </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
            {props.children}
        </Panel.Body>
    </Panel>
);

class OrderList extends React.Component {

    state = {
        orders: [],
        snackbarOpen: false,
        snackbarMessage: '',
        autoHideDuration: 3000,
        isLoading: false
    };

    componentDidMount() {
        this.setState(() => ({ isLoading: true }));

        axios.get(userOrdersApi, getAuthHeaders())
            .then((response) => {
                const orders = response.data;
                this.setState({ orders, isLoading: false });
            })
            .catch((error) => {
                console.log(error.response);
                this.props.history.push(ROUTES.auth.login);
            });
    }

    handleAddToCart = (product = {}) => {
        this.props.dispatch(addToCart(product));
        this.setState({ snackbarOpen: true, snackbarMessage: ADDED_TO_CART_SNACKBAR });
    };

    handleSnackbarRequestClose = () => {
        this.setState({ snackbarOpen: false });
    };

    static removeItemFromCart = (productId, props) => {
        props.dispatch(removeFromCart({ productId }));
    };

    handleUndoAction = () => {
        if(this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR){
            ProductInfo.removeItemFromCart(this.state.productId, this.props);
        }
        this.handleSnackbarRequestClose();
    };

    render() {

        if (this.state.isLoading) {
            return <LoadingScreen/>
        }

        return (
            <div>
                <h2 className="page-heading">My orders</h2>
                <hr/>
                <br/>
                {this.state.orders.length === 0 ?
                <p>You haven't placed any orders.</p> :
                this.state.orders.data.map((order) => {
                return <OrderPanels
                        key={'order' + order.id}
                        orderDate={order.created_at}
                        orderTotal={order.total}
                        itemCount={order.items.length}
                        orderID={order.id}
                    >
                        <ListGroup>
                            {order.items.map((item) => (
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
                    </OrderPanels>
              })
              }
              <Snackbar
                  open={this.state.snackbarOpen}
                  message={this.state.snackbarMessage}
                  action="undo"
                  autoHideDuration={this.state.autoHideDuration}
                  onClick={this.handleUndoAction}
                  onClose={this.handleSnackbarRequestClose}
              />
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(OrderList));
