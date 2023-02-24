export type Event = {
  id: string;
  title: string;
  description: string;
  entryFee?: number;
  startTime: Date;
  endTime: Date;
  location: string;
  locationLink?: string;
  userId: string;
  attending?: any;
  userEvent?: any;
};

export type Comment = {
  id: string;
  userId: string;
  eventId: string;
  content: string;
  createdAt: Date;
  user: User;
};

export type User = {
  username: string;
};
