import axios from 'axios'

export const getPatients = () => {
    return axios.get( 'http://localhost:3000/doctor/appointments',
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

export const cancelAppointment = ( details ) => {
    return axios.patch( `http://localhost:3000/doctor/${details.patientId}?id=${details.slotId}`,null,
    {
        headers : {
            'Content-type' :'application/json',
            'Authorization' : localStorage.getItem( 'token' )
        }
    })
    .then( response => response.data )
    .catch( error => error )
}

