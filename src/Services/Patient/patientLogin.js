import axios from 'axios';

const Key_Email = 'email';
const Key_Token = 'token'

export const patientLogin = ( credentials ) => {

    return axios.post( 'http://localhost:3000/patient/login', credentials, 
    {
        headers : {
            'Content-Type' : 'application/json',
        }
    })
    .then( response => response.data )
    .catch( error => {
        console.log( error )
        throw error;
    })
}

export const patientLogout = () =>{
    localStorage.removeItem(Key_Token);
    localStorage.removeItem(Key_Email);
    
}
