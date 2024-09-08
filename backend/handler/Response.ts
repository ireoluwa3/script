// File: handler/Response.ts

import {
  HttpResponse,
  RecognizedString,
  us_socket_context_t,
} from "uWebSockets.js";
import zlib from "zlib";
import { getCommonExpiration, getStatusMessage } from "../utils";
import { Request } from "./Request";
import logger from "@b/utils/logger";

export class Response {
  private aborted = false;

  constructor(private res: HttpResponse) {
    this.res.onAborted(() => {
      this.aborted = true;
    });
  }

  isAborted(): boolean {
    return this.aborted;
  }

  public handleError(code: number, message: any) {
    this.res.cork(() => {
      this.res.writeStatus(`${code} ${getStatusMessage(code)}`).end(
        JSON.stringify({
          message,
        })
      );
    });
  }

  pause() {
    return this.res.pause();
  }

  resume() {
    return this.res.resume();
  }

  writeStatus(status: RecognizedString) {
    return this.res.writeStatus(status);
  }

  writeHeader(key: RecognizedString, value: RecognizedString) {
    return this.res.writeHeader(key, value);
  }

  write(chunk: RecognizedString) {
    return this.res.write(chunk);
  }

  endWithoutBody(
    reportedContentLength?: number | undefined,
    closeConnection?: boolean | undefined
  ) {
    return this.res.endWithoutBody(reportedContentLength, closeConnection);
  }

  tryEnd(fullBodyOrChunk: RecognizedString, totalSize: number) {
    return this.res.tryEnd(fullBodyOrChunk, totalSize);
  }

  close() {
    return this.res.close();
  }

  getWriteOffset() {
    return this.res.getWriteOffset();
  }

  onWritable(handler: (offset: number) => boolean) {
    return this.res.onWritable(handler);
  }

  onAborted(handler: () => void) {
    return this.res.onAborted(handler);
  }

  onData(handler: (chunk: ArrayBuffer, isLast: boolean) => void) {
    return this.res.onData(handler);
  }

  getRemoteAddress() {
    return this.res.getRemoteAddress();
  }

  getRemoteAddressAsText() {
    return this.res.getRemoteAddressAsText();
  }

  getProxiedRemoteAddress() {
    return this.res.getProxiedRemoteAddress();
  }

  getProxiedRemoteAddressAsText() {
    return this.res.getProxiedRemoteAddressAsText();
  }

  cork(cb: () => void) {
    return this.res.cork(cb);
  }

  status(statusCode: number) {
    const message = getStatusMessage(statusCode);
    this.writeStatus(`${statusCode} ${message}`);
    return this;
  }

  upgrade<UserData>(
    userData: UserData,
    secWebSocketKey: RecognizedString,
    secWebSocketProtocol: RecognizedString,
    secWebSocketExtensions: RecognizedString,
    context: us_socket_context_t
  ) {
    return this.res.upgrade(
      userData,
      secWebSocketKey,
      secWebSocketProtocol,
      secWebSocketExtensions,
      context
    );
  }

  end(
    body?: RecognizedString | undefined,
    closeConnection?: boolean | undefined
  ) {
    return this.res.end(body, closeConnection);
  }

  json<T>(data: T) {
    this.res
      .writeHeader("Content-Type", "application/json")
      .end(JSON.stringify(data));
  }

  pipe(stream: NodeJS.ReadableStream) {
    return this.res.pipe(stream);
  }

  public setSecureCookie(
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "Strict" | "Lax" | "None";
    }
  ) {
    const cookieValue = `${name}=${value}; Path=/; HttpOnly=${options.httpOnly}; Secure=${options.secure}; SameSite=${options.sameSite};`;
    this.writeHeader("Set-Cookie", cookieValue);
  }

  setSecureCookies({ accessToken, csrfToken, sessionId }, request) {
    const secure = process.env.NODE_ENV === "production"; // Assuming NODE_ENV is set

    this.setSecureCookie("accessToken", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "None",
    });
    this.setSecureCookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure,
      sameSite: "Strict",
    });
    this.setSecureCookie("sessionId", sessionId, {
      httpOnly: true,
      secure,
      sameSite: "None",
    });

    this.applyUpdatedCookies(request);
  }

  public applyUpdatedCookies(request: Request) {
    const cookiesToUpdate = ["accessToken", "csrfToken", "sessionId"];
    cookiesToUpdate.forEach((cookieName) => {
      if (request.updatedCookies[cookieName]) {
        const { value } = request.updatedCookies[cookieName];

        if (request.headers.platform === "app") {
          return this.writeHeader(cookieName, value);
        }

        let cookieValue = `${cookieName}=${value}; Path=/; HttpOnly;`;
        const expiration = getCommonExpiration(cookieName);

        if (expiration) {
          cookieValue += ` Expires=${expiration};`;
        }

        if (process.env.NODE_ENV === "production") {
          cookieValue += " Secure; SameSite=None;";
        }

        this.writeHeader("Set-Cookie", cookieValue);
      }
    });
  }

  public writeCommonHeaders() {
    const headers = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
    };

    Object.entries(headers).forEach(([key, value]) => {
      this.res.writeHeader(key, value);
    });
  }

  public deleteSecureCookies() {
    ["accessToken", "csrfToken", "sessionId"].forEach((cookieName) => {
      this.writeHeader(
        "Set-Cookie",
        `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
      );
    });
  }

  public async sendResponse(
    req: Request,
    statusCode: number | string,
    responseData: any
  ) {
    try {
      if (this.aborted) {
        return;
      }

      this.res.cork(() => {
        this.handleCookiesInResponse(req, Number(statusCode), responseData);

        const response = this.compressResponse(req, responseData);

        this.writeCommonHeaders();

        this.res.writeStatus(
          `${statusCode} ${getStatusMessage(Number(statusCode))}`
        );
        this.res.writeHeader("Content-Type", "application/json");

        this.res.end(response);
      });
    } catch (error) {
      logger(
        "error",
        "response",
        __filename,
        `Error sending response: ${error.message}`
      );
      if (!this.aborted) {
        this.res.writeStatus("500").end("Internal Server Error");
      }
    }
  }

  private handleCookiesInResponse(
    req: Request,
    statusCode: number,
    responseData: any
  ) {
    if (responseData?.cookies && [200, 201].includes(statusCode)) {
      Object.entries(responseData.cookies).forEach(([name, value]) => {
        req.updateCookie(name, value as string);
      });
      delete responseData.cookies;
    }

    if (req.url.startsWith("/api/auth")) {
      this.applyUpdatedCookies(req);
    }
  }

  private compressResponse(req: Request, responseData: any): Buffer {
    const acceptEncoding = req.headers["accept-encoding"] || "";

    let response = responseData
      ? Buffer.from(JSON.stringify(responseData))
      : Buffer.from("{}");

    let contentEncoding = "identity"; // Default, no compression
    if (acceptEncoding.includes("gzip")) {
      response = zlib.gzipSync(response);
      contentEncoding = "gzip";
    } else if (acceptEncoding.includes("br") && zlib.brotliCompressSync) {
      response = zlib.brotliCompressSync(response);
      contentEncoding = "br";
    } else if (acceptEncoding.includes("deflate")) {
      response = zlib.deflateSync(response);
      contentEncoding = "deflate";
    }

    this.res.writeHeader("Content-Encoding", contentEncoding);
    return response;
  }
}
