import {CgMoon, CgSun} from "react-icons/cg";
import {Form, NavLink} from "@remix-run/react";

export default function Navbar({handleDarkModeToggle, darkMode, hasUserId}: any) {
    return <nav className='p-2 mb-3'>
        <ul className='flex'>
            {hasUserId && <li className='my-auto'>
                <NavLink to='/create-event' className='dark:text-white'>Create Event</NavLink>
            </li>}
            <div className='ml-auto flex'>
                {!hasUserId ?
                    <li className='my-auto'>
                        <NavLink to='/login' className='dark:text-white'>Login</NavLink>
                    </li>
                    : <li className='my-auto'>
                        <Form method='post' action='/logout'>
                            <button type='submit' name='_action' value='logout'  className='dark:text-white'>Logout</button>
                        </Form>
                    </li>
                }

                <li className='ml-4'>
                    <button className='dark:text-white text-3xl' onClick={() => {
                        handleDarkModeToggle()
                    }}>{darkMode ? <CgMoon/> : <CgSun/>}</button>
                </li>
            </div>

        </ul>
    </nav>
}