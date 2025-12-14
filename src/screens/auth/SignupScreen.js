// SIGNUP SCREEN - Allows new users to create an account

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signUp } from '../../config/firebase';

/**
 * Signup screen component
 * @param {object} navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Signup form UI
 * @description Displays a form where new users can:
 *   - Enter their name, email, and password
 *   - Choose their role (client or admin)
 *   - Create a new account
 *   - Navigate to login screen if they already have an account
 */
export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client'); // default to 'client' but can also be 'admin'

    /**
     * Handles the signup process
     * @description When user clicks "Sign Up":
     *   1. Calls signUp function from firebase.js
     *   2. Creates auth account + saves user info to Firestore
     *   3. If successful, AppNavigator automatically redirects based on role
     *   4. If error, shows alert with error message
     */
    const handleSignup = async () => {
        try {
            await signUp(email, password, name, role); // Create new user account using firebase function
        } 
        catch (error) {
            Alert.alert('Error', error.message); // Show error message if signup fails
        }
    };

    return (
        <View style={styles.container}>
          {/* Screen Title */}
          <Text style={styles.title}>Create Account</Text>
          
          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
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

          {/* Role Selection Label */}
          <Text style={styles.label}>I am a:</Text>
          
          {/* Role Selection Buttons */}
          <View style={styles.roleButtons}>
            {/* Client Role Button */}
            <TouchableOpacity
            style={[
                styles.roleButton,
                role === 'client' && styles.roleButtonActive // Highlight if selected
            ]}
            onPress={() => setRole('client')}
            >
            <Text style={styles.roleText}>Client</Text>
            </TouchableOpacity>
            
            {/* Admin Role Button */}
            <TouchableOpacity
            style={[
                styles.roleButton,
                role === 'admin' && styles.roleButtonActive // Highlight if selected
            ]}
            onPress={() => setRole('admin')}
            >
            <Text style={styles.roleText}>Admin</Text>
            </TouchableOpacity>
          </View>
        
          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          
          {/* Link to Login Screen */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600'
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center'
  },
  roleButtonActive: {
    borderColor: '#007AFF', // Blue border when selected
    backgroundColor: '#e3f2ff' // Light blue background when selected
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600'
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
  }
});