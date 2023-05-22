import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

export const AuthContext =  createContext(null)

const auth = getAuth(app)

const AuthProvider = ({children}) => {
        const [user, setUser] = useState(null)
        const [loading, setLoading] = useState(true)
        const googleProvider = new GoogleAuthProvider();

        const createUser = (email,password) => {
                setLoading(true)
                return createUserWithEmailAndPassword(auth,email,password)
        }
        const signIn = (email, password) => {
                setLoading(true)
                return signInWithEmailAndPassword(auth, email, password)
        }
        const logOut = () => {
                setLoading(true)
               return signOut(auth)
        }

         const googleSignIn = () => {
                setLoading(true)
                return signInWithPopup(auth, googleProvider)
         }
         const userUpdate = ( user, name, photo) =>{
                setLoading(true)
                   updateProfile(user, {displayName: name, photoURL:photo})
                  .then( () => {
                        setUser('user update')
                  })
                  .catch(error => {
                        console.log(error.message)
                  })
          }

        useEffect( () => {
                const unsibscribe = onAuthStateChanged(auth, currentUser => {
                            setUser(currentUser);
                            setLoading(false)
                            console.log('current users', currentUser)
                           
                    })
                    return () => {
                            return unsibscribe() ;
                    }
            }, [])


        const authInfo = {
                user,
                loading,
                createUser,
                signIn,
                googleSignIn,
                logOut,
                userUpdate
                 
        }
        return (
                <AuthContext.Provider value={authInfo}>
                        {children}
                </AuthContext.Provider>
        );
};

export default AuthProvider;