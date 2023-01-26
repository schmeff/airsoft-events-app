import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {CgMoon, CgSun} from "react-icons/cg";

import styles from './styles/app.css'
import {useState} from "react";
import Navbar from "~/components/nav";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Airsoft Events",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const[darkMode, setDarkMode] = useState(true)

    function toggleDarkMode(){
      setDarkMode(prev => !prev)
    }

  return (
    <html lang="en" className={`${darkMode? 'dark' : null}`}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='dark:bg-gray-900 lg:w-1/2 md:w-2/3 mx-auto px-4 md:px-0'>
        <Navbar handleDarkModeToggle={toggleDarkMode} darkMode={darkMode} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links(){
  return [{rel: 'stylesheet', href: styles}]
}
