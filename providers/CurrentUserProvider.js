import * as React from 'react';

//Firebase
import { auth, db } from '../firebase/firebase-config';
import { getDoc, doc } from "firebase/firestore";

export const CurrentUserContext = React.createContext({
    currentUser: {
        email: 'none',
        username: 'none',
        avatar: null,
        score: 2.5
    },
    setCurrentUser: () => {}
});

export const CurrentUserProvider = (props) => {

    const [currentUser, setCurrentUser] = React.useState({})

    const getCurrentUser = () => {
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
    

    // Listening to changes of device appearance while in run-time
    React.useEffect(() => {
        if(auth.currentUser){
            getCurrentUser()
        }
    }, [auth.currentUser]);

    const user = {
        currentUser,
        setCurrentUser: setCurrentUser
    }

  return (
        <CurrentUserContext.Provider value={user}>
            {props.children}
        </CurrentUserContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useCurrentUser = () => React.useContext(CurrentUserContext);
