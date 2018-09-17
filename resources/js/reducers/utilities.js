import {
    COUNTRIES,
    COUNTRIES_REQUESTED,
    COUNTRIES_ERROR,
    COUNTRIES_INVALIDATE
} from "../api/strings";

const utilitiesReducerDefaultState = {
    countries: {},
    countriesRequested: false,
    countriesError: false
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
        default:
            return state;
    }
};
