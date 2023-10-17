async function postVerifyA2eCustomerData(data={}) {
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
    const result = await response.json();
    if (response.ok) {
      console.log('Success:', result);
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}


async function callA2eSubmitLogin(email, password) {
  alert('hello a2e login!!!');
  const data = {email, password};
  try {
    const is_verify = await postVerifyA2eCustomerData(data);
    return is_verify;
  } catch (err) {
    alert(err.message);
  }
  return false;
}

function onSubmitLogin(form) {
  alert('hello a2e login');
  const formData = new FormData(e.currentTarget);
  const email = formData.get('email');
  const pass = formData.get('password');
  const isVerify= await callA2eSubmitLogin(email, pass);
  if (form !== undefined &&isVerify) {
      form.submit();
  }
  return false;
}

function getLoaderStyles() {
  return `
  #loader {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background: #FFF;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center; 
  }

    @-webkit-keyframes spinner-border {
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg); } }
    
    @keyframes spinner-border {
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg); } }
    .spinner-border  {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      vertical-align: text-bottom;
      border: 0.25em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      -webkit-animation: spinner-border 1s linear infinite;
      animation: spinner-border 1s linear infinite; }
    }`;
}
function addLoaderStyles() {
  const loaderStyles = document.createElement('style');
  loaderStyles.id = 'a2e-loader-style';
  loaderStyles.innerHTML = getLoaderStyles();
  document.head.appendChild(loaderStyles);

  const divLoader = document.createElement('div');
  divLoader.id = 'loader';
  divLoader.style = 'display:none';
  const divSpin = document.createElement('div');
  divSpin.className = 'spinner-border';
  divLoader.appendChild(divSpin);
  const body = document.querySelector('body');
  body.appendChild(divLoader);
}
window.onload = function () {
  addLoaderStyles();
};

function startPageLoader() {
  const divLoader = document.getElementById('loader');
  divLoader.style = 'display:flex';
}
function stopPageLoader() {
  const divLoader = document.getElementById('loader');
  divLoader.style = 'display:none';
}
