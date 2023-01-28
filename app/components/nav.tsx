import {CgMoon, CgSun} from "react-icons/cg";
import {Form, NavLink} from "@remix-run/react";

export default function Navbar({handleDarkModeToggle, darkMode, hasUserId}: any) {
    return <nav className='mb-3'>
        <ul className='flex gap-4'>
            <li className='my-auto'>
                <NavLink to='/'>Events</NavLink>
            </li>
            {hasUserId && <li className='my-auto'>
                <NavLink to='/create-event'>Create Event</NavLink>
            </li>}
            <div className='ml-auto flex'>
                {!hasUserId ?
                    <li className='my-auto'>
                        <NavLink to='/login'>Login</NavLink>
                    </li>
                    : <li className='my-auto'>
                        <Form method='post' action='/logout'>
                            <button type='submit' name='_action' value='logout'>Logout</button>
                        </Form>
                    </li>
                }

                <li className='ml-4'>
                    <button className='text-3xl' onClick={() => {
                        handleDarkModeToggle()
                    }}>{darkMode ? <CgMoon/> : <CgSun/>}</button>
                </li>
            </div>

        </ul>
    </nav>
}