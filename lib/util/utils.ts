// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache License. See License in the project root for license information.

/**
 * Defines a mapping for Http like response status codes for different status-code values
 * provided by an AMQP broker.
 * @enum AmqpResponseStatusCode
 */
export enum AmqpResponseStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  Ambiguous = 300,
  MultipleChoices = 300,
  Moved = 301,
  MovedPermanently = 301,
  Found = 302,
  Redirect = 302,
  RedirectMethod = 303,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  RedirectKeepVerb = 307,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  RequestEntityTooLarge = 413,
  RequestUriTooLong = 414,
  UnsupportedMediaType = 415,
  RequestedRangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  UpgradeRequired = 426,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505
}

/**
 * Provides a list of predefined (amqp) protocol level properties for an amqp message.
 */
export const messageProperties: string[] = [
  "message_id", "reply_to", "to", "correlation_id", "content_type", "absolute_expiry_time",
  "group_id", "group_sequence", "reply_to_group_id", "content_encoding", "creation_time", "subject",
  "user_id"
];

/**
 * Provides a list of predefined (amqp) protocol level properties for an amqp message header.
 */
export const messageHeader: string[] = [
  "first_acquirer", "delivery_count", "ttl", "durable", "priority"
];

/**
 * Type declaration for a Function type where T is the input to the function and V is the output of the function.
 */
export type Func<T, V> = (a: T) => V;

/**
 * Determines whether the given error object is like an AmqpError object.
 * @param {object} err The AmqpError object
 * @returns {boolean} result - `true` if it is an AMQP Error; `false` otherwise.
 */
export function isAmqpError(err: any): boolean {
  if (!err || typeof err !== "object") {
    throw new Error("err is a required parameter and must be of type 'object'.");
  }
  let result: boolean = false;
  if (((err.condition && typeof err.condition === "string") && (err.description && typeof err.description === "string"))
    || (err.value && Array.isArray(err.value))
    || (err.constructor && err.constructor.name === "c")) {
    result = true;
  }
  return result;
}

/**
 * Describes the options that can be provided while parsing connection strings.
 * The connection string usually looks like `{A}={B};{C}={D}`.
 * @interface ConnectionStringParseOptions
 */
export interface ConnectionStringParseOptions {
  /**
   * @property {string} [entitySeperator] Describes the separator that separates different parts/
   * entities in a connection string. Default value `;`.
   */
  entitySeperator?: string;
  /**
   * @property {string} [keyValueSeparator] Describes the separator that separates the key/value
   * pair for an entity/part in a connection string; Default value `=`.
   */
  keyValueSeparator?: string;
}

/**
 * Defines an object with possible properties defined in T.
 * @type ParsedOutput<T>
 */
export type ParsedOutput<T> = {
  [P in keyof T]: T[P];
};

/**
 * A wrapper for setTimeout that resolves a promise after t milliseconds.
 * @param {number} t - The number of milliseconds to be delayed.
 * @param {T} value - The value to be resolved with after a timeout of t milliseconds.
 * @returns {Promise<T>} - Resolved promise
 */
export function delay<T>(t: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), t));
}

/**
 * Parses the connection string and returns an object of type T.
 * @param {string} connectionString The connection string to be parsed.
 * @returns {ParsedOutput<T>} ParsedOutput<T>.
 */
export function parseConnectionString<T>(connectionString: string, options?: ConnectionStringParseOptions): ParsedOutput<T> {
  if (!options) options = {};
  const entitySeperator = options.entitySeperator || ";";
  const keyValueSeparator = options.keyValueSeparator || "=";

  return connectionString.split(entitySeperator).reduce((acc, part) => {
    const splitIndex = part.indexOf(keyValueSeparator);
    return {
      ...acc,
      [part.substring(0, splitIndex)]: part.substring(splitIndex + 1)
    };
  }, {} as any);
}