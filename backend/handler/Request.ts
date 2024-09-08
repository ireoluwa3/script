import {
  HttpRequest,
  HttpResponse,
  MultipartField,
  RecognizedString,
  getParts,
} from "uWebSockets.js";
import url from "url";
import { HttpMethod } from "../types";
import { handleArrayBuffer } from "../utils";
import { validateSchema } from "../utils/validation";
import { createError } from "@b/utils/error";
import logger from "@b/utils/logger";

const isDemo = process.env.NEXT_PUBLIC_DEMO_STATUS === "true" || false;

export class Request {
  public url: string;
  public method: HttpMethod;
  public keys: string[] = [];
  public regExp: RegExp | undefined;
  public query: Record<string, any>;
  public body: any;
  public params: Record<string, string> = {};
  public cookies: Record<string, string> = {};
  public headers: Record<string, string> = {};
  public metadata?: OperationObject;
  public user = null;
  public remoteAddress: string;
  public connection: { encrypted: boolean; remoteAddress: string } = {
    encrypted: false,
    remoteAddress: "127.0.0.1",
  };

  public updatedCookies: Record<
    string,
    { value: string; options?: Record<string, any> }
  > = {};

  constructor(private res: HttpResponse, private req: HttpRequest) {
    this.url = req.getUrl();

    this.method = req.getMethod() as HttpMethod;
    this.query = this.parseQuery();
    this.headers = this.parseHeaders();
    this.cookies = this.parseCookies();

    if (this.metadata) {
      this.validateParameters();
    }
  }

  private parseHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    this.req.forEach((key, value) => {
      headers[key] = value;
    });
    return headers;
  }

  private parseCookies(): Record<string, string> {
    const cookiesHeader = this.headers["cookie"] || "";
    const cookies: Record<string, string> = {};
    cookiesHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length === 2) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });
    return cookies;
  }

  public parseQuery(): Record<string, any> {
    return url.parse(`?${this.req.getQuery()}`, true).query;
  }

  public async parseBody(): Promise<void> {
    try {
      if (
        !["post", "put", "patch", "delete"].includes(this.method.toLowerCase())
      )
        return;
    } catch (error) {
      logger(
        "error",
        "request",
        __filename,
        `Error in parseBody: ${error.message}`
      );
      throw createError({ statusCode: 500, message: "Internal Server Error" });
    }

    const contentType = this.headers["content-type"] || "";

    try {
      const bodyContent = await this.readRequestBody();

      this.body = this.processBodyContent(contentType, bodyContent);

      if (
        this.metadata?.requestBody &&
        this.metadata.requestBody.content[contentType]?.schema
      ) {
        this.body = validateSchema(
          this.body,
          this.metadata.requestBody.content[contentType].schema
        );
      }
    } catch (error) {
      logger(
        "error",
        "request",
        __filename,
        `Error processing body content: ${error.message}`
      );
      throw createError({ statusCode: 400, message: error.message });
    }
  }

  private async readRequestBody(): Promise<string> {
    const bodyData: string[] = [];
    return new Promise((resolve, reject) => {
      this.res.onData((ab: ArrayBuffer, isLast: boolean) => {
        const chunk = Buffer.from(ab).toString();
        bodyData.push(chunk);

        if (isLast) {
          resolve(bodyData.join(""));
        }
      });

      this.res.onAborted(() => {
        reject(new Error("Request aborted"));
      });
    });
  }

  private processBodyContent(contentType: string, bodyContent: string): any {
    if (
      contentType.includes("application/json") &&
      bodyContent.trim() !== "" &&
      typeof bodyContent === "string"
    ) {
      try {
        return JSON.parse(bodyContent);
      } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      return Object.fromEntries(new URLSearchParams(bodyContent));
    }

    return bodyContent.trim() ? bodyContent : {};
  }

  private validateParameters(): void {
    if (!this.metadata || !this.metadata.parameters) return;

    for (const parameter of this.metadata.parameters) {
      const value = this.getParameterValue(parameter);

      if (value === undefined && parameter.required) {
        throw new Error(
          `Missing required ${parameter.in} parameter: "${parameter.name}"`
        );
      }

      if (value !== undefined) {
        try {
          this.updateParameterValue(
            parameter,
            validateSchema(value, parameter.schema)
          );
        } catch (error) {
          throw new Error(
            `Validation error for ${parameter.in} parameter "${parameter.name}": ${error.message}`
          );
        }
      }
    }
  }

  private getParameterValue(parameter): string | undefined {
    switch (parameter.in) {
      case "query":
        return this.query[parameter.name];
      case "header":
        return this.headers[parameter.name];
      case "path":
        return this.params[parameter.name];
      case "cookie":
        return this.cookies[parameter.name];
      default:
        return undefined;
    }
  }

  private updateParameterValue(parameter, value: any): void {
    switch (parameter.in) {
      case "query":
        this.query[parameter.name] = value;
        break;
      case "path":
        this.params[parameter.name] = value;
        break;
      case "cookie":
        this.cookies[parameter.name] = value;
        break;
    }
  }

  public _setRegexparam(keys: string[], regExp: RegExp) {
    this.keys = keys;
    this.regExp = regExp;
  }

  public getHeader(lowerCaseKey: RecognizedString) {
    return this.req.getHeader(lowerCaseKey);
  }

  public getParameter(index: number) {
    return this.req.getParameter(index);
  }

  public getUrl() {
    return this.req.getUrl();
  }

  public getMethod() {
    return this.req.getMethod();
  }

  public getCaseSensitiveMethod() {
    return this.req.getCaseSensitiveMethod();
  }

  public getQuery() {
    return this.req.getQuery();
  }

  public setYield(_yield: boolean) {
    return this.req.setYield(_yield);
  }

  public extractPathParameters(): void {
    if (!this.regExp) return;

    const matches = this.regExp.exec(this.url);

    if (!matches) return;

    this.keys.forEach((key, index) => {
      const value = matches[index + 1];
      if (value !== undefined) {
        this.params[key] = decodeURIComponent(value);
      }
    });
  }

  public async rawBody<T>(): Promise<T | null> {
    return new Promise<T | null>(async (resolve, reject) => {
      this.res.onData((data) => resolve(handleArrayBuffer(data) as T));
      this.res.onAborted(() => reject(null));
    });
  }

  public async file(): Promise<MultipartField[] | undefined> {
    const header = this.req.getHeader("content-type");

    return await new Promise<MultipartField[] | undefined>(
      (resolve, reject) => {
        let buffer = Buffer.from("");

        this.res.onData((ab, isLast) => {
          buffer = Buffer.concat([buffer, Buffer.from(ab)]);

          if (isLast) {
            resolve(getParts(buffer, header));
          }
        });

        this.res.onAborted(() => reject(null));
      }
    );
  }

  public updateCookie(
    name: string,
    value: string,
    options: Record<string, any> = {}
  ) {
    this.updatedCookies[name] = { value, options };
  }

  public updateTokens(tokens: Record<string, string>) {
    Object.entries(tokens).forEach(([name, value]) => {
      this.updatedCookies[name] = { value };
    });
  }

  public setMetadata(metadata: OperationObject) {
    this.metadata = metadata;
  }

  public getMetadata() {
    return this.metadata;
  }

  public setUser(user: any) {
    this.user = user;
  }

  public getUser(): {
    id: number;
    role: number;
  } | null {
    return this.user;
  }
}
