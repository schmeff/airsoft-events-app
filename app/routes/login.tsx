import {Form} from "@remix-run/react";
import {type ActionArgs, redirect} from "@remix-run/node";
import {login} from '~/utils/session.server'

export async function action({request}: ActionArgs){
   const formData = await request.formData()
   const username = formData.get('username') as string
    const password = formData.get('password') as string

    const response = await login({username, password})
    console.log('response - ', response)
    if(!response){
        return null
    }

    return redirect('/')
}

export default function Login(){
    return (
        <div className='grid place-content-center'>
            <Form method='post' className='flex flex-col gap-3'>
                <input type="text" name='username' maxLength={30} required placeholder='Username' className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
                <input type="password" name='password' maxLength={30} required placeholder='Password' className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
                <button type="submit" name='login' className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600'>Login</button>
            </Form>
        </div>
    )
}