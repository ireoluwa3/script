// KYC Template Type
interface KycTemplate {
  id: string;
  title: string;
  options: Record<string, any> | null;
  status: boolean | null;
  level: number;
  kyc: Kyc[];
}

interface Kyc {
  id: string;
  userId: string;
  templateId: string;
  data: Record<string, any> | null;
  status: KycStatus;
  level: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// KYC Status Enum
enum KycStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
