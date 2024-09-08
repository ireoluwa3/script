export interface ChatProps {
  ticket?: SupportTicket;
  setTicket: any;
  messages: ChatMessage[];
  setMessages: any;
  isSupport: boolean;
}

export interface ChatMessage {
  type: string;
  text: string;
  time: Date;
  userId: string;
  attachment: string;
}
