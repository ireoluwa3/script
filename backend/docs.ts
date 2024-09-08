import { baseUrl } from "@b/utils/constants";
import fs from "fs/promises";
import path from "path";
import { getMime } from "./utils/mime";

const SWAGGER_DOC_PATH = path.join(process.cwd(), "public", "swagger.json");
const SWAGGER_UI_FOLDER = path.join(process.cwd(), "packages", "docs-ui");
const REGENERATION_INTERVAL = 300000; // 5 minutes in milliseconds

const swaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: process.env.SITE_NAME || "API Documentation",
    version: "1.0.0",
    description:
      process.env.SITE_DESCRIPTION ||
      "This is the API documentation for the site, powered by Mash Server.",
  },
  paths: {},
  components: {
    schemas: {},
    responses: {},
    parameters: {},
    requestBodies: {},
    securitySchemes: {
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-KEY" },
    },
  },
  tags: [],
};

let lastSwaggerGenerationTime = 0;

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateSwaggerDocIfNeeded() {
  const needsRegeneration =
    !(await fileExists(SWAGGER_DOC_PATH)) ||
    Date.now() - lastSwaggerGenerationTime > REGENERATION_INTERVAL;

  if (needsRegeneration) {
    console.log("Swagger documentation needs regeneration.");
    await generateSwaggerDoc(path.join(baseUrl, "api"), "/api");
    lastSwaggerGenerationTime = Date.now();
    console.log("Swagger documentation regenerated.");
  } else {
    console.log("Using existing Swagger documentation.");
  }
}

async function generateSwaggerDoc(startPath, basePath = "/api") {
  const entries = await fs.readdir(startPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(startPath, entry.name);

    if (entry.isDirectory() && ["cron", "admin"].includes(entry.name)) {
      continue;
    }

    if (entry.name.startsWith("index.ws")) {
      continue;
    }

    if (entry.isDirectory()) {
      await generateSwaggerDoc(entryPath, `${basePath}/${entry.name}`);
    } else {
      const [routeName, method] = entry.name.replace(/\.[jt]s$/, "").split(".");
      if (!method) continue;

      const metadata = await loadRouteMetadata(entryPath);
      let routePath = `${basePath}/${routeName}`.replace(/\/index$/, "");
      routePath = convertToSwaggerPath(routePath);

      if (!swaggerDoc.paths[routePath]) {
        swaggerDoc.paths[routePath] = {};
      }

      swaggerDoc.paths[routePath][method.toLowerCase()] = {
        ...metadata,
        responses: constructResponses(metadata.responses),
        security: metadata.requiresAuth ? [{ ApiKeyAuth: [] }] : [],
      };
    }
  }

  const outputPath = path.join(process.cwd(), "public", "swagger.json");
  await fs.writeFile(outputPath, JSON.stringify(swaggerDoc, null, 2), "utf8");
}

async function loadRouteMetadata(entryPath): Promise<any> {
  try {
    const importedModule = await import(entryPath);
    if (!importedModule.metadata || !importedModule.metadata.responses) {
      console.error(`No proper 'metadata' exported from ${entryPath}`);
      return { responses: {} }; // Return a safe default to prevent errors
    }
    return importedModule.metadata;
  } catch (error) {
    console.error(`Error loading route metadata from ${entryPath}:`, error);
    return { responses: {} }; // Return a safe default to prevent errors
  }
}

function constructResponses(responses) {
  return Object.keys(responses).reduce((acc, statusCode) => {
    acc[statusCode] = {
      description: responses[statusCode].description,
      content: responses[statusCode].content,
    };
    return acc;
  }, {});
}

function convertToSwaggerPath(routePath) {
  // Convert :param to {param} for Swagger documentation
  routePath = routePath.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
  // Convert [param] to {param} for Swagger documentation
  routePath = routePath.replace(/\[(\w+)]/g, "{$1}");
  return routePath;
}

function setupSwaggerRoute(app) {
  app.get("/api/docs/swagger.json", async (res) => {
    try {
      await generateSwaggerDocIfNeeded();
      const data = await fs.readFile(SWAGGER_DOC_PATH);
      res.cork(() => {
        res.writeHeader("Content-Type", "application/json").end(data);
      });
    } catch (error) {
      console.error("Error generating or serving Swagger JSON:", error);
      res.cork(() => {
        res
          .writeStatus("500 Internal Server Error")
          .end("Internal Server Error");
      });
    }
  });

  app.get("/api/docs/*", async (res, req) => {
    try {
      const urlPath = req.getUrl();
      const filePath =
        urlPath === "/api/docs/v1"
          ? "index.html"
          : urlPath.replace("/api/docs/", "");
      const fullPath = path.join(SWAGGER_UI_FOLDER, filePath);
      const data = await fs.readFile(fullPath);

      res.cork(() => {
        res.writeHeader("Content-Type", getMime(filePath)).end(data);
      });
    } catch (error) {
      console.error("Error serving Swagger UI:", error);
      res.cork(() => {
        res
          .writeStatus("500 Internal Server Error")
          .end("Internal Server Error");
      });
    }
  });
}

export { setupSwaggerRoute };
