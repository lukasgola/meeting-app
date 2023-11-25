// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

//Authentication
import { 
  getAuth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";


//Firestore
import { getFirestore } from "firebase/firestore";
import { collection, setDoc, getDoc, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"; 

//Storage
import { getStorage, ref, getDownloadURL, uploadBytes, uploadBytesResumable, } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);


export const storage = getStorage(app);



export async function signInWithEmail (email, password){
  return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
}


export async function createUserWithEmail (username, email, password){
  return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            verifyEmail();
            adduser(userCredential.user.uid, email, username, null)
        })
        .catch((error) => {
            console.log('error: ', error.message)
            // ..
        });
    
}


export async function forgotPassword(email){
  return sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
}    


async function verifyEmail(){

  return sendEmailVerification(auth.currentUser)
  .then(function() {
    // Verification email sent.
  })
  .catch(function(error) {
    // Error occurred. Inspect error.code.
  });
}


export async function adduser(uid, email, username, avatar){
  try {
    await setDoc(doc(db, "users", uid), {
      username: username,
      email: email,
      avatar: avatar,
      score: 2.5
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function updateAvatar(uid, avatar){
  try {
    // Set the "capital" field of the city 'DC'
    await updateDoc(doc(db, "users", uid), {
      avatar: avatar
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}



export async function addEvent(event){
  try {
    await addDoc(collection(db, `users/${auth.currentUser.uid}/parties`), {
      title: event.title,
      day: event.day,
      month: event.month,
      year: event.year,
      time_hour: event.time_hour,
      time_minute: event.time_minute,
      type: event.type,
      place: event.place,
      actGuests: event.actGuests,
      maxGuests: event.maxGuests,
      description: event.description,
      latitude: event.latitude,
      longitude: event.longitude,
      likes: event.likes,
      category: event.category
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function setLikeParty(id, organizer, likes, mode){
  if(mode == "add") {
    try {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/liked`, id), {
        partyID: id
      })

      await updateDoc(doc(db, `users/${organizer}/parties`, id), {
        likes: likes
      });
    
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/liked`, id), {
        partyID: id
      })

      await updateDoc(doc(db, `users/${organizer}/parties`, id), {
        likes: likes
      });
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  
}

export async function addQuickAction(event){
  try {
    await addDoc(collection(db, `users/${auth.currentUser.uid}/quickActions`), {
      image: event.image,
      desc: event.desc,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function uploadImage(uid, avatar, type) {

  const metadata = {
    contentType: 'image/jpeg'
  };

  
  const response = await fetch(avatar);
  const blob = await response.blob();

  const directory = type == 'quickActions' ? 'quickActions/' : 'profilePictures/';

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, directory + uid);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
        default:
          console.log(snapshot.state)
          break;
      }
    }, 
    (error) => {
      // Handle errors and log them
      reject(error)
    },
    async () => {
      // Upload completed successfully, now we can get the download URL

      
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
      resolve({
        downloadURL,
        metadata: uploadTask.snapshot.metadata
      })
    }
  );
  })
}
