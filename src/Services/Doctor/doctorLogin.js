import axios from 'axios';

const Key_Email = 'email';
const Key_Token = 'token'

export const doctorLogin = ( credentials ) => {
  
    return axios.post( 'http://localhost:3000/doctor/login', credentials, 
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


export const doctorLogout = () =>{
    localStorage.removeItem(Key_Token);
    localStorage.removeItem(Key_Email);
    
}
