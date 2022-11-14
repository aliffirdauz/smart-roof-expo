import { Image, Switch, StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';

const Condition = ({temp, hum, wind}) => {
    const navigation = useNavigation();

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(false)
        navigation.navigate('Dark')
    };

    return (
        <>
            <Text style={styles.suhu}>{temp ? Math.round(temp.temp) : ""}°C</Text>
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
                    <Image source={require('../assets/humidity.png')} />
                    <Text style={styles.textdetail}>{hum ? hum.humidity : ""}%</Text>
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