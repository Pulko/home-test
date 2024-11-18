import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body className="relative min-h-screen bg-gray-50">
        <div className="pb-16">{children}</div>{" "}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md border-t border-gray-200">
          <div className="max-w-lg mx-auto flex justify-around py-3">
            <a
              href="/"
              className="flex flex-col items-center text-gray-500 hover:text-black transition-colors"
            >
              <span className="material-icons text-lg">
                👤
              </span>
              <span className="text-xs font-medium">
                Users
              </span>
            </a>
            <a
              href="/guestbooks"
              className="flex flex-col items-center text-gray-500 hover:text-black transition-colors"
            >
              <span className="material-icons text-lg">
                📝
              </span>
              <span className="text-xs font-medium">
                Guestbooks
              </span>
            </a>
          </div>
        </nav>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
