import {CgMoon, CgSun} from "react-icons/cg";
import {NavLink} from "@remix-run/react";

export default function Navbar({handleDarkModeToggle, darkMode}: any){
    return <nav className='p-2 mb-3'>
        <ul className='flex'>
            <li className='my-auto'>
                <NavLink to='/create-event' className='dark:text-white'>Create Event</NavLink>
            </li>
            <li className='ml-auto'>
                <button className='dark:text-white text-3xl' onClick={() => {handleDarkModeToggle()}}>{darkMode? <CgMoon /> : <CgSun />}</button>
            </li>
        </ul>
    </nav>
}