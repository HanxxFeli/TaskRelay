// LOGIN SCREEN - Allows existing users to sign in

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { signIn } from '../../config/firebase';

/**
 * Login screen component
 * @param {object} navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Login form UI
 * @description Displays a form where users can:
 *   - Enter their email and password
 *   - Sign in to their account
 *   - Navigate to signup screen if they don't have an account
 */
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Handles the login process
     * @description When user clicks "Login":
     *   1. Calls signIn function from firebase.js
     *   2. If successful, AppNavigator automatically redirects based on user role
     *   3. If error, shows alert with error message
     */
    const handleLogin = async () => {
        try {
          await signIn(email, password); // Attempt to sign in with email and password
        } 
        catch (error) {
          // Show error message if login fails
          Alert.alert('Error', error.message);
        }
    };

    return (
      <View style={styles.container}>
          {/* App Title */}
          <Image 
            source={require('../../img/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" // Don't auto-capitalize emails
          />
          
          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Hide password characters
          />
          
          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          {/* Link to Signup Screen */}
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
      </View>
    );
}

// Styles for this screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20
  },
  logo: {
    width: 200,
    height: 80,
    alignSelf: 'center',
    marginBottom: 40
  }
});