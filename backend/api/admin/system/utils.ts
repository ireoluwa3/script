import https from "https";
import AdmZip from "adm-zip";
import { promises as fs } from "fs";
import { createWriteStream } from "fs";
import { updateExtensionQuery } from "../../../utils/system";
import { models } from "@b/db";

let cachedIP: string | null = null;
let lastFetched: number | null = null;
let nextVerificationDate: Date | null = null;
const verificationPeriodDays = 3;
const rootPath = process.cwd();
const licFolderPath = `${rootPath}/lic`;

interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  lic_response?: string;
  data?: T;
  path?: string;
}

export async function getProduct(id?: string): Promise<any> {
  if (id) {
    const extension = await models.extension.findOne({
      where: { productId: id },
    });

    if (!extension) {
      throw new Error("Extension not found");
    }

    return extension;
  } else {
    try {
      const filePath = `${rootPath}/package.json`;
      const fileContent = await fs.readFile(filePath, "utf8");
      const content = JSON.parse(fileContent);

      if (!content) {
        throw new Error("Error reading package.json");
      }

      return {
        id: content.id,
        name: content.name,
        version: content.version,
        description: content.description,
      };
    } catch (error) {
      console.error(`Error getting product: ${(error as Error).message}`);
      throw new Error((error as Error).message);
    }
  }
}

export async function fetchPublicIp(): Promise<string | null> {
  try {
    const data = await new Promise<{ ip: string }>((resolve, reject) => {
      https.get("https://api.ipify.org?format=json", (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          resolve(JSON.parse(data));
        });

        resp.on("error", (err) => {
          reject(err);
        });
      });
    });
    return data.ip;
  } catch (error) {
    console.error(`Error fetching public IP: ${(error as Error).message}`);
    return null;
  }
}

export async function getPublicIp(): Promise<string | null> {
  const now = Date.now();

  if (cachedIP && lastFetched && now - lastFetched < 60000) {
    // 1 minute cache
    return cachedIP;
  }

  cachedIP = await fetchPublicIp();
  lastFetched = now;
  return cachedIP;
}

export async function callApi<T>(
  method: string,
  url: string,
  data: any = null,
  filename?: string
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "LB-API-KEY": process.env.API_LICENSE_API_KEY || "",
      "LB-URL": process.env.NEXT_PUBLIC_SITE_URL || "",
      "LB-IP": (await getPublicIp()) || "",
      "LB-LANG": "en",
    };

    const requestData = data ? JSON.stringify(data) : null;

    const requestOptions = {
      method: method,
      headers: headers,
    };

    const response: ApiResponse<T> = await new Promise((resolve, reject) => {
      const req = https.request(url, requestOptions, (res) => {
        const data: Buffer[] = [];

        if (res.headers["content-type"] === "application/zip") {
          if (!filename) {
            reject(new Error("Filename must be provided for zip content."));
            return;
          }

          const dirPath = `${rootPath}/updates`;
          const filePath = `${dirPath}/${filename}.zip`;

          // Ensure the directory exists
          fs.mkdir(dirPath, { recursive: true })
            .then(() => {
              const fileStream = createWriteStream(filePath);
              res.pipe(fileStream);

              fileStream.on("finish", () => {
                resolve({
                  status: true,
                  message: "Update file downloaded successfully",
                  path: filePath,
                });
              });

              fileStream.on("error", (err) => {
                reject(err);
              });
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          res.on("data", (chunk) => {
            data.push(chunk);
          });

          res.on("end", () => {
            const result = JSON.parse(Buffer.concat(data).toString());
            if (res.statusCode !== 200) {
              reject(new Error(result.message));
            } else {
              resolve(result);
            }
          });
        }

        res.on("error", (err) => {
          reject(err);
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      if (requestData) {
        req.write(requestData);
      }

      req.end();
    });

    return response;
  } catch (error) {
    console.error(`API call failed: ${(error as Error).message}`);
    throw new Error((error as Error).message);
  }
}

export async function verifyLicense(
  productId: string,
  license?: string | null,
  client?: string | null,
  timeBasedCheck?: boolean
): Promise<ApiResponse> {
  const licenseFilePath = `${licFolderPath}/${productId}.lic`;

  let data: any;

  try {
    // Check if a license file exists
    const licenseFileContent = await fs.readFile(licenseFilePath, "utf8");
    data = {
      product_id: productId,
      license_file: licenseFileContent,
      license_code: null,
      client_name: null,
    };
  } catch (err) {
    console.error(`Error reading license file: ${(err as Error).message}`);
    // File does not exist or other error occurred
    data = {
      product_id: productId,
      license_file: null,
      license_code: license,
      client_name: client,
    };
  }

  if (timeBasedCheck && verificationPeriodDays > 0) {
    const today = new Date();
    if (nextVerificationDate && today < nextVerificationDate) {
      return { status: true, message: "Verified from cache" };
    }
  }

  const response = await callApi(
    "POST",
    `${process.env.APP_LICENSE_API_URL}/api/verify_license`,
    data
  );

  if (timeBasedCheck && verificationPeriodDays > 0 && response.status) {
    const today = new Date();
    nextVerificationDate = new Date();
    nextVerificationDate.setDate(today.getDate() + verificationPeriodDays);
  }

  if (!response.status) {
    console.error(`License verification failed: ${response.message}`);
    throw new Error(response.message);
  }
  return response;
}

export async function activateLicense(
  productId: string,
  license: string,
  client: string
): Promise<ApiResponse> {
  const data = {
    product_id: productId,
    license_code: license,
    client_name: client,
    verify_type: "envato",
  };

  const response = await callApi(
    "POST",
    `${process.env.APP_LICENSE_API_URL}/api/activate_license`,
    data
  );

  if (!response.status) {
    console.error(`License activation failed: ${response.message}`);
    throw new Error(response.message);
  }

  // If activation is successful, save the license
  if (response.lic_response) {
    const licFileContent = response.lic_response;
    const licenseFilePath = `${licFolderPath}/${productId}.lic`;

    // Ensure the lic directory exists
    await fs.mkdir(licFolderPath, { recursive: true });
    // Save the license to a file in the lic directory
    await fs.writeFile(licenseFilePath, licFileContent);
  }

  return response;
}

export async function checkLatestVersion(productId: string) {
  const payload = {
    product_id: productId,
  };
  return await callApi(
    "POST",
    `${process.env.APP_LICENSE_API_URL}/api/latest_version`,
    payload
  );
}

export async function checkUpdate(productId: string, currentVersion: string) {
  const payload = {
    product_id: productId,
    current_version: currentVersion,
  };
  return await callApi(
    "POST",
    `${process.env.APP_LICENSE_API_URL}/api/check_update`,
    payload
  );
}

export async function downloadUpdate(
  productId: string,
  updateId: string,
  version: string,
  product: string,
  type?: string
): Promise<ApiResponse> {
  if (!productId || !updateId || !version || !product) {
    throw new Error("Missing required arguments.");
  }
  const licenseFilePath = `${licFolderPath}/${productId}.lic`;
  const licenseFile = await fs.readFile(licenseFilePath, "utf8");

  const data = {
    license_file: licenseFile,
    license_code: null,
    client_name: null,
  };

  // Call API to download update
  const response = await callApi(
    "POST",
    `${process.env.APP_LICENSE_API_URL}/api/download_update/main/${updateId}`,
    data,
    `${product}-${version}`
  );

  if (!response.status) {
    throw new Error(`Download failed: ${response.message}`);
  }

  if (!response.path) {
    throw new Error(`Download failed: No update file path returned.`);
  }

  try {
    // Extract the main update
    unzip(response.path, rootPath);

    if (type === "extension") {
      try {
        await updateExtensionQuery(productId, version);
      } catch (error) {
        throw new Error(
          `Update of extension version failed: ${(error as Error).message}`
        );
      }
    }

    // Remove the zip file after successful extraction
    await fs.unlink(response.path);
    return {
      message: "Update downloaded and extracted successfully",
      status: true,
    };
  } catch (error) {
    throw new Error(
      `Extraction of update files failed: ${(error as Error).message}`
    );
  }
}

const unzip = (filePath: string, outPath: string) => {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(outPath, true);
};
