import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';

export default function RegistrationScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigation = useNavigation()

    const handleSignUp = () => {
        // if (password !== confirmPassword) {
        //     alert("Passwords don't match.")
        //     return
        // }
        // auth
        //     .createUserWithEmailAndPassword(email, password)
        //     .then(userCredentials => {
        //         const user = userCredentials.user;
        //         console.log('Registered with:', user.email);
        //         alert('Registered!', `Registered with: ${user.email}`);
        //         navigation.navigate('Login');
        //     })
        //     .catch(error => alert(error.message))

        var checkEmail = RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i);

        if ((email.length == 0) || (password.length == 0) || (confirmPassword.length == 0)) {
            alert("Required Field Is Missing!!!");
        } else if (!(checkEmail).test(email)) {
            alert("invalid email!!!");
        }
        // Password validations
        else if (password.length < 8) {
            alert("Minimum 08 characters required!!!");
        } else if (!((/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/).test(password))) {
            alert("Use atleast 01 special character!!!");
        } else if (((/[ ]/).test(password))) {
            alert("Don't include space in password!!!");
        } else if (password !== confirmPassword) {
            alert("Password doesnot match!!!");
        }


        else {
            var InsertAPIURL = "https://6b87-2404-c0-2e10-00-1201-8546.ngrok.io/reactnative-api/signup.php";   //API to render signup

            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            var Data = {
                email: email,
                password: password
            };

            // FETCH func ------------------------------------
            fetch(InsertAPIURL, {
                method: 'POST',
                headers: headers,
                mode: 'no-cors',
                body: JSON.stringify(Data) //convert data to JSON
            })
                .then((response) => response.json()) //check response type of API (CHECK OUTPUT OF DATA IS IN JSON)
                .then((response) => {
                    alert(response[0].Message);       // If data is in JSON => Display alert msg
                    navigation.navigate('Login'); //Navigate to next screen if authentications are valid
                })
                .catch((error) => {
                    alert("Error Occured" + error);
                })
        }
    }

    const handleLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Smart Roof</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>Already have an account? <Text onPress={handleLogin} style={styles.footerLink}>Login</Text></Text>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        borderColor: 'lightgray',
        borderWidth: 1

    },
    buttonContainer: {
        width: '59%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        flexDirection: 'column',
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
    title: {
        fontSize: 48,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000000',
    },
    footerText: {
        marginTop: 20,
        fontSize: 16,
        color: '#000000',
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
})