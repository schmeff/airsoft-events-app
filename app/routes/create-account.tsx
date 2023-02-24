import { Form, NavLink, useActionData } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/node';
import { createAccount } from '~/server/session.server';
import { badRequest } from '~/server/request.server';

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
}

function comparePasswords(password: unknown, verifyPassword: unknown) {
  if (
    typeof password !== 'string' ||
    typeof verifyPassword !== 'string' ||
    password !== verifyPassword
  ) {
    return 'Passwords must match';
  }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { ...values } = Object.fromEntries(formData);

  const username = values['username'];
  const password = values['password'];
  const verifyPassword = values['verifyPassword'];

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof verifyPassword !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
    verifyPassword: comparePasswords(password, verifyPassword),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const user = await createAccount({ username, password, verifyPassword });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: 'Username is unavailable',
    });
  }

  return redirect('/login');
}

export default function CreateAccount() {
  const actionData = useActionData<typeof action>();

  return (
    <div className='grid place-content-center gap-3'>
      <Form method='post' className='flex flex-col gap-3 w-96'>
        <div className='flex flex-col'>
          <label htmlFor='username dark:text-gray-200'>Username</label>
          <input
            type='text'
            name='username'
            maxLength={30}
            required
            placeholder='Username'
            className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder'
          />
          {actionData?.fieldErrors?.username && (
            <p className='text-red-600 text-sm mx-auto'>
              {actionData?.fieldErrors?.username}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='password' className='dark:text-gray-200'>
            Password
          </label>
          <input
            type='password'
            name='password'
            maxLength={30}
            required
            placeholder='Password'
            className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder'
          />
          {actionData?.fieldErrors?.password && (
            <p className='text-red-600 text-sm mx-auto'>
              {actionData?.fieldErrors?.password}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='verifyPassword'>Verify Password</label>
          <input
            type='password'
            name='verifyPassword'
            maxLength={30}
            required
            placeholder='Verify Password'
            className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder'
          />
          {actionData?.fieldErrors?.verifyPassword && (
            <p className='text-red-600 text-sm mx-auto'>
              {actionData?.fieldErrors?.verifyPassword}
            </p>
          )}
        </div>
        {actionData?.formError && (
          <p className='text-red-600 text-sm mx-auto'>{actionData.formError}</p>
        )}
        <button
          type='submit'
          name='create'
          className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600'
        >
          Create
        </button>
      </Form>
      <NavLink to='/login' className='mx-auto'>
        Back to login
      </NavLink>
    </div>
  );
}
