// utils.ts

import fs from "fs";
import { readFileSync } from "fs-extra";
import path from "path";
import zlib from "zlib";
import { Response } from "../handler/Response";
import { getMime } from "./mime";
import { sanitizePath } from "./validation";
import { logError } from "./logger";

export const appName = process.env.NEXT_PUBLIC_SITE_NAME || "Platform";
export const appSupport =
  process.env.APP_SUPPORT_EMAIL || "support@mash3div.com";

export const allowedOrigins = [
  "localhost:80",
  "localhost:443",
  "localhost:3000",
];
export const notFoundResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 Not Found</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
    }
  </style>
</head>
<body>
  <h1>404 Not Found</h1>
  <p>The resource you are looking for is not available.</p>
</body>
</html>`;

export const apiResponse = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName} - Backend Service</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 20px;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #005A9C;
    }
    a {
      color: #007BFF;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .status {
      color: #28A745;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 0.9em;
      color: #666;
    }
    @media (max-width: 600px) {
      body {
        margin: 10px;
      }
      .container {
        margin: 10px;
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${appName} Backend Service</h1>
    <p>Status: <strong class="status">Live</strong></p>
    <p>This is the backend service for <strong>${appName}</strong>. All systems operational.</p>
    <p>API Documentation: <a href="/api/docs/v1">View Documentation</a></p>
    <!-- Additional UI elements could be added here -->
    <div class="footer">
      <p>Need help? <a href="mailto:${appSupport}">Contact Support</a></p>
    </div>
  </div>
</body>
</html>
`;

export const notFoundFn = (res: Response) => {
  res.status(404).end("Not Found");
};

export const errHandlerFn = (Err: any, res: Response) => {
  res.status(500).end("Error");
};

export const handleError = (res: Response, statusCode: number, error: any) => {
  res.status(statusCode).end(error);
};

export const handleArrayBuffer = (message: ArrayBuffer | string) => {
  if (message instanceof ArrayBuffer) return new TextDecoder().decode(message);

  return message;
};

export const voidFunction = () => {};

export function setupDefaultRoutes(app) {
  ["/", "/api"].forEach((route) => {
    app.get(route, (res, req) =>
      res.writeHeader("Content-Type", "text/html").end(apiResponse)
    );
  });
}

export function setupProcessEventHandlers() {
  process.on("uncaughtException", (error) => {
    const errorMessage = error.stack || `Uncaught Exception: ${error.message}`;
    console.error(errorMessage);
    logError("uncaughtException", error, __filename);
    // Perform cleanup or other necessary steps before a forced exit
    process.exit(1); // Exit with a non-zero status to indicate an error
  });

  process.on("unhandledRejection", (reason, promise) => {
    const reasonMessage =
      reason instanceof Error
        ? reason.stack || reason.message
        : JSON.stringify(reason);
    console.error(
      `Unhandled Rejection at: ${promise}, reason: ${reasonMessage}`
    );
    logError("unhandledRejection", new Error(reasonMessage), __filename);
  });

  process.on("SIGINT", async () => {
    console.info("Server is shutting down...");
    process.exit();
  });

  process.on("SIGTERM", async () => {
    console.info("Server received stop signal, shutting down gracefully");
    process.exit();
  });
}

// Handler to set CORS headers
export const setCORSHeaders = (res, origin) => {
  res.writeHeader("Access-Control-Allow-Origin", origin);
  res.writeHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.writeHeader(
    "Access-Control-Allow-Headers",
    "*, client-platform, Content-Type, Authorization, X-Requested-With, accessToken, refreshToken, sessionId, csrfToken"
  );
  res.writeHeader("Access-Control-Allow-Credentials", "true");
};

export const getStatusMessage = (statusCode: number): string => {
  const messages: { [key: number]: string } = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
    206: "Partial Content",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
  };

  return messages[statusCode] || "Unknown Status";
};

export const getCommonExpiration = (cookieName: string): string | undefined => {
  const expirationTimes = {
    accessToken: 15 * 60 * 1000, // 15 minutes
    refreshToken: 14 * 24 * 60 * 60 * 1000, // 14 days
    sessionId: 14 * 24 * 60 * 60 * 1000, // 14 days
    csrfToken: 24 * 60 * 60 * 1000, // 1 day
  };

  const time = expirationTimes[cookieName];
  return time ? new Date(Date.now() + time).toUTCString() : undefined;
};

function compressResponse(res, req, responseData) {
  const acceptEncoding = req.getHeader("accept-encoding") || ""; // Note: using getHeader for uWS

  let contentEncoding = "identity"; // Default, no compression
  let response = Buffer.isBuffer(responseData)
    ? responseData
    : Buffer.from(JSON.stringify(responseData));

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

  if (contentEncoding !== "identity") {
    res.writeHeader("Content-Encoding", contentEncoding);
  }

  return response;
}

export function convertAndSortCounts(countsPerDay) {
  return Object.keys(countsPerDay)
    .sort()
    .map((date) => ({
      date,
      count: countsPerDay[date],
    }));
}

export const validAddonFolders = [];

export const cronLastRunTimes = {
  aiInvestments: 0,
  forexInvestments: 0,
  icoPhases: 0,
  mailwizardCampaigns: 0,
  staking: 0,
  currencies: 0,
  binaryOrders: 0,
  spotCurrencies: 0,
  investments: 0,
  spotWalletsDeposit: 0,
  spotWalletsWithdraw: 0,
};

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const transactionTypeOptions = [
  { value: "DEPOSIT", label: "Deposit", color: "success" },
  { value: "WITHDRAW", label: "Withdraw", color: "danger" },
  {
    value: "OUTGOING_TRANSFER",
    label: "Outgoing Transfer",
    color: "warning",
  },
  { value: "INCOMING_TRANSFER", label: "Incoming Transfer", color: "info" },
  { value: "PAYMENT", label: "Payment", color: "primary" },
  { value: "REFUND", label: "Refund", color: "muted" },
  { value: "BINARY_ORDER", label: "Binary Order", color: "success" },
  { value: "EXCHANGE_ORDER", label: "Exchange Order", color: "warning" },
  { value: "INVESTMENT", label: "Investment", color: "info" },
  { value: "INVESTMENT_ROI", label: "Investment ROI", color: "primary" },
  { value: "AI_INVESTMENT", label: "AI Investment", color: "muted" },
  {
    value: "AI_INVESTMENT_ROI",
    label: "AI Investment ROI",
    color: "success",
  },
  { value: "INVOICE", label: "Invoice", color: "danger" },
  { value: "FOREX_DEPOSIT", label: "Forex Deposit", color: "warning" },
  { value: "FOREX_WITHDRAW", label: "Forex Withdraw", color: "info" },
  {
    value: "FOREX_INVESTMENT",
    label: "Forex Investment",
    color: "primary",
  },
  {
    value: "FOREX_INVESTMENT_ROI",
    label: "Forex Investment ROI",
    color: "muted",
  },
  {
    value: "ICO_CONTRIBUTION",
    label: "ICO Contribution",
    color: "success",
  },
  { value: "REFERRAL_REWARD", label: "Referral Reward", color: "warning" },
  { value: "STAKING", label: "Staking", color: "info" },
  { value: "STAKING_REWARD", label: "Staking Reward", color: "primary" },
  {
    value: "P2P_OFFER_TRANSFER",
    label: "P2P Offer Transfer",
    color: "muted",
  },
  { value: "P2P_TRADE", label: "P2P Trade", color: "danger" },
];

export const statusOptions = [
  { value: "PENDING", label: "Pending", color: "warning" },
  { value: "COMPLETED", label: "Completed", color: "success" },
  { value: "FAILED", label: "Failed", color: "danger" },
  { value: "CANCELLED", label: "Cancelled", color: "muted" },
  { value: "REJECTED", label: "Rejected", color: "danger" },
  { value: "EXPIRED", label: "Expired", color: "muted" },
];

export function slugify(str: string) {
  return str
    .replace(/^\s+|\s+$/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function serveStaticFile(res, req, filePath, markResponseSent) {
  let aborted = false;

  res.onAborted(() => {
    aborted = true;
    console.log("Request was aborted");
  });

  try {
    const sanitizedFilePath = sanitizePath(filePath);

    if (sanitizedFilePath.indexOf("..") !== -1) {
      if (!aborted) {
        res.writeStatus("403 Forbidden").end();
        markResponseSent();
      }
      return true;
    }

    let fullPath;
    if (filePath.startsWith("/uploads/")) {
      fullPath = path.join(process.cwd(), "public", sanitizedFilePath);
    } else if (filePath.startsWith("/themes/")) {
      fullPath = path.join(process.cwd(), sanitizedFilePath);
    }

    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
      let fileContent = fs.readFileSync(fullPath);
      const contentType = getMime(fullPath);

      fileContent = compressResponse(res, req, fileContent);

      const maxAge = 60 * 60 * 24 * 365; // 1 year
      const cacheControl = `public, max-age=${maxAge}, immutable`;

      if (!aborted) {
        res.writeHeader("Content-Type", contentType);
        res.writeHeader("Cache-Control", cacheControl);
        res.writeHeader("Connection", "keep-alive");
        res.end(fileContent);
        markResponseSent();
      }
      return true;
    }

    if (!aborted) {
      res.writeStatus("404 Not Found").end();
      markResponseSent();
    }
    return true;
  } catch (error) {
    console.error("Error serving static file:", error);
    if (!aborted) {
      res.writeStatus("500 Internal Server Error").end();
      markResponseSent();
    }
    return true;
  }
}
