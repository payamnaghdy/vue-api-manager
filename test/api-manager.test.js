import VueAPIManager from '../src/index'
import mockAxios from "axios";
import {NullAuthorizationHeaderError, InvalidRequestMethod} from '../src/exceptions'

describe('VueAPIManager', () => {
    const API_MANAGER_CONFIG = {
        host: '/',
        authorizationHeaderPrefix: 'Bearer',
        rootURL: '',
        apis: {
            getAll: {
                method: 'GET',
                path: 'getData',
                params: {}
            },
            getFirst: {
                method: "GET",
                path: 'gatData',
                params: {
                    id: 1
                },
            },
            getDataRequireAuth: {
                method: "GET",
                path: 'gatData',
                params: {},
                requiresAuth: true
            },
            postData: {
                method: "POST",
                path: 'postData',
            },
            postDataWithParams: {
                method: "POST",
                path: 'postDataWithParams',
                params: {
                    id: 1
                },
            },
            patchData: {
                method: "PATCH",
                path: 'patchData',
            },
            patchDataWithParams: {
                method: "PATCH",
                path: 'patchDataWithParams',
                params: {
                    id: 1
                },
            },
            putData: {
                method: "PUT",
                path: 'putData',
            },
            putDataWithParams: {
                method: "PUT",
                path: 'putDataWithParams',
                params: {
                    id: 1
                },
            },
            deleteData: {
                method: "DELETE",
                path: 'deleteData',
            },
            deleteDataWithParams: {
                method: "DELETE",
                path: 'deleteDataWithParams',
                params: {
                    id: 1
                },
            },
        }
    }
    it('Create manager with global headers', async () => {
        const GLOBAL_HEADER_CONFIG = {
            host: '/',
            authorizationHeaderPrefix: 'Bearer',
            rootURL: '',
            headers: {
                NewHeader: 'newHeader'
            }
        }
        new VueAPIManager(GLOBAL_HEADER_CONFIG)
        expect(mockAxios.defaults.headers.common).toEqual({"DefaultCommonHeader": "default", "NewHeader": "newHeader"})
    })
    it('Create manager with an api without path', async () => {
        const UNDEFINED_PATH_CONFIG = {
            host: '/',
            authorizationHeaderPrefix: 'Bearer',
            rootURL: '',
            apis: {
                undefPath: {
                    method: 'GET',
                    params: {}
                },
            }
        }
        try {
            new VueAPIManager(UNDEFINED_PATH_CONFIG)
        } catch (e) {
            expect(e.message).toEqual('You should define path property for api')
            expect(e.name).toEqual('UndefinedPath')
            expect(e.apiName).toEqual('undefPath')
            expect(e.apiProperties).toEqual({"method": "GET", "params": {}})
        }
    })
    it('Create manager with invalid method', async () => {
        const INVALID_METHOD_CONFIG = {
            host: '/',
            authorizationHeaderPrefix: 'Bearer',
            rootURL: '',
            apis: {
                invalidMethod: {
                    method: 'InvalidMethod',
                    path: 'invalidMethod',
                    params: {}
                },
            }
        }
        try {
            new VueAPIManager(INVALID_METHOD_CONFIG)
        } catch (e) {
            expect(e.message).toEqual('Invalid request method')
            expect(e.name).toEqual('InvalidRequestMethod')
            expect(e.apiName).toEqual('invalidMethod')
            expect(e.apiProperties).toEqual({"method": "InvalidMethod", "params": {}, "path": "invalidMethod"})
        }
    })

    it('GET request to getData', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.getAll();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.get).toBeCalledTimes(1);
        expect(mockAxios.get).toBeCalledWith("/getData", {"headers": {}, "params": {}})

    });
    it('GET request to getData with params', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.getFirst();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.get).toBeCalledTimes(1);
        expect(mockAxios.get).toBeCalledWith("/gatData", {"headers": {}, "params": {"id": 1}})

    });
    it('GET request to getData with authorization', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        // Require auth without set authorization
        await expect(apiManager.getDataRequireAuth()).rejects.toEqual(
            new NullAuthorizationHeaderError()
        );
        apiManager.setAuthorizationHeader("Auth token")
        const data = await apiManager.getDataRequireAuth();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.get).toBeCalledTimes(1);
        expect(mockAxios.get).toBeCalledWith("/gatData", {
            "headers": {"Authorization": "Bearer Auth token"},
            "params": {}
        })

    });

    it('POST to postData', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.postData();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.post).toBeCalledTimes(1);
        expect(mockAxios.post).toBeCalledWith("/postData", {}, {"headers": {}})
    })
    it('POST to postDataWithParams', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.postDataWithParams();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.post).toBeCalledTimes(1);
        expect(mockAxios.post).toBeCalledWith("/postDataWithParams", {"id": 1}, {"headers": {}})
    })

    it('PATCH to patchData', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.patch.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.patchData();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.patch).toBeCalledTimes(1);
        expect(mockAxios.patch).toBeCalledWith("/patchData", {}, {"headers": {}})
    })
    it('PATCH to patchDataWithParams', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.patch.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.patchDataWithParams();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.patch).toBeCalledTimes(1);
        expect(mockAxios.patch).toBeCalledWith("/patchDataWithParams", {"id": 1}, {"headers": {}})
    })

    it('PUT to putData', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.putData();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.put).toBeCalledTimes(1);
        expect(mockAxios.put).toBeCalledWith("/putData", {}, {"headers": {}})
    })
    it('PUT to putDataWithParams', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.putDataWithParams();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.put).toBeCalledTimes(1);
        expect(mockAxios.put).toBeCalledWith("/putDataWithParams", {"id": 1}, {"headers": {}})
    })

    it('DELETE to deleteData', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.delete.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.deleteData();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.delete).toBeCalledTimes(1);
        expect(mockAxios.delete).toBeCalledWith("/deleteData", {data: {}, headers: {}})
    })
    it('DELETE to deleteDataWithParams', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        mockAxios.delete.mockImplementationOnce(() =>
            Promise.resolve({
                data: {status: "OK"}
            })
        );

        const data = await apiManager.deleteDataWithParams();
        expect(data).toEqual(
            {
                data: {status: "OK"}
            }
        )
        expect(mockAxios.delete).toBeCalledTimes(1);
        expect(mockAxios.delete).toBeCalledWith("/deleteDataWithParams", {"headers": {}, data: {"id": 1}})
    })

    it('Parse response with 2xx status', async () => {
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: {
                    result: {
                        status: 'OK'
                    }
                }
            })
        );
        const dataWithoutParser = await apiManager.getAll();
        expect(dataWithoutParser.parsedData).toBe(undefined)

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: {
                    result: {
                        status: 'OK'
                    }
                }
            })
        );
        const responseParser = (response) => {
            return response.data.result.status
        }
        apiManager.setResponseParser(responseParser)
        const data = await apiManager.getAll();
        expect(data.parsedData).toBe('OK')
    })

    it('Parse response with status > 2xx', async () => {

        mockAxios.get.mockImplementationOnce(() => {
                throw  {
                    response: {
                        status: 400,
                        data: {
                            result: {
                                status: 'NOK'
                            }
                        }
                    }
                }
            }
        );

        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);

        const dataWithoutParser = await apiManager.getAll();
        expect(dataWithoutParser.parsedError).toBe(400);

        mockAxios.get.mockImplementationOnce(() => {
                throw  {
                    response: {
                        status: 400,
                        data: {
                            result: {
                                status: 'NOK'
                            }
                        }
                    }
                }
            }
        );
        const httpErrorParser = (response) => {
            return response.data.result.status;
        }
        apiManager.setHttpErrorParser(httpErrorParser);
        const data = await apiManager.getAll();
        expect(data.parsedError).toBe('NOK')
    })
    it('Error without response with message', async () => {
        mockAxios.get.mockImplementationOnce(() => {
                throw {
                    message: 'Error from tests'
                }
            }
        );
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        const data = await apiManager.getAll();
        expect(data.parsedError).toBe('Error from tests');
    })
    it('Error without response and message', async () => {
        mockAxios.get.mockImplementationOnce(() => {
                throw {}
            }
        );
        let apiManager = new VueAPIManager(API_MANAGER_CONFIG);
        const data = await apiManager.getAll();
        expect(data.parsedError).toBe('No message');

        mockAxios.get.mockImplementationOnce(() => {
                throw {}
            }
        );
        apiManager.setDefaultErrorMessage('New default message')
        const dataNewDefault = await apiManager.getAll()
        expect(dataNewDefault.parsedError).toBe('New default message');

    })
})
