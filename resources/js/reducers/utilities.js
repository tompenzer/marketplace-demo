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

const utilitiesReducerDefaultState = {
    countries: {},
    countriesRequested: false,
    countriesError: false,
    units: {},
    unitsRequested: false,
    unitsError: false,
    currencies: {},
    currenciesRequested: false,
    currenciesError: false
};

export default (state = utilitiesReducerDefaultState, action) => {
    switch (action.type) {
        case COUNTRIES:
            return {
                ...state,
                countries: action.countries,
                countriesRequested: false,
                countriesError: false
            };
        case COUNTRIES_REQUESTED:
            return {
                ...state,
                countriesRequested: true,
                countriesError: false
            };
        case COUNTRIES_ERROR:
            return {
                ...state,
                countriesRequested: false,
                countriesError: true
            };
        case COUNTRIES_INVALIDATE:
            return {
                ...state,
                ...utilitiesReducerDefaultState
            };
        case UNITS:
            return {
                ...state,
                units: action.units,
                unitsRequested: false,
                unitsError: false
            };
        case UNITS_REQUESTED:
            return {
                ...state,
                unitsRequested: true,
                unitsError: false
            };
        case UNITS_ERROR:
            return {
                ...state,
                unitsRequested: false,
                unitsError: true
            };
        case CURRENCIES:
            return {
                ...state,
                currencies: action.currencies,
                currenciesRequested: false,
                currenciesError: false
            };
        case CURRENCIES_REQUESTED:
            return {
                ...state,
                currenciesRequested: true,
                currenciesError: false
            };
        case CURRENCIES_ERROR:
            return {
                ...state,
                currenciesRequested: false,
                currenciesError: true
            };
        default:
            return state;
    }
};
