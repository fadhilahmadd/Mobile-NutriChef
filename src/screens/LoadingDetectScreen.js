import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect }  from 'react'
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function LoadingDetectScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => navigation.navigate('Upload'), 2700)
    }, [])

    return (
        <View style={styles.container} className="bg-cyan-500">
            <Image
                source={require('../../assets/loadingImg/Deteksi Sayur.gif')} // Ganti dengan path menuju file GIF Anda
                style={styles.gif}
            />
            {/* <Text>LoadingDetectScreen</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gif: {
        width: hp(40),
        height: hp(40),
    },
});