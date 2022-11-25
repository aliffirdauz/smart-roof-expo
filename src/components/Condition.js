import { Image, Switch, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat';

const Condition = ({ temp, hum, wind }) => {
    const navigation = useNavigation();

    const [suhu, setSuhu] = useState(0);
    const [lembab, setLembab] = useState(0);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleDark = () => {
        setIsEnabled(false)
        // navigation.navigate('Dark')
    };

    const toggleBright = () => {
        setIsEnabled(true)
        // navigation.navigate('Bright')
    };

    useEffect(() => {
        (async () => {
            firebase.database().ref('sensor/dht/').on('value', function (snapshot) {
                console.log(snapshot.val())
                setSuhu(snapshot.val())
            });
            firebase.database().ref('sensor/hum/').on('value', function (snapshot) {
                console.log(snapshot.val())
                setLembab(snapshot.val())
            });
        })();
    }, []);

    return (
        <>
            <Text style={styles.suhu}>{suhu ? Math.round(suhu) : ""}°C</Text>
            <View style={{ flexDirection: 'row', width: 300, 'alignItems': 'center', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Status :</Text>
                {isEnabled ?
                    <Switch
                        style={styles.switch}
                        onChange={() => {
                            bcon = isEnabled
                        }}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleDark}
                        value={isEnabled}
                    />
                    :
                    <Switch
                        style={styles.switch}
                        onChange={() => {
                            bcon = isEnabled
                        }}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleBright}
                        value={isEnabled}
                    />
                }
            </View>
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
        </>
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
})