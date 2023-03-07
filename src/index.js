import axios from 'axios'
import {InvalidRequestMethod, NullAuthorizationHeaderError, UndefinedPath} from './exceptions'
import {getHTTPMethod, implementedMethods} from "./methods";

const METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

class VueAPIManager {
    constructor(config) {
        this._responseParser = null;
        this._httpErrorParser = null;
        this._defaultErrorMessage = 'No message'
        this._host = config.hasOwnProperty('host') ? config.host : "";
        this._apiURL = `${this._host}${config.hasOwnProperty('rootURL') ? config.rootURL : "/"}`;
        this._apis = config.hasOwnProperty('apis') ? config.apis : {};

        this._authorizationHeaderPrefix = config.hasOwnProperty('authorizationHeaderPrefix') ? config.authorizationHeaderPrefix : "";

        this._globalHeaders = config.hasOwnProperty('headers') ? config.headers : {}
        axios.defaults.headers.common = {
            ...this._globalHeaders,
            ...axios.defaults.headers.common,
        };

        for (const [key, value] of Object.entries(this._apis)) {
            let requestHeaders = value.headers ? value.headers : {}

            if (!Object.keys(implementedMethods).includes(value.method))
                throw new InvalidRequestMethod(key, value)
            if (!value.hasOwnProperty('path'))
                throw new UndefinedPath(key, value)

            this[key] = this._doAPICall.bind(this, {
                url: `${this._apiURL}${value.path}`,
                method: value.method,
                defaultParams: value.params ? value.params : {},
                requiresAuth: value.requiresAuth,
                defaultHeaders: requestHeaders,
                axiosConfig: value.axiosConfig
            })
        }

    }

    setAuthorizationHeader(authHeaderGetter) {
        this._authorizationHeader = authHeaderGetter;
    }

    setResponseParser(responseParser) {
        this._responseParser = responseParser;
    }

    setHttpErrorParser(httpErrorParser) {
        this._httpErrorParser = httpErrorParser;
    }
    setDefaultErrorMessage(message) {
        this._defaultErrorMessage = message;
    }
    _getAuthorizationHeader() {
        if (!this._authorizationHeader) {
            throw new NullAuthorizationHeaderError()
        }
        return typeof this._authorizationHeader === 'function' ? this._authorizationHeader() : this._authorizationHeader
    }

    async _doAPICall({
                         url,
                         method,
                         defaultParams = {},
                         requiresAuth = false,
                         defaultHeaders = {},
                         axiosConfig = {},
                     }, {params, headers} = {params: {}, headers: {}}) {

        let requestHeaders = {
            ...defaultHeaders,
            ...headers
        }

        if (requiresAuth) {
            requestHeaders['Authorization'] = `${this._authorizationHeaderPrefix} ${this._getAuthorizationHeader()}`;
        }
        const requestParams = {...defaultParams, ...params}
        try {
            let response = await getHTTPMethod(method)(url, requestParams, requestHeaders, axiosConfig);
            if (this._responseParser)
                response.parsedData = this._responseParser(response);
            return response;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let response = error.response;
                if (this._httpErrorParser)
                    response.parsedError = this._httpErrorParser(response);
                else
                    response.parsedError = error.response.status;
                return response;
            } else {
                // Something happened in setting up the request that triggered an Error
                if (error.message)
                    return {
                        parsedError: error.message
                    }
                else
                    return {
                        parsedError: this._defaultErrorMessage
                    }
            }
        }
    }
}

module.exports = VueAPIManager
