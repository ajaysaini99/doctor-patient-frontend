import axios from 'axios'

export const bookAppointment = ( details, slotDetails ) =>{
    return axios.post( `http://localhost:3000/patient/${details.doctorId}?id=${ details.slotId}`, slotDetails,
    {
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    })
    .then( response => response.data )
    .catch( error => error)
}

export const cancelAppointment = ( details ) => {
    return axios.patch( `http://localhost:3000/patient/${details.doctorId}?id=${details.slotId}`,null,
    {
        headers : {
            'Content-type' :'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    })
    .then( response => response.data )
    .catch( error => error )
}