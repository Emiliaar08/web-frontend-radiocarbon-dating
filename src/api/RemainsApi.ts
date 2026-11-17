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

/** RemainResponse */
export interface RemainResponse {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string | null;
  /** Status */
  status: string;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
  /** Analysis Time Days */
  analysis_time_days: number | null;
  /** Carbon 14 Pmc */
  carbon_14_pmc: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Published At */
  published_at: string | null;
  /**
   * Likes Count
   * @default 0
   */
  likes_count?: number;
  /**
   * Is Liked
   * @default 0
   */
  is_liked?: number;
  /**
   * Is Mine
   * @default 0
   */
  is_mine?: number;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** Body_create_remains_draft_api_remains_draft_post */
export interface BodyCreateRemainsDraftApiRemainsDraftPost {
  /**
   * Title
   * @minLength 1
   * @maxLength 120
   */
  title: string;
  /** Image File */
  image_file: File | Blob;
  /** Video File */
  video_file: File | Blob;
}

/** PublishRemainRequest */
export interface PublishRemainRequest {
  /**
   * Description
   * @minLength 2
   * @maxLength 2000
   */
  description: string;
  /**
   * Analysis Time Days
   * @exclusiveMin 0
   * @max 36500
   */
  analysis_time_days: number;
  /** Carbon 14 Pmc */
  carbon_14_pmc: number | string;
}

/** LikeRequest */
export interface LikeRequest {
  /**
   * Liked
   * @min 0
   * @max 1
   */
  liked: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Radiocarbon Dating API
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Публичный список с фильтрами по названию и содержанию C-14. Если передана cookie, в ответе также вычисляются признаки автора и лайка.
     *
     * @tags Останки
     * @name ListRemains
     * @summary Получить опубликованные останки
     * @request GET:/api/remains
     * @response `200` `(RemainResponse)[]` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    listRemains: (
      query?: {
        /**
         * Carbon Min
         * @default "0"
         */
        carbon_min?: number | string;
        /** Carbon Max */
        carbon_max?: number | string | null;
        /** Title */
        title?: string | null;
        /**
         * Limit
         * @min 1
         * @max 100
         * @default 100
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RemainResponse[], HTTPValidationError>({
        path: `/api/remains`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Публично возвращает первую опубликованную запись, запись по ID либо следующую запись при next=true.
     *
     * @tags Останки
     * @name GetRemainsFeed
     * @summary Получить останок для ленты
     * @request GET:/api/remains/feed
     * @response `200` `RemainResponse` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    getRemainsFeed: (
      query?: {
        /** Remains Id */
        remains_id?: number | null;
        /**
         * Next
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<RemainResponse, HTTPValidationError>({
        path: `/api/remains/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Требует авторизации; возвращается черновик текущего исследователя без передачи его ID.
     *
     * @tags Останки
     * @name GetRemainsDraft
     * @summary Получить свой черновик
     * @request GET:/api/remains/draft
     * @secure
     * @response `200` `RemainResponse` Successful Response
     */
    getRemainsDraft: (params: RequestParams = {}) =>
      this.request<RemainResponse, any>({
        path: `/api/remains/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Требует авторизации. Принимает multipart/form-data с названием и файлами; медиа сохраняются в MinIO, создатель берётся из сессии.
     *
     * @tags Останки
     * @name CreateRemainsDraft
     * @summary Создать черновик с фото и видео
     * @request POST:/api/remains/draft
     * @secure
     * @response `201` `RemainResponse` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    createRemainsDraft: (
      data: BodyCreateRemainsDraftApiRemainsDraftPost,
      params: RequestParams = {},
    ) =>
      this.request<RemainResponse, HTTPValidationError>({
        path: `/api/remains/draft`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Требует авторизации владельца черновика. Передаются описание, время анализа и содержание C-14; служебные поля задаёт сервер.
     *
     * @tags Останки
     * @name PublishRemains
     * @summary Опубликовать свой черновик
     * @request PUT:/api/remains/{remain_id}/publish
     * @secure
     * @response `200` `RemainResponse` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    publishRemains: (
      remainId: number,
      data: PublishRemainRequest,
      params: RequestParams = {},
    ) =>
      this.request<RemainResponse, HTTPValidationError>({
        path: `/api/remains/${remainId}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Требует авторизации. liked=1 ставит лайк, liked=0 снимает его для текущего исследователя.
     *
     * @tags Останки
     * @name SetRemainLike
     * @summary Поставить или снять лайк
     * @request POST:/api/remains/{remain_id}/likes
     * @secure
     * @response `200` `RemainResponse` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    setRemainLike: (
      remainId: number,
      data: LikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<RemainResponse, HTTPValidationError>({
        path: `/api/remains/${remainId}/likes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Требует авторизации владельца опубликованной записи. Физического удаления строки не происходит.
     *
     * @tags Останки
     * @name DeleteRemain
     * @summary Логически удалить свой останок
     * @request DELETE:/api/remains/{remain_id}
     * @secure
     * @response `204` `void` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    deleteRemain: (remainId: number, params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/api/remains/${remainId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
