import React from "react";
import { Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { SUCCESSFUL_ORDER, ROUTES } from "../api/strings";
import { connect } from "react-redux";
import { emptyCart } from "../actions/shoppingCart";
import { getUserInfo, placeOrder } from "../actions/users";
import { getCountries } from "../actions/utilities";
import AddressForm from "../components/AddressForm";
import LoadingScreen from "../components/LoadingScreen";

const s = "success";

class CheckoutInformation extends React.Component {

    componentDidMount() {
        this.props.dispatch(getUserInfo());

        this.props.dispatch(getCountries());

        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    componentWillReceiveProps(nextProps) {
        // If an order has been created/updated, redirect to it.
        if (this.props.users.orderCreated !== nextProps.users.orderCreated &&
            parseInt(nextProps.users.orderCreated) == nextProps.users.orderCreated
        ) {
            this.props.dispatch(emptyCart());
            this.props.history.push({
                pathname: ROUTES.orders.confirmation,
                state: {
                    order: SUCCESSFUL_ORDER,
                    orderId: nextProps.users.orderCreated
                }
            });
        }

        // Require auth; redirect to login if the auth check comes back negative.
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated &&
            nextProps.authentication.isAuthenticated === false
        ) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    handleSubmit = (address) => {
        this.props.dispatch(placeOrder(address));
    };

    render() {
        if (this.props.users.usersRequested ||
            this.props.utilities.countriesRequested ||
            this.props.users.orderRequested
        ) {
            return <LoadingScreen/>
        }

        return (
            <Row>
                <Col lg={12} md={12}>
                    <AddressForm
                        loadedAddresses={this.props.users.user ?
                            this.props.users.user.addresses : []}
                        countries={this.props.utilities.countries}
                        handleSubmit={this.handleSubmit}
                    />
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    authentication: state.authentication,
    shoppingCart: state.shoppingCart,
    users: state.users,
    utilities: state.utilities,
});

export default connect(mapStateToProps)(withRouter(CheckoutInformation));
