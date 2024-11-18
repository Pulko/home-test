import {
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import {
  fetchGuestbook,
  fetchUsers,
  updateGuestbookEntry,
} from "../hooks";
import { Guestbook, User } from "../types";

export const action: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();
  const newGuestbook = {
    message:
      formData.get("message")?.toString() ?? "",
    user_id: parseInt(
      formData.get("user_id")?.toString() ?? "",
      10
    ),
  };

  if (!newGuestbook.user_id) {
    return {
      error: "Message is required",
    };
  }

  if (!params.id) {
    return {
      error: "Invalid guestbook ID",
    };
  }

  updateGuestbookEntry(newGuestbook, params.id);

  return redirect("/guestbooks/" + params.id);
};

export const loader: LoaderFunction = async ({
  params,
}) => {
  const users = await fetchUsers();

  return {
    users,
    guestbook: params.id
      ? await fetchGuestbook(params.id)
      : {
          id: "",
          message: "",
          user_id: "",
        },
  };
};

export default function CreateGuestbookPage() {
  const actionData = useActionData() as {
    error?: string;
    success?: boolean;
  };

  const { users, guestbook } = useLoaderData<{
    users: Array<User>;
    guestbook: Guestbook;
  }>();

  return (
    <div className="items-center bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h1 className="text-xl font-bold text-gray-900">
          Update Guestbook
        </h1>
        <Form
          method="post"
          className="mt-6 space-y-4"
        >
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
              defaultValue={guestbook.message}
            ></textarea>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="user"
            >
              User
            </label>
            <select
              name="user_id"
              id="user"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
              defaultValue={guestbook.user_id}
            >
              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-lg shadow-sm hover:bg-gray-800"
          >
            Update
          </button>
        </Form>
        {actionData?.error && (
          <div className="text-center text-red-500 mt-4">
            {actionData.error}
          </div>
        )}
        {actionData?.success && (
          <p className="text-center text-green-900 mt-4">
            Guestbook updated!
          </p>
        )}
      </div>
    </div>
  );
}
