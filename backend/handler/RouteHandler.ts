// handler/RouteHandler.ts

import { parse } from "regexparam";
import { HttpRequest, HttpResponse } from "uWebSockets.js";
import { HttpMethod, IErrorHandler, IRequestHandler, IRoute } from "../types";
import { errHandlerFn, notFoundFn } from "../utils";
import { Request } from "./Request";
import { Response } from "./Response";
import logger from "@b/utils/logger";

export class RouteHandler {
  private routes: IRoute[] = [];
  private middlewares: IRequestHandler[] = [];

  private errorHandler: IErrorHandler = errHandlerFn;
  private notFoundHandler: IRequestHandler = notFoundFn;

  public set(method: HttpMethod, path: string, ...handler: IRequestHandler[]) {
    const { keys, pattern } = parse(path);
    this.routes.push({ handler, method, path, regExp: pattern, keys });
  }

  public use(middleware: IRequestHandler) {
    this.middlewares.push(middleware);
  }

  public error(cb: IErrorHandler) {
    this.errorHandler = cb;
  }

  public notFound(cb: IRequestHandler) {
    this.notFoundHandler = cb;
  }

  private findRoutes(path: string, method: HttpMethod): IRoute | undefined {
    for (const route of this.routes) {
      if (
        (route.method === method || route.method === "all") &&
        route.regExp.test(path)
      ) {
        return route;
      }
    }
  }

  private applyMiddleware(res: Response, req: Request, done: VoidFunction) {
    if (this.middlewares.length === 0) return done();

    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        this.middlewares[index](res, req, () => {
          index++;
          if (index < this.middlewares.length) {
            next();
          } else {
            done();
          }
        });
      }
    };

    next();
  }

  private applyHandler(
    res: Response,
    req: Request,
    handlers: IRequestHandler[]
  ) {
    let index = 0;

    const next = () => {
      index++;
      if (index < handlers.length) {
        handlers[index](res, req, next);
      }
    };

    handlers[index](res, req, next);
  }

  public processRoute(
    response: HttpResponse,
    request: HttpRequest,
    markResponseSent: () => void
  ) {
    const req = new Request(response, request);
    const res = new Response(response);

    const route = this.findRoutes(req.url, req.method);

    if (route) {
      req._setRegexparam(route.keys, route.regExp);
      req.extractPathParameters();
    }

    try {
      this.applyMiddleware(res, req, () => {
        if (route) {
          this.applyHandler(res, req, route.handler);
        } else {
          this.notFoundHandler(res, req);
        }
        markResponseSent(); // Mark the response as sent after handling the route
      });
    } catch (err) {
      logger(
        "error",
        "route",
        __filename,
        `Error processing route: ${err.message}`
      );
      this.errorHandler(err, res, req);
      markResponseSent(); // Mark the response as sent in case of an error
    }
  }
}
