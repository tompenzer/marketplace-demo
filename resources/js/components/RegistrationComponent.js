import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from "../api/axiosInstance";
import {getUserAPI, registerAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {ACCESS_TOKEN} from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { connect } from 'react-redux';

const s = "success";

class RegistrationComponent extends React.Component{

    state = {
        usernameValidation: null,
        passwordValidation: false,
        fullNameValidation: null,
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isLoading: false,
        errors: []
    };

    componentDidMount(){
        if(window.localStorage.getItem(ACCESS_TOKEN) !== null){
            // means the user is already logged in, check if it is valid
            this.setState(() => ({isLoading: true}));
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
            axios.get(getUserAPI, {headers})
                .then((response) => {
                    this.props.dispatch(loginUser());
                    this.props.history.push("/");
                })
                .catch((error) => {
                    window.localStorage.removeItem(ACCESS_TOKEN);
                    this.props.dispatch(logoutUser());
                    this.setState(() => ({isLoading: false}));
                });
        }
    }

    passwordChange = (e) => {
        const password = e.target.value;
        const confirmPassword = this.state.confirmPassword;
        if(confirmPassword.length > 0 && password !== confirmPassword){
            this.setState(() => ({passwordValidation: true, password}))
        }
        else{
            this.setState(() => ({passwordValidation: false, password}))
        }
    };

    confirmPasswordChange = (e) => {
        const confirmPassword = e.target.value;
        const password = this.state.password;
        if(password.length > 0 && password !== confirmPassword){
            this.setState(() => ({passwordValidation: true, confirmPassword}))
        }
        else{
            this.setState(() => ({passwordValidation: false, confirmPassword}))
        }
    };

    handleFullNameChange = (e) => {
        const fullName = e.target.value;
        let fullNameValidation = null;
        if(fullName.length > 0 && fullName.length < 45){
            fullNameValidation = "success";
            this.setState(() => ({fullName, fullNameValidation}));
        }
        else{
            fullNameValidation = "error";
            this.setState(() => ({fullNameValidation}));
        }
    };

    static emailValidation = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    onEmailChange = (e) => {
        const email = e.target.value;
        let emailValidation = "error";
        if(RegistrationComponent.emailValidation(email.trim())){
            emailValidation = "success";
        }

        if(email.length <= 45){
            this.setState(() => ({email, emailValidation}));
        }
    };

    onRegisterClick = (e) => {
        e.preventDefault();
        this.setState(() => ({isLoading: true}));
        const data = {
            name: this.state.fullName,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword
        };

        axios.post(registerAPI, data)
            .then(() => {
                this.props.history.push("/login");
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
                        <h3 className={"text-center"}>Register</h3>
                        {this.state.errors.length > 0 &&
                        <div>
                            <Panel bsStyle="danger">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Error while registering</Panel.Title>
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
                        <form>

                            <FormGroup
                                controlId="formBasicFullName"
                                validationState={this.state.fullNameValidation}
                            >
                                <ControlLabel>Full Name</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.fullName}
                                    placeholder="Full Name"
                                    onChange={this.handleFullNameChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicUsername"
                                validationState={this.state.emailValidation}
                            >
                                <ControlLabel>Email</ControlLabel>
                                <FormControl
                                    type="email"
                                    value={this.state.email}
                                    placeholder="This will be used for login"
                                    onChange={this.onEmailChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicPassword"
                            >
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    placeholder="Password"
                                    onChange={this.passwordChange}
                                />
                                <HelpBlock>Password must of at least 6 characters.</HelpBlock>
                                {this.state.passwordValidation ? <span className={"error-message"}>Password doesn't match.</span> : ''}
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicConfirmPassword"
                            >
                                <ControlLabel>Confirm Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.confirmPassword}
                                    placeholder="Confirm Password"
                                    onChange={this.confirmPasswordChange}
                                />
                                {this.state.passwordValidation && <span className={"error-message"}>Password doesn't match.</span>}
                            </FormGroup>

                            {this.state.fullNameValidation === s &&
                            !this.state.passwordValidation &&
                            this.state.emailValidation === s &&
                            this.state.password.length > 5 &&
                            <Button type={"submit"} onClick={this.onRegisterClick} bsStyle={"primary"}>Register</Button>
                            }
                        </form>
                        <div>
                            <br/>
                            <p>Already have an account?</p>
                            <Link to={"/login"} className='btn btn-default'>Login</Link>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default connect()(RegistrationComponent);
