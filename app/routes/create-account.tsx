import {Form} from "@remix-run/react";
import {type ActionArgs, redirect} from "@remix-run/node";
import {createAccount} from "~/utils/session.server";

export async function action({request}: ActionArgs){
    const formData = await request.formData()
    const {...values} = Object.fromEntries(formData)

    const username = (values['username'] as string).toLowerCase()
    const password = values['password'] as string
    const verifyPassword = values['verifyPassword'] as string

     await createAccount({username, password, verifyPassword})

    return redirect('/login')
}

export default function CreateAccount(){
    return (
        <div className='grid place-content-center'>
            <Form method='post' className='flex flex-col gap-3'>
                <input type="text" name='username' maxLength={30} required placeholder='Username' className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
                <input type="password" name='password' maxLength={30} required placeholder='Password' className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
                <input type="password" name='verifyPassword' maxLength={30} required placeholder='Verify Password' className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
                <button type="submit" name='create' className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600'>Create</button>
            </Form>
        </div>
    )
}