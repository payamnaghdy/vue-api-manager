export default {
    defaults: {
        headers: {
            common: {
                DefaultCommonHeader: 'default'
            }
        }
    },
    get: jest.fn(() => Promise.resolve({data: {}})),
    post: jest.fn(() => Promise.resolve({data: {}})),
    put: jest.fn(() => Promise.resolve({data: {}})),
    patch: jest.fn(() => Promise.resolve({data: {}})),
    delete: jest.fn(() => Promise.resolve({data: {}}))
};