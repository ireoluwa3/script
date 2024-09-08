import { RedisSingleton } from "../utils/redis";
import {
  generateTokens,
  refreshTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "@b/utils/token";
import { Response } from "./Response";
import { Request } from "./Request";
import { MashServer } from "..";
import logger from "@b/utils/logger";
import { models } from "@b/db";

const isDemo = process.env.NEXT_PUBLIC_DEMO_STATUS === "true" || false;
const AUTH_PAGES = ["/logout"];

const PERMISSION_MAP = {
  trade: ["/api/exchange/order", "/api/ext/ecosystem/order"],
  futures: ["/api/ext/futures"],
  deposit: ["/api/finance/deposit"],
  withdraw: ["/api/finance/withdraw"],
  transfer: ["/api/finance/transfer"],
};

export async function authenticate(
  res: Response,
  req: Request,
  routePath: string,
  next: NextFunction
) {
  try {
    // Allow preflight requests
    if (req.method === "options") {
      return next();
    }

    if (req.headers.platform && !req.headers.accesstoken) {
      return res.handleError(401, "Authentication Required");
    }

    if (!req.headers.platform && !req.cookies) {
      return res.handleError(401, "Authentication Required");
    }

    const apiKey = req.headers["x-api-key"];
    if (apiKey) {
      try {
        // Fetch the API key details from the database
        const apiKeyRecord = await models.apiKey.findOne({
          where: { key: apiKey },
        });
        if (!apiKeyRecord) throw new Error("Invalid API Key");

        const userPermissions =
          typeof apiKeyRecord.permissions === "string"
            ? JSON.parse(apiKeyRecord.permissions)
            : apiKeyRecord.permissions;
        req.setUser({ id: apiKeyRecord.userId, permissions: userPermissions });

        return next(); // Pass control to the next middleware (rolesGate)
      } catch (error) {
        logger(
          "error",
          "auth",
          __filename,
          `API Key Verification Error: ${error.message}`
        );
        return res.handleError(401, "Authentication Required");
      }
    }

    const accessToken = req.cookies.accessToken || req.headers.accesstoken;
    if (!accessToken) {
      return attemptRefreshToken(res, req, next).catch((error) => {
        logger(
          "error",
          "auth",
          __filename,
          `JWT Verification Error: ${error.message}`
        );
        return res.handleError(401, "Authentication Required");
      });
    }

    const userPayload = await verifyAccessToken(accessToken);
    req.setUser(userPayload.sub);
    return csrfCheck(res, req, next);
  } catch (error) {
    logger(
      "error",
      "auth",
      __filename,
      `Error in authentication: ${error.message}`
    );
    return res.handleError(500, "Internal Server Error");
  }
}

async function attemptRefreshToken(
  res: Response,
  req: Request,
  next: NextFunction
) {
  try {
    const sessionId = req.cookies.sessionId || req.headers.sessionid;
    if (!sessionId) {
      return res.handleError(401, "Authentication Required");
    }

    const userSessionKey = `sessionId:${sessionId}`;
    const sessionData = await RedisSingleton.getInstance().get(userSessionKey);

    if (!sessionData) {
      return res.handleError(401, "Authentication Required");
    }

    const { refreshToken: storedRefreshToken, user } = JSON.parse(sessionData);

    if (!storedRefreshToken)
      return res.handleError(401, "Authentication Required");

    let newTokens;
    try {
      const decoded = await verifyRefreshToken(storedRefreshToken);
      if (!decoded.sub || typeof decoded.sub !== "object" || !decoded.sub.id) {
        throw new Error("Invalid token structure");
      }

      newTokens = await refreshTokens(decoded.sub, sessionId);
    } catch (error) {
      newTokens = await generateTokens(user);
    }

    req.updateTokens(newTokens);
    req.setUser(user);
    next();
  } catch (error) {
    logger(
      "error",
      "auth",
      __filename,
      `Token refresh error: ${error.message}`
    );
    return res.handleError(401, "Authentication Required");
  }
}

export async function csrfCheck(
  res: Response,
  req: Request,
  next: NextFunction
) {
  try {
    if (req.method.toLowerCase() === "get" || !AUTH_PAGES.includes(req.url)) {
      return next();
    }

    const csrfToken = req.cookies.csrfToken || req.headers.csrftoken;
    const sessionId = req.cookies.sessionId || req.headers.sessionid;

    if (!csrfToken || !sessionId)
      return res.handleError(403, "CSRF Token or Session ID missing");

    const user = req.getUser();
    if (!user) return res.handleError(401, "Authentication Required");

    const userSessionKey = `sessionId:${user.id}:${sessionId}`;
    const sessionData = await RedisSingleton.getInstance().get(userSessionKey);

    if (!sessionData) return res.handleError(403, "Invalid Session");

    const { csrfToken: storedCSRFToken } = JSON.parse(sessionData);
    if (csrfToken !== storedCSRFToken)
      return res.handleError(403, "Invalid CSRF Token");

    next();
  } catch (error) {
    logger("error", "csrf", __filename, `CSRF Check Error: ${error.message}`);
    res.handleError(403, "CSRF Check Failed");
  }
}

export async function rateLimit(
  res: Response,
  req: Request,
  next: NextFunction
) {
  try {
    if (
      !["post", "put", "patch", "delete"].includes(req.method.toLowerCase())
    ) {
      return next();
    }

    const ip = res.getRemoteAddressAsText(); // Get client IP address
    const userRateLimitKey = `rateLimit:${ip}`;
    const limit = 100; // Max number of requests
    const expireTime = 60; // Window size in seconds

    const current = await RedisSingleton.getInstance().get(userRateLimitKey);

    if (current !== null && parseInt(current) >= limit)
      return res.handleError(429, "Rate Limit Exceeded, Try Again Later");

    await RedisSingleton.getInstance()
      .multi()
      .incr(userRateLimitKey)
      .expire(userRateLimitKey, expireTime)
      .exec();

    next();
  } catch (error) {
    logger(
      "error",
      "rateLimit",
      __filename,
      `Rate Limiting Error: ${error.message}`
    );
    res.handleError(500, "Internal Server Error");
  }
}

export async function rolesGate(
  app: MashServer,
  res: Response,
  req: Request,
  routePath: string,
  method: string,
  next: NextFunction
) {
  try {
    const metadata = req.metadata;
    if (!metadata) return next();

    if (!metadata.permission) return next();

    const user = req.getUser();
    if (!user) return res.handleError(401, "Authentication Required");

    // Check if the request is authenticated using API Key
    if (req.headers["x-api-key"]) {
      const apiKey = req.headers["x-api-key"];
      const apiKeyRecord = await models.apiKey.findOne({
        where: { key: apiKey },
      });
      if (!apiKeyRecord) return res.handleError(401, "Authentication Required");

      const userPermissions =
        typeof apiKeyRecord.permissions === "string"
          ? JSON.parse(apiKeyRecord.permissions)
          : apiKeyRecord.permissions;

      // Check if route requires specific permissions based on API Key
      for (const permission in PERMISSION_MAP) {
        if (
          PERMISSION_MAP[permission].some((route) =>
            routePath.startsWith(route)
          )
        ) {
          if (!userPermissions.includes(permission)) {
            return res.handleError(
              403,
              "Forbidden - You do not have permission to access this"
            );
          }
          break;
        }
      }
    }

    // Fallback to role-based authorization
    const userRole = app.getRole(user.role);

    if (
      !userRole ||
      (!userRole.permissions.includes(metadata.permission) &&
        userRole.name !== "Super Admin")
    )
      return res.handleError(
        403,
        "Forbidden - You do not have permission to access this"
      );

    if (
      isDemo &&
      routePath.startsWith("/api/admin") &&
      ["post", "put", "delete", "del"].includes(method) &&
      userRole.name !== "Super Admin"
    ) {
      res.handleError(403, "Action not allowed in demo mode");
      return;
    }

    next();
  } catch (error) {
    logger(
      "error",
      "rolesGate",
      __filename,
      `Roles Gate Error: ${error.message}`
    );
    res.handleError(500, "Internal Server Error");
  }
}
