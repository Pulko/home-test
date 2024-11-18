import { ActionFunction } from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
} from "@remix-run/react";
import { createUser } from "../hooks";

export const action: ActionFunction = async ({
  request,
}) => {
  const formData = await request.formData();
  const newUser = {
    username:
      formData.get("username")?.toString() ?? "",
    email:
      formData.get("email")?.toString() ?? "",
  };

  if (!newUser.username || !newUser.email) {
    return {
      error: "Username and email are required",
    };
  }

  createUser(newUser);

  return redirect("/users", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export default function CreateUserPage() {
  const actionData = useActionData() as {
    error?: string;
    success?: boolean;
  };

  return (
    <div className="items-center bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h1 className="text-xl font-bold text-gray-900">
          Create New User
        </h1>
        <Form
          method="post"
          className="mt-6 space-y-4"
        >
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter a username"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter an email address"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
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
            User created!
          </p>
        )}
      </div>
    </div>
  );
}
