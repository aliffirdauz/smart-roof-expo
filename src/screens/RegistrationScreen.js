import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button, Alert, TouchableOpacity } from 'react-native';

async function register(name, address, email, password) {
    try {
        let response = await fetch('https://smartroof-api.000webhostapp.com/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        });

        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        Alert.alert('Error', 'An error occurred while trying to register');
    }
}

export default function RegistrationScreen({ navigation }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        (async () => {
            let response = await register(name, address, email, password);
            console.log(response);
        }
        )();
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Roof</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <Button title="Register" onPress={() => handleSubmit()} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}
                >
                    <Text
                        style={{ color: 'blue' }}
                    >
                        Already have an account? Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: 300,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});
