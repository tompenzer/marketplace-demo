import React from "react";
import { Row, Col, Panel, ListGroup } from "react-bootstrap";
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { ADDED_TO_CART_SNACKBAR, ROUTES } from "../api/strings";
import { addToCart, removeFromCart } from "../actions/shoppingCart";
import { getUserOrders } from "../actions/users";
import Snackbar from '@material-ui/core/Snackbar';
import LoadingScreen from "../components/LoadingScreen";
import CustomListGroupItem from '../components/CustomListGroupItemOrder';
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
        addedToCartProductId: null,
        snackbarOpen: false,
        snackbarMessage: '',
        autoHideDuration: 3000
    };

    componentDidMount() {
        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }

        this.props.dispatch(getUserOrders());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    handleAddToCart = (product = {}) => {
        this.props.dispatch(addToCart(product));
        this.setState({
            addedToCartProductId: product.productId,
            snackbarOpen: true,
            snackbarMessage: ADDED_TO_CART_SNACKBAR
        });
    };

    handleSnackbarRequestClose = () => {
        this.setState({ snackbarOpen: false });
    };

    handleUndoAction = () => {
        if (this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR) {
            this.props.dispatch(removeFromCart({ productId: this.state.addedToCartProductId }));
            this.setState({ addedToCartProductId: null });
        }
        this.handleSnackbarRequestClose();
    };

    render() {

        if (this.props.users.ordersRequested) {
            return <LoadingScreen/>
        }

        return (
            <div>
                <h2 className="page-heading">My orders</h2>
                <hr/>
                <br/>
                {this.props.users.orders.length === 0 ?
                <p>You haven't placed any orders.</p> :
                this.props.users.orders.data.map((order) => {
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

const mapStateToProps = state => ({
    authentication: state.authentication,
    users: state.users
});

export default connect(mapStateToProps)(withRouter(OrderList));
