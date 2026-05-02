export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  msg: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  color?: string;
  pinned?: boolean;
  tags?: string[];
  user: string;
  createdAt: string;
  updatedAt: string;
};