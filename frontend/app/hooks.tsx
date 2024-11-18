import {
  NewGuestbook,
  NewUser,
  UpdateGuestbook,
  UpdateUser,
} from "./types";

const API_URL = process.env.API_URL;

export const fetchUsers = async () => {
  const response = await fetch(
    `${API_URL}/users`
  );
  if (!response.ok)
    throw new Error("Failed to fetch users");
  return response.json();
};

export const fetchUser = async (
  userId: string
) => {
  const response = await fetch(
    `${API_URL}/users/${userId}`
  );
  if (!response.ok)
    throw new Error(
      "Failed to fetch user details"
    );
  return response.json();
};

export const fetchGuestbooks = async () => {
  const response = await fetch(
    `${API_URL}/guestbooks`
  );
  if (!response.ok)
    throw new Error("Failed to fetch guestbooks");
  return response.json();
};

export const fetchGuestbook = async (
  guestbookId: string
) => {
  const response = await fetch(
    `${API_URL}/guestbooks/${guestbookId}`
  );
  if (!response.ok)
    throw new Error("Failed to fetch guestbook");
  return response.json();
};

export const fetchGuestbookEntries = async (
  userId: string
) => {
  const response = await fetch(
    `${API_URL}/users/${userId}/guestbooks`
  );
  if (!response.ok)
    throw new Error("Failed to fetch guestbooks");
  return response.json();
};

export const createUser = async (
  newUser: NewUser
) => {
  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }
  );

  if (!response.ok) {
    return { error: "Failed to create user" };
  }

  return { success: true };
};

export const updateUser = async (
  newUser: UpdateUser,
  userId: string
) => {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }
  );

  if (!response.ok) {
    return { error: "Failed to update user" };
  }

  return { success: true };
};

export const deleteUser = async (
  userId: string
) => {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok)
    throw new Error("Failed to delete user");
};

export const createGuestbookEntry = async (
  newGuestbook: NewGuestbook
) => {
  const response = await fetch(
    `${API_URL}/guestbooks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGuestbook),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to create guestbook",
    };
  }

  return { success: true };
};

export const updateGuestbookEntry = async (
  guestbook: UpdateGuestbook,
  id: string
) => {
  const response = await fetch(
    `${API_URL}/guestbooks/${id}`,

    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guestbook),
    }
  );

  console.log({ response });

  if (!response.ok) {
    return {
      error: "Failed to create guestbook",
    };
  }

  return { success: true };
};

export const deleteGuestbookEntry = async (
  id: string
) => {
  const response = await fetch(
    `${API_URL}/guestbooks/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok)
    throw new Error(
      "Failed to delete guestbook entry"
    );
};
