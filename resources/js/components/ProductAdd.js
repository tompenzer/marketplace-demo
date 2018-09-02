import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios, { getAuthHeaders } from "../api/axiosInstance";
import { storeAuthApi, productsApi, unitsApi, currenciesApi } from "../api/apiURLs";
import { loginUser, logoutUser } from "../actions/authentication";
import { ACCESS_TOKEN } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { connect } from 'react-redux';

const s = "success";

class ProductAdd extends React.Component{

    state = {
        storeId: null,
        unitsDimension: {},
        unitsWeight: {},
        currencies: {},
        productNameValidation: null,
        productName: '',
        descriptionValidation: null,
        description: '',
        widthValidation: null,
        width: '',
        widthUnitValidation: 'success',
        widthUnitId: '1',
        heightValidation: null,
        height: '',
        heightUnitValidation: 'success',
        heightUnitId: '1',
        lengthValidation: null,
        length: '',
        lengthUnitValidation: 'success',
        lengthUnitId: '1',
        weightValidation: null,
        weight: '',
        weightUnitValidation: 'success',
        weightUnitId: '6',
        priceValidation: null,
        price: '',
        currencyValidation: 'success',
        currencyId: '1',
        isLoading: false,
        userHasAuth: false,
        errors: []
    };

    // Require auth to create a product - redirect to login if unauthorized.
    componentDidMount() {
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);

        if (access_token && this.props.match && this.props.match.params.storeId) {
            let storeId = this.props.match.params.storeId;

            // means the user is already logged in, check if it is valid
            this.setState(() => ({
                isLoading: true,
                storeId: storeId
            }));

            axios.get(storeAuthApi(storeId), getAuthHeaders())
                .then((response) => {
                    this.setState(() => ({
                        isLoading: false,
                        userHasAuth: response.data
                     }));

                     this.fillUnits();
                     this.fillCurrencies();
                     console.log(this.state);
                })
                .catch((error) => {
                    console.log('test');
                    window.localStorage.removeItem(ACCESS_TOKEN);
                    this.props.dispatch(logoutUser());
                    this.setState(() => ({ isLoading: false }));
                    this.props.history.push("/login");
                });
        } else {
            console.log(this.props);
            this.props.dispatch(logoutUser());
            this.props.history.push("/login");
        }
    }

    fillUnits() {
        // Make an object of unit abbreviations keyed to their IDs.
        axios.get(unitsApi).then((response) => {
            let unitsDimension = {},
                unitsWeight = {};

            for (let unit of response.data) {
                switch (unit.type.name) {
                    case 'dimension':
                        unitsDimension[unit.id] = unit.abbreviation;
                        break;
                    case 'weight':
                        unitsWeight[unit.id] = unit.abbreviation;
                        break;
                }
            }

            this.setState({ unitsDimension, unitsWeight });
        });
    }

    fillCurrencies() {
        // Make an object of currency abbreviations keyed to their IDs.
        axios.get(currenciesApi).then((response) => {
            let currencies = {};

            for (let currency of response.data) {
                currencies[currency.id] = currency.abbreviation;
            }

            this.setState({ currencies: currencies });
        });
    }

    handleNameChange = (e) => {
        const name = e.target.value;
        let productNameValidation = null;

        if (name.length > 0 && name.length < 255){
            productNameValidation = "success";
            this.setState(() => ({ name, productNameValidation }));
        } else {
            productNameValidation = "error";
            this.setState(() => ({ productNameValidation }));
        }
    };

    handleDescriptionChange = (e) => {
        const description = e.target.value;
        let descriptionValidation;

        if (description.length > 0){
            descriptionValidation = "success";
            this.setState(() => ({ description, descriptionValidation }));
        } else {
            descriptionValidation = "error";
            this.setState(() => ({ descriptionValidation }));
        }
    };

    handleWidthChange = (e) => {
        const width = e.target.value;
        let widthValidation;

        if (width.length > 0 && parseFloat(width) == width){
            widthValidation = "success";
            this.setState(() => ({ width, widthValidation }));
        } else {
            widthValidation = "error";
            this.setState(() => ({ widthValidation }));
        }
    };

    handleWidthUnitChange = (e) => {
        const widthUnitId = e.target.value;
        let widthUnitValidation;

        if (widthUnitId.length > 0 && parseInt(widthUnitId) == widthUnitId){
            widthUnitValidation = "success";
            this.setState(() => ({ widthUnitId, widthUnitValidation }));
        } else {
            widthUnitValidation = "error";
            this.setState(() => ({ widthUnitValidation }));
        }
    };

    handleHeightChange = (e) => {
        const height = e.target.value;
        let heightValidation;

        if (parseFloat(height) == height) {
            heightValidation = "success";
            this.setState(() => ({ height, heightValidation }));
        } else {
            heightValidation = "error";
            this.setState(() => ({ heightValidation }));
        }
    };

    handleHeightUnitChange = (e) => {
        const heightUnitId = e.target.value;
        let heightUnitValidation;

        if (heightUnitId.length > 0 && parseInt(heightUnitId) == heightUnitId){
            heightUnitValidation = "success";
            this.setState(() => ({ heightUnitId, heightUnitValidation }));
        } else {
            heightUnitValidation = "error";
            this.setState(() => ({ heightUnitValidation }));
        }
    };

    handleLengthChange = (e) => {
        const length = e.target.value;
        let lengthValidation;

        if (parseFloat(length) == length) {
            lengthValidation = "success";
            this.setState(() => ({ length, lengthValidation }));
        } else {
            lengthValidation = "error";
            this.setState(() => ({ lengthValidation }));
        }
    };

    handleLengthUnitChange = (e) => {
        const lengthUnitId = e.target.value;
        let lengthUnitValidation;

        if (lengthUnitId.length > 0 && parseInt(lengthUnitId) == lengthUnitId){
            lengthUnitValidation = "success";
            this.setState(() => ({ lengthUnitId, lengthUnitValidation }));
        } else {
            lengthUnitValidation = "error";
            this.setState(() => ({ lengthUnitValidation }));
        }
    };

    handleWeightChange = (e) => {
        const weight = e.target.value;
        let weightValidation;

        if (parseFloat(weight) == weight) {
            weightValidation = "success";
            this.setState(() => ({ weight, weightValidation }));
        } else {
            weightValidation = "error";
            this.setState(() => ({ weightValidation }));
        }
    };

    handleWeightUnitChange = (e) => {
        const weightUnitId = e.target.value;
        let weightUnitValidation;

        if (weightUnitId.length > 0 && parseInt(weightUnitId) == weightUnitId){
            weightUnitValidation = "success";
            this.setState(() => ({ weightUnitId, weightUnitValidation }));
        } else {
            weightUnitValidation = "error";
            this.setState(() => ({ weightUnitValidation }));
        }
    };

    handlePriceChange = (e) => {
        const price = e.target.value;
        let priceValidation;

        if (parseFloat(price) == price) {
            priceValidation = "success";
            this.setState(() => ({ price, priceValidation }));
        } else {
            priceValidation = "error";
            this.setState(() => ({ priceValidation }));
        }
    };

    handleCurrencyChange = (e) => {
        const currencyId = e.target.value;
        let currencyValidation;

        if (currencyId.length > 0 && parseInt(currencyId) == currencyId){
            currencyValidation = "success";
            this.setState(() => ({ currencyId, currencyValidation }));
        } else {
            currencyValidation = "error";
            this.setState(() => ({ currencyValidation }));
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState(() => ({ isLoading: true }));
        const data = {
            store_id: this.state.storeId,
            name: this.state.name,
            description: this.state.description,
            width: this.state.width,
            width_unit_id: this.state.widthUnitId,
            height: this.state.height,
            height_unit_id: this.state.heightUnitId,
            length: this.state.length,
            length_unit_id: this.state.lengthUnitId,
            weight: this.state.weight,
            weight_unit_id: this.state.weightUnitId,
            price: this.state.price,
            currency_id: this.state.currencyId
        };

        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = { Accept: "application/json", Authorization: `Bearer ${access_token}` };
        axios.post(productsApi, data, { headers })
            .then((response) => {
                if (response.data.id) {
                    this.setState(() => ({ isLoading: false }));
                    this.props.history.push("/product/" + response.data.id);
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
                        <h3 className={"text-center"}>Add a product</h3>
                        {this.state.errors.length > 0 &&
                        <div>
                            <Panel bsStyle="danger">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Error adding product</Panel.Title>
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
                                controlId="formProductName"
                                validationState={this.state.productNameValidation}
                            >
                                <ControlLabel>Product name</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.name}
                                    placeholder="Product name"
                                    onChange={this.handleNameChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formDescription"
                                validationState={this.state.descriptionValidation}
                            >
                                <ControlLabel>Product description</ControlLabel>
                                <FormControl
                                    componentClass="textarea"
                                    value={this.state.description}
                                    placeholder="Some of the services provided"
                                    onChange={this.handleDescriptionChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formWidth"
                                        validationState={this.state.widthValidation}
                                    >
                                        <ControlLabel>Product width</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.width}
                                            placeholder="The width of the item"
                                            onChange={this.handleWidthChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup
                                        controlId="formWidthUnit"
                                        validationState={this.state.widthUnitValidation}
                                    >
                                        <ControlLabel>Width units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleWidthUnitChange}
                                        >
                                            {Object.keys(this.state.unitsDimension).map((key) => (<option value={key}>{this.state.unitsDimension[key]}</option>))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formHeight"
                                        validationState={this.state.heightValidation}
                                    >
                                        <ControlLabel>Product height</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.height}
                                            placeholder="The height of the item"
                                            onChange={this.handleHeightChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup
                                        controlId="formHeightUnit"
                                        validationState={this.state.heightUnitValidation}
                                    >
                                        <ControlLabel>Height units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleHeightUnitChange}
                                        >
                                            {Object.keys(this.state.unitsDimension).map((key) => (<option value={key}>{this.state.unitsDimension[key]}</option>))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formLength"
                                        validationState={this.state.lengthValidation}
                                    >
                                        <ControlLabel>Product length</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.length}
                                            placeholder="The length of the item"
                                            onChange={this.handleLengthChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup
                                        controlId="formLengthUnit"
                                        validationState={this.state.lengthUnitValidation}
                                    >
                                        <ControlLabel>Length units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleLengthUnitChange}
                                        >
                                            {Object.keys(this.state.unitsDimension).map((key) => (<option value={key}>{this.state.unitsDimension[key]}</option>))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formWeight"
                                        validationState={this.state.weightValidation}
                                    >
                                        <ControlLabel>Product weight</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.weight}
                                            placeholder="The weight of the item"
                                            onChange={this.handleWeightChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup
                                        controlId="formWeightUnit"
                                        validationState={this.state.weightUnitValidation}
                                    >
                                        <ControlLabel>Weight units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleWeightUnitChange}
                                        >
                                            {Object.keys(this.state.unitsWeight).map((key) => (<option value={key}>{this.state.unitsWeight[key]}</option>))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formPrice"
                                        validationState={this.state.priceValidation}
                                    >
                                        <ControlLabel>Product price</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.price}
                                            placeholder="The price of the item"
                                            onChange={this.handlePriceChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup
                                        controlId="formPriceUnit"
                                        validationState={this.state.currencyValidation}
                                    >
                                        <ControlLabel>Currency</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleCurrencyChange}
                                        >
                                            {Object.keys(this.state.currencies).map((key) => (<option value={key}>{this.state.currencies[key]}</option>))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            {this.state.productNameValidation === s &&
                            this.state.descriptionValidation === s &&
                            this.state.widthValidation === s &&
                            this.state.widthUnitValidation === s &&
                            this.state.heightValidation === s &&
                            this.state.heightUnitValidation === s &&
                            this.state.lengthValidation === s &&
                            this.state.lengthUnitValidation === s &&
                            this.state.weightValidation === s &&
                            this.state.weightUnitValidation === s &&
                            this.state.priceValidation === s &&
                            this.state.currencyValidation === s &&
                            <Button type={"submit"} bsStyle={"primary"}>Add product</Button>
                            }
                        </form>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default connect()(ProductAdd);
