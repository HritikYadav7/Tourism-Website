// import { login } from './login';
// import { displayMap } from './mapbox';
// import '@babel/polyfill';


// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');

// Values


// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
}

displayMap(locations);
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password)
    console.log('Login')
    login(email, password);
  });
}else {
console.log('Login')
}
