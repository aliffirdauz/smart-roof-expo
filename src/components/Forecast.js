import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const Forecast = ({ date, time, hour9, hour12, hour15, hour18 }) => {
    if (hour9 && hour9.weather && hour12 && hour12.weather && hour15 && hour15.weather && hour18 && hour18.weather) {
        const img9 = { uri: 'http://openweathermap.org/img/wn/' + hour9.weather[0].icon + '@2x.png' }
        const img12 = { uri: 'http://openweathermap.org/img/wn/' + hour12.weather[0].icon + '@2x.png' }
        const img15 = { uri: 'http://openweathermap.org/img/wn/' + hour15.weather[0].icon + '@2x.png' }
        const img18 = { uri: 'http://openweathermap.org/img/wn/' + hour18.weather[0].icon + '@2x.png' }
        return (
            <View style={{ marginTop: 20, backgroundColor: 'rgba(0, 13, 38, 0.3)', borderRadius: 20, padding: 10, width: Dimensions.get('window').width - 120 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
                    <Text style={styles.textdetail}>{date}</Text>
                    <Text style={styles.textdetail}>{time}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour9 ? Math.round(hour9.main.temp) : ""}°C</Text>
                        <Image source={img9}
                            style={{ width: 55, height: 45 }} />
                        <Text style={styles.textdetail}>09.00</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour12 ? Math.round(hour12.main.temp) : ""}°C</Text>
                        <Image source={img12}
                            style={{ width: 55, height: 45 }} />
                        <Text style={styles.textdetail}>12.00</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour15 ? Math.round(hour15.main.temp) : ""}°C</Text>
                        <Image source={img15}
                            style={{ width: 55, height: 45 }} />
                        <Text style={styles.textdetail}>15.00</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour18 ? Math.round(hour18.main.temp) : ""}°C</Text>
                        <Image source={img18}
                            style={{ width: 55, height: 45 }} />
                        <Text style={styles.textdetail}>18.00</Text>
                    </View>
                </View>
            </View>
        )
    }
    else {
        return (
            <View style={{ marginTop: 20, backgroundColor: 'rgba(0, 13, 38, 0.3)', borderRadius: 20, padding: 10, width: 300, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
                    <Text style={styles.textdetail}>{date}</Text>
                    <Text style={styles.textdetail}>{time}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour9 ? Math.round(hour9.main.temp) : ""}°C</Text>
                        <Image source={require('../assets/cloud.png')} />
                        <Text style={styles.textdetail}>09.00</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour12 ? Math.round(hour12.main.temp) : ""}°C</Text>
                        <Image source={require('../assets/cloud.png')} />
                        <Text style={styles.textdetail}>12.00</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour15 ? Math.round(hour15.main.temp) : ""}°C</Text>
                        <Image source={require('../assets/cloud.png')} />
                        <Text style={styles.textdetail}>15.00</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.textdetail}>{hour18 ? Math.round(hour18.main.temp) : ""}°C</Text>
                        <Image source={require('../assets/cloud.png')} />
                        <Text style={styles.textdetail}>18.00</Text>
                    </View>
                </View>
            </View>
        )
    }

}

export default Forecast

const styles = StyleSheet.create({
    textdetail: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5
    },
})