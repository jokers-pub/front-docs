## Requester Request Handler

`Requester` is a class designed to handle HTTP requests. It offers pre-request, post-request, and error-handling callbacks, supports features such as request caching, timeout handling, and Mock data. Additionally, it allows for customizing the transformation of request and response data, as well as the error-handling logic.

## Importing Modules

```typescript
import { Requester, RequestOption, RequesterOption } from "./yourFilePath";
```

## Error Code Constants

| Constant Name                | Description                     |
| ---------------------------- | ------------------------------- |
| `ERROR_CODE_REQUEST_BREAK`   | Request interruption error code |
| `ERROR_CODE_REQUEST_ABORT`   | Request abort error code        |
| `ERROR_CODE_REQUEST_DEFAULT` | Default request error code      |
| `ERROR_CDODE_TIME_OUT`       | Request timeout error code      |

## Class and Type Definitions

### `Requester` Class

#### Constructor

```typescript
constructor(option: RequesterOption);
```

-   **Parameters**:
-   `option`: of type `RequesterOption`, which represents the configuration options for the request handler.

#### Properties

| Property Name     | Type                                                                                                    | Description                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `beforeCallbacks` | `Callbacks<(requestOption: RequestOption & T) => false \| Promise<false> \| Promise<void> \| void>`     | Collection of pre-request callback functions   |
| `afterCallbacks`  | `Callbacks<(requestOption: RequestOption & T, data: any \| RequestError, response?: Response) => void>` | Collection of post-request callback functions  |
| `errorCallbacks`  | `Callbacks<(error: RequestError<T>, response?: Response) => void>`                                      | Collection of request error callback functions |
| `requestList`     | `Array<RequestQueueItem>`                                                                               | Queue of ongoing requests                      |

#### Methods

##### `request`

```typescript
public async request<I = any, O = any>(
    url: string,
    option?: Partial<Omit<RequestOption<I>, "url"> & T>
): Promise<O>;
```

-   **Parameters**:
-   `url`: The URL of the request.
-   `option`: Optional parameter. Request configuration options, inheriting from `RequestOption` and allowing for extensions.
-   **Return Value**: Returns a `Promise` that resolves to the response data of the request.
-   **Description**: Initiates an HTTP request, supporting features such as caching, timeout handling, and Mock data.

##### `cancelAllRequest`

```typescript
public cancelAllRequest();
```

-   **Description**: Cancels all ongoing requests.

### `RequestQueueItem` Type

```typescript
export type RequestQueueItem = {
    cancel: Function;
    option: RequestOption;
};
```

-   **Description**: Represents an item in the request queue, containing a function to cancel the request and the request configuration options.

### `RequestError` Type

```typescript
export type RequestError<T = any> = {
    code: string;
    message: string;
    data?: any;
    option: RequestOption & T;
    e?: Error;
};
```

-   **Description**: Holds information about the request error, including the error code, error message, and request configuration options.

### `RequesterOption` Type

```typescript
export type RequesterOption = {
    base?: string;
    timeout?: number | false;
    errorCodeMessage?: Record<string, string>;
    defaultErrorFunc?: (err: RequestError, response?: Response) => void;
    transformReqData?: (
        data: any,
        option: RequestOption & Record<string, any>,
        requesteroption: RequesterOption
    ) => any | Promise<any>;
    transformRspData?: (
        data: any,
        option: RequestOption & Record<string, any>,
        requesteroption: RequesterOption
    ) => any | Promise<any>;
    analyRspResult?: (
        data: any,
        success: (data: any) => void,
        error: (err: Omit<RequestError, "option">) => void,
        response: Response
    ) => void;
    mock?: (option: RequestOption & Record<string, any>) => Promise<any>;
};
```

-   **Description**: Configuration options for the request handler, including the following properties:
-   `base`: The root of the request address, optional.
-   `timeout`: Interface timeout in seconds. Set to `false` to disable timeout handling. The default value is 10 seconds.
-   `errorCodeMessage`: Mapping and translation of error codes to error messages, optional.
-   `defaultErrorFunc`: Custom default error-handling function, optional.
-   `transformReqData`: Custom function for transforming request data, optional.
-   `transformRspData`: Custom function for transforming server-returned response data, optional.
-   `analyRspResult`: Custom function for parsing response data and diverting between success and failure, optional.
-   `mock`: Function for providing Mock data, optional.

### `RequestMethod` Type

```typescript
export type RequestMethod = "GET" | "POST" | "DELETE" | "PUT";
```

-   **Description**: Supported HTTP request methods.

### `RequestCacheOption` Type

```typescript
export type RequestCacheOption = {
    id: string;
    expires?: number;
};
```

-   **Description**: Configuration options for request caching, including the cache ID and cache expiration time (in milliseconds).

### `RequestOption` Type

```typescript
export type RequestOption<T = any> = {
    url: string;
    method: RequestMethod;
    data?: T;
    rspType?: "json" | "stream";
    timeout?: number | false;
    mock?: boolean;
    cache?: RequestCacheOption | true;
    headers?: Record<string, any>;
    error?: (err: RequestError, response?: Response) => void | false;
    success?: (data: any, response?: Response) => void;
    stream?: (chunk: string, allChunk: string, response?: Response) => void;
};
```

-   **Description**: Configuration options for request parameters, including the following properties:
-   `url`: The URL of the request.
-   `method`: The HTTP request method.
-   `data`: Request data, optional.
-   `rspType`: The type of response data. Optional values are `"json"` or `"stream"`, with a default value of `"json"`.
-   `timeout`: Interface timeout in seconds. Set to `false` to disable timeout handling, optional.
-   `mock`: Whether to use Mock data, optional.
-   `cache`: Configuration options for request caching, optional.
-   `headers`: Request headers, optional.
-   `error`: Request error-handling function, optional.
-   `success`: Request success-handling function, optional.
-   `stream`: Function for handling streaming responses, optional.

## Helper Functions

### `transformRequestBody`

```typescript
function transformRequestBody(data: any);
```

-   **Parameters**:
-   `data`: Request data.
-   **Return Value**: Returns an object containing the request body and request headers.
-   **Description**: Converts the request data into an appropriate format (`FormData` or JSON string) based on whether the request data contains files.

## Usage Example

```typescript
// Create an instance of the request handler
const requester = new Requester({
    base: "https://api.example.com",
    timeout: 10,
    errorCodeMessage: {
        "404": "Resource not found"
    },
    defaultErrorFunc: (err, response) => {
        console.error("Default error handling:", err);
    },
    transformReqData: (data, option, requesterOption) => {
        // Custom request data transformation
        return data;
    },
    transformRspData: (data, option, requesterOption) => {
        // Custom response data transformation
        return data;
    },
    analyRspResult: (data, success, error, response) => {
        // Custom parsing of response data
        if (data.code === 200) {
            success(data.data);
        } else {
            error({
                code: data.code.toString(),
                message: data.message
            });
        }
    },
    mock: (option) => {
        // Mock data
        return Promise.resolve({
            code: 200,
            data: {
                message: "Mock data"
            }
        });
    }
});

// Add a pre-request callback
requester.beforeCallbacks.add((requestOption) => {
    console.log("Pre-request callback:", requestOption);
});

// Add a post-request callback
requester.afterCallbacks.add((requestOption, data, response) => {
    console.log("Post-request callback:", requestOption, data, response);
});

// Add a request error callback
requester.errorCallbacks.add((error, response) => {
    console.error("Request error callback:", error, response);
});

// Initiate a request
requester
    .request("users", {
        method: "GET",
        cache: {
            id: "users",
            expires: 60 * 1000 // Cache for 1 minute
        }
    })
    .then((data) => {
        console.log("Request succeeded:", data);
    })
    .catch((error) => {
        console.error("Request failed:", error);
    });

// Cancel all requests
requester.cancelAllRequest();
```

The above example demonstrates how to create an instance of `Requester`, add callback functions, initiate a request, and cancel all requests.
