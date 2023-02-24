import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import styles from './styles/app.css';
import { useState } from 'react';
import Navbar from '~/components/nav';
import { getUserId } from '~/server/session.server';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Airsoft Events',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({ request }: LoaderArgs) {
  return await getUserId(request);
}

export default function App() {
  const hasUserId = !!useLoaderData<typeof loader>();
  const [darkMode, setDarkMode] = useState(true);

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  return (
    <html lang='en' className={`${darkMode ? 'dark' : null}`}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='dark:bg-gray-900 lg:w-1/2 md:w-2/3 mx-auto px-4 md:px-0 dark:text-white'>
        <Navbar
          handleDarkModeToggle={toggleDarkMode}
          darkMode={darkMode}
          hasUserId={hasUserId}
        />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
