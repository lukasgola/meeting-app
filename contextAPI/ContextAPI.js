
import React, { useState, useEffect } from "react";

import { db, auth } from "../firebase/firebase-config";

import { getDoc, doc } from "firebase/firestore"; 

const PracticeContext = React.createContext();

const PracticeProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState()

    const getCurrentUser = async () => {
        getDoc(doc(db, "users", auth.currentUser.uid))
        .then(docSnap => {
        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            const user = {
                ...docSnap.data()
            }
            setCurrentUser(user)
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
        })
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    //console.log(JSON.stringify(currentUser));
    

    return(
        <PracticeContext.Provider value={{currentUser, setCurrentUser}}>
            {children}
        </PracticeContext.Provider>
    )
}

export { PracticeContext, PracticeProvider }