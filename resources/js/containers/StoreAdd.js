import React from 'react';
import {
    Button,
    Grid,
    Row,
    Col,
    ControlLabel,
    FormGroup,
    FormControl,
    Panel
} from 'react-bootstrap';
import { loadStoreDetails, checkStoreAuth, saveStore } from "../actions/stores";
import { ROUTES } from "../api/strings";
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
            this.setState({ storeId: this.props.match.params.storeId });
            this.getStore(this.props.match.params.storeId);
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
            this.setState({ storeId: nextProps.match.params.storeId });
            this.getStore(nextProps.match.params.storeId);
        }

        // Handle situations where storeAuth is returned before and after the
        // storeDetails.
        if (nextProps.stores.storeDetails.id &&
            this.props.stores.storeDetails !== nextProps.stores.storeDetails &&
            this.props.stores.storeAuth
        ) {
            this.updateStoreInfo(nextProps.stores.storeDetails);
        }

        if (nextProps.stores.storeAuth &&
            this.props.stores.storeAuth !== nextProps.stores.storeAuth &&
            this.props.stores.storeDetails.id
        ) {
            this.updateStoreInfo(this.props.stores.storeDetails);
        }

        // If a store has been created/updated, redirect to it.
        if (this.props.stores.storeCreated !== nextProps.stores.storeCreated &&
            parseInt(nextProps.stores.storeCreated) == nextProps.stores.storeCreated
        ) {
            this.props.history.push(
                ROUTES.stores.show
                    .replace(':storeId', nextProps.stores.storeCreated)
            );
        }

        // Require auth; redirect to login if the auth check comes back negative.
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated &&
            nextProps.authentication.isAuthenticated === false
        ) {
            this.props.history.push(ROUTES.auth.login);
        }

        // Update mode require store auth; redirect to login if the store auth
        // check was performed (update mode) and it comes back negative.
        if (this.props.stores.storeAuth !== nextProps.stores.storeAuth &&
            nextProps.stores.storeAuth === false
        ) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    getStore = storeId => {
        this.props.dispatch(checkStoreAuth(storeId));
        this.props.dispatch(loadStoreDetails(storeId));
    }

    updateStoreInfo = storeDetails => {
        this.setState({
            storeName: storeDetails.name,
            storeNameValidation: s,
            description: storeDetails.description,
            descriptionValidation: s
        });
    }

    handleNameChange = e => {
        const storeName = e.target.value.toString();
        let status = "error";

        if (storeName.length > 0 && storeName.length < 255) {
            status = s;
        }

        this.setState({ storeName, storeNameValidation: status });
    };

    handleDescriptionChange = e => {
        const description = e.target.value.toString();
        let status = "error";

        if (description.length > 0) {
            status = s;
        }

        this.setState({ description, descriptionValidation: status });
    };

    handleSubmit = e => {
        e.preventDefault();

        if (this.state.storeName.length && this.state.description.length) {
            let store = {
                name: this.state.storeName,
                description: this.state.description
            };

            if (this.state.storeId) {
                store.id = this.state.storeId;
            }

            this.props.dispatch(saveStore(store));
        }
    };

    render() {
        if (this.props.stores.storesRequested) {
            return <LoadingScreen/>
        }

        let addOrEdit = 'Add',
            errors = '';

        if (this.state.storeId) {
            addOrEdit = 'Edit';
        }

        if (this.props.stores.storeCreateErrors.length) {
            errors = (
                <Panel bsStyle="danger">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            Error adding store
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <ul>
                            {this.props.stores.storeCreateErrors.map(item => (
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
                        <h3 className="text-center">
                            {addOrEdit + (this.state.storeId ? '' : ' a')} store
                        </h3>
                        {errors}
                        <form onSubmit={this.handleSubmit}>

                            <FormGroup
                                controlId="formStoreName"
                                validationState={this.state.storeNameValidation}>
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
                                validationState={this.state.descriptionValidation}>
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
                            <Button type="submit" bsStyle="primary">
                                {addOrEdit} store
                            </Button>
                            }
                        </form>
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

export default connect(mapStateToProps)(StoreAdd);
