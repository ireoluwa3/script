type MailWizardCampaign = {
  id: string;
  name: string;
  subject: string;
  status?:
    | "PENDING"
    | "PAUSED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED"
    | "STOPPED";
  speed: number;
  targets: any;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
  template: MailWizardTemplate;
};

type MailWizardTemplate = {
  id: string;
  name: string;
  content: string;
  design: string;
  createdAt: Date;
  updatedAt: Date;
};

type MailWizardBlock = {
  id: string;
  name: string;
  design: string;
  createdAt: Date;
  updatedAt: Date;
};
