import {
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import {
  deleteGuestbookEntry,
  fetchGuestbook,
} from "../hooks";
import { Guestbook } from "../types";

export const loader: LoaderFunction = async ({
  params,
}) => {
  if (!params.id) {
    return null;
  }
  return fetchGuestbook(params.id);
};

export const action: ActionFunction = async ({
  params,
}) => {
  if (!params.id) {
    return null;
  }
  deleteGuestbookEntry(params.id);

  return redirect("/guestbooks", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export default function GuestbookDetailsPage() {
  const guestbook =
    useLoaderData<Guestbook | null>();

  if (!guestbook) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-xl">
          Guestbook not found
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto items-center bg-gray-50 min-h-screen py-8 px-4 w-96">
      <div className="p-6 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h1 className="text-xl font-bold text-gray-900">
          Guestbook Entry
        </h1>
        <p className="mt-4 text-gray-800">
          <span className="font-semibold">
            Message:
          </span>{" "}
          {guestbook.message}
        </p>
        <p className="mt-2 text-gray-800">
          <span className="font-semibold">
            Author:
          </span>{" "}
          {guestbook.username}
        </p>
        <div className="flex justify-between items-baseline">
          <a
            href={`/guestbooks/update/${guestbook.id}`}
            className="mt-6 inline-block px-4 py-2 text-sm font-medium text-white bg-black rounded-lg shadow-sm hover:bg-gray-800"
          >
            Update
          </a>
          <Form method="post">
            <input
              type="hidden"
              name="id"
              value={guestbook.id}
            />
            <button
              type="submit"
              aria-label="delete"
              name="_delete"
              className="mt-6 inline-block px-4 py-2 text-sm font-medium bg-red-300 rounded-lg shadow-sm hover:bg-red-800"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
