import React from "react";
import PropTypes from 'prop-types';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    Row,
    Col,
    Button
} from "react-bootstrap";

const s = "success";

class AddressForm extends React.Component {

    state = {
        id: null,
        recipient: '',
        street_1: '',
        street_2: '',
        city: '',
        state: '',
        postal_code: '',
        country_id: 1,
        phone: '',
        recipientValidation: null,
        addressValidation: null,
        cityValidation: null,
        stateValidation: null,
        postalCodeValidation: null,
        phoneValidation: null
    };

    componentDidMount(){
        if (this.props.loadedAddresses) {
            this.props.loadedAddresses.map((address) => {
                // FormControl inputs don't like `null` values; scrub them.
                Object.keys(address).forEach(
                    key => address[key] === null && delete address[key]
                );

                // Sets this.state.id, which we'll pass to the back-end unless
                // any edits are made, at which point we reset the id.
                this.setState({
                    ...address,
                    recipientValidation: s,
                    addressValidation: s,
                    cityValidation: s,
                    stateValidation: s,
                    postalCodeValidation: s,
                    phoneValidation: s
                });
            });
        }
    }

    // Setting id to null if we make any edits, so we add it to the user.
    handleRecipientChange = (e) => {
        let recipient = e.target.value.trim(),
            recipientValidation = 'error';

        if (recipient.length > 0 && recipient.length <= 255) {
            recipientValidation = s;
        }

        this.setState({
            recipient,
            recipientValidation,
            id: null
        });
    };

    handleAddressOneChange = (e) => {
        let street_1 = e.target.value.trim(),
            addressValidation = 'error';

        if (street_1.length > 0 && street_1.length <= 255) {
            addressValidation = s;
        }

        this.setState({
            street_1,
            addressValidation,
            id: null
        });
    };

    handleAddressTwoChange = (e) => {
        let street_2 = e.target.value.trim();

        if (street_2.length <= 255) {
            this.setState({ street_2, id: null });
        }
    };

    handleCityChange = (e) => {
        let city = e.target.value.trim(),
            cityValidation = 'error';

        if (city.length > 0 && city.length <= 255) {
            cityValidation = s;
        }

        this.setState({
            city,
            cityValidation,
            id: null
        });
    };

    handleStateChange = (e) => {
        let state = e.target.value.trim(),
            stateValidation = 'error';

        if (state.length > 0 && state.length <= 255) {
            stateValidation = s;
        }

        this.setState({
            state,
            stateValidation,
            id: null
        });
    };

    handlePostalCodeChange = (e) => {
        let postal_code = e.target.value.trim(),
            postalCodeValidation = 'error';

        if (postal_code.length > 0 && postal_code.length <= 255) {
            postalCodeValidation = s;
        }

        this.setState({
            postal_code,
            postalCodeValidation,
            id: null
        });
    };

    handleCountryChange = (e) => {
        let country_id = e.target.value.trim();

        if (this.props.countries[country_id]) {
            this.setState({ country_id, id: null });
        }
    };

    handlePhoneChange = (e) => {
        let phone = e.target.value.trim(),
            phoneValidation = 'error';

        if (phone.length > 0 && phone.length <= 255) {
            phoneValidation = s;
        }

        this.setState({
            phone,
            phoneValidation,
            id: null
        });
    };

    handleAddressSubmit = () => {
        const {
            id,
            recipient,
            street_1,
            street_2,
            city,
            state,
            postal_code,
            country_id,
            phone
        } = this.state;

        this.props.handleSubmit({
            id,
            recipient,
            street_1,
            street_2,
            city,
            state,
            postal_code,
            country_id,
            phone
        });
    };

    render() {
        return (
            <form onSubmit={this.handleAddressSubmit}>
                <fieldset>
                    <FormGroup
                        controlId="formBasicRecipient"
                        validationState={this.state.recipientValidation}
                    >
                        <ControlLabel>Recipient</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.recipient}
                            placeholder="Recipient"
                            onChange={this.handleRecipientChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                        controlId="formBasicAddress"
                        validationState={this.state.addressValidation}
                    >
                        <ControlLabel>Street Address</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.street_1}
                            placeholder="Address 1"
                            onChange={this.handleAddressOneChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                        controlId="formBasicAddress2"
                    >
                        <FormControl
                            type="text"
                            value={this.state.street_2}
                            placeholder="Address 2"
                            onChange={this.handleAddressTwoChange}
                        />
                    </FormGroup>

                    <FormGroup
                        controlId="formBasicCity"
                        validationState={this.state.cityValidation}
                    >
                        <ControlLabel>City</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.city}
                            placeholder="City"
                            onChange={this.handleCityChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    <Row>
                        <Col lg={4} md={4} sm={12}>
                            <FormGroup
                                controlId="formBasicState"
                                validationState={this.state.stateValidation}
                            >
                                <ControlLabel>State</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.state}
                                    placeholder="State"
                                    onChange={this.handleStateChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </Col>

                        <Col lg={4} md={4} sm={12}>
                            <FormGroup
                                controlId="formBasicPostalCode"
                                validationState={this.state.postalCodeValidation}
                            >
                                <ControlLabel>Postal Code</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.postal_code}
                                    placeholder="Postal code"
                                    onChange={this.handlePostalCodeChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </Col>

                        <Col lg={4} md={4} sm={12}>
                            <FormGroup
                                controlId="formCountryId"
                            >
                                <ControlLabel>Country</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleCountryChange}
                                >
                                    {Object.keys(this.props.countries)
                                        .map((key) => (
                                            <option
                                                key={'country-' + key}
                                                value={key}
                                                >
                                                {this.props.countries[key]}
                                            </option>
                                        ))}
                                </FormControl>
                            </FormGroup>
                        </Col>

                    </Row>

                    <FormGroup
                        controlId="formBasicPhone"
                        validationState={this.state.phoneValidation}
                    >
                        <ControlLabel>Phone</ControlLabel>
                        <FormControl
                            type="number"
                            value={this.state.phone}
                            placeholder="Phone"
                            onChange={this.handlePhoneChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    {this.state.recipientValidation === s &&
                    this.state.addressValidation === s &&
                    this.state.cityValidation === s &&
                    this.state.stateValidation === s &&
                    this.state.postalCodeValidation === s &&
                    this.state.phoneValidation === s &&
                    <Button
                        type="submit"
                        bsStyle="success"
                        className="margin-t-s"
                    >
                        Place Order
                    </Button>}
                </fieldset>
            </form>
        )
    }
}

AddressForm.propTypes = {
    countries: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    loadedAddresses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            recipient: PropTypes.string,
            street_1: PropTypes.string,
            street_2: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            postal_code: PropTypes.string,
            country_id: PropTypes.number,
            phone: PropTypes.string
        })
    )
};

export default AddressForm;
