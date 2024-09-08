import { crudParameters } from "@b/utils/constants";
import { cacheInitialized, initMediaWatcher, mediaCache } from "./utils";
import { operatorMap } from "../../system/log/utils";

export const metadata: OperationObject = {
  summary: "Fetches media files based on category and date",
  operationId: "fetchMediaFiles",
  tags: ["Admin", "Content", "Media"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "Media entries for the given category and date",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
      },
    },
    400: {
      description: "Bad request if the category or date are not specified",
    },
    404: { description: "Not found if the media file does not exist" },
    500: { description: "Internal server error" },
  },
  requiresAuth: true,
  permission: "Access Media Management",
};

export default async (data: any) => {
  if (!cacheInitialized) await initMediaWatcher();

  const { query } = data;
  const page = query.page ? parseInt(query.page) : 1;
  const perPage = query.perPage ? parseInt(query.perPage) : 10;
  const sortField = query.sortField || "name";
  const sortOrder = query.sortOrder || "asc";
  const filters = query.filter ? JSON.parse(query.filter) : {};

  // Filter media files by applying filters with operators
  const filteredMedia = mediaCache.filter((file) => {
    return (
      Object.entries(filters as Record<string, any>).every(([key, filter]) => {
        const { value, operator } =
          typeof filter === "object"
            ? filter
            : { value: filter, operator: "equal" };
        const operation = operatorMap[operator];
        return operation ? operation(file, key, value) : true;
      }) && /\.(jpg|jpeg|png|gif|webp)$/i.test(file[sortField])
    );
  });

  // Sort media files
  filteredMedia.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalItems = filteredMedia.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const offset = (page - 1) * perPage;
  const paginatedItems = filteredMedia.slice(offset, offset + perPage);

  return {
    items: paginatedItems,
    pagination: {
      totalItems,
      currentPage: page,
      perPage,
      totalPages,
    },
  };
};
