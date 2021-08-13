# Vue API Manager
Vue api manager is a centralized api manager for vue applications. It's usable through all components of your application
, Design goal is to have an easy to use and config api manager for your vue application

# Installation
To install this module just run:
```angular2html
npm install --save @payamnaghdy/vue-api-manager
```

# Configuration
Create folder named api manage at the root of your project and inside the folder create
index.js file.

Next we need to import Vue and VueAPIManager:
```angular2html
import Vue from 'vue'
import VueAPIManager from '@payamnaghdy/vue-api-manager'
```
Then create configuration object:
```angular2html
export const APIRoutes = {
    host: '<host>',
    authorizationHeaderPrefix: '<prefix>', // The module automatically puts a space after the prefix
    rootURL: '<rootURL>',
    headers: {}, // Here you can set global headers
    apis: {
        apiOne: {
            method: 'GET',
            path: '<api one path>',
            params: {},
            headers: {} // Here you can set headers for this request
        },
        apiTwo:{
            method: "GET",
            path:'<api two path>',
            params: {},
            requiresAuth: true // If you set this parameter module automatically includes auth header
        }
    }
}
```
## Options description
Now I'm going to explain the options:

### Authorization header prefix:
```angular2html
<!--This is the prefix for your authorization header: <prefix> <auth token>-->
<!--for example: Bearer <the auth token>-->
authorizationHeaderPrefix: '<prefix>'
```
### host and rootURL:
```angular2html
<!--This two options are the host url and root url of your api-->
host: '<host>', 
rootURL: '',
```
### Global headers:
```angular2html
<!--This header options is global headers and will set headers for-->
<!--all requests-->
export const APIRoutes = {
    .
    .
    .
    rootURL: '',
    headers: {}, // Here you can set global headers
    apis: {
        ...
    }
}
```
### API path:
```angular2html
<!--This is the path of the api so the module finally cals: -->
<!--<host><rootURL><path>-->
<!--for example:-->
<!--host is https://test.com-->
<!--rootURL is /api/v2-->
<!--path is /resource-->
<!--then the module calls https://test.com/api/v2/resource-->
apis: {
        apiOne: {
            path: '<api one path>',
        },
        .
        .
        .
    }
```
### API headers and parameters
```angular2html
<!--These two options are headers and params associated with this-->
<!--request and the headers will be added to the global headers-->
<!--You can also set headers when you call the api-->
    apis: {
        apiOne: {
            .
            .
            .
            params: {},
            headers: {} // Here you can set headers for this request
        },
        .
        .
        .
    }
```
## API with authorization
### requiresAuth:
```angular2html
<!--If your api needs authorization just set this property to true-->
<!--You should not set the authorization header in the headers property -->
<!--because you need to change it in runtime-->
<!--If you set this you need to set the authorizationHeaderPrefix -->
<!--and give a getter function for the token to the module-->
apis: {
        .
        .
        .
        apiTwo:{
            ...
            requiresAuth: true // If you set this parameter module automatically includes auth header
        }
    }
```
### Create VueAPIManager instance and set the authorization token getter:

```
<!--You need to create a function that returns the token for authorization-->
<!--And in this case my token is in the Vuex store-->
<!--then set it by setAuthorizationHeader and the module is going to-->
<!--set the authorization header when it sees the requiresAuth option-->

import store from '../store/index'
function getAuthorizationToken() {
    // You should write a getter for the token or change the return value
    return store.getters.getAuthToken;
}
Vue.prototype.$apiManager = new VueAPIManager(APIRoutes)

Vue.prototype.$apiManager.setAuthorizationHeader(getAuthorizationToken)


export default APIRoutes
```

# Usage
Finally, in your component you can call the api (remember one of my apis had apiOne as the key so im going to call a
function with this name
)
```angular2html
let response = await this.$apiManager.apiOne();
console.log(response.data)
```
### Extend headers and parameters:
You can also extend headers and params of the request.
```angular2html
let response = await this.$apiManager.apiOne({
        params: {
          id:1
        },
        headers:{
        'My-New-Header': 'header value'
        }
      });
      console.log(response)
```

# Return Value
This module uses axios underneath, and the return value is the same as axios

# Todo

- Create vue-cli service for the configuration (90% progress)
- Create centralized error management for the module
