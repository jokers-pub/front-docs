## Requester 请求处理程序

`Requester` 是一个用于处理 HTTP 请求的类，提供了请求前置、后置和错误处理回调，支持请求缓存、超时处理、Mock 数据等功能，同时可自定义请求和响应数据的转换以及错误处理逻辑。

## 引入模块

```typescript
import { Requester, RequestOption, RequesterOption } from "./yourFilePath";
```

## 错误码常量

| 常量名                       | 描述           |
| ---------------------------- | -------------- |
| `ERROR_CODE_REQUEST_BREAK`   | 请求中断错误码 |
| `ERROR_CODE_REQUEST_ABORT`   | 请求中止错误码 |
| `ERROR_CODE_REQUEST_DEFAULT` | 默认请求错误码 |
| `ERROR_CDODE_TIME_OUT`       | 请求超时错误码 |

## 类和类型定义

### `Requester` 类

#### 构造函数

```typescript
constructor(option: RequesterOption);
```

-   **参数**：
    -   `option`：`RequesterOption` 类型，请求处理程序的配置选项。

#### 属性

| 属性名            | 类型                                                                                                    | 描述                 |
| ----------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| `beforeCallbacks` | `Callbacks<(requestOption: RequestOption & T) => false \| Promise<false> \| Promise<void> \| void>`     | 请求前置回调函数集合 |
| `afterCallbacks`  | `Callbacks<(requestOption: RequestOption & T, data: any \| RequestError, response?: Response) => void>` | 请求后置回调函数集合 |
| `errorCallbacks`  | `Callbacks<(error: RequestError<T>, response?: Response) => void>`                                      | 请求错误回调函数集合 |
| `requestList`     | `Array<RequestQueueItem>`                                                                               | 请求中队列           |

#### 方法

##### `request`

```typescript
public async request<I = any, O = any>(
    url: string,
    option?: Partial<Omit<RequestOption<I>, "url"> & T>
): Promise<O>;
```

-   **参数**：
    -   `url`：请求的 URL。
    -   `option`：可选参数，请求配置选项，继承自 `RequestOption` 并可扩展。
-   **返回值**：返回一个 `Promise`，解析为请求的响应数据。
-   **描述**：发起一个 HTTP 请求，支持缓存、超时处理、Mock 数据等功能。

##### `cancelAllRequest`

```typescript
public cancelAllRequest();
```

-   **描述**：取消所有正在进行的请求。

### `RequestQueueItem` 类型

```typescript
export type RequestQueueItem = {
    cancel: Function;
    option: RequestOption;
};
```

-   **描述**：请求队列项，包含取消请求的函数和请求配置选项。

### `RequestError` 类型

```typescript
export type RequestError<T = any> = {
    code: string;
    message: string;
    data?: any;
    option: RequestOption & T;
    e?: Error;
};
```

-   **描述**：请求错误信息，包含错误码、错误消息、请求配置选项等。

### `RequesterOption` 类型

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

-   **描述**：请求处理程序的配置选项，包含以下属性：
    -   `base`：请求地址根，可选。
    -   `timeout`：接口超时时间，单位为秒，设置为 `false` 时不做超时处理，默认值为 10s。
    -   `errorCodeMessage`：错误码 - 信息映射转译，可选。
    -   `defaultErrorFunc`：自定义默认错误处理函数，可选。
    -   `transformReqData`：自定义请求数据转换函数，可选。
    -   `transformRspData`：自定义服务端返回数据转换函数，可选。
    -   `analyRspResult`：自定义解析响应数据，并进行成功、失败分流的函数，可选。
    -   `mock`：Mock 数据函数，可选。

### `RequestMethod` 类型

```typescript
export type RequestMethod = "GET" | "POST" | "DELETE" | "PUT";
```

-   **描述**：支持的 HTTP 请求方法。

### `RequestCacheOption` 类型

```typescript
export type RequestCacheOption = {
    id: string;
    expires?: number;
};
```

-   **描述**：请求缓存配置选项，包含缓存 ID 和缓存过期时间（毫秒）。

### `RequestOption` 类型

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

-   **描述**：请求参数配置选项，包含以下属性：
    -   `url`：请求的 URL。
    -   `method`：HTTP 请求方法。
    -   `data`：请求数据，可选。
    -   `rspType`：响应数据类型，可选值为 `"json"` 或 `"stream"`，默认值为 `"json"`。
    -   `timeout`：接口超时时间，单位为秒，设置为 `false` 时不做超时处理，可选。
    -   `mock`：是否使用 Mock 数据，可选。
    -   `cache`：请求缓存配置选项，可选。
    -   `headers`：请求头，可选。
    -   `error`：请求错误处理函数，可选。
    -   `success`：请求成功处理函数，可选。
    -   `stream`：流式响应处理函数，可选。

## 辅助函数

### `transformRequestBody`

```typescript
function transformRequestBody(data: any);
```

-   **参数**：
    -   `data`：请求数据。
-   **返回值**：返回一个对象，包含请求体和请求头。
-   **描述**：根据请求数据是否包含文件，将请求数据转换为合适的格式（`FormData` 或 JSON 字符串）。

## 使用示例

```typescript
// 创建请求处理程序实例
const requester = new Requester({
    base: "https://api.example.com",
    timeout: 10,
    errorCodeMessage: {
        "404": "未找到资源"
    },
    defaultErrorFunc: (err, response) => {
        console.error("默认错误处理:", err);
    },
    transformReqData: (data, option, requesterOption) => {
        // 自定义请求数据转换
        return data;
    },
    transformRspData: (data, option, requesterOption) => {
        // 自定义响应数据转换
        return data;
    },
    analyRspResult: (data, success, error, response) => {
        // 自定义解析响应数据
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
        // Mock 数据
        return Promise.resolve({
            code: 200,
            data: {
                message: "Mock 数据"
            }
        });
    }
});

// 添加请求前置回调
requester.beforeCallbacks.add((requestOption) => {
    console.log("请求前置回调:", requestOption);
});

// 添加请求后置回调
requester.afterCallbacks.add((requestOption, data, response) => {
    console.log("请求后置回调:", requestOption, data, response);
});

// 添加请求错误回调
requester.errorCallbacks.add((error, response) => {
    console.error("请求错误回调:", error, response);
});

// 发起请求
requester
    .request("users", {
        method: "GET",
        cache: {
            id: "users",
            expires: 60 * 1000 // 缓存 1 分钟
        }
    })
    .then((data) => {
        console.log("请求成功:", data);
    })
    .catch((error) => {
        console.error("请求失败:", error);
    });

// 取消所有请求
requester.cancelAllRequest();
```

以上示例展示了如何创建 `Requester` 实例，添加回调函数，发起请求以及取消所有请求。
