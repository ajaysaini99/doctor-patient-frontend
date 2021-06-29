import { patientLogin } from '@/Services/Patient/patientLogin'
import { doctorLogin } from '@/Services/Doctor/doctorLogin'
const Key_Token = 'token';
const Key_Email = 'email';
const User_Type = 'user'

const auth = {
    state : {
        token : localStorage.getItem( Key_Token ) || "",
        email : localStorage.getItem( Key_Email ) || "",
        role : localStorage.getItem( User_Type ) || ""

    },

    getters : {
        isAuthenticated( state ) {
            return !!state.token;
        }
    },

    mutations : {
        setToken( state, token ) {
            state.token = token;
        },
        setEmail( state, email ) {
            state.email = email
        },
        setUserType( state, user) {
            state.role = user;
        },
        unsetUserType( state, user ) {
            state.role = user;

        }
    },

    actions : {
        login( { commit }, credentials ) {
            let { email, password, role } = credentials;
            if( role === 'patient' ){
                let patientCredentials= {
                    email : email,
                    password : password
                }
                localStorage.setItem( User_Type, role );
                commit( 'setUserType', role );

                return patientLogin( patientCredentials )
                        .then( data => {
                          
                            const { token, email } = data
                                console.log( data )
                                localStorage.setItem( Key_Token, token );
                                localStorage.setItem( Key_Email, email );

                                commit( 'setToken', token );
                                commit( 'setEmail', email );

                                return email;
                            })
                            .catch( (error) => {
                                localStorage.removeItem( User_Type );
                                commit( 'unsetUserType', "" );

                                console.log('inside vuex')
                                throw error
                            })  
            } else if( role === 'doctor') {
                let doctorCredentials= {
                    email : email,
                    password : password
                }
                localStorage.setItem( User_Type, role );
                commit( 'setUserType', role );

                return doctorLogin( doctorCredentials )
                        .then( data => {
                            const { token, email } = data
                                console.log( data )
                                localStorage.setItem( Key_Token, token );
                                localStorage.setItem( Key_Email, email );

                                commit( 'setToken', token );
                                commit( 'setEmail', email );

                                return email;
                            })
                            .catch( (error) => {
                                localStorage.removeItem( User_Type );
                                commit( 'unsetUserType', "" );

                                console.log('inside vuex')
                            throw error;
                        })  

            }   
        },
        logout( { commit } ){
            localStorage.removeItem( Key_Token );
            localStorage.removeItem( Key_Email );
            localStorage.removeItem( User_Type)
    
            commit( 'setToken', '' );
            commit( 'setEmail', '' );
    
            return Promise.resolve();
        }
    }  
};

export default auth;