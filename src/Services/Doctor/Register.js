import axios from 'axios'

axios.defaults.withCredentials = false;

export const registerDoctor = ( details ) => {
    return axios.post( 'http://localhost:3000/doctor/register', details ,
    {
        headers : {
            'Content-type' : 'application/json'
        }
    })
    .then( response => response.data)
    .catch( error => error.message )
}