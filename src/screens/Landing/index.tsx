import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, ScrollView, Image, Pressable, Modal, Alert, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const LandingScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{width: wp('100%'), height: hp('100%'), backgroundColor: '#FFFFFF'}}>
            <View style={{ display: 'flex',height: hp('100%'), alignItems: 'center', top: hp('25%')}}>
                {/* <Image
                    style={{ width: wp('100%'), height: hp("20%") }}
                    resizeMode="contain"
                    source={require('../../assets/images/bully.webp')}
                /> */}
                {/* <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: hp('7%'), backgroundColor: 'red'}}></View> */}

                <Image
                    style={{ width: wp('100%'), height: hp("30%") }}
                    resizeMode="contain"
                    source={require('../../assets/images/Student-Engagement.png')}
                />
                <View style={{ marginTop: hp(2) }}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#007AFF', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 8 }}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <View>
                            <Text style={{ color: '#FFF', fontSize: 14 }}>Student Engagement</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        paddingTop: hp(2),
        // justifyContent: 'center'
    }
});

export default LandingScreen;
