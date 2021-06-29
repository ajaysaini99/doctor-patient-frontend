import axios from 'axios'

export const getSlots = () => {
    return axios.get( 'http://localhost:3000/doctor/slots',
    {
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    })
    .then( response => response.data)
    .catch( error => {
        console.log( 'error in getslots for doctor in services', error )
        return error
    })
}

