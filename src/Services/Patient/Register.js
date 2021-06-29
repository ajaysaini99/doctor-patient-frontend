import axios from 'axios'


export const registerPatient = ( details ) => {
    return axios.post( 'http://localhost:3000/patient/register', details ,
    {
        headers : {
            'Content-type' : 'application/json'
        }
    })
    .then( response => response.data)
    .catch( error => error.message )
}