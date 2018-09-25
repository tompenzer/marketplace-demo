import React from 'react';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Grid,
    Row,
    Col
} from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn } from "../actions/authentication";
import { getCart } from "../actions/shoppingCart";
import LoadingScreen from "../components/LoadingScreen";
import { ROUTES } from "../api/strings";

const FieldGroup = ({ id, label, help, ...props }) => (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
);

class LoginComponent extends React.Component{

    state = {
        passwordHelp: '',
        usernameHelp: ''
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
    }

    onLoginSubmit = e => {
        e.preventDefault();

        const email = e.target.formControlsUsername.value;
        const password = e.target.formControlsPassword.value;

        if (password.length === 0) {
            this.setState({ passwordHelp: "Password cannot be empty" });
        } else {
            this.setState({ passwordHelp: '' });
        }

        if (email.length === 0) {
            this.setState({ usernameHelp: "Username cannot be empty" });
        } else {
            this.setState({ usernameHelp: '' });
        }

        if (email.length && password.length) {
            this.props.dispatch(logIn(email, password));
        }
    };

    render() {

        if (this.props.authentication.loginRequested) {
            return <LoadingScreen/>
        }

        return (
            <Grid className="page-min-height">
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className="text-center">Login</h3>
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
                            {this.props.authentication.loginError &&
                                <p className="error-message margin-t-s">
                                    Username or password not valid.
                                </p>}
                            <Button type="submit" className="btn btn-primary">
                                Login
                            </Button>
                        </form>
                        <div>
                            <br/>
                            <p>Don't have an account?</p>
                            <Link
                                to={ROUTES.auth.register}
                                className="btn btn-default">
                                Register
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

export default connect(mapStateToProps)(withRouter(LoginComponent));
