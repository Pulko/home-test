import { LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  Link,
} from "@remix-run/react";

export const loader: LoaderFunction =
  async () => {
    const response = await fetch(
      "http://localhost:8000/users"
    );
    if (!response.ok) {
      throw new Error("Failed to load users");
    }
    return response.json();
  };

export default function UserListPage() {
  const users = useLoaderData<
    Array<{
      id: string;
      username: string;
      guestbook_count: string;
    }>
  >();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-baseline">
        <h1 className="text-2xl font-semibold text-gray-900">
          Users
        </h1>
        <Link
          to="/users/new"
          className="mt-6 inline-block px-4 py-2 text-sm font-medium text-white bg-black rounded-lg shadow-sm hover:bg-gray-800"
        >
          Create New User
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {users.map((user) => (
          <li key={user.id}>
            <Link
              to={`/users/${user.id}`}
              className="relative flex flex-col mt-6 bg-white shadow-sm border border-slate-200 rounded-lg"
            >
              <div className="p-4">
                <h5 className="mb-2 text-slate-800 text-xl font-semibold">
                  {user.username}
                </h5>
              </div>
              <div className="mx-3 border-t border-slate-200 pb-3 pt-2 px-1">
                <span className="text-sm text-slate-500">
                  Entries: {user.guestbook_count}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
