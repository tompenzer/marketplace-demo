import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios, { getAuthHeaders } from "../api/axiosInstance";
import { storeAuthApi, productsApi, productInfoAPI, productUpdateApi, unitsApi, currenciesApi } from "../api/apiURLs";
import { loginUser, logoutUser } from "../actions/authentication";
import { loadProductDetails, saveProduct } from "../actions/products";
import { checkStoreAuth } from "../actions/stores";
import { ACCESS_TOKEN, ROUTES } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { connect } from 'react-redux';

const s = "success";

class ProductAdd extends React.Component{

    state = {
        storeId: null,
        productId: null,
        productNotFound: null,
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
        // Require auth to add/edit stores.
        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }

        // If passed a storeId prop, and it's an integer (as opposed to the word
        // "add" from the shared create route), pre-fill the data and we'll do a
        // store update rather than adding a new store.
        if (this.props.match &&
            this.props.match.params.storeId &&
            parseInt(this.props.match.params.storeId) == this.props.match.params.storeId
        ) {
            this.setState({ storeId: this.props.match.params.storeId });
            this.props.dispatch(checkStoreAuth(this.props.match.params.storeId));
        }

        // If passed a product prop, pre-fill the data and we'll do a product
        // update rather than adding a new product.
        if (this.props.match &&
            this.props.match.params.productId &&
            parseInt(this.props.match.params.productId) == this.props.match.params.productId
        ) {
            this.setState({ productId: this.props.match.params.productId });
            this.props.dispatch(loadProductDetails(this.props.match.params.productId));
        }

        this.fillUnits();
        this.fillCurrencies();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.storeId !== nextProps.match.params.storeId &&
            parseInt(nextProps.match.params.storeId) == nextProps.match.params.storeId
        ) {
            this.setState({ storeId: nextProps.match.params.storeId });
            this.props.dispatch(checkStoreAuth(nextProps.match.params.storeId));
        }

        if (this.props.match.params.productId !== nextProps.match.params.productId &&
            parseInt(nextProps.match.params.productId) == nextProps.match.params.productId
        ) {
            this.setState({ productId: nextProps.match.params.productId });
            this.props.dispatch(loadProductDetails(nextProps.match.params.productId));
        }

        if (nextProps.products.productDetails.id &&
            this.props.products.productDetails !== nextProps.products.productDetails
        ) {
            this.updateProductInfo(nextProps.products.productDetails);
        }

        // If a product has been created/updated, redirect to it.
        if (this.props.products.productCreated !== nextProps.products.productCreated &&
            parseInt(nextProps.products.productCreated) == nextProps.products.productCreated
        ) {
            this.props.history.push(ROUTES.products.show.split(':')[0] + nextProps.products.productCreated);
        }

        // Require auth; redirect to login if the auth check comes back negative.
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated &&
            nextProps.authentication.isAuthenticated === false
        ) {
            this.props.history.push(ROUTES.auth.login);
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

    updateProductInfo = (product) => {
        this.setState({
            productId: product.id,
            productName: product.name,
            productNameValidation: s,
            description: product.description,
            descriptionValidation: s,
            width: product.width,
            widthValidation: s,
            widthUnitId: product.width_unit_id,
            height: product.height,
            heightValidation: s,
            heightUnitId: product.height_unit_id,
            length: product.length,
            lengthValidation: s,
            lengthUnitId: product.length_unit_id,
            weight: product.weight,
            weightValidation: s,
            weightUnitId: product.weight_unit_id,
            price: product.price,
            priceValidation: s,
            currencyId: product.currency_id,
        });
    };

    handleNameChange = (e) => {
        const productName = e.target.value;
        let status = "error";

        if (productName.length > 0 && productName.length < 255) {
            status = s;
        }

        this.setState({ productName, productNameValidation: status });
    };

    handleDescriptionChange = (e) => {
        const description = e.target.value;
        let status = "error";

        if (description.length > 0) {
            status = s;
        }

        this.setState({ description, descriptionValidation: status });
    };

    handleWidthChange = (e) => {
        const width = e.target.value;
        let status = "error";

        if (width.length > 0 && parseFloat(width) == width) {
            status = s;
        }

        this.setState({ width, widthValidation: status });
    };

    handleWidthUnitChange = (e) => {
        const widthUnitId = e.target.value;
        let status = "error";

        if (widthUnitId.length > 0 && parseInt(widthUnitId) == widthUnitId) {
            status = s;
        }

        this.setState({ widthUnitId, widthUnitValidation: status });
    };

    handleHeightChange = (e) => {
        const height = e.target.value;
        let status = "error";

        if (parseFloat(height) == height) {
            status = s;
        }

        this.setState({ height, heightValidation: status });
    };

    handleHeightUnitChange = (e) => {
        const heightUnitId = e.target.value;
        let status = "error";

        if (heightUnitId.length > 0 && parseInt(heightUnitId) == heightUnitId) {
            status = s;
        }

        this.setState({ heightUnitId, heightUnitValidation: status });
    };

    handleLengthChange = (e) => {
        const length = e.target.value;
        let status = "error";

        if (parseFloat(length) == length) {
            status = s;
        }

        this.setState({ length, lengthValidation: status });
    };

    handleLengthUnitChange = (e) => {
        const lengthUnitId = e.target.value;
        let status = "error";

        if (lengthUnitId.length > 0 && parseInt(lengthUnitId) == lengthUnitId) {
            status = s;
        }

        this.setState({ lengthUnitId, lengthUnitValidation: status });
    };

    handleWeightChange = (e) => {
        const weight = e.target.value;
        let status = "error";

        if (parseFloat(weight) == weight) {
            status = s;
        }

        this.setState({ weight, weightValidation: status });
    };

    handleWeightUnitChange = (e) => {
        const weightUnitId = e.target.value;
        let status = "error";

        if (weightUnitId.length > 0 && parseInt(weightUnitId) == weightUnitId) {
            status = s;
        }

        this.setState({ weightUnitId, weightUnitValidation: status });
    };

    handlePriceChange = (e) => {
        const price = e.target.value;
        let status = "error";

        if (parseFloat(price) == price) {
            status = s;
        }

        this.setState({ price, priceValidation: status });
    };

    handleCurrencyChange = (e) => {
        const currencyId = e.target.value;
        let status = "error";

        if (currencyId.length > 0 && parseInt(currencyId) == currencyId) {
            status = s;
        }

        this.setState({ currencyId, currencyValidation: status });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const product = {
            store_id: this.state.storeId,
            name: this.state.productName,
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

        if (parseInt(this.state.productId) == this.state.productId) {
            product.id = this.state.productId;
        }

        this.props.dispatch(saveProduct(product));
    };

    render() {
        let addOrEdit = 'Add',
            errors = '';

        if (this.state.productId) {
            addOrEdit = 'Edit';
        }

        if (this.props.products.productsRequested) {
            return <LoadingScreen/>
        }

        if (this.props.products.productCreateErrors.length) {
            errors = (
                <Panel bsStyle="danger">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Error adding product</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <ul>
                            {this.props.products.productCreateErrors.map((item) => (
                                item.map((error, k) => (
                                    <li key={k}>{error}</li>
                                ))
                            ))}
                        </ul>
                    </Panel.Body>
                </Panel>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className={"text-center"}>{addOrEdit} a product</h3>
                        {errors}
                        <form onSubmit={this.handleSubmit}>

                            <FormGroup
                                controlId="formProductName"
                                validationState={this.state.productNameValidation}
                            >
                                <ControlLabel>Product name</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.productName}
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
                                    placeholder="A description of the product."
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
                                            {Object.keys(this.state.unitsDimension).map((key) => (<option key={'width-' + key} value={key}>{this.state.unitsDimension[key]}</option>))}
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
                                            {Object.keys(this.state.unitsDimension).map((key) => (<option key={'height-' + key} value={key}>{this.state.unitsDimension[key]}</option>))}
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
                                            {Object.keys(this.state.unitsDimension).map((key) => (<option key={'length-' + key} value={key}>{this.state.unitsDimension[key]}</option>))}
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
                                            {Object.keys(this.state.unitsWeight).map((key) => (<option key={'weight-' + key} value={key}>{this.state.unitsWeight[key]}</option>))}
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
                                            {Object.keys(this.state.currencies).map((key) => (<option key={'curr-' + key} value={key}>{this.state.currencies[key]}</option>))}
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
                            <Button type="submit" bsStyle="primary">{addOrEdit} product</Button>
                            }
                        </form>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    authentication: state.authentication,
    products: state.products,
    stores: state.stores
});

export default connect(mapStateToProps)(ProductAdd);
