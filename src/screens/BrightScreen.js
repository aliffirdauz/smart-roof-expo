import { Image, Switch, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat';
import { auth } from '../firebase';
import { Header } from '@rneui/base'
import { useNavigation } from '@react-navigation/native';
import Condition from '../components/Condition';
import Forecast from '../components/Forecast';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'cae2e98bbf36527d96a1d9b6de9da84d';

const city = 'Bandung';

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

export default function BrightScreen() {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [data, setData] = useState({});
    const [forecast, setForecast] = useState({});
    const [isEnabled, setIsEnabled] = useState();
    const [suhu, setSuhu] = useState(0);

    useEffect(() => {
        (async () => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
                setData(data);
            });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
                setForecast(data.list);
            });
        })();
    }, []);

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
    }, []);

    const toggleDark = () => {
        setIsEnabled(false)
    };

    const toggleBright = () => {
        setIsEnabled(true)
    };

    useEffect(() => {
        (async () => {
            firebase.database().ref('sensor/dht/').on('value', function (snapshot) {
                console.log(snapshot.val())
                setSuhu(snapshot.val())
            });
        })();
    }, []);

    return (
        <>
            {isEnabled ? (
                <View style={[styles.container, { backgroundColor: '#0C43AC' }]}>
                    <Header
                        placement="left"
                        backgroundColor='#0C43AC'
                        leftComponent={<Mapicon />}
                        centerComponent={{ text: 'Bandung', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
                        rightComponent={<Unionicon />}
                        containerStyle={{ marginHorizontal: 20 }}
                    />
                    <View style={styles.icon}>
                        <Image style={styles.logo} source={require('../assets/Rain.png')} />
                    </View>
                    <Text style={styles.suhu}>{suhu ? Math.round(suhu) : ""}°C</Text>
                    <View style={{ flexDirection: 'row', width: 300, 'alignItems': 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Status :</Text>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleDark}
                            value={isEnabled}
                        />
                    </View>
                    <Condition wind={data.wind} />
                    <Forecast date={date} time={time} hour9={forecast[0]} hour12={forecast[1]} hour15={forecast[2]} hour18={forecast[3]} />
                </View>
            ) : (
                <View style={[styles.container, { backgroundColor: '#29B2DD' }]}>
                    <Header
                        placement="left"
                        backgroundColor='#29B2DD'
                        leftComponent={<Mapicon />}
                        centerComponent={{ text: 'Bandung', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
                        rightComponent={<Unionicon />}
                        containerStyle={{ marginHorizontal: 20 }}
                    />
                    <View style={styles.icon}>
                        <Image style={styles.logo} source={require('../assets/Sun.png')} />
                    </View>
                    <Text style={styles.suhu}>{suhu ? Math.round(suhu) : ""}°C</Text>
                    <View style={{ flexDirection: 'row', width: 300, 'alignItems': 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Status :</Text>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleBright}
                            value={isEnabled}
                        />
                    </View>
                    <Condition wind={data.wind} />
                    <Forecast date={date} time={time} hour9={forecast[0]} hour12={forecast[1]} hour15={forecast[2]} hour18={forecast[3]} />
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginLeft: 5
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 150,
        height: 150,
        marginVertical: 40,
    }
})