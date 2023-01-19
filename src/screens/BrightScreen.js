import { Dimensions, Image, ScrollView, Switch, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { Header } from '@rneui/base'
import { useNavigation } from '@react-navigation/native';
import Condition from '../components/Condition';
import Forecast from '../components/Forecast';
import Paho from 'paho-mqtt';
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'cae2e98bbf36527d96a1d9b6de9da84d';

const city = 'Bandung';

const clientTemp = new Paho.Client('broker.hivemq.com', 8000, 'clientId-temp');
const clientRds = new Paho.Client('broker.hivemq.com', 8000, 'clientId-rds');

function Mapicon() {
    return (
        <Image style={{ width: 27, height: 27 }} source={require('../assets/map.png')} />
    );
}

async function signOut() {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (error) {
        console.log('Error signing out: ', error);
    }
}

function Unionicon() {
    const navigation = useNavigation();

    const handleSignOut = () => {
        signOut();
        navigation.replace('Login');
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
    const [dataReal, setDataReal] = useState({});
    const [forecast, setForecast] = useState({});
    const [isEnabled, setIsEnabled] = useState();
    const [suhu, setSuhu] = useState(0);
    const [hujan, setHujan] = useState(0);

    useEffect(() => {
        (async () => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
                setData(data);
            });
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
                setForecast(data.list);
            });
            fetch(`https://smartroof-api.000webhostapp.com/show.php`, { method: 'GET', mode: 'no-cors' }).then(res => res.json()).then(data => {
                if (data.length == 0) {
                    console.log('No data');
                } else {
                    setDataReal(data.data);
                }
            });
            firebase.database().ref('sensor/btn/').on('value', function (snapshot) {
                console.log(snapshot.val())
                setIsEnabled(snapshot.val())
            });
        })();
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
        // TEMP
        clientTemp.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('Koneksi Temp ke broker MQTT terputus');
            }
        };

        clientTemp.onMessageArrived = (message) => {
            console.log(`Pesan diterima dari topic ${message.destinationName}: ${message.payloadString}`);
            setSuhu(message.payloadString);
        };

        if (!clientTemp.isConnected()) {
            clientTemp.connect({
                onSuccess: () => {
                    console.log('Temp berhasil terhubung ke broker MQTT');
                    clientTemp.subscribe('iot-dzaki-temp');

                }
            });
        } else {
            console.log('Temp sudah terhubung ke broker MQTT');
            clientTemp.subscribe('iot-dzaki-temp');
        }
        // RDS
        clientRds.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('Koneksi RDS ke broker MQTT terputus');
            }
        };

        clientRds.onMessageArrived = (message) => {
            console.log(`Pesan diterima dari topic ${message.destinationName}: ${message.payloadString}`);
            setHujan(message.payloadString);
        };

        if (!clientRds.isConnected()) {
            clientRds.connect({
                onSuccess: () => {
                    console.log('RDS berhasil terhubung ke broker MQTT');
                    clientRds.subscribe('iot-dzaki-rds');

                }
            });
        } else {
            console.log('RDS sudah terhubung ke broker MQTT');
            clientRds.subscribe('iot-dzaki-rds');
        }

        // if (hujan == 0 && isEnabled == true) {
        //     Alert.alert(
        //         'Warning',
        //         'The rain has stopped, you can open the roof!',
        //         [
        //             {
        //                 text: 'OK'
        //             },
        //         ],
        //         { cancelable: false }

        //     )
        // }
    }, []);

    const toggleDark = (isEnabled) => {
        if (hujan == 1) {
            Alert.alert(
                'Warning',
                'Please wait until the rain stops!',
                [
                    {
                        text: 'OK'
                    },
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'Warning',
                'Are you sure to open the roof?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            setIsEnabled(false);
                            firebase.database().ref('sensor/').update({
                                btn: isEnabled
                            });
                        }
                    },
                ],
                { cancelable: false }
            )
        }
    };

    const toggleBright = (isEnabled) => {
        Alert.alert(
            'Warning',
            'Are you sure to close the roof?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        setIsEnabled(true)
                        firebase.database().ref('sensor/').update({
                            btn: isEnabled
                        });
                    }
                },
            ]
        )
    };

    const TempChart = ({ temp9, temp12, temp15, temp18 }) => {
        var t9 = temp9 ? temp9.temp : 0
        var t12 = temp12 ? temp12.temp : 0
        var t15 = temp15 ? temp15.temp : 0
        var t18 = temp18 ? temp18.temp : 0
        console.log('t9 : ', t9)
        console.log('t12 : ', t12)
        console.log('t15 : ', t15)
        console.log('t18 : ', t18)
        return (
            <>
                <Text style={styles.text}>Temperature Data</Text>
                <BarChart
                    data={{
                        labels: ['09:00', '12:00', '15:00', '18:00'],
                        datasets: [
                            {
                                data: [t9, t12, t15, t18],
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 120}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        padding: 10
                    }}
                />
            </>
        );
    };

    const HumChart = ({ hum9, hum12, hum15, hum18 }) => {
        var h9 = hum9 ? hum9.hum : 0
        var h12 = hum12 ? hum12.hum : 0
        var h15 = hum15 ? hum15.hum : 0
        var h18 = hum18 ? hum18.hum : 0
        console.log('h9 : ', h9)
        console.log('h12 : ', h12)
        console.log('h15 : ', h15)
        console.log('h18 : ', h18)
        return (
            <>
                <Text style={styles.text}>Humidity Data</Text>
                <BarChart
                    data={{
                        labels: ['09:00', '12:00', '15:00', '18:00'],
                        datasets: [
                            {
                                data: [h9, h12, h15, h18],
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 120}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        padding: 10
                    }}
                />
            </>
        );
    };
    return (
        <ScrollView>
            <View style={[styles.container, { backgroundColor: isEnabled ? '#0C43AC' : '#29B2DD' }]}>
                <Header
                    placement="left"
                    backgroundColor={isEnabled ? '#0C43AC' : '#29B2DD'}
                    leftComponent={<Mapicon />}
                    centerComponent={{ text: 'Bandung', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
                    rightComponent={<Unionicon />}
                    containerStyle={{ marginHorizontal: 20 }}
                />
                <View style={styles.icon}>
                    <Image style={styles.logo} source={isEnabled ? require('../assets/Rain.png') : require('../assets/Sun.png')} />
                </View>
                <Text style={styles.suhu}>{suhu ? suhu : ""}°C</Text>
                <View style={{ flexDirection: 'row', width: 300, 'alignItems': 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Status :</Text>
                    <Switch
                        style={styles.switch}
                        trackColor={isEnabled ? { false: "#767577", true: "#81b0ff" } : { false: "#767577", true: "#f5dd4b" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={isEnabled ? toggleDark : toggleBright}
                        value={isEnabled}
                    />
                </View>
                <Condition wind={data.wind} />
                <Forecast date={date} time={time} hour9={forecast[0]} hour12={forecast[1]} hour15={forecast[2]} hour18={forecast[3]} />
                <TempChart temp9={dataReal[3]} temp12={dataReal[2]} temp15={dataReal[1]} temp18={dataReal[0]} />
                <HumChart hum9={dataReal[3]} hum12={dataReal[2]} hum15={dataReal[1]} hum18={dataReal[0]} />
            </View>
        </ScrollView>
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
        width: Dimensions.get('window').width - 16,
        height: 150,
        marginVertical: 40,
    }
})