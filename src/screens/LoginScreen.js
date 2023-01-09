import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button, Alert, TouchableOpacity } from 'react-native';

async function login(email, password) {
  try {
    let response = await fetch('https://smartroof-api.000webhostapp.com/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });

    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  } catch (error) {
    Alert.alert('Error', 'An error occurred while trying to log in');
  }
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    (async () => {
      let response = await login(email, password);
      console.log(response);
    }
    )();
    navigation.navigate('Bright');
  }

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
      >
        Smart Roof
      </Text>
      <View style={styles.inputContainer}>
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
        <Button title="Log In" onPress={() => handleSubmit()} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Registration')}
          style={styles.button}
        >
          <Text
            style={{ color: 'blue' }}
          >
            Don't have an account? Register here.
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