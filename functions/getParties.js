import { db } from '../firebase/firebase-config'
import { getDocs, collectionGroup, query, where, get } from "firebase/firestore";

async function getParties (category) {

    const collectionRef = collectionGroup(db, "parties");
    let q = query(collectionRef);
    if (category != 'all'){
        q = query(collectionRef, where("category", "==", category));
    }
    
    const querySnapshot = await getDocs(q);

    const temp = [];
    
    querySnapshot.forEach((doc) => { 
        console.log("partyID: " + doc.id)
        const getLikes = async () => {
            const likesRef = collectionGroup(db, "liked");
            q = query(likesRef, where("partyID", "==", doc.id));
            const querySnap = await getDocs(collectionRef);
            querySnap.forEach((like) => {
                console.log(like.data())
            })
        }
        
        getLikes()

        temp.push({
            ...doc.data(),
            id: doc.id,
            organizer: doc.ref.parent.parent.id
        })
    });

    return temp
}

export {getParties}