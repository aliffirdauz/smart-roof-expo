import { Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Header } from '@rneui/base'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';

function Mapicon() {
    return (
        <Image style={{ width: 27, height: 27 }} source={require('../assets/map.png')} />
    );
}

function Unionicon() {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                console.warn('User signed out!');
                navigation.replace('Login');
            })
            .catch(error => alert(error.message))
    }

    return (

        <TouchableOpacity onPress={handleSignOut}>
            <Image style={{ width: 32, height: 32 }} source={require('../assets/logout.png')} />
        </TouchableOpacity>

    );
}

const Headerr = ({city}) => {
    return (
        <Header
            placement="left"
            backgroundColor='#29B2DD'
            leftComponent={<Mapicon />}
            centerComponent={{ text: {city}, style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
            rightComponent={<Unionicon />}
            containerStyle={{ marginHorizontal: 20 }}
        />
    )
}

export default Headerr