class Error {
    constructor(message) {
        this.message = message;
        this.name = "Error";
    }
}

export class NullAuthorizationHeaderError extends Error {
    constructor() {
        super('This api needs authorization, but header not provided');
        this.name = 'NullAuthorizationHeaderError'
    }
}

export class InvalidRequestMethod extends Error {
    constructor(apiName, apiProperties) {
        super('Invalid request method');
        this.name = 'InvalidRequestMethod'
        this.apiName = apiName;
        this.apiProperties = apiProperties;
    }
}

export class UndefinedPath extends Error {
    constructor(apiName, apiProperties) {
        super('You should define path property for api');
        this.name = 'UndefinedPath'
        this.apiName = apiName;
        this.apiProperties = apiProperties;

    }

}

export class NotImplemented extends Error {
    constructor() {
        super('Not Implemented');
    }
}
