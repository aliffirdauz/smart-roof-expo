import { Image, Switch, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Headerr from '../components/Headerr';
import Condition from '../components/Condition';
import Forecast from '../components/Forecast';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'cae2e98bbf36527d96a1d9b6de9da84d';

const city = 'Bandung';

export default function BrightScreen() {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [data, setData] = useState({});
    const [forecast, setForecast] = useState({});
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
    }, [])

    return (
        <>
            <View style={styles.container}>
                <Headerr city={city} />
                <Image style={styles.logo} source={require('../assets/Sun.png')} />
                <Condition temp={data.main} hum={data.main} wind={data.wind} />
                <Forecast date={date} time={time} hour9={forecast[0]} hour12={forecast[1]} hour15={forecast[2]} hour18={forecast[3]} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#29B2DD',
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
})