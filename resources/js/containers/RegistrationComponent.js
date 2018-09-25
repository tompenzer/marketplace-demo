import React from 'react';
import {
    Button,
    Grid,
    Row,
    Col,
    ControlLabel,
    FormGroup,
    FormControl,
    Panel,
    HelpBlock
} from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from "../actions/authentication";
import { ROUTES } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";

const s = 'success';

class RegistrationComponent extends React.Component{

    state = {
        fullNameValidation: null,
        emailValidation: null,
        passwordValidation: false,
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    componentDidMount() {
        if (this.props.authentication.isAuthenticated) {
            this.props.history.push(ROUTES.root);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authentication.isAuthenticated) {
            this.props.history.push(ROUTES.root);
        }

        // Redirect to login once registration succeeds.
        if (nextProps.authentication.userCreated) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    passwordChange = (e) => {
        const password = e.target.value,
            confirmPassword = this.state.confirmPassword;
        let passwordValidation = false;

        if (confirmPassword.length > 5 && password === confirmPassword) {
            passwordValidation = true;
        }

        this.setState({ passwordValidation, password });
    };

    confirmPasswordChange = (e) => {
        const confirmPassword = e.target.value,
            password = this.state.password;
        let passwordValidation = false;

        if (password.length > 5 && password === confirmPassword) {
            passwordValidation = true;
        }

        this.setState({ passwordValidation, confirmPassword });
    };

    handleFullNameChange = (e) => {
        const fullName = e.target.value;
        let fullNameValidation = 'error';

        if (fullName.length > 0 && fullName.length < 255) {
            fullNameValidation = s;
        }

        this.setState({ fullName, fullNameValidation });
    };

    static emailValidation = email => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    onEmailChange = (e) => {
        const email = e.target.value;
        let emailValidation = 'error';

        if (email.length <= 255 &&
            RegistrationComponent.emailValidation(email.trim())
        ) {
            emailValidation = s;
        }

        this.setState({ email, emailValidation });
    };

    onRegisterSubmit = () => {
        this.props.dispatch(registerUser({
            name: this.state.fullName,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword
        }));
    };

    render() {

        if (this.props.authentication.registrationRequested) {
            return <LoadingScreen/>
        }

        return (
            <Grid>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className="text-center">Register</h3>
                        {this.props.authentication.registrationErrors.length > 0 &&
                        <div>
                            <Panel bsStyle="danger">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">
                                        Error while registering
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <ul>
                                        {this.props.authentication.registrationErrors.map(item => (
                                            item.map((error, k) => (
                                                <li key={k}>{error}</li>
                                            ))
                                        ))}
                                    </ul>
                                </Panel.Body>
                            </Panel>
                        </div>
                        }
                        <form onSubmit={e => e.preventDefault()}>

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
                                validationState={this.state.passwordValidation ?
                                    s : null}>
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    placeholder="Password"
                                    onChange={this.passwordChange}
                                />
                                <HelpBlock>
                                    Password must of at least 6 characters.
                                </HelpBlock>
                                {this.state.confirmPassword.length > 0 &&
                                    ! this.state.passwordValidation &&
                                        <span className="error-message margin-t-s">
                                            Password doesn't match.
                                        </span>}
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicConfirmPassword"
                                validationState={this.state.passwordValidation ?
                                    s : null}
                            >
                                <ControlLabel>Confirm Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.confirmPassword}
                                    placeholder="Confirm Password"
                                    onChange={this.confirmPasswordChange}
                                />
                                {this.state.password.length > 0 &&
                                    ! this.state.passwordValidation &&
                                        <span className="error-message margin-t-s">
                                            Password doesn't match.
                                        </span>}
                            </FormGroup>

                            {this.state.fullNameValidation === s &&
                            this.state.emailValidation === s &&
                            this.state.passwordValidation &&
                            <Button
                                type="submit"
                                onClick={this.onRegisterSubmit}
                                bsStyle="primary">
                                Register
                            </Button>
                            }
                        </form>
                        <div>
                            <br/>
                            <p>Already have an account?</p>
                            <Link
                                to={ROUTES.auth.login}
                                className='btn btn-default'>
                                Login
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    authentication: state.authentication
});

export default connect(mapStateToProps)(withRouter(RegistrationComponent));
