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
import { collection, setDoc, getDoc, addDoc, doc } from "firebase/firestore"; 

//Storage
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd2e4UPkyUCvts_oKush6gMhqr6RC1yOI",
  authDomain: "brynol-app.firebaseapp.com",
  projectId: "brynol-app",
  storageBucket: "brynol-app.appspot.com",
  messagingSenderId: "472747692296",
  appId: "1:472747692296:web:cfcad86ad9035920bf1cbd"
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
            adduser(userCredential.user.uid, email, username)
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


export async function adduser(uid, email, username){
  try {
    await setDoc(doc(db, "users", uid), {
      username: username,
      email: email,
      avatar: null,
      score: 2.5
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}



export async function addEvent(event){
  try {
    
    const newEventRef = await addDoc(collection(db, "parties"), {
      title: event.title,
      day: event.day,
      month: event.month,
      year: event.year,
      hour: event.hour,
      minutes: event.minutes,
      type: event.type,
      place: event.place,
      maxGuests: event.maxGuests,
      description: event.description,
      latitude: event.latitude,
      longitude: event.longitude,
      organizer_uid: event.organizer_uid,
      organizer_username: event.organizer_username,
      organizer_avatar: event.organizer_avatar,
      organizer_score: event.organizer_score
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  console.log(event.organizer_uid)
}


export async function uploadImage(uid, avatar) {

  const metadata = {
    contentType: 'image/jpeg'
  };

  const response = await fetch(avatar);
  const blob = await response.blob();

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, 'profilePictures/' + uid);
  const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

  // Listen for state changes, errors, and completion of the upload.
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
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
  );
  
}


export async function getURL(uid, avatar) {
  let storageRef = ref(storage, `/profilePictures/${uid}`)
  getDownloadURL(storageRef).then((url) => {
    console.log(url)
    return url;
  })
}

