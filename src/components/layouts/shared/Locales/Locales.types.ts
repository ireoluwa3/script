export interface Announcement {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementsProps {
  shape?: "straight" | "rounded" | "smooth" | "curved" | "full";
}
