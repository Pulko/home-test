import { LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  Link,
} from "@remix-run/react";
import { fetchGuestbooks } from "../hooks";
import { Guestbook } from "../types";

export const loader: LoaderFunction =
  fetchGuestbooks;

export default function GuestbooksPage() {
  const guestbooks =
    useLoaderData<Array<Guestbook>>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-baseline">
        <h1 className="text-2xl font-semibold text-gray-900">
          Guestbooks
        </h1>
        <Link
          to="/guestbooks/new"
          className="mt-6 inline-block px-4 py-2 text-sm font-medium text-white bg-black rounded-lg shadow-sm hover:bg-gray-800"
        >
          Create New Guestbook
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {guestbooks.map((guestbook) => (
          <li key={guestbook.id}>
            <Link
              to={`/guestbooks/${guestbook.id}`}
              className="relative flex flex-col mt-6 bg-white shadow-sm border border-slate-200 rounded-lg"
            >
              <div className="p-4">
                <h5 className="mb-2 text-slate-800 text-xl font-semibold">
                  {guestbook.username}
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
