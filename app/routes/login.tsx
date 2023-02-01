import { Form, NavLink, useActionData } from "@remix-run/react";
import { type ActionArgs } from "@remix-run/node";
import { createUserSession, login } from '~/server/session.server'
import { badRequest } from "~/server/request.server";



export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')

  if (typeof username !== 'string' || typeof password !== 'string') {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { username, password }

  const user = await login({ username, password })
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: 'Username/Password combination is incorrect'
    })
  }

  return createUserSession(user.id, '/')
}

export default function Login() {
  const actionData = useActionData<typeof action>()

  return (
    <div className='grid place-content-center gap-3'>
      <Form method='post' className='flex flex-col gap-3 w-96'>
        <input type="text" name='username' maxLength={30} required placeholder='Username'
          className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder'
        />
        <input type="password" name='password' maxLength={30} required placeholder='Password'
          className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
        {actionData?.formError && <p className='text-red-600 text-sm mx-auto'>{actionData.formError}</p>}
        <button type="submit" name='login'
          className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600'>Login
        </button>
      </Form>
      <NavLink to='/create-account' className='mx-auto'>Create Account</NavLink>
    </div>
  )
}