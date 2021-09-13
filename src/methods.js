import axios from "axios";
import {NotImplemented} from "./exceptions";


async function get(url, params, headers) {
    return await axios.get(url, {
        params,
        headers
    });
}

async function post(url, params, headers) {
    return await axios.post(
        url,
        params,
        {
            headers
        }
    )
}

async function patch(url, params, headers) {
    return await axios.patch(
        url,
        params,
        {
            headers
        }
    )
}

async function put(url, params, headers) {
    return await axios.put(
        url,
        params,
        {
            headers
        }
    )
}

async function _delete(url, params, headers) {
    return await axios.delete(
        url,
        {
            headers,
            data: params
        }
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
