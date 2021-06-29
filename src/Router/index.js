import Router from 'vue-router'

import Login from '@/components/Login'
import Register from '@/components/Register'
import DoctorList from '@/components/DoctorList'

import AppointedDoctors from '@/components/AppointedDoctors'
import DoctorSlots from '@/components/DoctorSlots'
import MakeSlots from '@/components/MakeSlots'
import PatientList from '@/components/PatientList'

import PageNotFound from '@/components/PageNotFound'

import store from '../Store'




const router = new Router ( {
    mode : 'history',
    routes : [
        {
            name : 'login',
            path : '/login',
            component : Login,
            meta : { requiresAuth : false}
        },
        {
            name : 'register',
            path : '/register',
            component : Register,
            meta : { requiresAuth : false}

        },
        {
            name : 'doctor',
            path : '/patient/doctors',
            component : DoctorList,
            meta : { requiresAuth : true, authPatient : true, authDoctor : false}
        },
        {
            name : 'appointment',
            path : '/patient/appointments',
            component : AppointedDoctors,
            meta : { requiresAuth : true, authPatient : true, authDoctor : false}
            
        },
        {
            name : 'slot',
            path : '/doctor/my-slots',
            component : DoctorSlots,
            meta : { requiresAuth : true, authPatient : false, authDoctor : true}
            
        },
        {
            name : 'makeSlot',
            path : '/doctor/make-slots',
            component : MakeSlots,
            meta : { requiresAuth : true, authPatient : false, authDoctor : true}
            
        },
        {
            name : 'patient',
            path : '/doctor/appointments',
            component : PatientList,
            meta : { requiresAuth : true, authPatient : false, authDoctor : true}
            
        },
        {
            name : 'pageNotFound',
            path : '*',
            component : PageNotFound,
        }
    ]
} )

router.beforeEach(( to, from, next ) => {
    
    if( to.meta.requiresAuth && !store.getters.isAuthenticated ){
        next( {
            name : 'login'
        });
    } else {

        if( store.getters.isAuthenticated && to.meta.requiresAuth){
            console.log( 'in router part')
            let user = store.state.auth.role;
            console.log( 'store id ', store)
            console.log('user is', user)

            if( to.meta.authDoctor) {
                if( user === 'doctor' ){
                    next( )
                }else{
                    next({
                        name : 'pageNotFound'
                    })
                }
            }
            else if( to.meta.authPatient ) {

                if( user === 'patient' ){
                    next()
                } else{
                    next({
                        name : 'pageNotFound'
                    })
                }
            }

        }  
        else if( !to.meta.requiresAuth && store.getters.isAuthenticated && (to.name === 'login' || to.name === 'register' )) {
            let user = store.state.auth.role;

            if( user === 'patient' ){
                next({ name : 'appointment'})
            } else if(  user === 'doctor'  ){
                next({ name : 'patient'})

            }
        } else {
            next()
        }
    }
})

export default router;