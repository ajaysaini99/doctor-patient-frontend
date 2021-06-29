import axios from 'axios'

export function makeSlotsAvailable ( formDetails ) {
    return axios.post( `http://localhost:3000/doctor/make-slots` , formDetails ,
    {
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    }
    )
    .then( response => response.data )
    .catch( error => error)
}