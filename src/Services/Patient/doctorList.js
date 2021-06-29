import axios from 'axios'

export const allDoctors = () => {
    return axios.get( 'http://localhost:3000/patient/doctors',
     {
         headers : {
             'Content-Type' : 'application/json',
             'Authorization' : localStorage.getItem( 'token' )
         }
     }
     )
     .then( response => response.data )
     .catch( error => console.log( 'error is here ',error ))
}

export const getSlots = ( doctorId ) => {
    return axios.get( `http://localhost:3000/patient/${ doctorId }`,
    {
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    })
    .then( response => response.data )
    .catch( error => {
        console.log( 'error in getiing slots Services', error)
        return error;
    })
}

export const appointedDoctors = (  ) => {
    return axios.get( 'http://localhost:3000/patient/appointments', {
        headers : {
            'Content-type' : 'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    })
    .then( response => response.data )
}