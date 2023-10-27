import React, {useEffect, useState} from 'react';
import {View, Dimensions, FlatList} from 'react-native';

//Providers
import { useTheme } from '../theme/ThemeProvider';
import { useCurrentUser } from '../providers/CurrentUserProvider'
import { useCurrentLocation } from '../providers/CurrentLocationProvider';
import { useIsFocused } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';

import FlatListItem from '../components/FlatListItem';


//Firebase
import { auth, db } from '../firebase/firebase-config'
import { getDocs, collectionGroup, collection, doc, getDoc } from "firebase/firestore";

export default function Search({navigation}){


    const height = Dimensions.get('window').height;

    const {colors} = useTheme();
    const {currentUser} = useCurrentUser()
    const { currentLocation } = useCurrentLocation()
    const { isFocused } = useIsFocused()
 
    const [ liked, setLiked ] = useState([]);


    const getLiked = async () => {

        const collectionRef = collectionGroup(db, "liked");
        const querySnapshot = await getDocs(collectionRef);

        const tempIDs = [];

        const temp = [];

        querySnapshot.forEach((doc) => { 

            tempIDs.push({
                ...doc.data(),
                id: doc.id,
            })
        });
        
        await Promise.all(tempIDs.map(async (document) => {
            const docRef = doc(db, `users/${auth.currentUser.uid}/parties`, document.partyID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                temp.push({
                    ...docSnap.data(),
                    id: docSnap.id,
                    organizer: docSnap.ref.parent.parent.id
                })
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }
        }));

        setLiked(temp)
    }


    React.useEffect(() => {
        const unsubscribe = navigation.getParent().addListener('tabPress', (e) => {
            getLiked()
          });
          return unsubscribe;
    }, [navigation])
    

    return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background,
            }}>
 

            <FlatList
                data={liked}
                renderItem={({item}) => <FlatListItem item={item} location={currentLocation} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{marginTop: 10}}>

                    </View>
                }
                ListEmptyComponent={
                    <View
                        style={{
                            paddingTop: height/3,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CustomText>No events yet</CustomText>
                    </View>
                }
            />
                
            </View>
    );
}
