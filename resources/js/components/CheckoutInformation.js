import React from "react";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import MaterialButton from '@material-ui/core/Button';
import { Row, Col, FormGroup, ControlLabel, FormControl, Radio, Form, Button } from "react-bootstrap";
import AddressForm from "./AddressForm";
import { withRouter } from "react-router-dom";
import axios, { getAuthHeaders } from "../api/axiosInstance";
import { ACCESS_TOKEN, SUCCESSFUL_ORDER } from "../api/strings";
import { getUserAPI, userCartTotalsApi, userOrderApi, countriesApi} from "../api/apiURLs";
import { connect } from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import { totalReducer } from "./ShoppingCart";
import { cartUid } from "../actions/shoppingCart";

const FieldGroup = ({ id, label, validationState=null, ...props }) => (
        <FormGroup controlId={id} validationState={validationState}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            <FormControl.Feedback />
        </FormGroup>
);

const s = "success";

class CheckoutInformation extends React.Component {

    state = {
        countries: {},
        loadedAddresses: [],
        isLoading: false
    };

    componentDidMount() {
        this.setState({ isLoading: true });

        axios.get(getUserAPI, getAuthHeaders())
            .then((response) => {
                this.setState(() => ({ loadedAddresses: response.data.addresses, isLoading: false }));
            })
            .catch((error) => {
                // Login is required
                this.props.history.push('/login');
            });

        this.fillCountries();
    }

    fillCountries() {
        // Make an object of country abbreviations keyed to their IDs.
        axios.get(countriesApi).then((response) => {
            let countries = {};

            for (let country of response.data) {
                countries[country.id] = country.abbreviation + ' - ' + country.name;
            }

            this.setState({ countries });
        });
    }

    handleSubmit = (address) => {
        // process the order
        this.setState(() => ({ isLoading: true }));

        axios.post(userOrderApi(cartUid), address, getAuthHeaders())
            .then((response) => {
                this.props.history.push('/');
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }

        return (
            <Row>
                <Col lg={12} md={12}>
                    <AddressForm
                        loadedAddresses={this.state.loadedAddresses}
                        countries={this.state.countries}
                        handleSubmit={this.handleSubmit}
                    />
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication,
        shoppingCart: state.shoppingCart
    };
};

export default connect(mapStateToProps)(withRouter(CheckoutInformation));
