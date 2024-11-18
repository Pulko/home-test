import {
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import { deleteUser, fetchUser } from "../hooks";
import { UserWithGuestbooks } from "../types";

export const loader: LoaderFunction = async ({
  params,
}) => {
  if (!params.id) {
    return null;
  }

  return fetchUser(params.id);
};

export const action: ActionFunction = async ({
  params,
}) => {
  if (!params.id) {
    return null;
  }
  deleteUser(params.id);

  return redirect("/users", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export default function UserDetailsPage() {
  const user =
    useLoaderData<UserWithGuestbooks | null>();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-xl">
          User not found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-8 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.username}
        </h1>
        <p className="text-gray-700 mt-2">
          <span className="font-medium">
            Email:
          </span>{" "}
          {user.email}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">ID:</span>{" "}
          {user.id}
        </p>
        <div className="mt-6">
          <div className="flex justify-between items-baseline">
            <a
              href={`/users/update/${user.id}`}
              className="inline-block px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Update User
            </a>
            <Form method="post">
              <input
                type="hidden"
                name="id"
                value={user.id}
              />
              <button
                type="submit"
                id="submit"
                aria-label="delete"
                className="mt-6 inline-block px-4 py-2 text-sm font-medium bg-red-300 rounded-lg shadow-sm hover:bg-red-800"
              >
                Delete with entries
              </button>
            </Form>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Guestbooks
        </h2>
        <ul className="space-y-4">
          {user.guestbooks.map((guestbook) => (
            <a
              key={guestbook.id}
              href={`/guestbooks/${guestbook.id}`}
            >
              <div
                className="relative flex flex-col mt-6 bg-white shadow-sm border border-slate-200 rounded-lg"
                key={guestbook.id}
              >
                <div className="p-4">
                  <h5 className="mb-2 text-slate-800 text-xl font-semibold">
                    {user.username}
                  </h5>
                  <p className="text-slate-600 leading-normal font-light">
                    {guestbook.message}
                  </p>
                </div>
                <div className="mx-3 border-t border-slate-200 pb-3 pt-2 px-1">
                  <span className="text-sm text-slate-500">
                    ID: {guestbook.id}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
}
