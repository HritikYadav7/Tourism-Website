// import axios from 'axios';
// const { showAlert } =  require('./alert');
// import { showAlert } from './alert';

const showAlert = (type, message) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}>${message}</div>`;
    console.log(message);
    document.querySelector('body').insertAdjacentElement('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}


const login = async (email, password) => {
    // console.log(email, password)
    try {
        // console.log(email, password)
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            alert('Logged in succesfully!');
            // showAlert('success', 'Logged in succesfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        console.log(email, password);
        // console.log(res.data);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });
        if(res.data.status = 'success') location.reload(true);      //reload from server not from breowser cache
        console.log(res.data)
    } catch(err) {
        alert('error', 'Error logging out! Try again.')
        // showAlert('error', 'Error logging out! Try again.')
    }
}


const hideAlert = () => {
    const el = document.querySelector('alert');
    if(el) el.parentElement.removeChild(el);
}

const log = document.querySelector('.nav__el--logout')
if(log) {
    log.addEventListener('click', logout);
}

const form =  document.querySelector('.form');
if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        //   console.log(email, password);
        console.log('Login');
        login(email, password);
    });
}


  
