// server.ts
import {
  App,
  type AppOptions,
  type RecognizedString,
  type WebSocketBehavior,
} from "uWebSockets.js";
import { RouteHandler } from "./handler/RouteHandler";
import { type IErrorHandler, type IRequestHandler } from "./types";
import { allowedOrigins, serveStaticFile, setCORSHeaders } from "./utils";
import { Response } from "./handler/Response";

export class MashServer extends RouteHandler {
  private app;
  private roles: any;

  constructor(options: AppOptions = {}) {
    super();
    this.app = App(options);
  }

  public listen(port: number, cb: VoidFunction) {
    this.app.any("/*", (res, req) => {
      let responseSent = false;

      res.onAborted(() => {
        responseSent = true;
      });

      try {
        const url = req.getUrl();
        if (["/uploads/", "/themes/"].some((path) => url.startsWith(path))) {
          const handled = serveStaticFile(
            res,
            req,
            url,
            () => (responseSent = true)
          );
          if (handled) return;
        }
        this.processRoute(res, req, () => (responseSent = true)); // Pass the callback to mark response as sent
      } catch (error) {
        console.error("Server error :", error);
        if (!responseSent && !res.aborted) {
          const response = new Response(res);
          response.handleError(500, `Internal Server Error: ${error.message}`);
          responseSent = true;
        }
      }
    });

    this.app.listen(port, cb);
  }

  public get(path: string, ...handler: IRequestHandler[]) {
    super.set("get", path, ...handler);
  }

  public post(path: string, ...handler: IRequestHandler[]) {
    super.set("post", path, ...handler);
  }

  public put(path: string, ...handler: IRequestHandler[]) {
    super.set("put", path, ...handler);
  }

  public patch(path: string, ...handler: IRequestHandler[]) {
    super.set("patch", path, ...handler);
  }

  public del(path: string, ...handler: IRequestHandler[]) {
    super.set("delete", path, ...handler);
  }

  public options(path: string, ...handler: IRequestHandler[]) {
    super.set("options", path, ...handler);
  }

  public head(path: string, ...handler: IRequestHandler[]) {
    super.set("head", path, ...handler);
  }

  public connect(path: string, ...handler: IRequestHandler[]) {
    super.set("connect", path, ...handler);
  }

  public trace(path: string, ...handler: IRequestHandler[]) {
    super.set("trace", path, ...handler);
  }

  public all(path: string, ...handler: IRequestHandler[]) {
    super.set("all", path, ...handler);
  }

  public use(middleware: IRequestHandler) {
    super.use(middleware);
  }

  public error(cb: IErrorHandler) {
    super.error(cb);
  }

  public notFound(cb: IRequestHandler) {
    super.notFound(cb);
  }

  public ws<T>(pattern: RecognizedString, behavior: WebSocketBehavior<T>) {
    this.app.ws(pattern, behavior);
  }

  public cors() {
    // Options request handler for preflight requests
    this.app.options("/*", (res, req) => {
      const origin = req.headers ? req.headers["origin"] : undefined;
      if (origin && allowedOrigins.includes(origin)) {
        setCORSHeaders(res, origin);
      }
      res.end();
    });

    // Middleware to set CORS headers for actual requests
    this.use((res, req, next) => {
      const origin = req.headers ? req.headers["origin"] : undefined;
      if (origin && allowedOrigins.includes(origin)) {
        setCORSHeaders(res, origin);
      }
      if (typeof next === "function") {
        next();
      }
    });
  }

  public setRoles(roles: Map<any, any>) {
    this.roles = roles;
  }

  public getRole(id: any) {
    return this.roles.get(id);
  }
}
