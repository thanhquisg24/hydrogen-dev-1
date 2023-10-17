// function postVerifyA2eCustomerData(data: any = {}): Promise<boolean> {
//   // Default options are marked with *
//   return new Promise((resolve, reject) => {
//     const url = 'http://192.168.2.15:8081/api/a2e-shopify/v1/customer/verify';
//     fetch(url, {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//       body: JSON.stringify(data), // body data type must match "Content-Type" header
//     })
//       .then(function (response) {
//         console.log(
//           '🚀 ~ file: a2e-login-submit-func.ts:15 ~ returnnewPromise ~ response:',
//           response,
//         );
//         console.log(response.body);
//         console.log(
//           '🚀 ~ file: a2e-login-submit-func.ts:18 ~ returnnewPromise ~ response.body:',
//           response.body,
//         );
//         console.log(response.json());
//         if (response.errors) {
//           console.error(response.errors);
//         }
//         // if (response.status >= 400) {
//         //   reject('Bad response from server');
//         // }
//         if (response.ok) {
//           resolve(true);
//         }
//       })
//       // here's the way to access the error message
//       .catch(function (error) {
//         console.log(error.response.data.message);
//         reject(error.response.data.message);
//       });
//   });
// }
async function postVerifyA2eCustomerData(data: any = {}): Promise<boolean> {
  // Default options are marked with *
  try {
    const url = 'http://192.168.2.15:8081/api/a2e-shopify/v1/customer/verify';
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const result: any = await response.json();
    if (response.ok) {
      console.log('Success:', result);
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function callA2eSubmitLogin(email: any, password: any) {
  alert('hello a2e login!!!');
  const data = {email, password};
  try {
    const is_verify = await postVerifyA2eCustomerData(data);
    return is_verify;
  } catch (err: any) {
    alert(err.message);
  }
  return false;
}

export async function onA2eSubmitLogin(e: React.FormEvent<HTMLFormElement>) {
  const form = new FormData(e.currentTarget);
  const email = form.get('email');
  const pass = form.get('password');
  return callA2eSubmitLogin(email, pass);
}
