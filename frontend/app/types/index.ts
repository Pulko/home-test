export interface UserWithGuestbookCount {
  id: number;
  username: string;
  email: string;
  guestbook_count: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Guestbook {
  id: number;
  message: string;
  username: string;
  user_id: string;
}

export interface NewGuestbook {
  message: string;
  user_id: number;
}

export interface NewUser {
  username: string;
  email: string;
}

export interface UpdateUser {
  username: string;
  email: string;
}

export interface UpdateGuestbook {
  message: string;
  user_id: number;
}

export interface UserWithGuestbooks {
  id: number;
  username: string;
  email: string;
  guestbooks: Array<Guestbook>;
}
