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
  createGuestbookEntry,
  fetchUsers,
} from "../hooks";
import { User } from "../types";

export const action: ActionFunction = async ({
  request,
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

  createGuestbookEntry(newGuestbook);

  return redirect("/guestbooks", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const loader: LoaderFunction = fetchUsers;

export default function CreateGuestbookPage() {
  const actionData = useActionData() as {
    error?: string;
    success?: boolean;
  };

  const users = useLoaderData<Array<User>>();

  return (
    <div className="items-center bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h1 className="text-xl font-bold text-gray-900">
          Create New Guestbook
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
              placeholder="Write your message here"
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
            Create
          </button>
        </Form>
        {actionData?.error && (
          <div className="text-center text-red-500 mt-4">
            {actionData.error}
          </div>
        )}
        {actionData?.success && (
          <p className="text-center text-green-900 mt-4">
            Guestbook created!
          </p>
        )}
      </div>
    </div>
  );
}
