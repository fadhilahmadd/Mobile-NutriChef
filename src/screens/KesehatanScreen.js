import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import URL from '../hooks/cfg';

const KesehatanScreen = () => {
    const [penyakit, setPenyakit] = useState([]);
    const [selectedPenyakit, setSelectedPenyakit] = useState('');
    const [penyakitUser, setPenyakitUser] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [token, setToken] = useState('');
    const [currentPenyakitIndex, setCurrentPenyakitIndex] = useState(0);

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchPenyakit();
            fetchPenyakitUser();
        }
    }, [token]);

    const fetchToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setToken(token);
                console.log('Token diperoleh:', token);
            } else {
                console.error('Token tidak ditemukan');
                Alert.alert('Error', 'Token tidak ditemukan');
            }
        } catch (error) {
            console.error('Error mengambil token:', error.message);
            Alert.alert('Error', 'Gagal mengambil token');
        }
    };

    const fetchPenyakit = async () => {
        try {
            const response = await axios.get(`${URL}/nama-penyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPenyakit(response.data);
        } catch (error) {
            console.error('Error mengambil data penyakit:', error.message);
            Alert.alert('Error', 'Gagal mengambil data penyakit');
        }
    };

    const fetchPenyakitUser = async () => {
        try {
            const response = await axios.get(`${URL}/user/penyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPenyakitUser(response.data);
        } catch (error) {
            console.error('Error mengambil data penyakit user:', error.message);
            Alert.alert('Error', 'Gagal mengambil data penyakit user');
        }
    };

    const handleSubmit = async () => {
        if (!selectedPenyakit) {
            Alert.alert('Error', 'Silakan pilih penyakit');
            return;
        }

        try {
            const response = await axios.post(
                `${URL}/penyakit_user`,
                { penyakit_id: selectedPenyakit },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                Alert.alert('Sukses', 'Penyakit berhasil dihubungkan dengan user');
                fetchPenyakitUser(); // Refresh daftar penyakit user
            } else {
                Alert.alert('Error', 'Gagal menghubungkan penyakit dengan user');
            }
        } catch (error) {
            console.error('Error menghubungkan penyakit dengan user:', error.message);
            Alert.alert('Error', 'Gagal menghubungkan penyakit dengan user');
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleMonthChange = (date) => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    };

    const getRecipesForSelectedDate = () => {
        if (!selectedDate || penyakitUser.length === 0) {
            return [];
        }

        const dataPenyakit = penyakitUser[currentPenyakitIndex].data; // Menggunakan data penyakit sesuai index saat ini
        const dayIndex = Math.floor((selectedDate - new Date(selectedDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

        const mealTimes = ['Pagi     ', 'Siang  ', 'Malam'];
        return mealTimes.map((time, index) => {
            const recipeIndex = (dayIndex + index) % dataPenyakit.length;
            return { ...dataPenyakit[recipeIndex], time };
        });
    };

    const recipes = getRecipesForSelectedDate();

    const monthsIndonesian = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const weekdaysIndonesian = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const customDayHeaderStylesCallback = ({ dayOfWeek }) => {
        return {
            style: {
                backgroundColor: '#fff',
            },
            textStyle: {
                color: '#000',
                fontWeight: 'bold',
            }
        };
    };

    const handleNextPenyakit = () => {
        setCurrentPenyakitIndex((currentPenyakitIndex + 1) % penyakitUser.length);
    };

    const handlePreviousPenyakit = () => {
        setCurrentPenyakitIndex((currentPenyakitIndex - 1 + penyakitUser.length) % penyakitUser.length);
    };

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedPenyakit}
                onValueChange={(itemValue) => setSelectedPenyakit(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Pilih penyakit" value="" />
                {penyakit.map((disease) => (
                    <Picker.Item key={disease.id} label={disease.nama} value={disease.id} />
                ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Penyakit</Text>
            </TouchableOpacity>
            {penyakitUser.length > 0 && (
                <>
                    <View style={styles.penyakitNavigator}>
                        <TouchableOpacity onPress={handlePreviousPenyakit}>
                            <Text style={styles.navigatorText}>{"<"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.currentPenyakitText}>
                            {penyakitUser[currentPenyakitIndex].nama}
                        </Text>
                        <TouchableOpacity onPress={handleNextPenyakit}>
                            <Text style={styles.navigatorText}>{">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <CalendarPicker
                        onDateChange={handleDateChange}
                        onMonthChange={handleMonthChange}
                        months={monthsIndonesian}
                        weekdays={weekdaysIndonesian}
                        previousTitle="Sebelumnya"
                        nextTitle="Berikutnya"
                        selectedDayColor="#0891b2"
                        customDayHeaderStyles={customDayHeaderStylesCallback}
                    />
                    {selectedDate && (
                        <View style={styles.recipeContainer}>
                            <FlatList
                                data={recipes}
                                keyExtractor={(item) => item.idMeal.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.recipeItem}>
                                        <Text style={styles.timeText}>{item.time}</Text>
                                        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
                                        <Text style={styles.recipeText}>{item.strMeal}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </>
            )}
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
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0891b2',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    monthHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    penyakitNavigator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    navigatorText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0891b2',
    },
    currentPenyakitText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    recipeContainer: {
        marginTop: 20,
    },
    recipeHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    recipeImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    recipeText: {
        fontSize: 16,
    },
});

export default KesehatanScreen;
