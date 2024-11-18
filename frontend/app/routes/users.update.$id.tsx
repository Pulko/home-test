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
import { fetchUser, updateUser } from "../hooks";
import { User } from "../types";

export const action: ActionFunction = async ({
  request,
  params,
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

  if (!params.id) {
    return {
      error: "Invalid user ID",
    };
  }

  updateUser(newUser, params.id);

  return redirect("/users/" + params.id);
};

export const loader: LoaderFunction = async ({
  params,
}) => {
  if (!params.id) {
    return null;
  }

  return fetchUser(params.id);
};

export default function CreateUserPage() {
  const actionData = useActionData() as {
    error?: string;
    success?: boolean;
  };

  const user = useLoaderData<User | null>();

  return (
    <div className="items-center bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h1 className="text-xl font-bold text-gray-900">
          Update User
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
              defaultValue={user?.username ?? ""}
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
              defaultValue={user?.email ?? ""}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
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
            User updated!
          </p>
        )}
      </div>
    </div>
  );
}
