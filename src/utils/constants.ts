export const arrowMap = {
  right: "right",
  left: "left",
  top: "up",
  bottom: "down",
};

export const positioningClass = {
  left: "left-0",
  right: "right-0",
  top: "top-0",
  bottom: "bottom-0",
};

export const focusClass = "focus:ring-1";

type options = {
  value: string;
  label: string;
  color?:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "primary"
    | "muted"
    | "default"
    | "contrast"
    | null
    | undefined;
};

export const transactionTypeOptions: options[] = [
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

export const statusOptions: options[] = [
  { value: "PENDING", label: "Pending", color: "warning" },
  { value: "COMPLETED", label: "Completed", color: "success" },
  { value: "FAILED", label: "Failed", color: "danger" },
  { value: "CANCELLED", label: "Cancelled", color: "muted" },
  { value: "REJECTED", label: "Rejected", color: "danger" },
  { value: "EXPIRED", label: "Expired", color: "contrast" },
];

export const localeFlagMap: Record<string, string> = {
  af: "ZA", // South Africa
  am: "ET", // Ethiopia
  ar: "IQ", // Iraq
  as: "IN", // India (Assam)
  az: "AZ", // Azerbaijan
  bg: "BG", // Bulgaria
  bn: "BD", // Bangladesh
  bs: "BA", // Bosnia and Herzegovina
  ca: "CT", // Catalonia
  cs: "CZ", // Czech Republic
  cy: "GB-WLS", // Wales
  da: "DK", // Denmark
  de: "DE", // Germany
  dv: "MV", // Maldives
  el: "GR", // Greece
  en: "GB", // United Kingdom
  es: "ES", // Spain
  et: "EE", // Estonia
  fa: "IR", // Iran
  fi: "FI", // Finland
  fil: "PH", // Philippines
  fj: "FJ", // Fiji
  fr: "FR", // France
  ga: "IE", // Ireland
  gl: "GAL", // Galicia
  gu: "IN", // India (Gujarat)
  he: "IL", // Israel
  hi: "IN", // India (Hindi)
  hr: "HR", // Croatia
  ht: "HT", // Haiti
  hu: "HU", // Hungary
  hy: "AM", // Armenia
  id: "ID", // Indonesia
  is: "IS", // Iceland
  it: "IT", // Italy
  ja: "JP", // Japan
  ka: "GE", // Georgia
  kk: "KZ", // Kazakhstan
  km: "KH", // Cambodia
  kn: "IN", // India (Karnataka)
  ko: "KR", // South Korea
  lv: "LV", // Latvia
  lt: "LT", // Lithuania
  mk: "MK", // North Macedonia
  ml: "IN", // India (Kerala)
  mr: "IN", // India (Maharashtra)
  ms: "MY", // Malaysia
  mt: "MT", // Malta
  nb: "NO", // Norway
  nl: "NL", // Netherlands
  pa: "IN", // India (Punjab)
  pl: "PL", // Poland
  pt: "PT", // Portugal
  ro: "RO", // Romania
  ru: "RU", // Russia
  sk: "SK", // Slovakia
  sl: "SI", // Slovenia
  sq: "AL", // Albania
  sv: "SE", // Sweden
  sw: "KE", // Kenya
  ta: "IN", // India (Tamil Nadu)
  te: "IN", // India (Telangana)
  th: "TH", // Thailand
  tr: "TR", // Turkey
  uk: "UA", // Ukraine
  ur: "PK", // Pakistan
  vi: "VN", // Vietnam
  yue: "HK", // Hong Kong (Cantonese)
  zu: "ZA", // South Africa
};
