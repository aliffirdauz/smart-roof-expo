import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat';
import Paho from 'paho-mqtt';

const clientHum = new Paho.Client('broker.hivemq.com', 8000, 'clientId-hum');

const Condition = ({ wind }) => {
    const [lembab, setLembab] = useState(0);
    // useEffect(() => {
    //     (async () => {
    //         firebase.database().ref('sensor/hum/').on('value', function (snapshot) {
    //             setLembab(snapshot.val())
    //         });
    //     })();
    // }, []);

    useEffect(() => {
        (async () => {
            // HUM
            clientHum.onConnectionLost = (responseObject) => {
                if (responseObject.errorCode !== 0) {
                    console.log('Koneksi Hum ke broker MQTT terputus');
                }
            };

            clientHum.onMessageArrived = (message) => {
                console.log(`Pesan diterima dari topic ${message.destinationName}: ${message.payloadString}`);
                setLembab(message.payloadString);
            };

            if (!clientHum.isConnected()) {
                clientHum.connect({
                    onSuccess: () => {
                        console.log('Hum berhasil terhubung ke broker MQTT');
                        clientHum.subscribe('iot-dzaki-humi');

                    }
                });
            } else {
                console.log('Hum sudah terhubung ke broker MQTT');
                clientHum.subscribe('iot-dzaki-humi');
            }
        })();
    }, []);

    return (
        <View style={styles.details}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/humidity.png')} />
                <Text style={styles.textdetail}>{lembab ? lembab : ""}%</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/wind.png')} />
                <Text style={styles.textdetail}>{wind ? wind.speed : ""}m/s</Text>
            </View>
        </View>
    )
}

export default Condition

const styles = StyleSheet.create({
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
        width: Dimensions.get('window').width - 120,
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
})