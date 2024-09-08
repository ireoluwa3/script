import { structureSchema } from "@b/utils/constants";
import { imageStructureLg } from "@b/utils/schema/structure";

export const metadata = {
  summary: "Get form structure for Sliders",
  operationId: "getSliderStructure",
  tags: ["Admin", "Sliders"],
  responses: {
    200: {
      description: "Form structure for managing Sliders",
      content: structureSchema,
    },
  },
  permission: "Access Slider Management",
};

export const sliderStructure = async () => {
  const image = {
    type: "input",
    label: "Image",
    name: "image",
    placeholder: "Enter the image URL",
  };

  const link = {
    type: "input",
    label: "Link",
    name: "link",
    placeholder: "Enter the link URL",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    placeholder: "Select the status of the slider",
    options: [
      { label: "Active", value: true },
      { label: "Disabled", value: false },
    ],
    ts: "boolean",
  };

  return {
    image,
    link,
    status,
  };
};

export default async () => {
  const { image, link, status } = await sliderStructure();

  return {
    get: [imageStructureLg, link, status],
    set: [imageStructureLg, [link, status]],
  };
};
