// /api/admin/users/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import { Op } from "sequelize";

// Define the form structure for editing user information
export const metadata = {
  summary: "Get form structure for user editing",
  operationId: "getFormStructureForUserEditing",
  tags: ["Admin", "CRM", "User"],
  responses: {
    200: {
      description: "Form structure for editing user information",
      content: structureSchema,
    },
  },
  permission: "Access User Management",
};

export const userStructure = () => {
  const email = {
    type: "input",
    component: "InfoBlock",
    label: "Email",
    name: "email",
    placeholder: "example@gmail.com",
    icon: "mdi:email",
  };

  const avatar = {
    type: "file",
    label: "Avatar",
    name: "avatar",
    fileType: "avatar",
    className: "rounded-full",
    width: 64,
    height: 64,
    maxSize: 1,
  };

  const firstName = {
    type: "input",
    label: "First Name",
    name: "firstName",
    placeholder: "John",
    icon: "ph:user-circle",
  };

  const lastName = {
    type: "input",
    label: "Last Name",
    name: "lastName",
    placeholder: "Doe",
    icon: "ph:user-circle",
  };

  const emailVerified = {
    type: "select",
    label: "Email Verified",
    name: "emailVerified",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const phone = {
    type: "input",
    component: "InfoBlock",
    label: "Phone",
    name: "phone",
    placeholder: "1234567890",
    icon: "ph:phone",
  };

  const roleSelect = async () => {
    const roles = await models.role.findAll({
      where: {
        name: {
          [Op.not]: "Super Admin",
        },
      },
    });

    return {
      type: "select",
      label: "Role",
      name: "roleId",
      options: roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
      placeholder: "Select a role",
      ts: "number",
    };
  };

  const role = {
    type: "input",
    component: "InfoBlock",
    label: "Role",
    name: "role.name",
    icon: "ph:user",
  };

  const lastLogin = {
    type: "datetime",
    label: "Last Login",
    name: "lastLogin",
  };

  const lastFailedLogin = {
    type: "datetime",
    label: "Last Failed Login",
    name: "lastFailedLogin",
  };

  const failedLoginAttempts = {
    type: "input",
    label: "Failed Login Attempts",
    name: "failedLoginAttempts",
    placeholder: "Enter failed login attempts",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "BANNED", label: "Banned" },
      { value: "SUSPENDED", label: "Suspended" },
    ],
    placeholder: "Select status",
    ts: "string",
  };

  const twoFactor = {
    type: "select",
    label: "Two Factor Authentication",
    name: "twoFactor",
    notNull: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const profile = {
    type: "object",
    name: "profile",
    grid: "column",
    ts: "object",
    fields: [
      {
        type: "textarea",
        label: "Bio",
        name: "bio",
        placeholder: "Enter bio",
      },
      {
        type: "object",
        label: "Location",
        name: "location",
        fields: [
          [
            {
              type: "input",
              label: "Address",
              name: "address",
              placeholder: "Enter address",
              icon: "ph:map-pin-simple-area",
            },
            {
              type: "input",
              label: "City",
              name: "city",
              placeholder: "Enter city",
              icon: "ph:map-pin",
            },
          ],
          [
            {
              type: "input",
              label: "Country",
              name: "country",
              placeholder: "Enter country",
              icon: "ph:map-trifold",
            },
            {
              type: "input",
              label: "Zip",
              name: "zip",
              placeholder: "Enter zip",
              icon: "ph:signpost",
            },
          ],
        ],
      },
      {
        type: "object",
        label: "Social",
        name: "social",
        fields: [
          [
            {
              type: "input",
              label: "Facebook",
              name: "facebook",
              placeholder: "Enter facebook",
              icon: "ph:facebook-logo",
            },
            {
              type: "input",
              label: "Twitter",
              name: "twitter",
              placeholder: "Enter twitter",
              icon: "ph:twitter-logo",
            },
            {
              type: "input",
              label: "Dribbble",
              name: "dribbble",
              placeholder: "Enter dribbble",
              icon: "ph:dribbble-logo",
            },
          ],
          [
            {
              type: "input",
              label: "Instagram",
              name: "instagram",
              placeholder: "Enter instagram",
              icon: "ph:instagram-logo",
            },
            {
              type: "input",
              label: "Github",
              name: "github",
              placeholder: "Enter github",
              icon: "ph:github-logo",
            },
            {
              type: "input",
              label: "Gitlab",
              name: "gitlab",
              placeholder: "Enter gitlab",
              icon: "ph:gitlab-logo",
            },
          ],
        ],
      },
    ],
  };

  return {
    email,
    firstName,
    lastName,
    avatar,
    emailVerified,
    phone,
    roleSelect,
    lastLogin,
    lastFailedLogin,
    failedLoginAttempts,
    status,
    twoFactor,
    profile,
    role,
  };
};

export default async (): Promise<object> => {
  const {
    email,
    firstName,
    lastName,
    avatar,
    emailVerified,
    phone,
    roleSelect,
    twoFactor,
    status,
    profile,
    role,
  } = userStructure();

  // You need to await the async roleSelect function to get the role data
  const roles = await roleSelect();

  const ContactInfo = {
    type: "component",
    name: "Contact Information",
    filepath: "ContactInfo",
    props: {
      emailVerified,
    },
  };

  const UserInformation = {
    fields: [
      {
        type: "component",
        name: "User Information",
        filepath: "UserProfileInfo",
        props: {
          avatar,
          firstName,
          lastName,
        },
      },
      { fields: [email, phone, role], grid: "column" },
    ],
    className: "card-dashed mb-5 items-center",
  };

  return {
    get: [UserInformation, ContactInfo, profile],
    set: [
      avatar,
      [firstName, lastName],
      [email, phone],
      [roles, status],
      [emailVerified, twoFactor],
      profile,
    ],
  };
};
