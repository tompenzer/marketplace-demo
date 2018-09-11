import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios, { getAuthHeaders } from "../api/axiosInstance";
import { getUserAPI, storesApi, storeInfoApi, storeUpdateApi, storeAuthApi } from "../api/apiURLs";
import { loginUser, logoutUser } from "../actions/authentication";
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
        description: '',
        isLoading: false,
        errors: []
    };

    componentDidMount() {
        // Require auth to create a store - redirect to login if unauthorized.
        if (window.localStorage.getItem(ACCESS_TOKEN) === null) {
            this.props.dispatch(logoutUser());
            this.props.history.push(ROUTES.auth.login);
        }

        // means the user is already logged in, check if it is valid
        this.setState(() => ({ isLoading: true }));

        axios.get(getUserAPI, getAuthHeaders())
            .then(() => {
                this.setState(() => ({ isLoading: false }));
            })
            .catch((error) => {
                window.localStorage.removeItem(ACCESS_TOKEN);
                this.props.dispatch(logoutUser());
                this.setState(() => ({ isLoading: false }));
                this.props.history.push(ROUTES.auth.login);
            });

        // If passed a store prop, pre-fill the data and we'll do a store
        // update rather than adding a new store.
        if (this.props.match && this.props.match.params.storeId) {
            this.loadStoreDetails(this.props.match.params.storeId);
        }
    }

    loadStoreDetails = (storeId) => {
        // Check if logged in user has authorization to edit store.
        axios.get(storeAuthApi(storeId), getAuthHeaders()).then((response) => {
            this.setState({ storeId, userHasAuth: response.data });

            // Get the store info
            axios.get(storeInfoApi(storeId)).then((response) => (
                this.setState(() => ({
                    storeName: response.data.name,
                    storeNameValidation: s,
                    description: response.data.description,
                    descriptionValidation: s
                }))
            ));
        });
    };

    handleNameChange = (e) => {
        const storeName = e.target.value;
        let storeNameValidation = null;

        if(storeName.length > 0 && storeName.length < 255){
            storeNameValidation = "success";
            this.setState(() => ({ storeName, storeNameValidation }));
        } else{
            storeNameValidation = "error";
            this.setState(() => ({ storeNameValidation }));
        }
    };

    handleDescriptionChange = (e) => {
        const description = e.target.value;
        let descriptionValidation;

        if(description.length > 0){
            descriptionValidation = "success";
            this.setState(() => ({ description, descriptionValidation }));
        } else{
            descriptionValidation = "error";
            this.setState(() => ({ descriptionValidation }));
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState(() => ({ isLoading: true }));
        const data = {
            name: this.state.storeName,
            description: this.state.description
        };

        let url = storesApi;

        if (this.state.storeId !== null) {
            // Laravel uses POST requests with a pseudo-method `_method`
            // postfield for actions other than GET and POST.
            data._method = 'put';
            url = storeUpdateApi(this.state.storeId);
        }

        axios.post(url, data, getAuthHeaders())
            .then((response) => {
                if (response.data.id) {
                    this.setState(() => ({ isLoading: false }));
                    this.props.history.push(ROUTES.stores.show.split(':')[0] + response.data.id);
                }
            })
            .catch((error) => {
                 this.setState(() => ({ isLoading: false, errors: Object.values(error.response.data.errors) }));
            });
    };

    render(){
        let addOrEdit = 'Add';

        if (this.state.storeId) {
            addOrEdit = 'Edit';
        }

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        return (
            <Grid>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className={"text-center"}>{addOrEdit + (this.state.storeId ? '' : ' a')} store</h3>
                        {this.state.errors.length > 0 &&
                        <div>
                            <Panel bsStyle="danger">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Error adding store</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <ul>
                                        {this.state.errors.map((item) => (
                                            item.map((error, k) => (
                                                <li key={k}>{error}</li>
                                            ))
                                        ))}
                                    </ul>
                                </Panel.Body>
                            </Panel>
                        </div>
                        }
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

export default connect()(StoreAdd);
