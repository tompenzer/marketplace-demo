import React from "react";
import { Grid, Row, Col, Button } from "react-bootstrap";
import { loadStores } from "../actions/stores";
import { connect } from 'react-redux';
import StoreList from "../components/StoreList";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import { ROUTES } from "../api/strings";

class Stores extends React.Component {

    componentDidMount() {
        this.props.dispatch(loadStores(this.props.match.params.q));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.q !== nextProps.match.params.q) {
            this.props.dispatch(loadStores(nextProps.match.params.q));
        }
    }

    render() {

        if (this.props.stores.storesRequested) {
            return (
                <Grid>
                    <Row className="margin-b-m">
                        <Col md={12} sm={12}>
                            <h2 className="text-center">
                                retrieving stores...
                            </h2>
                        </Col>
                    </Row>

                    <Row className="margin-b-m">
                        <Col md={12} sm={12}>
                            <LoadingScreen/>
                        </Col>
                    </Row>
                </Grid>
            )
        }

        let addStoreButton = '';

        if (this.props.authentication.isAuthenticated) {
            addStoreButton = (
                <Button
                    bsStyle="primary"
                    className="add-store"
                    onClick={() => (
                        this.props.history.push(ROUTES.stores.store))}>
                    Add store
                </Button>
            )
        }

        if (this.props.stores.storesError) {
            return (
                <div>
                    <InformationPanel
                        panelTitle="There are no stores currently available"
                        informationHeading="Something went wrong."
                        message="We were unable to find any stores, which wasn't expected. Please try again later in the hopes it's been fixed."
                        />
                    {addStoreButton}
                </div>
            )
        }

        return (
            <Grid>
                {addStoreButton}

                <Row className="margin-b-m">
                    <Col md={12} sm={12}>
                        <h2 className="text-center">
                            Choose from a selection of stores listed below
                        </h2>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} sm={12}>
                        <StoreList stores={this.props.stores.stores}/>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    authentication: state.authentication,
    stores: state.stores
});

export default connect(mapStateToProps)(Stores);
