import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, KeyboardAvoidingView, TextInput, Button, SafeAreaView, ImageBackground, TouchableOpacity  } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {debounce} from "lodash"


// import Logo from "../../assets/images/cop.gif"

import { StatusBar } from 'expo-status-bar';
import { fetchLocations, fetchWeatherForcast } from './weather';






// import CustomButton from '../../components/CustomButton';




// import {useNavigation} from '@react-navigation/native';


const WeatherScreen = () => {



    const {height} =  useWindowDimensions()
    const _height = Math.floor( height / 5)

    // console.log( Math.floor( height / 5) )
    // console.log(_height)




    const [showSearch, setShowSearch] = useState(false) 
    const [locations, setLocations] = useState([])
    const [weather, setWeather] = useState({})
    const [current, setCurrent] = useState({})
    const [location, setLocation] = useState({})

    

    const handleLocation = ( loc ) => {
        // console.log(loc)
        setLocations([]);
        setShowSearch(false);
        console.log("1", loc.name)
        fetchWeatherForcast({
            cityName: loc?.name, 
            days: "7",
        }).then( data => {
            setWeather(data)
            // console.log("1111 ======================================================================")
            // console.log(weather)
            // console.log("222 ======================================================================")
            // console.log("got forecast", data)
            // console.log("333 ======================================================================")
            console.log("got forecast", weather)
            setCurrent(data?.current)
            setLocation(data?.location)

            // console.log("444 ======================================================================")
            // console.log("current", current)
            // console.log("555 ======================================================================")
            // console.log("location", location)
        })
    }



    const handleSearch = (value) => {
        // console.log("value", value)
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

    // const [current, location] = weather;

    return (
        <ImageBackground blurRadius={70} source={require('../../../assets/background/background1.jpg')} style={{ flex: 1, resizeMode: 'cover' }} >
            <View  style={{ }}>
                <StatusBar style='light'/>
                <SafeAreaView>

                    <ScrollView nestedScrollEnabled={true}  style={{}}>
                        

                        <View style={{flex: 1, backgroundColor: showSearch ? "rgba(255,255,255,0.2)" : null, width: "70%", alignSelf: "center", borderRadius: 40, flexDirection: "row", alignItems: 'center', justifyContent: showSearch ? 'space-between' : "flex-end"}}> 
                            {showSearch && (
                                <View style={{ flexGrow: 1,  marginRight: 10, }}> 
                                    <TextInput 
                                        onChangeText={handleTestDebounce} placeholder='Search city' style={{padding: 12, paddingLeft: 20, color: "white", fontFamily: "Kanit-Regular", fontSize: 16, }}/> 
                                </View>
                            )}
                            <TouchableOpacity style={{ justifyContent: "flex-end",  margin: 2, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 40, justifyContent: 'center', alignItems: 'center', width: 45, height: 45, }} onPress={() => {setShowSearch(!showSearch)}} >
                                <Ionicons name="search" size={32} color="black" style={{   }}/>
                            </TouchableOpacity>
                        </View>


                            <View style={{ flex: 1, position: 'relative', alignItems: 'center' }}>
                            {/* Overlaying view */}
                            {showSearch && locations.length > 0 && (
                                <View style={{ position: 'absolute', top: 20, width: "90%", backgroundColor: "white", alignSelf: "center", borderRadius: 20, zIndex: 1 }}>
                                {locations.map((loc, index) => (
                                    
                                    <View key={index }>
                                    <TouchableOpacity style={{ padding: 15, flexDirection: "row" }} onPress={() => { handleLocation(loc) }}>
                                        <Ionicons name="navigate" size={24} color="black" style={{ marginHorizontal: 3 }} />
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

                            {/* Content beneath the overlay */}
                        <View style={{ flex: 1, justifyContent: "center", alignSelf: "center", marginTop: 40 }}>
                            <Text style={{ fontFamily: "Kanit-Bold", fontSize: 24, color: "white" }}>{location?.name},
                            <Text style={{ fontFamily: "Kanit-Regular" }}>{"  " +  location?.country}</Text>
                            </Text>
                        </View>
                        <View style={{  justifyContent: 'center', alignItems: 'center',  maxHeight:_height+50,  marginTop: 20  }}  >
                            <Ionicons name="partly-sunny" size={_height+50} color="orange" style={{   }}/>
                        </View>

                        </View>



                        <View style={{flex: 1, justifyContent: "center",  alignSelf: "center",  marginTop: 10}}>
                            <Text style={{fontFamily: "Kanit-Bold", fontSize: 60, color: "white", textAlign: "center" }}>{current?.temp_c}&#176;</Text>
                            <Text style={{fontFamily: "Kanit-Regular", fontSize: 20, color: "white", textAlign: "center" }}>Feels like   {current?.feelslike_c}&#176;</Text>
                            <Text style={{fontFamily: "Kanit-Regular", fontSize: 35, color: "white", textAlign: "center"}}>{current?.condition?.text}</Text>
                        </View> 


                        <View style={{flexDirection: "row", margin: 5, justifyContent: "space-between", width: "90%", alignSelf: "center"}} >
                            <View style={{flexDirection: "row", margin: 5 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center',  }}  >
                                    <Ionicons name="compass" size={28} color="white" style={{   }}/>
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{fontFamily: "Kanit-Regular", padding: 3, fontSize: 20, color: "white"}}>{current?.wind_kph} km</Text>
                                </View>
                            </View>

                            <View style={{flexDirection: "row", margin: 5 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center',  }}  >
                                    <Ionicons name="water" size={28} color="white" style={{   }}/>
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{fontFamily: "Kanit-Regular", padding: 3, fontSize: 20, color: "white"}}>{current?.humidity} %</Text>
                                </View>
                            </View>

                            <View style={{flexDirection: "row", margin: 5 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center',  }}  >
                                    <Ionicons name="sunny" size={28} color="white" style={{   }}/>
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{fontFamily: "Kanit-Regular", padding: 3, fontSize: 20, color: "white"}}>6:30 AM</Text>
                                </View>
                            </View>
                        </View>
                    
                        <View style={{width: "90%", alignSelf: "center", flexDirection: "row", marginTop: 20}}>
                            <View style={{  justifyContent: 'center', }}  >
                                <Ionicons name="calendar" size={28} color="white" style={{   }}/>
                            </View>
                            <View style={{flex: 1, justifyContent: "center",  alignSelf: "center", marginLeft: 10 }}>
                                <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "left"}}>Daily forecast</Text>
                            </View> 
                        </View>


                        {/* <ScrollView showsVerticalScrollIndicator={false} horizontal={true} nestedScrollEnabled={true} style={{ marginHorizontal: 1, backgroundColor: "white"   }} >
                        { weather?.forecast?.forecastday?.map((item, index) => 
                                            //    <View key={index} style={{flexDirection: "row"}}>
                                               <View key={index} style={{backgroundColor: "rgba(255,255,255,0.1)", width: 100, marginLeft: "5%", marginTop: 20, borderRadius: 10}}>
                                                   <View style={{ alignSelf: "center",  margin: 8 }}  >
                                                       <Ionicons name="rainy" size={28} color="white" style={{   }}/>
                                                   </View>
                                                   <View style={{flex: 1, alignSelf: "center", marginBottom: 10}}>
                                                       <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "center", }}>{item?.date}</Text>
                                                       <Text style={{fontFamily: "Kanit-Bold",  color: "white", textAlign: "center", fontSize: 28 }}>{item?.day?.avgtemp_c}&#176;</Text>
                                                   </View>
                                               </View>
                                        //    </View>
                        )}
                        </ScrollView> */}
                


                        { weather?.forecast?.forecastday?.map((item, index) => {
                            let date = new Date(item?.date);
                            let options = {weekday: "long"};
                            let dayName = date.toLocaleDateString("en-US", options).split(",")[0]

                            return (
                                <View key={index} style={{flexDirection: "row"}}>
                                    <View  style={{backgroundColor: "rgba(255,255,255,0.1)", width: 100, marginLeft: "5%", marginTop: 20, borderRadius: 10}}>
                                        <View style={{ alignSelf: "center",  margin: 8 }}  >
                                            <Ionicons name="rainy" size={28} color="white" style={{   }}/>
                                        </View>
                                        <View style={{flex: 1, alignSelf: "center", marginBottom: 10}}>
                                            <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "center", }}>{dayName}</Text>
                                            <Text style={{fontFamily: "Kanit-Bold",  color: "white", textAlign: "center", fontSize: 28 }}>{item?.day?.avgtemp_c}&#176;</Text>
                                        </View>
                                    </View>
                                </View>

                            )


                            })  
                        }


              
                        <View style={{flexDirection: "row"}}>
                            <View style={{backgroundColor: "rgba(255,255,255,0.1)", width: 100, marginLeft: "5%", marginTop: 20, borderRadius: 10}}>
                                <View style={{ alignSelf: "center",  margin: 8 }}  >
                                    <Ionicons name="rainy" size={28} color="white" style={{   }}/>
                                </View>
                                <View style={{flex: 1, alignSelf: "center", marginBottom: 10}}>
                                    <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "center", }}>Monday</Text>
                                    <Text style={{fontFamily: "Kanit-Bold",  color: "white", textAlign: "center", fontSize: 28 }}>25&#176;</Text>
                                </View>
                            </View>
                            <View style={{backgroundColor: "rgba(255,255,255,0.1)", width: 100, marginLeft: "5%", marginTop: 20, borderRadius: 10}}>
                                <View style={{ alignSelf: "center",  margin: 8 }}  >
                                    <Ionicons name="sunny" size={28} color="white" style={{   }}/>
                                </View>
                                <View style={{flex: 1, alignSelf: "center", marginBottom: 10}}>
                                    <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "center", }}>Tuesday</Text>
                                    <Text style={{fontFamily: "Kanit-Bold",  color: "white", textAlign: "center", fontSize: 28 }}>25&#176;</Text>
                                </View>
                            </View>
                            <View style={{backgroundColor: "rgba(255,255,255,0.1)", width: 100, marginLeft: "5%", marginTop: 20, borderRadius: 10}}>
                                <View style={{ alignSelf: "center",  margin: 8 }}  >
                                    <Ionicons name="snow" size={28} color="white" style={{   }}/>
                                </View>
                                <View style={{flex: 1, alignSelf: "center", marginBottom: 10}}>
                                    <Text style={{fontFamily: "Kanit-Regular",  color: "white", textAlign: "center", }}>Wednesday</Text>
                                    <Text style={{fontFamily: "Kanit-Bold",  color: "white", textAlign: "center", fontSize: 28 }}>25&#176;</Text>
                                </View>
                            </View>
            
                        </View>


                    </ScrollView>
                    
                </SafeAreaView>
            </View>
        </ImageBackground> 
    )
  }


const styles = StyleSheet.create({

    container: {
        marginTop: 10,
        padding: 10,
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: 100, 
        backgroundColor: "yellow"
        
    }, 
    }); 



export default WeatherScreen;




