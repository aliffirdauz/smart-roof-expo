import { Image, StyleSheet, View, Text } from 'react-native'
import React from 'react'

const Atasnya = () => {
    return (
        <View style={styles.container}>
            <Image style={{ width : 27, height : 27}} source={require('../assets/map.png')} />
            <Text style={styles.locname}>Bandung</Text>
            <Image style={{ width : 24, height : 24}} source={require('../assets/Union.png')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        paddingTop: 30,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    locname: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
    }
})

export default Atasnya