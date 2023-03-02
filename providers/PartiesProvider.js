import * as React from 'react';

//Firebase
import { auth, db } from '../firebase/firebase-config';
import { getDocs, getDoc, collectionGroup } from "firebase/firestore";

export const PartiesContext = React.createContext({
    parties: [],
    setParties: () => {}
});

export const PartiesProvider = (props) => {

    const [parties, setParties] = React.useState([])

    const getParties = async () => {

        const querySnapshot = await getDocs(collectionGroup(db, "parties"));

        querySnapshot.forEach( async (doc)  => {

            const docRef = doc.ref.parent.parent;   
            const userSnap = await getDoc(docRef);
            const organizer = userSnap.data();

            const party = {
                ...doc.data(),
                id: doc.id,
                organizer: docRef.id
            }
            setParties(old => [...old, party])
        });
    }
    

    // Listening to changes of device appearance while in run-time
    React.useEffect(() => {
        setParties([]);
        getParties();
    },[]);

    const partiesObject = {
        parties,
        setParties: (data) => {setParties([...data])}
    }


  return (
        <PartiesContext.Provider value={partiesObject}>
            {props.children}
        </PartiesContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useParties = () => React.useContext(PartiesContext);
