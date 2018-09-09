import React from "react";
import { FormGroup, ControlLabel, FormControl, Row, Col, Button } from "react-bootstrap";

const s = "success";

export default class AddressForm extends React.Component {

    state = {
        id: null,
        countries: {},
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
        countryValidation: s,
        phoneValidation: null,
        editDisabled: false
    };

    componentDidMount(){
        if (this.props.loadedAddresses !== null) {
            this.props.loadedAddresses.map((address) => {
                // FormControl inputs don't like `null` values; scrub them.
                Object.keys(address).forEach((key) => (address[key] === null) && delete address[key]);

                this.setState({
                    ...address,
                    recipientValidation: s,
                    addressValidation: s,
                    cityValidation: s,
                    stateValidation: s,
                    postalCodeValidation: s,
                    countryValidation: s,
                    phoneValidation: s,
                    editDisabled: false
                });
            });
        }

        if (this.props.countries !== null) {
            this.setState({ countries: this.props.countries });
        }
    }

    // Setting id to null if we make any edits, so we add it to the user.
    handleRecipientChange = (e) => {
        let recipient = e.target.value.trim();

        if (recipient.length > 0 && recipient.length <= 255) {
            this.setState(() => ({ recipient, recipientValidation: s, id: null }));
        } else {
            this.setState(() => ({ recipientValidation: "error" }));
        }

    };

    handleAddressOneChange = (e) => {
        let street_1 = e.target.value.trim();

        if (street_1.length > 0 && street_1.length <= 255) {
            this.setState(() => ({ street_1, addressValidation: s, id: null }));
        } else {
            this.setState(() => ({ addressValidation: "error" }));
        }

    };

    handleAddressTwoChange = (e) => {
        let street_2 = e.target.value.trim();
        if (street_2.length <= 255) {
            this.setState(() => ({ street_2, id: null }));
        }
    };

    handleCityChange = (e) => {
        let city = e.target.value.trim();

        if (city.length > 0 && city.length <= 255) {
            this.setState(() => ({ city, cityValidation: s, id: null }));
        } else {
            this.setState(() => ({ cityValidation: "error" }));
        }
    };

    handleStateChange = (e) => {
        let state = e.target.value.trim();

        if (state.length > 0 && state.length <= 255) {
            this.setState(() => ({ state, stateValidation: s, id: null }));
        } else {
            this.setState(() => ({ stateValidation: "error" }));
        }
    };

    handlePostalCodeChange = (e) => {
        let postal_code = e.target.value.trim();

        if (postal_code.length > 0 && postal_code.length <= 255) {
            this.setState(() => ({ postal_code, postalCodeValidation: s, id: null }));
        } else {
            this.setState(() => ({ postalCodeValidation: "error" }));
        }
    };

    handleCountryChange = (e) => {
        let country_id = e.target.value.trim();

        if (this.state.countries[country_id]) {
            this.setState(() => ({ country_id, countryValidation: s, id: null }));
        } else {
            this.setState(() => ({ countryValidation: "error" }));
        }
    };

    handlePhoneChange = (e) => {
        let phone = e.target.value.trim();

        if (phone.length > 0 && phone.length <= 255) {
            this.setState(() => ({ phone, phoneValidation: s, id: null }));
        } else {
            this.setState(() => ({ phoneValidation: "error" }));
        }
    };

    handleAddress = () => {
        const { id, recipient, street_1, street_2, city, state, postal_code, country_id, phone } = this.state;
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


    render(){
        return (
            <form onSubmit={this.handleAddress}>
                <fieldset disabled={this.state.editDisabled}>
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
                                validationState={this.state.countryValidation}
                            >
                                <ControlLabel>Country</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleCountryChange}
                                >
                                    {Object.keys(this.state.countries).map((key) => (<option key={'country-' + key} value={key}>{this.state.countries[key]}</option>))}
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
                    this.state.countryValidation === s &&
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
