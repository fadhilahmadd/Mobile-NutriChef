import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import URL from '../hooks/cfg';

const KesehatanScreen = () => {
    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');

    useEffect(() => {
        fetchDiseases();
    }, []);

    const fetchDiseases = async () => {
        try {
            const response = await axios.get(`${URL}/diseases`);
            setDiseases(response.data.diseases);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch diseases');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Kesehatan Screen</Text>
            <Picker
                selectedValue={selectedDisease}
                onValueChange={(itemValue, itemIndex) => setSelectedDisease(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a disease" value="" />
                {diseases.map((disease) => (
                    <Picker.Item key={disease.id} label={disease.name} value={disease.id} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default KesehatanScreen;
