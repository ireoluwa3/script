export interface SearchResult {
  href?: string;
  type: string;
  title: string;
  content: string;
  photoUrl?: string | null;
  color?: string | null;
  icon?: string;
}

export interface InboxMessage {
  avatar: string | null;
  sender: string;
  message: string;
  received_at: string;
  read: boolean;
}

export interface TeamMember {
  avatar: string;
  name: string;
  job: string;
}

export interface MailboxMessage {
  id: number;
  name: string;
  content: string;
  date: string;
  attachments: string[];
  avatar: string;
  email: string;
}

export interface Topic {
  isPinned?: boolean;
  isLocked?: boolean;
  title: string;
  date: string;
  owner: {
    name: string;
    avatar: string;
  };
  replies: number;
  lastReply: {
    image: string;
    date: string;
  };
}

export interface CircleColors {
  primary: string;
  info: string;
  yellow: string;
  success: string;
  warning: string;
  danger: string;
  green: string;
  orange: string;
}

export interface KanbanColumns {
  name: string;
  items: KanbanItem[];
}

export interface KanbanItem {
  id: string;
  title: string;
  time: string;
  logo: string;
  avatars: string[];
  dealValue: string;
}

export interface Task {
  title: string;
  due: string;
  progress: number;
  members: string[];
  subtaskCount: string;
}

export interface SubEvent {
  date: {
    day: string;
    dayOfWeek: string;
    month: string;
    year: number;
  };
  title: string;
  time: string;
  participants: string[];
  summary: string;
}
