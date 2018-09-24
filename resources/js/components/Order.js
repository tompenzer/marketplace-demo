import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import OrderList from "../containers/OrderList";
import OrderConfirmation from "./OrderConfirmation";
import { connect } from "react-redux";
import { SUCCESSFUL_ORDER, ROUTES } from "../api/strings";
import { withRouter } from "react-router-dom";

class Order extends React.Component {

    componentDidMount() {
        if (! this.props.location.state ||
            this.props.location.state.order !== SUCCESSFUL_ORDER
        ) {
            this.props.history.push(ROUTES.orders.index);
        }
    }

    render() {
        return (
            <Grid className="page-min-height">
                <Row>
                    <Col lg={12} md={12}>
                        <OrderConfirmation/>
                        <OrderList/>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default withRouter(Order);
