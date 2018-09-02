import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "../api/axiosInstance";
import { getUserAPI, storesApi } from "../api/apiURLs";
import { loginUser, logoutUser } from "../actions/authentication";
import {ACCESS_TOKEN} from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { connect } from 'react-redux';

const s = "success";

class StoreAdd extends React.Component{

    state = {
        storeNameValidation: null,
        storeName: '',
        descriptionValidation: null,
        description: '',
        isLoading: false,
        errors: []
    };

    // Require auth to create a store - redirect to login if unauthorized.
    componentDidMount(){
        if(window.localStorage.getItem(ACCESS_TOKEN) !== null){
            // means the user is already logged in, check if it is valid
            this.setState(() => ({isLoading: true}));
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = { Accept: "application/json", Authorization: `Bearer ${access_token}` };
            axios.get(getUserAPI, { headers })
                .then(() => {
                    this.setState(() => ({ isLoading: false }));
                })
                .catch((error) => {
                    window.localStorage.removeItem(ACCESS_TOKEN);
                    this.props.dispatch(logoutUser());
                    this.setState(() => ({isLoading: false}));
                    this.props.history.push("/login");
                });
        } else {
            this.props.dispatch(logoutUser());
            this.props.history.push("/login");
        }
    }

    handleNameChange = (e) => {
        const name = e.target.value;
        let storeNameValidation = null;

        if(name.length > 0 && name.length < 255){
            storeNameValidation = "success";
            this.setState(() => ({ name, storeNameValidation }));
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
        this.setState(() => ({isLoading: true}));
        const data = {
            name: this.state.name,
            description: this.state.description
        };

        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = { Accept: "application/json", Authorization: `Bearer ${access_token}` };
        axios.post(storesApi, data, { headers })
            .then((response) => {
                if (response.data.id) {
                    this.props.history.push("/stores/" + response.data.id);
                }
            })
            .catch((error) => {
                 const errors = Object.values(error.response.data.errors);
                 this.setState(() => ({isLoading: false, errors }));
            });
    };

    render(){

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        return (
            <Grid>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className={"text-center"}>Add a store</h3>
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
                                    value={this.state.name}
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
                            <Button type={"submit"} bsStyle={"primary"}>Add store</Button>
                            }
                        </form>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default connect()(StoreAdd);
