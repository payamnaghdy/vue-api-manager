import axios from "axios";
import {NotImplemented} from "./exceptions";


async function get(url, params, headers, config) {
    return await axios.get(url, {
        params,
        headers,
        ...config
    });
}

async function post(url, params, headers, config) {
    return await axios.post(
        url,
        params,
        {
            headers,
            ...config
        }
    )
}

async function patch(url, params, headers, config) {
    return await axios.patch(
        url,
        params,
        {
            headers,
            ...config
        }
    )
}

async function put(url, params, headers, config) {
    return await axios.put(
        url,
        params,
        {
            headers,
            ...config
        }
    )
}

async function _delete(url, params, headers, config) {
    return await axios.delete(
        url,
        {
            headers,
            data: params,
            ...config
        },
    )
}

export const implementedMethods = {
    GET: get,
    POST: post,
    PUT: put,
    PATCH: patch,
    DELETE: _delete
}

export function getHTTPMethod(method) {
    if (implementedMethods[method]) {
        return implementedMethods[method]
    } else {
        throw new NotImplemented();
    }
}
