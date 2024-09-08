interface Handler {
  params: { [key: string]: string };
  query: { [key: string]: string };
  body: any;
  user?: User;
  sessionId?: string;
}

type NextFunction = () => void;

interface BodyExtract {
  params: { [key: string]: string };
  query?: { [key: string]: string };
  body: any;
  error?: any;
}

interface QueryParameter {
  type: "string" | "integer" | "boolean";
  minimum?: number;
  maximum?: number;
  description: string;
  default?: any;
}

interface BodySchema {
  description?: string;
  required?: string[];
  properties: Record<
    string,
    {
      type: "string" | "integer" | "boolean" | "object" | "array";
      minLength?: number;
      maxLength?: number;
      format?: string;
      description?: string;
      items?: any;
    }
  >;
}

interface DataTableProps {
  title: string;
  postTitle?: string;
  endpoint: string;
  columnConfig: ColumnConfigType[];
  hasBreadcrumb?: boolean;
  hasRotatingBackButton?: boolean;
  isCrud?: boolean;
  isParanoid?: boolean;
  canView?: boolean;
  canCreate?: boolean;
  canImport?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  navActionsSlot?: ReactNode;
  navActionsConfig?: NavActionsConfig[] | DropdownActionsConfig[];
  dropdownActionsSlot?: ReactNode;
  dropdownActionsConfig?: DropdownActionsConfig[];
  hasStructure?: boolean;
  hasAnalytics?: boolean;
  onlySingleActiveStatus?: boolean;
  formSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  hasTitle?: boolean;
  viewPath?: string;
  editPath?: string;
  blank?: boolean;
  paginationLocation?: "static" | "floating";
  fixedPagination?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  shape?:
    | "straight"
    | "rounded-sm"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-xl"
    | "rounded-2xl"
    | "rounded-3xl";
  navSlot?: ReactNode;
  params?: any;
}

interface DataTableJotaiProps {
  endpoint: string;
  hasStructure?: boolean;
}

type FormItem = FormField | FormField[];

interface FormField {
  type:
    | "select"
    | "input"
    | "textarea"
    | "date"
    | "checkbox"
    | "radio"
    | "switch"
    | "file";
  fileType?: "avatar" | "image" | "document";
  acceptedFileTypes?: string[];
  width?: number;
  height?: number;
  maxSize?: number;
  label: string;
  placeholder?: string;
  name: string;
  color?: string;
  options?: string[];
  notNull?: boolean;
}

interface DropdownActionsConfig {
  name: string;
  label?: string;
  icon: string;
  type: "modal" | "link" | "panel";
  modalType?: "confirmation" | "form";
  modelSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  formItems?: FormItem[];
  topic?: string;
  api?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  component?: React.ComponentType<any> | React.ElementType;
  confirmationMessage?: string;
  link?: string;
  refresh?: boolean;
  side?: "top" | "bottom" | "left" | "right";
}

interface NavActionsConfig {
  name: string;
  label?: string;
  sublabel?: string;
  icon: string;
  topic?: string;
  type: "modal" | "link" | "checkbox" | "button";
  color?: string;
  api?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  modalType?: "confirmation" | "form";
  modelSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  formItems?: FormItem[];
}

type ColumnConfigType = {
  field: string;
  key?: string;
  label: string;
  sublabel?: string;
  sortable: boolean;
  filterable?: boolean;
  sortName?: string;
  type: string;
  active?: string;
  disabled?: string;
  api?: string;
  path?: string;
  subpath?: string;
  color?:
    | "default"
    | "contrast"
    | "muted"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | null
    | undefined;
  hasImage?: boolean;
  imageKey?: string;
  placeholder?: string;
  className?: string;
  tooltip?: string;
  precision?: number | ((item: any) => number);
  maxLength?: number;
  getValue?: (item: any) => string | number | boolean | ReactNode;
  getSubValue?: (item: any) => string | number | boolean | ReactNode;
  getImage?: (item: any) => string | boolean | ReactNode;
  imageWidth?: number;
  imageHeight?: number;
  options?: {
    value: string | boolean | number;
    label: string;
    color?:
      | "default"
      | "contrast"
      | "muted"
      | "primary"
      | "info"
      | "success"
      | "warning"
      | "danger"
      | null
      | undefined;
  }[];
  actions?: {
    icon: string;
    color:
      | "default"
      | "contrast"
      | "muted"
      | "primary"
      | "info"
      | "success"
      | "warning"
      | "danger";
    onClick: (item: any) => void;
    loading?: boolean;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    tooltip?: string;
    condition?: (item: any) => boolean;
  }[];
};

interface IMenu {
  title: string;
  icon: string;
  href: string;
  menu?: Menu[];
  permission?: string[];
  extension?: string;
  settings?: string[];
  auth?: boolean;
  env?: string;
  description?: string;
  isMegaMenu?: boolean;
}

interface Menu {
  title: string;
  icon: string;
  href?: string;
  subMenu?: SubMenu[];
  permission?: string[];
  extension?: string;
  settings?: string[];
  auth?: boolean;
  env?: string;
  description?: string;
}

interface SubMenu {
  title: string;
  href: string;
  icon: string;
  permission?: string[];
  extension?: string;
  settings?: string[];
  auth?: boolean;
  env?: string;
  description?: string;
}

type Pagination = {
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
};

type FilterOption = {
  value: string | number | boolean | null;
  label: string;
  color:
    | "default"
    | "contrast"
    | "muted"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "yellow";
  icon: string;
  path?: string;
};

type AvailableFilters = Record<string, FilterOption[]>;

interface CustomStatusConfig {
  key: string;
  true: string;
  false: string;
}

type Attribute = string | [string, string]; // Supports simple attribute name or tuple for aliasing

type includeModel = {
  model: ModelStatic<Model<any, any>>;
  as: string;
  attributes?: Attribute[]; // Allow array of strings or tuples for attributes
  includeModels?: includeModel[]; // Recursive inclusion for nested relationships
  through?: {
    model?: ModelStatic<Model<any, any>>; // Join table model
    attributes: string[]; // Attributes to include from the join table
  };
  required?: boolean; // Default to false
};

interface FetchParams {
  model: ModelStatic<Model<any, any>>;
  query: {
    page?: number;
    perPage?: number;
    filter?: string | string[];
    sortOrder?: string;
    showDeleted?: string;
  };
  where?: WhereOptions;
  customFilterHandler?: (filter: { [key: string]: any }) => WhereOptions;
  customStatus?: CustomStatusConfig[]; // Now an array of custom status configurations
  sortField?: string;
  timestamps?: boolean;
  paranoid?: boolean;
  numericFields?: string[];
  includeModels?: includeModel[];
  excludeFields?: string[];
  excludeRecords?: {
    model?: ModelStatic<Model<any, any>>;
    key: string;
    value: any;
  }[];
}

interface User {
  id: string;
  email: string;
  password: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  phone?: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt?: Date;
  roleId: number;
  profile?: {
    location: {
      address: string;
      city: string;
      country: string;
      zip: string;
    };
    role?: string;
    bio: string;
    social: {
      facebook: string;
      twitter: string;
      dribbble: string;
      instagram: string;
      github: string;
      gitlab: string;
    };
  };
  status?: UserStatus;
  role: Role;
  twofactor?: TwoFactor;
  author?: Author;
  chats: Chat[];
  notification: Notification[];
  posts: Post[];
  comments: Comment[];
}

interface CustomWebSocket {
  send: (
    message: string | ArrayBuffer,
    isBinary?: boolean,
    compress?: boolean
  ) => void;
  end: (data: any) => void;
}

type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "SUSPENDED";

interface UserMetadata {
  role: string;
  bio: string;
  location: {
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  social: {
    facebook: string;
    twitter: string;
    dribbble: string;
    instagram: string;
    github: string;
    gitlab: string;
  };
  info: {
    experience: string;
    firstJob: { label: string; value: boolean };
    flexible: { label: string; value: boolean };
    remote: { label: string; value: boolean };
  };
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  rolePermissions: RolePermission[];
}

interface Permission {
  id: string;
  name: string;
  rolePermissions: RolePermission[];
}

interface RolePermission {
  id: number;
  role: Role;
  permission: Permission;
}

interface ProviderUser {
  id: string;
  provider: "GOOGLE";
  providerUserId: string;
  userId: string;
}

interface JSONResponse {
  status: "success" | "fail";
  data?: any;
  error?: any;
}

interface TokensSession {
  accessToken: string;
  refreshToken: string;
  sid?: string;
}

type ClientPlatforms = "app" | "browser" | "browser-dev";

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

interface UserEditable {
  firstName?: string;
  lastName?: string;
  csrfToken?: string;
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  csrfToken?: string;
}

interface RefreshToken {
  id: string;
  tokenId: string;
  userId: string;
  isActive: boolean;
  dateCreated: Date;
}

type RefreshTokens = Array<RefreshToken>;

interface Session {
  id: string;
  userId: string;
  sid: string;
  accessToken: string;
  csrfToken: string;
  isActive: boolean;
  ipAddress: string;
}

interface Notification {
  id: string;
  userId: string;
  type: string | null;
  title: string;
  message: string;
  link: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

enum NotificationType {
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
  ACTIVITY = "ACTIVITY",
}

interface TwoFactor {
  id: string;
  userId: string;
  secret: string;
  type: TwoFactorType;
  createdAt: string;
  updatedAt: string;
}

type TwoFactorType = "EMAIL" | "SMS" | "APP";

interface Settings {
  key: string;
  value: string;
  updatedAt: Date | null;
}

interface CustomField {
  name?: string;
  title: string;
  required: boolean;
  type: "input" | "textarea" | "file upload";
}

interface Chat {
  id: string;
  userId: string;
  user: User;
  agentId: string;
  agent: User;
  messages: Message[] | null;
}

enum TicketStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  REPLIED = "REPLIED",
  CLOSED = "CLOSED",
}

enum TicketImportance {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

interface SupportTicket {
  id: string;
  userId: string;
  chatId?: string;
  subject: string;
  messages: ChatMessage[];
  status: TicketStatus;
  importance: TicketImportance;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  agent: User;
  chat: SupportChat;
}

interface Attachment {
  type: string;
  image: string;
  url: string;
  title: string;
  description: string;
}

interface Message {
  type: string;
  text: string;
  time: string;
  userId: string;
  agentId: string;
  attachments: Attachment[];
}

interface Page {
  id: string;
  title: string;
  content: string;
  description?: string;
  image?: string;
  slug: string;
  status: PageStatus;
}

enum PageStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}

interface NotificationTemplate {
  id: number;
  name: string;
  subject: string;
  emailBody?: string;
  smsBody?: string;
  pushBody?: string;
  shortCodes?: JSON;
  email?: boolean;
  sms?: boolean;
  push?: boolean;
}

type OneTimeToken = {
  id: string;
  tokenId: string;
  tokenType: string;
  expiresAt: Date;
  dateCreated: Date;
  updatedAt: Date | null;
};

interface Extension {
  id: string;
  productId: string;
  name: string;
  title?: string | null;
  description?: string | null;
  link?: string | null;
  status?: boolean;
  version?: string;
  image?: string | null;
}

interface RequestContext {
  originalReq: any;
  user?: any;
  tokens?: any;
  headers?: any;
  platform?: string;
  url?: string;
  method?: string;
}

interface ChatMessage {
  type: string;
  text: string;
  time: Date;
  userId: string;
  attachment?: string;
}
