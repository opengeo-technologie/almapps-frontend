/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** ClientCreate */
export interface ClientCreate {
  /** Name */
  name: string;
  /** Address */
  address: string;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
  /** Postal */
  postal: string;
  /** Nui */
  nui: string;
  /** Rc */
  rc: string;
  /** Type Id */
  type_id: number;
}

/** ClientResponse */
export interface ClientResponse {
  /** Name */
  name: string;
  /** Id */
  id: number;
  /** Address */
  address: string;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
  /** Postal */
  postal: string;
  /** Nui */
  nui: string;
  /** Rc */
  rc: string;
  /** Type Id */
  type_id: number;
}

/** ClientTypeCreate */
export interface ClientTypeCreate {
  /** Type */
  type: string;
}

/** ClientTypeResponse */
export interface ClientTypeResponse {
  /** Type */
  type: string;
  /** Id */
  id: number;
}

/** ContactPersonCreate */
export interface ContactPersonCreate {
  /** Name */
  name: string;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
  /** Client Id */
  client_id: number;
}

/** ContactPersonResponse */
export interface ContactPersonResponse {
  /** Name */
  name: string;
  /** Id */
  id: number;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
  /** Client Id */
  client_id: number;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** ProductCreate */
export interface ProductCreate {
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Unit */
  unit: string;
  /** Stock Security Level */
  stock_security_level: number;
}

/** ProductInputCreate */
export interface ProductInputCreate {
  /** Product Id */
  product_id: number;
  /** Vendor Id */
  vendor_id: number;
  /** User Id */
  user_id: number;
  /** Quantity */
  quantity: number;
  /** Price */
  price: number;
  /**
   * Date Input
   * @format date
   */
  date_input: string;
}

/** ProductInputResponse */
export interface ProductInputResponse {
  /** Id */
  id: number;
  /** Product Id */
  product_id: number;
  /** Vendor Id */
  vendor_id: number;
  /** User Id */
  user_id: number;
  /** Quantity */
  quantity: number;
  /** Price */
  price: number;
  /**
   * Date Input
   * @format date
   */
  date_input: string;
}

/** ProductOutputCreate */
export interface ProductOutputCreate {
  /** Product Id */
  product_id: number;
  /** User Id */
  user_id: number;
  /** Quantity */
  quantity: number;
  /** Price */
  price: number;
  /**
   * Date Output
   * @format date
   */
  date_output: string;
}

/** ProductOutputResponse */
export interface ProductOutputResponse {
  /** Id */
  id: number;
  /** Product Id */
  product_id: number;
  /** User Id */
  user_id: number;
  /** Quantity */
  quantity: number;
  /** Price */
  price: number;
  /**
   * Date Output
   * @format date
   */
  date_output: string;
}

/** ProductResponse */
export interface ProductResponse {
  /** Name */
  name: string;
  /** Id */
  id: number;
  /** Description */
  description: string;
  /** Unit */
  unit: string;
  /** Stock Security Level */
  stock_security_level: number;
}

/** ProfileCreate */
export interface ProfileCreate {
  /**
   * Name
   * @minLength 3
   * @maxLength 100
   */
  name: string;
}

/** ProfileResponse */
export interface ProfileResponse {
  /** Name */
  name: string;
  /** Id */
  id: number;
}

/** UserCreate */
export interface UserCreate {
  /**
   * Username
   * @minLength 3
   * @maxLength 200
   */
  username: string;
  /**
   * Email
   * @minLength 3
   * @maxLength 200
   */
  email: string;
  /**
   * Password
   * @minLength 3
   * @maxLength 200
   */
  password: string;
  /** Is Active */
  is_active: boolean;
  /** Profile Id */
  profile_id: number;
}

/** UserResponse */
export interface UserResponse {
  /** Username */
  username: string;
  /** Id */
  id: number;
  /** Email */
  email: string;
  /** Is Active */
  is_active: boolean;
}

/** UserUpdate */
export interface UserUpdate {
  /**
   * Username
   * @minLength 3
   * @maxLength 200
   */
  username: string;
  /**
   * Email
   * @minLength 3
   * @maxLength 200
   */
  email: string;
  /** Is Active */
  is_active: boolean;
  /** Profile Id */
  profile_id: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** VendorCreate */
export interface VendorCreate {
  /** Name */
  name: string;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
  /** Address */
  address: string;
}

/** VendorResponse */
export interface VendorResponse {
  /** Name */
  name: string;
  /** Id */
  id: number;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
  /** Address */
  address: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name HealthCheckGet
   * @summary Health Check
   * @request GET:/
   */
  healthCheckGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  profiles = {
    /**
     * No description
     *
     * @tags Profiles
     * @name ReadAllProfilesGet
     * @summary Read All
     * @request GET:/profiles/
     */
    readAllProfilesGet: (params: RequestParams = {}) =>
      this.request<ProfileResponse[], any>({
        path: `/profiles/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ReadProfileProfilesProfileIdGet
     * @summary Read Profile
     * @request GET:/profiles/{profile_id}
     */
    readProfileProfilesProfileIdGet: (
      profileId: number,
      params: RequestParams = {},
    ) =>
      this.request<ProfileResponse, HTTPValidationError>({
        path: `/profiles/${profileId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name CreateProfileProfilesCreatePost
     * @summary Create Profile
     * @request POST:/profiles/create
     */
    createProfileProfilesCreatePost: (
      data: ProfileCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/profiles/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name UpdateProfileProfilesProfileProfileIdPut
     * @summary Update Profile
     * @request PUT:/profiles/profile/{profile_id}
     */
    updateProfileProfilesProfileProfileIdPut: (
      profileId: number,
      data: ProfileCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/profiles/profile/${profileId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name DeleteProfileProfilesProfileProfileIdDelete
     * @summary Delete Profile
     * @request DELETE:/profiles/profile/{profile_id}
     */
    deleteProfileProfilesProfileProfileIdDelete: (
      profileId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/profiles/profile/${profileId}`,
        method: "DELETE",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags Users
     * @name ReadAllUsersGet
     * @summary Read All
     * @request GET:/users/
     */
    readAllUsersGet: (params: RequestParams = {}) =>
      this.request<UserResponse[], any>({
        path: `/users/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ReadUserUsersUserIdGet
     * @summary Read User
     * @request GET:/users/{user_id}
     */
    readUserUsersUserIdGet: (userId: number, params: RequestParams = {}) =>
      this.request<UserResponse, HTTPValidationError>({
        path: `/users/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name CreateUserUsersCreatePost
     * @summary Create User
     * @request POST:/users/create
     */
    createUserUsersCreatePost: (data: UserCreate, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/users/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UpdateUserUsersUserUserIdPut
     * @summary Update User
     * @request PUT:/users/user/{user_id}
     */
    updateUserUsersUserUserIdPut: (
      userId: number,
      data: UserUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/users/user/${userId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name DeleteUserUsersUserUserIdDelete
     * @summary Delete User
     * @request DELETE:/users/user/{user_id}
     */
    deleteUserUsersUserUserIdDelete: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/users/user/${userId}`,
        method: "DELETE",
        ...params,
      }),
  };
  clientTypes = {
    /**
     * No description
     *
     * @tags Client types
     * @name ReadAllClientTypesGet
     * @summary Read All
     * @request GET:/client-types/
     */
    readAllClientTypesGet: (params: RequestParams = {}) =>
      this.request<ClientTypeResponse[], any>({
        path: `/client-types/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client types
     * @name ReadClientTypeClientTypesClientTypeIdGet
     * @summary Read Client Type
     * @request GET:/client-types/{client_type_id}
     */
    readClientTypeClientTypesClientTypeIdGet: (
      clientTypeId: number,
      params: RequestParams = {},
    ) =>
      this.request<ClientTypeResponse, HTTPValidationError>({
        path: `/client-types/${clientTypeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client types
     * @name CreateClientTypeClientTypesCreatePost
     * @summary Create Client Type
     * @request POST:/client-types/create
     */
    createClientTypeClientTypesCreatePost: (
      data: ClientTypeCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/client-types/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client types
     * @name UpdateClientTypeClientTypesClientTypeClientTypeIdPut
     * @summary Update Client Type
     * @request PUT:/client-types/client_type/{client_type_id}
     */
    updateClientTypeClientTypesClientTypeClientTypeIdPut: (
      clientTypeId: number,
      data: ClientTypeCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/client-types/client_type/${clientTypeId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client types
     * @name DeleteClientTypeClientTypesClientTypeClientTypeIdDelete
     * @summary Delete Client Type
     * @request DELETE:/client-types/client_type/{client_type_id}
     */
    deleteClientTypeClientTypesClientTypeClientTypeIdDelete: (
      clientTypeId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/client-types/client_type/${clientTypeId}`,
        method: "DELETE",
        ...params,
      }),
  };
  clients = {
    /**
     * No description
     *
     * @tags Clients
     * @name ReadAllClientsGet
     * @summary Read All
     * @request GET:/clients/
     */
    readAllClientsGet: (params: RequestParams = {}) =>
      this.request<ClientResponse[], any>({
        path: `/clients/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clients
     * @name ReadClientClientsClientIdGet
     * @summary Read Client
     * @request GET:/clients/{client_id}
     */
    readClientClientsClientIdGet: (
      clientId: number,
      params: RequestParams = {},
    ) =>
      this.request<ClientResponse, HTTPValidationError>({
        path: `/clients/${clientId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clients
     * @name CreateClientClientsCreatePost
     * @summary Create Client
     * @request POST:/clients/create
     */
    createClientClientsCreatePost: (
      data: ClientCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/clients/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clients
     * @name UpdateClientClientsUpdateClientIdPut
     * @summary Update Client
     * @request PUT:/clients/update/{client_id}
     */
    updateClientClientsUpdateClientIdPut: (
      clientId: number,
      data: ClientCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/clients/update/${clientId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clients
     * @name DeleteClientClientsDeleteClientIdDelete
     * @summary Delete Client
     * @request DELETE:/clients/delete/{client_id}
     */
    deleteClientClientsDeleteClientIdDelete: (
      clientId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/clients/delete/${clientId}`,
        method: "DELETE",
        ...params,
      }),
  };
  contactPerson = {
    /**
     * No description
     *
     * @tags Client Contact
     * @name ReadAllContactPersonGet
     * @summary Read All
     * @request GET:/contact-person/
     */
    readAllContactPersonGet: (params: RequestParams = {}) =>
      this.request<ContactPersonResponse[], any>({
        path: `/contact-person/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client Contact
     * @name ReadClientContactContactPersonContactIdGet
     * @summary Read Client Contact
     * @request GET:/contact-person/{contact_id}
     */
    readClientContactContactPersonContactIdGet: (
      contactId: number,
      params: RequestParams = {},
    ) =>
      this.request<ContactPersonResponse, HTTPValidationError>({
        path: `/contact-person/${contactId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client Contact
     * @name ReadClientContactContactPersonClientClientIdGet
     * @summary Read Client Contact
     * @request GET:/contact-person/client/{client_id}
     */
    readClientContactContactPersonClientClientIdGet: (
      clientId: number,
      params: RequestParams = {},
    ) =>
      this.request<ContactPersonResponse, HTTPValidationError>({
        path: `/contact-person/client/${clientId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client Contact
     * @name CreateClientContactContactPersonCreatePost
     * @summary Create Client Contact
     * @request POST:/contact-person/create
     */
    createClientContactContactPersonCreatePost: (
      data: ContactPersonCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/contact-person/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client Contact
     * @name UpdateClientContactContactPersonUpdateContactIdPut
     * @summary Update Client Contact
     * @request PUT:/contact-person/update/{contact_id}
     */
    updateClientContactContactPersonUpdateContactIdPut: (
      contactId: number,
      data: ContactPersonCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/contact-person/update/${contactId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Client Contact
     * @name DeleteClientContactContactPersonDeleteContactIdDelete
     * @summary Delete Client Contact
     * @request DELETE:/contact-person/delete/{contact_id}
     */
    deleteClientContactContactPersonDeleteContactIdDelete: (
      contactId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/contact-person/delete/${contactId}`,
        method: "DELETE",
        ...params,
      }),
  };
  vendors = {
    /**
     * No description
     *
     * @tags Vendors
     * @name ReadAllVendorsGet
     * @summary Read All
     * @request GET:/vendors/
     */
    readAllVendorsGet: (params: RequestParams = {}) =>
      this.request<VendorResponse[], any>({
        path: `/vendors/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vendors
     * @name ReadVendorVendorsVendorIdGet
     * @summary Read Vendor
     * @request GET:/vendors/{vendor_id}
     */
    readVendorVendorsVendorIdGet: (
      vendorId: number,
      params: RequestParams = {},
    ) =>
      this.request<VendorResponse, HTTPValidationError>({
        path: `/vendors/${vendorId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vendors
     * @name CreateClientVendorsCreatePost
     * @summary Create Client
     * @request POST:/vendors/create
     */
    createClientVendorsCreatePost: (
      data: VendorCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/vendors/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vendors
     * @name UpdateVendorVendorsVendorVendorIdPut
     * @summary Update Vendor
     * @request PUT:/vendors/vendor/{vendor_id}
     */
    updateVendorVendorsVendorVendorIdPut: (
      vendorId: number,
      data: VendorCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/vendors/vendor/${vendorId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vendors
     * @name DeleteVendorVendorsVendorVendorIdDelete
     * @summary Delete Vendor
     * @request DELETE:/vendors/vendor/{vendor_id}
     */
    deleteVendorVendorsVendorVendorIdDelete: (
      vendorId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/vendors/vendor/${vendorId}`,
        method: "DELETE",
        ...params,
      }),
  };
  products = {
    /**
     * No description
     *
     * @tags Products
     * @name ReadAllProductsGet
     * @summary Read All
     * @request GET:/products/
     */
    readAllProductsGet: (params: RequestParams = {}) =>
      this.request<ProductResponse[], any>({
        path: `/products/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ReadProductProductsProductIdGet
     * @summary Read Product
     * @request GET:/products/{product_id}
     */
    readProductProductsProductIdGet: (
      productId: number,
      params: RequestParams = {},
    ) =>
      this.request<ProductResponse, HTTPValidationError>({
        path: `/products/${productId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products
     * @name CreateProductProductsCreatePost
     * @summary Create Product
     * @request POST:/products/create
     */
    createProductProductsCreatePost: (
      data: ProductCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/products/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products
     * @name UpdateProductProductsProductProductIdPut
     * @summary Update Product
     * @request PUT:/products/product/{product_id}
     */
    updateProductProductsProductProductIdPut: (
      productId: number,
      data: ProductCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/products/product/${productId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products
     * @name DeleteProductProductsProductProductIdDelete
     * @summary Delete Product
     * @request DELETE:/products/product/{product_id}
     */
    deleteProductProductsProductProductIdDelete: (
      productId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/products/product/${productId}`,
        method: "DELETE",
        ...params,
      }),
  };
  productsInput = {
    /**
     * No description
     *
     * @tags Products Inputs
     * @name ReadAllProductsInputGet
     * @summary Read All
     * @request GET:/products-input/
     */
    readAllProductsInputGet: (params: RequestParams = {}) =>
      this.request<ProductInputResponse[], any>({
        path: `/products-input/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Inputs
     * @name ReadProductProductsInputProductIdGet
     * @summary Read Product
     * @request GET:/products-input/{product_id}
     */
    readProductProductsInputProductIdGet: (
      productId: number,
      params: RequestParams = {},
    ) =>
      this.request<ProductInputResponse, HTTPValidationError>({
        path: `/products-input/${productId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Inputs
     * @name CreateProductInputProductsInputCreatePost
     * @summary Create Product Input
     * @request POST:/products-input/create
     */
    createProductInputProductsInputCreatePost: (
      data: ProductInputCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/products-input/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Inputs
     * @name UpdateProductInputProductsInputProductInputProductIdPut
     * @summary Update Product Input
     * @request PUT:/products-input/product-input/{product_id}
     */
    updateProductInputProductsInputProductInputProductIdPut: (
      productInputId: number,
      productId: string,
      data: ProductInputCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/products-input/product-input/${productId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Inputs
     * @name DeleteProductInputProductsInputProductInputProductIdDelete
     * @summary Delete Product Input
     * @request DELETE:/products-input/product-input/{product_id}
     */
    deleteProductInputProductsInputProductInputProductIdDelete: (
      productInputId: number,
      productId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/products-input/product-input/${productId}`,
        method: "DELETE",
        ...params,
      }),
  };
  productsOutputs = {
    /**
     * No description
     *
     * @tags Products Outputs
     * @name ReadAllProductsOutputsGet
     * @summary Read All
     * @request GET:/products-outputs/
     */
    readAllProductsOutputsGet: (params: RequestParams = {}) =>
      this.request<ProductOutputResponse[], any>({
        path: `/products-outputs/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Outputs
     * @name ReadProductProductsOutputsProductOutputIdGet
     * @summary Read Product
     * @request GET:/products-outputs/{product_output_id}
     */
    readProductProductsOutputsProductOutputIdGet: (
      productOutputId: number,
      params: RequestParams = {},
    ) =>
      this.request<ProductOutputResponse, HTTPValidationError>({
        path: `/products-outputs/${productOutputId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Outputs
     * @name CreateProductOutputProductsOutputsCreatePost
     * @summary Create Product Output
     * @request POST:/products-outputs/create
     */
    createProductOutputProductsOutputsCreatePost: (
      data: ProductOutputCreate,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/products-outputs/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Outputs
     * @name UpdateProductOutputProductsOutputsProductOutputProductIdPut
     * @summary Update Product Output
     * @request PUT:/products-outputs/product-output/{product_id}
     */
    updateProductOutputProductsOutputsProductOutputProductIdPut: (
      productOutputId: number,
      productId: string,
      data: ProductOutputCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/products-outputs/product-output/${productId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Products Outputs
     * @name DeleteProductOutputProductsOutputsProductInputProductIdDelete
     * @summary Delete Product Output
     * @request DELETE:/products-outputs/product-input/{product_id}
     */
    deleteProductOutputProductsOutputsProductInputProductIdDelete: (
      productOutputId: number,
      productId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/products-outputs/product-input/${productId}`,
        method: "DELETE",
        ...params,
      }),
  };
}
