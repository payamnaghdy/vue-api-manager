import axios from 'axios'
import {NullAuthorizationHeaderError, InvalidRequestMethod, UndefinedPath} from './exceptions'

const METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

class VueAPIManager {
    constructor(config) {
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

            if (!Object.values(METHODS).includes(value.method))
                throw new InvalidRequestMethod(key, value)
            if (!value.hasOwnProperty('path'))
                throw new UndefinedPath(key, value)

            this[key] = this._doAPICall.bind(this, {
                url: `${this._apiURL}${value.path}`,
                method: value.method,
                defaultParams: value.params ? value.params : {},
                requiresAuth: value.requiresAuth,
                defaultHeaders: requestHeaders
            })
        }

    }

    setAuthorizationHeader(authHeaderGetter) {
        this._authorizationHeader = authHeaderGetter;
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
                         defaultHeaders = {}
                     }, {params, headers} = {params: {}, headers: {}}) {

        let response = '';
        let requestHeaders = {
            ...defaultHeaders,
            ...headers
        }

        if (requiresAuth) {
            requestHeaders['Authorization'] = `${this._authorizationHeaderPrefix} ${this._getAuthorizationHeader()}`;
        }

        switch (method) {
            case METHODS.GET:
                response = await axios.get(url, {
                    params: {
                        ...defaultParams,
                        ...params
                    },
                    headers: requestHeaders
                });
                break
            case METHODS.POST:
                response = await axios.post(
                    url,
                    {...defaultParams, ...params},
                    {
                        headers
                    }
                )
                break
            case METHODS.PATCH:
                response = await axios.patch(
                    url,
                    {...defaultParams, ...params},
                    {headers}
                )
                break
            case METHODS.PUT:
                response = await axios.put(
                    url,
                    {...defaultParams, ...params},
                    {headers}
                )
                break
            case METHODS.DELETE:
                response = await axios.delete(
                    url,
                    {
                        params: {
                            ...defaultParams,
                            ...params
                        },
                        headers: headers
                    }
                )
                break
        }
        return response;
    }
}

module.exports = VueAPIManager