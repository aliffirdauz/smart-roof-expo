import { Image, TouchableOpacity, Switch, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Header } from '@rneui/base'
import { useNavigation } from '@react-navigation/native';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

export default function BrightScreen() {
    const navigation = useNavigation();

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    useEffect(() => {
        setInterval(() => {
            const time = new Date();
            const month = time.getMonth();
            const date = time.getDate();
            const day = time.getDay();
            const hour = time.getHours();
            const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
            const minutes = time.getMinutes();
            const ampm = hour >= 12 ? 'pm' : 'am'

            setTime((hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ampm)

            setDate(days[day] + ', ' + date + ' ' + months[month])

        }, 1000);
    }, [])

    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => {
        setIsEnabled(true)
        navigation.navigate('Bright')
    };

    return (
        <>
            <View style={styles.container}>
                <Header
                    placement="left"
                    backgroundColor='#0C43AC'
                    leftComponent={<Mapicon />}
                    centerComponent={{ text: 'Bandung', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
                    rightComponent={<Unionicon />}
                    containerStyle={{ marginHorizontal: 20 }}
                />
                <Image style={styles.logo} source={require('../assets/Rain.png')} />
                <Text style={styles.suhu}>30°C</Text>
                <View style={{ flexDirection: 'row', width: 300, 'alignItems': 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Status :</Text>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={styles.details}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/Contour.png')} />
                        <Text style={styles.textdetail}>23%</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/humidity.png')} />
                        <Text style={styles.textdetail}>90%</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/wind.png')} />
                        <Text style={styles.textdetail}>19 km/h</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, backgroundColor: 'rgba(0, 13, 38, 0.3)', borderRadius: 20, padding: 10, width: 300, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
                        <Text style={styles.textdetail}>{date}</Text>
                        <Text style={styles.textdetail}>{time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textdetail}>29°C</Text>
                            <Image source={require('../assets/cloud.png')} />
                            <Text style={styles.textdetail}>15.00</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textdetail}>29°C</Text>
                            <Image source={require('../assets/cloud.png')} />
                            <Text style={styles.textdetail}>15.00</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textdetail}>29°C</Text>
                            <Image source={require('../assets/cloud.png')} />
                            <Text style={styles.textdetail}>15.00</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textdetail}>29°C</Text>
                            <Image source={require('../assets/cloud.png')} />
                            <Text style={styles.textdetail}>15.00</Text>
                        </View>
                    </View>
                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C43AC',
        alignItems: 'center',
        marginTop: 20
    },
    suhu: {
        fontSize: 100,
        color: '#fff',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        backgroundColor: 'rgba(0, 13, 38, 0.3)',
    },
    textdetail: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300,
        marginTop: 20,
        backgroundColor: 'rgba(0, 13, 38, 0.3)',
        borderRadius: 20,
        padding: 10,
    },
    switch: {
        transform: [{ scaleX: 3.0 }, { scaleY: 3.0 }],
        marginTop: 20,
        marginRight: 35,
    },
    logo: {
        width: 250,
        height: 250,
    }
})