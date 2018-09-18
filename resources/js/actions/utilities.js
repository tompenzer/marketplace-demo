import axios from "../api/axiosInstance";
import { countriesApi, unitsApi, currenciesApi } from "../api/apiURLs";
import {
    COUNTRIES,
    COUNTRIES_REQUESTED,
    COUNTRIES_ERROR,
    COUNTRIES_INVALIDATE,
    UNITS,
    UNITS_REQUESTED,
    UNITS_ERROR,
    CURRENCIES,
    CURRENCIES_REQUESTED,
    CURRENCIES_ERROR
} from "../api/strings";

export const addCountriesHelper = (countries = {}) => ({
    type: COUNTRIES,
    countries
});

export const countriesRequested = () => ({
    type: COUNTRIES_REQUESTED
});

export const countriesError = () => ({
    type: COUNTRIES_ERROR
});

export const countriesInvalidate = () => ({
    type: COUNTRIES_INVALIDATE
});

export const addUnitsHelper = (units = {}) => ({
    type: UNITS,
    units
});

export const unitsRequested = () => ({
    type: UNITS_REQUESTED
});

export const unitsError = () => ({
    type: UNITS_ERROR
});

export const addCurrenciesHelper = (currencies = {}) => ({
    type: CURRENCIES,
    currencies
});

export const currenciesRequested = () => ({
    type: CURRENCIES_REQUESTED
});

export const currenciesError = () => ({
    type: CURRENCIES_ERROR
});

export const getCountries = () => {
    return (dispatch, getState) => {
        dispatch(countriesRequested());

        // Make an object of country abbreviations and names keyed to their IDs,
        // suitable for a select menu of countries.
        axios.get(countriesApi)
            .then(response => {
                let countries = {};

                for (let country of response.data) {
                    countries[country.id] = country.abbreviation + ' - ' + country.name;
                }

                dispatch(addCountriesHelper(countries));
            })
            .catch(() => dispatch(countriesError()));
    }
}

export const getUnits = () => {
    return (dispatch, getState) => {
        dispatch(unitsRequested());

        // Make an object of unit abbreviations keyed to their IDs, organized by
        // unit type, suitable for generating select menus for the various types.
        axios.get(unitsApi)
            .then(response => {
                let units = {
                    dimension: {},
                    weight: {}
                };

                for (let unit of response.data) {
                    switch (unit.type.name) {
                        case 'dimension':
                        case 'weight':
                            units[unit.type.name][unit.id] = unit.name + ' (' + unit.abbreviation + ')';
                            break;
                    }
                }

                dispatch(addUnitsHelper(units));
            })
            .catch(() => dispatch(unitsError()));
    };
};

export const getCurrencies = () => {
    return (dispatch, getState) => {
        dispatch(currenciesRequested());

        // Make an object of currency abbreviations keyed to their IDs, suitable
        // for generating a select menu of currencies.
        axios.get(currenciesApi).then(response => {
            let currencies = {};

            for (let currency of response.data) {
                currencies[currency.id] = currency.name + ' (' + currency.abbreviation + ')';
            }

            dispatch(addCurrenciesHelper(currencies));
        })
        .catch(() => dispatch(currenciesError()));
    };
};
