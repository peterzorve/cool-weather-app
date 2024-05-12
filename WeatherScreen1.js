// https://www.youtube.com/watch?v=953vyZMO4cM&t=301s
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Dimensions, KeyboardAvoidingView, TextInput, Button, SafeAreaView, ImageBackground, TouchableOpacity  } from 'react-native'
// import React, { useLayoutEffect, useState  } from "react"; 
import React, { useLayoutEffect, useCallback, useEffect, useState } from 'react'
import {useNavigation} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {debounce} from "lodash"

import { fetchLocations, fetchWeatherForcast } from './weather';
import { weatherImages } from '../../../constants/iconsWeather';

const WeatherScreen1 = ( { route } ) => { 

    const {height} =  useWindowDimensions()
    const _height = Math.floor( height / 5)

    const [showSearch, setShowSearch] = useState(false) 
    const [locations, setLocations] = useState([])
    const [weather, setWeather] = useState({})
    const [current, setCurrent] = useState({})
    const [location, setLocation] = useState({})


    


    const handleLocation = ( loc ) => {
        setLocations([]);
        setShowSearch(false);
        fetchWeatherForcast({
            cityName: loc?.name, 
            days: "7",
        }).then( data => {
            setWeather(data)
            setCurrent(data?.current)
            setLocation(data?.location)
        })
    }

    const handleSearch = (value) => {
        if (value?.length > 2) {
            fetchLocations({cityName: value}).then(data => {
                console.log("got locations", data)
                setLocations(data)
            })

        }
    }

    useEffect(() => {
        fetchMyWeatherData();
    }, []); 

    const fetchMyWeatherData = async () => {
        fetchWeatherForcast({
            cityName: "Accra", 
            days: "7",
        }).then( data => {
            setWeather(data)
            setCurrent(data?.current)
            setLocation(data?.location)
        })
    }

    const handleTestDebounce = useCallback(debounce(handleSearch, 1200), [])



    return ( 
        <ImageBackground blurRadius={70} source={require('../../../assets/background/background1.jpg')} style={{ flex: 1, resizeMode: 'cover' }} >
            <View style={{  }}>
                <StatusBar style='dark'/>
                <ScrollView showsVerticalScrollIndicator={false} style={{}} >

                    <View style={{ marginTop: 10, flex: 1, backgroundColor: showSearch ? "rgba(255,255,255,0.2)" : null, width: "70%", alignSelf: "center", borderRadius: 40, flexDirection: "row", alignItems: 'center', justifyContent: showSearch ? 'space-between' : "flex-end"}}> 
                        {showSearch && (
                            <View style={{ flexGrow: 1,  marginRight: 10, }}> 
                                <TextInput 
                                    onChangeText={handleTestDebounce} placeholder='Search city' style={{padding: 8, paddingLeft: 20, color: "white", fontFamily: "Kanit-Regular", fontSize: 14, }}/> 
                            </View>
                        )}
                        <TouchableOpacity style={{ justifyContent: "flex-end",  margin: 2, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 40, justifyContent: 'center', alignItems: 'center', width: 40, height: 40, }} onPress={() => {setShowSearch(!showSearch)}} >
                            <Ionicons name="search" size={26} color="black" style={{   }}/>
                        </TouchableOpacity>
                    </View>

            
                    <View style={{ flex: 1, position: 'relative', alignItems: 'center' }}>
                        {showSearch && locations.length > 0 && (
                            <View style={{ position: 'absolute', top: 20, width: "90%", backgroundColor: "white", alignSelf: "center", borderRadius: 10, zIndex: 1 }}>
                            {locations.map((loc, index) => (
                                <View key={index}>
                                <TouchableOpacity style={{ padding: 10, paddingHorizontal: 20, flexDirection: "row" }} onPress={() => { handleLocation(loc) }}>
                                    <View style={{ justifyContent: "center", }}>
                                        <Ionicons name="location" size={16} color="green" style={{ marginHorizontal: 5 }} />
                                    </View>
                                    <View style={{ justifyContent: "center" }}>
                                        <Text style={{ fontFamily: "Kanit-Bold" }}>{loc?.name}, 
                                            <Text style={{ fontFamily: "Kanit-Regular" }}> {loc?.region ? loc?.region + " - " : "" } {loc?.country}</Text>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: "#b4b4b4", height: 1, width: "85%", alignSelf: "center" }}></View>
                                </View>
                            ))}
                            </View>
                        )}
                        <View style={{ flex: 1, justifyContent: "center", alignSelf: "center", marginTop: 15 }}>
                            <Text style={{ fontFamily: "Kanit-Bold", fontSize: 22, color: "white" }}>{location?.name},
                            <Text style={{ fontFamily: "Kanit-Regular" }}>{" " +  location?.country}</Text>
                            </Text>
                        </View>
                        <View style={{  justifyContent: 'center', alignItems: 'center',  maxHeight:_height+30,  marginTop: 5  }}  >
                            <Ionicons name={weatherImages[current?.condition?.text]} size={_height+30} color="orange" style={{   }}/>
                        </View>
                        </View>

                        <View style={{flex: 1, justifyContent: "center",  alignSelf: "center",  marginTop: 5}}>
                            {/* <Text style={{ fontFamily: "Kanit-Regular", fontSize: 32, color: "white", textAlign: "center", marginBottom: 5 }}> {new Date(parseInt(current?.location?.localtime)).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })} </Text> */}
                            <Text style={{ fontFamily: "Kanit-Regular", fontSize: 32, color: "white", textAlign: "center", marginBottom: 5 }}> { current?.last_updated } </Text>
                            <Text style={{fontFamily: "JosefinSans-Bold", fontSize: 60, color: "white", textAlign: "center" }}>{current?.temp_c}&#176;</Text>
                            <Text style={{fontFamily: "JosefinSans-Regular", fontSize: 24, color: "white", textAlign: "center" }}>Feels like {current?.feelslike_c}&#176;</Text>
                            <Text style={{fontFamily: "Kanit-Regular", fontSize: 35, color: "white", textAlign: "center"}}>{current?.condition?.text}</Text>
                        </View> 


                        <View style={{flexDirection: "row", margin: 5, justifyContent: "space-between", width: "90%", alignSelf: "center"}} >
                            <View style={{flexDirection: "row", margin: 5 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center',  }}  >
                                    <Ionicons name="time" size={24} color="white" style={{   }}/>
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{fontFamily: "Kanit-Regular", padding: 3, fontSize: 20, color: "white"}}>{current?.last_updated?.split(" ")[1]}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: "row", margin: 5 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center',  }}  >
                                    <Ionicons name="compass" size={24} color="white" style={{   }}/>
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{fontFamily: "Kanit-Regular", padding: 3, fontSize: 20, color: "white"}}>{current?.wind_kph}km</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: "row", margin: 5 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center',  }}  >
                                    <Ionicons name="water" size={24} color="white" style={{   }}/>
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{fontFamily: "Kanit-Regular", padding: 3, fontSize: 20, color: "white"}}>{current?.humidity}%</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{width: "90%", alignSelf: "center", flexDirection: "row", marginTop: 20}}>
                            <View style={{  justifyContent: 'center', }}  >
                                <Ionicons name="calendar" size={24} color="white" style={{   }}/>
                            </View>
                            <View style={{flex: 1, justifyContent: "center",  alignSelf: "center", marginLeft: 10 }}>
                                <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "left", fontSize: 18}}>Daily forecast</Text>
                            </View> 
                        </View>

   
                    <ScrollView showsVerticalScrollIndicator={false} horizontal={true} nestedScrollEnabled={true} style={{ marginLeft: 10, marginBottom: 20 }} >
                        {weather?.forecast?.forecastday?.map((item, index) => {
                            let date = new Date(item?.date);
                            let options = {weekday: "long"};
                            let dayName = date.toLocaleDateString("en-US", options).split(",")[0]
                            return (
                                <View key={index} style={{ marginLeft: 10,  } }>
                                    <View  style={{backgroundColor: "rgba(255,255,255,0.1)", width: 100,  marginTop: 10, borderRadius: 10}}>
                                        <View style={{ alignSelf: "center",  margin: 8 }}  >
                                            <Ionicons name={weatherImages[current?.condition?.text]} size={28} color="white" style={{   }}/>
                                        </View>
                                        <View style={{ alignSelf: "center",  margin: 8 }}  >
                                            <Image source={ item?.icon} size={28} color="white" style={{   }}/>
                                        </View>
                                        <View style={{flex: 1, alignSelf: "center", }}>
                                            <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "center", }}>{dayName}</Text>
                                            <Text style={{fontFamily: "Kanit-Bold",  color: "white", textAlign: "center", fontSize: 24 }}>{item?.day?.avgtemp_c}&#176;</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        )}
                    </ScrollView>



      


            {/* ====  Logout ============================================================================================================================================================================== */}
            {/* <View style={{ flexDirection: "row", margin: 5, marginTop: 10,  alignSelf: "center" }} >
                    <TouchableOpacity  style={{marginHorizontal: 3, backgroundColor: "#331b03", padding: 10, borderRadius: 6, width: "95%",  alignItems: "center"  }} onPress={() => { navigation.replace("WeatherScreen")   }}>
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 24}}>Another Screen</Text>
                    </TouchableOpacity>
            </View> */}

        </ScrollView>
    </View>
    </ImageBackground>
  )
}


const styles = StyleSheet.create({ 
    backgroundImage: { flex: 1, resizeMode: 'cover', },
}); 


export default WeatherScreen1