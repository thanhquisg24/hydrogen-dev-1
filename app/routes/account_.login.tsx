import {
  callA2eSubmitLogin,
  onA2eSubmitLogin,
} from '~/misc/a2e-login-submit-func';
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  Link,
  useActionData,
  useSubmit,
  type V2_MetaFunction,
} from '@remix-run/react';

type ActionResponse = {
  error: string | null;
};
// export const handle = {
//   scripts: () => [{src: '/custom-a2e-login.js'}],
// };

export const meta: V2_MetaFunction = () => {
  return [{title: 'Login'}];
};

export async function loader({context}: LoaderArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}: ActionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Login() {
  const submit = useSubmit();

  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const pass = form.get('password');
    const isValid = await onA2eSubmitLogin(e);
    function sleep(lf_ms: number) {
      return new Promise((resolve) => setTimeout(resolve, lf_ms));
    }

    // await sleep(2000);
    submit(e.currentTarget);
  };

  return (
    <div className="login">
      <h1>Sign in.</h1>
      <Form
        method="POST"
        id="customer_login"
        // onSubmit={async (e) => {
        //   return onHandleSubmit(e);
        // }}
      >
        <fieldset>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            required
          />
        </fieldset>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        <button type="submit">Sign in</button>
      </Form>
      <br />
      <div>
        <p>
          <Link to="/account/recover">Forgot password →</Link>
        </p>
        <p>
          <Link to="/account/register">Register →</Link>
        </p>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
