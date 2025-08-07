## Requester Request Handler  

`Requester` is a class designed for handling HTTP requests. It provides pre-request, post-request, and error-handling callbacks, supporting features like request caching, timeout handling, mock data, and customizable request/response data transformation as well as error-handling logic.  

## Module Import  

```typescript
import { Requester, RequestOption, RequesterOption } from "./yourFilePath";
```  

## Error Code Constants  

| Constant Name                   | Description                   |  
| ------------------------------- | ----------------------------- |  
| `ERROR_CODE_REQUEST_BREAK`      | Request interruption error code |  
| `ERROR_CODE_REQUEST_ABORT`      | Request abort error code       |  
| `ERROR_CODE_REQUEST_DEFAULT`    | Default request error code     |  
| `ERROR_CDODE_TIME_OUT`          | Request timeout error code     |  

## Class and Type Definitions  

### `Requester` Class  

#### Constructor  

```typescript
constructor(option: RequesterOption);  
```  

-   **Parameters**:  
    -   `option`: Type `RequesterOption`, the configuration options for the request handler.  

#### Properties  

| Property Name       | Type                                                                                                    | Description                      |  
| ------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------- |  
| `beforeCallbacks`   | `Callbacks<(requestOption: RequestOption & T) => false \| Promise<false> \| Promise<void> \| void>`     | Collection of pre-request callbacks |  
| `afterCallbacks`    | `Callbacks<(requestOption: RequestOption & T, data: any \| RequestError, response?: Response) => void>` | Collection of post-request callbacks |  
| `errorCallbacks`    | `Callbacks<(error: RequestError<T>, response?: Response) => void>`                                      | Collection of error-handling callbacks |  
| `requestList`       | `Array<RequestQueueItem>`                                                                               | In-progress request queue       |  

#### Methods  

##### `request`  

```typescript
public async request<I = any, O = any>(  
    url: string,  
    option?: Partial<Omit<RequestOption<I>, "url"> & T>  
): Promise<O>;  
```  

-   **Parameters**:  
    -   `url`: The request URL.  
    -   `option`: Optional parameter, request configuration options extending `RequestOption`.  
-   **Return Value**: Returns a `Promise` resolving to the response data.  
-   **Description**: Initiates an HTTP request, supporting caching, timeout handling, mock data, etc.  

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

-   **Description**: Request queue item, containing the cancel function and request configuration options.  

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

-   **Description**: Request error information, including error code, error message, request options, etc.  

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

-   **Description**: Configuration options for the request handler, including:  
    -   `base`: Base URL (optional).  
    -   `timeout`: Request timeout in seconds. Set to `false` to disable (default: 10s).  
    -   `errorCodeMessage`: Error code-to-message mapping (optional).  
    -   `defaultErrorFunc`: Custom default error handler (optional).  
    -   `transformReqData`: Custom request data transformation function (optional).  
    -   `transformRspData`: Custom response data transformation function (optional).  
    -   `analyRspResult`: Custom function to parse response and handle success/failure (optional).  
    -   `mock`: Mock data function (optional).  

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

-   **Description**: Request caching options, including cache ID and expiration time (milliseconds).  

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

-   **Description**: Request configuration options, including:  
    -   `url`: Request URL.  
    -   `method`: HTTP request method.  
    -   `data`: Request data (optional).  
    -   `rspType`: Response type (`"json"` or `"stream"`, default: `"json"`).  
    -   `timeout`: Timeout in seconds (`false` to disable, optional).  
    -   `mock`: Enable mock data (optional).  
    -   `cache`: Cache configuration (optional).  
    -   `headers`: Request headers (optional).  
    -   `error`: Custom error handler (optional).  
    -   `success`: Custom success handler (optional).  
    -   `stream`: Stream response handler (optional).  

## Helper Functions  

### `transformRequestBody`  

```typescript
function transformRequestBody(data: any);  
```  

-   **Parameters**:  
    -   `data`: Request data.  
-   **Return Value**: Returns an object containing the request body and headers.  
-   **Description**: Transforms request data into an appropriate format (`FormData` or JSON string) based on whether it contains files.  

## Usage Example  

```typescript
// Create a Requester instance  
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
        // Custom response parsing  
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

// Add pre-request callback  
requester.beforeCallbacks.add((requestOption) => {  
    console.log("Pre-request callback:", requestOption);  
});  

// Add post-request callback  
requester.afterCallbacks.add((requestOption, data, response) => {  
    console.log("Post-request callback:", requestOption, data, response);  
});  

// Add error-handling callback  
requester.errorCallbacks.add((error, response) => {  
    console.error("Error-handling callback:", error, response);  
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
        console.log("Request successful:", data);  
    })  
    .catch((error) => {  
        console.error("Request failed:", error);  
    });  

// Cancel all requests  
requester.cancelAllRequest();  
```  

The above example demonstrates how to create a `Requester` instance, add callbacks, initiate requests, and cancel all requests.