import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { sanitizePath } from "@b/utils/validation";

const rootPath = process.cwd();
const BASE_UPLOAD_DIR = path.join(rootPath, "public", "uploads");

export const metadata: OperationObject = {
  summary: "Uploads a file to a specified directory",
  description: "Uploads a file to a specified directory",
  operationId: "uploadFile",
  tags: ["Upload"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            dir: {
              type: "string",
              description: "Directory to upload file to",
            },
            file: {
              type: "string",
              description: "Base64 encoded file data",
            },
            height: {
              type: "number",
              description: "Height of the image",
            },
            width: {
              type: "number",
              description: "Width of the image",
            },
            oldPath: {
              type: "string",
              description: "Path of the old image to remove",
            },
          },
          required: ["dir", "file"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "File uploaded successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "URL of the uploaded file",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Upload"),
    500: serverErrorResponse,
  },
};

export default async (data) => {
  const { body, user } = data;
  if (!user) throw new Error("User not found");

  const { dir, file: base64File, width, height, oldPath } = body;

  if (!dir || !base64File) {
    throw new Error("No directory specified or no file provided");
  }

  // Sanitize the directory path to prevent LFI
  const sanitizedDir = sanitizePath(dir.replace(/-/g, "/"));
  const base64Data = base64File.split(",")[1];
  const mimeType = base64File.match(/^data:(.*);base64,/)?.[1] || "";
  const mediaDir = path.join(BASE_UPLOAD_DIR, sanitizedDir);
  await ensureDirExists(mediaDir);

  const buffer = Buffer.from(base64Data, "base64");
  let filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  let processedImage = buffer;

  // Check if the MIME type starts with 'image/' and is not a GIF
  if (mimeType.startsWith("image/") && !mimeType.includes("image/gif")) {
    processedImage = await sharp(buffer)
      .resize({ width, height, fit: "inside" }) // Resize image
      .webp({ quality: 80 }) // Convert to WebP
      .toBuffer();
    filename += ".webp";
  } else if (mimeType.startsWith("video/")) {
    // For video files, simply use the original format and skip processing
    filename += mimeType.split("/")[1]; // Use original video extension
  } else if (mimeType.includes("image/gif")) {
    // Keep GIFs unprocessed to preserve animations
    filename += ".gif";
  } else {
    throw new Error("Unsupported file format.");
  }

  const filePath = path.join(mediaDir, filename);

  await fs.writeFile(filePath, processedImage);

  if (oldPath) {
    try {
      await removeOldImageIfAvatar(oldPath);
    } catch (error) {
      console.error("Error removing old image:", error);
    }
  }

  return { url: `/uploads/${sanitizedDir}/${filename}` };
};

async function ensureDirExists(dir) {
  try {
    await fs.access(dir);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(dir, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function removeOldImageIfAvatar(oldPath) {
  if (oldPath) {
    const oldImageFullPath = path.join(rootPath, "public", oldPath);
    try {
      await fs.access(oldImageFullPath);
      await fs.unlink(oldImageFullPath);
    } catch (error) {
      console.error("Error removing old image:", error);
    }
  }
}
