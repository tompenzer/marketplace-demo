import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios, { getAuthHeaders } from "../api/axiosInstance";
import { getUserAPI, storesApi, storeInfoApi, storeUpdateApi, storeAuthApi } from "../api/apiURLs";
import { loginUser, logoutUser } from "../actions/authentication";
import { loadStoreDetails, checkStoreAuth, saveStore } from "../actions/stores";
import { ACCESS_TOKEN, ROUTES } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { connect } from 'react-redux';

const s = "success";

class StoreAdd extends React.Component{

    state = {
        storeId: null,
        storeNameValidation: null,
        storeName: '',
        descriptionValidation: null,
        description: ''
    };

    componentDidMount() {
        // Require auth to add/edit stores.
        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }

        // If passed a storeId prop, and it's an integer (as opposed to the word
        // "add" from the shared create route), pre-fill the data and we'll do a
        // store update rather than adding a new store.
        if (this.props.match &&
            this.props.match.params.storeId &&
            parseInt(this.props.match.params.storeId) == this.props.match.params.storeId
        ) {
            this.props.dispatch(checkStoreAuth(this.props.match.params.storeId));
            this.props.dispatch(loadStoreDetails(this.props.match.params.storeId));
        }

        if (this.props.stores.storeAuth && this.props.stores.storeDetails) {
            this.updateStoreInfo(this.props.stores.storeDetails);
        }
    }

    componentWillReceiveProps(nextProps) {
        // Check that we're getting an integer, since the "add" portion of the
        // `/store/add` route gets interpreted as a :storeId.
        if (this.props.match.params.storeId !== nextProps.match.params.storeId &&
            parseInt(nextProps.match.params.storeId) == nextProps.match.params.storeId
        ) {
            this.props.dispatch(checkStoreAuth(nextProps.match.params.storeId));
            this.props.dispatch(loadStoreDetails(nextProps.match.params.storeId));
        }

        // Handle situations where storeAuth is returned before and after the
        // storeDetails.
        if (this.props.stores.storeDetails !== nextProps.stores.storeDetails) {
            if (this.props.stores.storeAuth) {
                this.updateStoreInfo(nextProps.stores.storeDetails);
            }
        }

        if (this.props.stores.storeAuth !== nextProps.stores.storeAuth) {
            if (nextProps.stores.storeAuth && this.props.stores.storeDetails) {
                this.updateStoreInfo(this.props.stores.storeDetails);
            }
        }

        // If a store has been created/updated, redirect to it.
        if (this.props.stores.storeCreated !== nextProps.stores.storeCreated &&
            parseInt(nextProps.stores.storeCreated) == nextProps.stores.storeCreated
        ) {
            this.props.history.push(ROUTES.stores.show.split(':')[0] + nextProps.stores.storeCreated);
        }

        // Require auth; redirect to login if the auth check comes back negative.
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated) {
            if (nextProps.authentication.isAuthenticated === false) {
                this.props.history.push(ROUTES.auth.login);
            }
        }
    }

    updateStoreInfo = (storeDetails) => {
        this.setState({
            storeName: storeDetails.name,
            storeNameValidation: s,
            description: storeDetails.description,
            descriptionValidation: s
        });
    }

    handleNameChange = (e) => {
        const storeName = e.target.value;
        let storeNameValidation = null;

        if (storeName.length > 0 && storeName.length < 255) {
            storeNameValidation = "success";
            this.setState(() => ({ storeName, storeNameValidation }));
        } else {
            storeNameValidation = "error";
            this.setState(() => ({ storeNameValidation }));
        }
    };

    handleDescriptionChange = (e) => {
        const description = e.target.value;
        let descriptionValidation;

        if (description.length > 0) {
            descriptionValidation = "success";
            this.setState(() => ({ description, descriptionValidation }));
        } else {
            descriptionValidation = "error";
            this.setState(() => ({ descriptionValidation }));
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.storeName.length && this.state.description.length) {
            let store = {
                name: this.state.storeName,
                description: this.state.description
            };

            if (this.props.match &&
                this.props.match.params.storeId &&
                parseInt(this.props.match.params.storeId) == this.props.match.params.storeId
            ) {
                store.id = this.props.match.params.storeId;
            }

            this.props.dispatch(saveStore(store));
        }
    };

    render() {
        let addOrEdit = 'Add',
            errors = '';

        if (this.props.match && this.props.match.params.storeId) {
            addOrEdit = 'Edit';
        }

        if (this.props.stores.storesRequested) {
            return <LoadingScreen/>
        }

        if (this.props.stores.storeCreateErrors.length) {
            errors = (
                <Panel bsStyle="danger">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Error adding store</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <ul>
                            {this.props.stores.storeCreateErrors.map((item) => (
                                item.map((error, k) => (
                                    <li key={k}>{error}</li>
                                ))
                            ))}
                        </ul>
                    </Panel.Body>
                </Panel>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className={"text-center"}>{addOrEdit + (this.props.match && this.props.match.params.storeId ? '' : ' a')} store</h3>
                        {errors}
                        <form onSubmit={this.handleSubmit}>

                            <FormGroup
                                controlId="formStoreName"
                                validationState={this.state.storeNameValidation}
                            >
                                <ControlLabel>Store name</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.storeName}
                                    placeholder="Store name"
                                    onChange={this.handleNameChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formDescription"
                                validationState={this.state.descriptionValidation}
                            >
                                <ControlLabel>Store description</ControlLabel>
                                <FormControl
                                    componentClass="textarea"
                                    value={this.state.description}
                                    placeholder="Some of the services provided"
                                    onChange={this.handleDescriptionChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            {this.state.storeNameValidation === s &&
                            this.state.descriptionValidation === s &&
                            <Button type={"submit"} bsStyle={"primary"}>{addOrEdit} store</Button>
                            }
                        </form>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    authentication: state.authentication,
    stores: state.stores
});

export default connect(mapStateToProps)(StoreAdd);
