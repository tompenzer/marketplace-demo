import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Grid, Row, Col } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import axios, { getAuthHeaders } from 'axios';
import { loginAPI, getUserAPI, getUserCartAPI } from "../api/apiURLs";
import { loginUser, logoutUser } from "../actions/authentication";
import { connect } from 'react-redux';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { getCart } from "../actions/shoppingCart";

const FieldGroup = ({ id, label, help, ...props }) => (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
);

class LoginComponent extends React.Component{

    state = {
        passwordHelp: undefined,
        usernameHelp: undefined,
        invalidCredentials: undefined,
        isLoading: false
    };

    onLoginSubmit = (e) => {
        e.preventDefault();
        const email = e.target.formControlsUsername.value;
        const password = e.target.formControlsPassword.value;

        if (password.length === 0) {
            this.setState(() => ({ passwordHelp: "Password cannot be empty" }));
        } else{
            this.setState(() => ({ passwordHelp: undefined }));
        }

        if (email.length === 0) {
            this.setState(() => ({usernameHelp: "Username cannot be empty"}));
        } else {
            this.setState(() => ({usernameHelp: undefined}));
        }

        if (email.length && password.length) {
            this.setState(() => ({ isLoading: true }));

            const data = {
              grant_type: "password",
              client_id: window.Laravel.clientId,
              client_secret: window.Laravel.clientSecret,
              username: email,
              password: password,
              scope: "*"
            };
            axios.post(loginAPI, data)
                .then((response) => {
                    this.setState(() => ({ isLoading: false }));
                    window.localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
                    window.localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
                    this.props.dispatch(loginUser());
                    this.props.history.push("/");
                })
                .catch((error) => (
                    this.setState(() => ({
                        invalidCredentials: true,
                        isLoading: false
                    }))
                ));
        }
    };

    render(){

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        return (
            <Grid className={"minimum-height"}>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className={"text-center"}>Login</h3>
                        <form onSubmit={this.onLoginSubmit}>
                            <FieldGroup
                                id="formControlsUsername"
                                type="email"
                                label="Email address"
                                placeholder="Enter registered email"
                                help={this.state.usernameHelp}
                            />
                            <FieldGroup
                                id="formControlsPassword"
                                label="Password"
                                type="password"
                                placeholder="Enter password"
                                help={this.state.passwordHelp}
                            />
                            {this.state.invalidCredentials && <p className={"error-message"}>Username or password not valid.</p>}
                            <Button type={"submit"} className={'btn btn-primary'}>Login</Button>
                        </form>
                        <div>
                            <br/>
                            <p>Don't have an account?</p>
                            <Link to={"/register"} className='btn btn-default'>Register</Link>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(LoginComponent));
