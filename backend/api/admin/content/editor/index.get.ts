import { RedisSingleton } from "@b/utils/redis";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import path from "path";
import fs from "fs";
import { models } from "@b/db";

const rootPath = process.cwd();
const dataFolder = "data";

export const metadata: OperationObject = {
  summary: "Handles editor related requests",
  description:
    "This endpoint handles various editor-related requests, including data, asset, and theme handling.",
  operationId: "handleEditor",
  tags: ["Builder"],
  parameters: [
    {
      in: "query",
      name: "type",
      schema: {
        type: "string",
        enum: ["data", "asset", "theme"],
      },
      required: true,
      description: "The type of request to handle",
    },
    {
      in: "query",
      name: "path",
      schema: {
        type: "string",
      },
      description: "The path to the file to load",
    },
    {
      in: "query",
      name: "ext",
      schema: {
        type: "string",
      },
      description: "The file extension to load",
    },
    {
      in: "query",
      name: "name",
      schema: {
        type: "string",
      },
      description: "The name of the theme to load",
    },
  ],
  responses: {
    200: {
      description: "Request handled successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: { type: "string", description: "Response data" },
              urls: {
                type: "array",
                items: { type: "string" },
                description: "Uploaded file URLs",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Resource"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Frontend Builder",
};

export default async (data: Handler) => {
  const { query } = data;
  const { type, path, ext, name } = query;
  switch (type) {
    case "all":
      return await loadAllData(query);
    case "data":
      let page = await models.page.findOne({
        where: { slug: path === "/" ? "frontend" : path },
      });
      if (!page) {
        page = await models.page.create({
          title: "Frontend",
          slug: "frontend",
          content: "{}",
          status: "PUBLISHED",
        });
      }

      return page.content;
    case "theme":
      return await loadTheme(query);
    default:
      return { data: "Invalid request" };
  }
};

export const loadData = async (route: string, ext: string): Promise<string> => {
  const fileName = getFileNameFromRoute(route);
  const dataPath = path.join(rootPath, dataFolder, `${fileName}.${ext}`);
  if (!fs.existsSync(dataPath)) {
    return ext === "json" ? "{}" : "<div>Not found</div>";
  } else {
    const data = await fs.promises.readFile(dataPath, "utf8");
    return data;
  }
};

// Helper functions
const getFileNameFromRoute = (route: string) =>
  route === "/" ? "frontend" : route;

const loadAllData = async (query: any) => {
  const { name } = query;
  const basePath = path.join(rootPath, dataFolder);
  const files = readdirRecursive(basePath) as string[];
  const data = await Promise.all(
    files.map((f) =>
      fs.promises
        .readFile(f, "utf8")
        .then((c) => ({ name: f, content: c }))
        .then((c) => fixPaths(c, basePath))
    )
  );
  return data;
};

const readdirRecursive = (
  folder: string,
  files: string[] = []
): string[] | void => {
  fs.readdirSync(folder).forEach((file) => {
    const pathAbsolute = path.join(folder, file);
    if (fs.statSync(pathAbsolute).isDirectory()) {
      readdirRecursive(pathAbsolute, files);
    } else {
      files.push(pathAbsolute);
    }
  });
  return files;
};

const fixPaths = (c: { name: string; content: string }, basePath: string) => {
  const nameWithoutBasePath = getRouteFromFilename(
    c.name.replace(basePath, "")
  );
  const nameWithFixSeps = nameWithoutBasePath.split(path.sep).join("/"); // replace all
  return { content: c.content, name: nameWithFixSeps };
};

const getRouteFromFilename = (filename: string) =>
  filename.slice(0, -5) === path.sep + "default" ? path.sep : filename; // file paths are OS-specific

const loadTheme = async (query: any) => {
  const { name } = query;
  // handle request
  const themeName = query.name as string;
  const folderPath = path.join(process.cwd(), "themes", themeName);
  const componentNames = await fs.promises
    .readdir(folderPath)
    .then((f) => f.filter((c) => c !== "index.ts" && !c.startsWith(".")));
  const componentsP = componentNames.map(async (c) => {
    const assetPath = path.join(folderPath, c, "index.html");
    const source = await fs.promises.readFile(assetPath, "utf-8");
    return { source, folder: c };
  });
  const components = await Promise.all(componentsP);
  return components;
};
