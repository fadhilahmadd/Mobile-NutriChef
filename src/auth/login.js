import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import URL from '../hooks/cfg';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${URL}/login`, {
                email,
                password,
            });
            const token = response.data.token;
            await AsyncStorage.setItem('token', token);

            const usernameResponse = await axios.get(`${URL}/username/${email}`);
            const username = usernameResponse.data.username;

            await AsyncStorage.setItem('username', username);

            setShowLoginAlert(true);
        } catch (error) {
            Alert.alert('Error', error.response.data.error);
        }
    };

    const goToRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc" // Placeholder text color
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#ccc" // Placeholder text color
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToRegister}>
                <Text style={styles.createAccountText}>Buat akun baru</Text>
            </TouchableOpacity>
            <AwesomeAlert
                show={showLoginAlert}
                showProgress={false}
                title="Berhasil"
                message="Anda berhasil masuk"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#0891b2"
                onConfirmPressed={() => {
                    setShowLoginAlert(false);
                    navigation.navigate('HomeScreenUser');
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 20,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 16, // Adjust font size
        color: '#000', // Input text color
    },
    button: {
        backgroundColor: '#0891b2',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    createAccountText: {
        textAlign: 'center',
        color: '#0891b2',
        marginTop: 10,
    },
});

export default LoginScreen;
