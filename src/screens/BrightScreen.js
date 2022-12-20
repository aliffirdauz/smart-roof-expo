import { Dimensions, Image, ScrollView, Switch, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat';
import { auth } from '../firebase';
import { Header } from '@rneui/base'
import { useNavigation } from '@react-navigation/native';
import Condition from '../components/Condition';
import Forecast from '../components/Forecast';
import Paho from 'paho-mqtt';
import {
    BarChart,
    PieChart
} from "react-native-chart-kit";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'cae2e98bbf36527d96a1d9b6de9da84d';

const city = 'Bandung';

const clientTemp = new Paho.Client('broker.hivemq.com', 8000, 'clientId-temp');
const clientRds = new Paho.Client('broker.hivemq.com', 8000, 'clientId-rds');
const clientBtn = new Paho.Client('broker.hivemq.com', 8000, 'clientId-btn');

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
    const [dataReal, setDataReal] = useState({});
    const [forecast, setForecast] = useState({});
    const [isEnabled, setIsEnabled] = useState();
    const [suhu, setSuhu] = useState(0);
    const [isHujan, setIsHujan] = useState();

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
        (async () => {
            fetch(`https://4043-103-104-130-10.ngrok.io/smartroof-api/data/show.php`, { method: 'GET', mode: 'no-cors' }).then(res => res.json()).then(data => {
                if (data.length == 0) {
                    console.log('No data');
                } else {
                    setDataReal(data.data);
                }
            });
        })();
    }, []);

    // useEffect(() => {
    //     (async () => {
    //         firebase.database().ref('sensor/btn/').on('value', function (snapshot) {
    //             setIsEnabled(snapshot.val())
    //         });
    //         firebase.database().ref('sensor/isHujan/').on('value', function (snapshot) {
    //             setIsHujan(snapshot.val())
    //         });
    //     })();
    // }, []);

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

    const toggleDark = (btn = isEnabled) => {
        setIsEnabled(false)
        // firebase.database().ref('sensor/').update({
        //     btn,
        // });

        // Btn
        const message = new Paho.Message('false');

        clientBtn.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('Koneksi Button ke broker MQTT terputus');
            }
        };

        if (!clientBtn.isConnected()) {
            clientBtn.connect({
                onSuccess: () => {
                    console.log('Button berhasil terhubung ke broker MQTT');
                    message.destinationName = 'iot-dzaki-button';
                    clientBtn.send(message);
                }
            });
        } else {
            console.log('Button sudah terhubung ke broker MQTT');
            message.destinationName = 'iot-dzaki-button';
            clientBtn.send(message);
        }
    };

    const toggleBright = (btn = isEnabled) => {
        setIsEnabled(true)
        // firebase.database().ref('sensor/').update({
        //     btn,
        // });
        // Btn
        const message = new Paho.Message('true');

        clientBtn.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('Koneksi Button ke broker MQTT terputus');
            }
        };

        if (!clientBtn.isConnected()) {
            clientBtn.connect({
                onSuccess: () => {
                    console.log('Button berhasil terhubung ke broker MQTT');
                    message.destinationName = 'iot-dzaki-button';
                    clientBtn.send(message);
                }
            });
        } else {
            console.log('Button sudah terhubung ke broker MQTT');
            message.destinationName = 'iot-dzaki-button';
            clientBtn.send(message);
        }
    };

    // useEffect(() => {
    //     (async () => {
    //         firebase.database().ref('sensor/dht/').on('value', function (snapshot) {
    //             setSuhu(snapshot.val())
    //         });
    //     })();
    // }, []);

    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    useEffect(() => {
        (async () => {
            // RDS
            clientRds.onConnectionLost = (responseObject) => {
                if (responseObject.errorCode !== 0) {
                    console.log('Koneksi RDS ke broker MQTT terputus');
                }
            };

            clientRds.onMessageArrived = (message) => {
                console.log(`Pesan diterima dari topic ${message.destinationName}: ${message.payloadString}`);
                setIsHujan(message.payloadString);
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
        })();
    }, []);

    const MyBarChart = ({ temp9, temp12, temp15, temp18 }) => {
        var t9 = temp9 ? temp9.temp : 0
        var t12 = temp12 ? temp12.temp : 0
        var t15 = temp15 ? temp15.temp : 0
        var t18 = temp18 ? temp18.temp : 0
        console.log(t9)
        console.log(t12)
        console.log(t15)
        console.log(t18)
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

    const MyPieChart = () => {
        return (
            <>
                <Text style={styles.text}>Rain Count</Text>
                <PieChart
                    data={[
                        {
                            name: 'Rainy Day',
                            population: 6,
                            color: '#472183',
                            legendFontColor: '#fff',
                            legendFontSize: 15,
                        },
                        {
                            name: 'Sunny Day',
                            population: 3,
                            color: '#4B56D2',
                            legendFontColor: '#fff',
                            legendFontSize: 15,
                        },
                    ]}
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
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute //for the absolute number remove if you want percentage
                />
            </>
        );
    };

    return (
        <>
            {isEnabled ? (
                <ScrollView>
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
                        <Text style={styles.suhu}>{suhu ? suhu : ""}°C</Text>
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
                        <MyBarChart temp9={dataReal[0]} temp12={dataReal[1]} temp15={dataReal[2]} temp18={dataReal[3]} />
                        <MyPieChart />
                    </View>
                </ScrollView>
            ) : (
                <ScrollView>
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
                        <Text style={styles.suhu}>{suhu ? suhu : ""}°C</Text>
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
                        <MyBarChart temp9={dataReal[0]} temp12={dataReal[1]} temp15={dataReal[2]} temp18={dataReal[3]} />
                        <MyPieChart />
                    </View>
                </ScrollView>
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
        width: Dimensions.get('window').width - 16,
        height: 150,
        marginVertical: 40,
    }
})