import axios from "../api/axiosInstance";
import { countriesApi } from "../api/apiURLs";
import {
    COUNTRIES,
    COUNTRIES_REQUESTED,
    COUNTRIES_ERROR,
    COUNTRIES_INVALIDATE
} from "../api/strings";

export const addCountriesHelper = (countries = []) => ({
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
            .catch(error => dispatch(countriesError()));
    }
}
