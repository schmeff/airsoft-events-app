import {CgMoon, CgSun} from "react-icons/cg";
import {NavLink} from "@remix-run/react";

export default function Navbar({handleDarkModeToggle, darkMode, hasUserId}: any) {
    return <nav className='p-2 mb-3'>
        <ul className='flex'>
            {hasUserId && <li className='my-auto'>
                <NavLink to='/create-event' className='dark:text-white'>Create Event</NavLink>
            </li>}
            {!hasUserId ?
                <li className='my-auto ml-auto'>
                    <NavLink to='/login' className='dark:text-white'>Login</NavLink>
                </li>
                : <li className='my-auto ml-auto'>
                    <button type='button' className='dark:text-white'>Logout</button>
                </li>
            }

            <li className='ml-auto'>
                <button className='dark:text-white text-3xl' onClick={() => {
                    handleDarkModeToggle()
                }}>{darkMode ? <CgMoon/> : <CgSun/>}</button>
            </li>
        </ul>
    </nav>
}