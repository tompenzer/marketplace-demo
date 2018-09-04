import React from "react";
import { FormGroup, ControlLabel, FormControl, Row, Col } from "react-bootstrap";
import Button from '@material-ui/core/Button';

const s = "success";

export default class AddressForm extends React.Component {

    state = {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
        country_id: '',
        phone: '',
        addressValidation: null,
        cityValidation: null,
        zipValidation: null,
        phoneValidation: null,
        editDisabled: false
    };

    componentDidMount(){
        if (this.props.loadedAddresses !== null) {
            this.props.loadedAddresses.map((address) => {
                this.setState(() => ({
                    street1: address.street_1,
                    street2: address.street_2,
                    city: address.city,
                    state: address.state,
                    zip: address.postal_code,
                    phone: address.phone,
                    addressValidation: s,
                    cityValidation: s,
                    zipValidation: s,
                    phoneValidation: s,
                    editDisabled: true
                }));
            });
        }
    }

    handleAddressOneChange = (e) => {
        let street1 = e.target.value;
        let addressValidation = "success";
        if(street1.trim().length === 0){
            addressValidation = "error";
        }
        if(street1.length <= 45){
            this.setState(() => ({street1, addressValidation}));
        }

    };

    handleAddressTwoChange = (e) => {
        let street2 = e.target.value;
        if(street2.length <= 45) {
            this.setState(() => ({street2}));
        }
    };

    handleCityChange = (e) => {
        let city = e.target.value;
        let cityValidation = "success";
        if(city.trim().length === 0){
            cityValidation = "error";
        }
        this.setState(() => ({city, cityValidation}));
    };

    handleStateChange = (e) => {
        let state = e.target.value;
        this.setState(() => ({state}));
    };

    handleZipChange = (e) => {
        let zip = e.target.value;
        let zipValidation = null;
        if(zip.length < 5){
            zipValidation = "error";
        }
        else{
            zipValidation = "success"
        }

        if(zip.length <= 5){
            this.setState(() => ({zip, zipValidation}));
        }

    };

    handlePhoneChange = (e) => {
        let phone = e.target.value.trim();
        let phoneValidation = null;
        if(phone.length < 10){
            phoneValidation = "error"
        }
        else{
            phoneValidation = "success"
        }

        if(phone.length <= 10){
            this.setState(() => ({phone, phoneValidation}));
        }
    };

    handleNextAddress = () => {
        const { street1, street2, city, state, zip, phone } = this.state;
        this.props.handleNext({
            street1,
            street2,
            city,
            state,
            zip,
            phone
        });
    };


    render(){
        return (
            <form>
                <fieldset disabled={this.state.editDisabled}>
                    <FormGroup
                        controlId="formBasicAddress"
                        validationState={this.state.addressValidation}
                    >
                        <ControlLabel>Address</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.street1}
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
                            value={this.state.street2}
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
                        <Col lg={6} md={6}>
                            <FormGroup
                                controlId="formBasicState"
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

                        <Col lg={6} md={6}>
                            <FormGroup
                                controlId="formBasicZip"
                                validationState={this.state.zipValidation}
                            >
                                <ControlLabel>Zip</ControlLabel>
                                <FormControl
                                    type="number"
                                    value={this.state.zip}
                                    placeholder="Zip"
                                    onChange={this.handleZipChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup
                        controlId="formBasicZip"
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
                </fieldset>
                <div style={{margin: '12px 0'}}>
                    <Button
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={this.props.handlePrev}
                    >
                        Back
                    </Button>
                {this.state.addressValidation === s &&
                this.state.cityValidation === s &&
                this.state.zipValidation === s &&
                this.state.phoneValidation === s &&
                <Button
                    className="margin-r-s"
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary="true"
                    onClick={this.handleNextAddress}
                >
                    Next
                </Button>
                }
                </div>
            </form>
        )
    }
}
