import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, TextInput, ImageBackground, Image, StyleSheet } from "react-native";
import React, { useLayoutEffect, useRef, useState,  } from "react";
import { Entypo, FontAwesome,} from "@expo/vector-icons";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp,} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useSelector } from "react-redux";
import axios from 'axios';
// import { Configuration } from 'axios';
import { chatGPTapiKey } from "@env"

// import { chatgptAPI } from "@env"
import { Configuration, OpenAI }  from "openai";



const AskAIScreen = ({ route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(null); 
    const user = useSelector((state) => state.user.user);

    const apiKey = "sk-xxxxyyyyyqevBJukQJ0ET3BlbkFJgLVs5QrBANOK6HqNQizP123";
    const endpoint = 'https://api.openai.com/v1/completions';

    const sendMessage = async () => {
      if (message.trim()) {
        const my_question = { timeID: `${Date.now()}`, message: message.trim(), user: "Peter Zorve", email: user?.email}; 
        try {  
          const docRef = await addDoc( collection(doc(db, "eduzolveReportUsers", user?._id, "askAI", "askAI"), "askAI"), my_question )
          setMessage("")
        } catch (error) {  
          alert("Something went wrong\n" + error.message)
        } 
        
        try {
          const response = await axios.post(endpoint, {
            model: 'gpt-3.5-turbo-instruct',
            prompt: message.trim(),
            max_tokens: 120, // Maximum response length
            temperature: 0.7, // Adjust response randomness (0 = deterministic, 1 = creative)
            top_p: 1, // Promote likely completions
            n: 1, // Number of responses to generate
          }, {
            headers: { Authorization: `Bearer ${chatGPTapiKey}`, },
          });

          const responseData = response.data.choices[0].text;
          if (responseData.trim().length > 0) {
            const al_response = { timeID: `${Date.now()}`, message: responseData.trim(), user: "Kwame", email: "kwame.com"};
            try {  
              const docRef = await addDoc( collection(doc(db, "eduzolveReportUsers", user?._id, "askAI", "askAI"), "askAI"), al_response )
              setMessage("")
            } catch (error) { 
              alert("Something went wrong\n" + error.message)
            }
          } else {
            alert("No response found")
          }

        } catch (error) {
          alert(error.message)
        }
      };
    }




    useLayoutEffect(() => {
      // const msgQuery = query(collection(db, "chats", room?.chatID, "messages"), orderBy("timeStamp", "asc") );
      const msgQuery = query(collection(db, "eduzolveReportUsers", user?._id, 'askAI', "askAI", "askAI"), orderBy("timeID", "asc") );
      const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
        const upMsg = querySnap.docs.map((doc) => doc.data()); 
        setMessages(upMsg);
        setIsLoading(false); 
      });
      return unsubscribe;
    }, []);
  
    const scrollViewRef = useRef();
    const scrollToBottom = () => { 
      if (scrollViewRef.current) { scrollViewRef.current.scrollToEnd({ animated: true });}
    };


 

    return (
      <ImageBackground source={require('../../../assets/background/background3.jpg')} style={{flex: 1, resizeMode: 'cover',}} >
      <View  style={{flex: 1, backgroundColor: "rgba(0, 0, 0, 0.95)", }} >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'between', padding: 3,  backgroundColor: 'white', margin: 10, borderRadius: 10}}> 
              <View style={{ width: 35,  height: 35, borderRadius: 20, borderWidth: 1,  flexDirection: 'row',  alignItems: 'center',  justifyContent: 'center', marginHorizontal: 5,}}> 
                  <Image source={{ uri: "https://fastly.picsum.photos/id/659/300/300.jpg?hmac=PxmRQ6eGErgkq4LdPwpld0eYGMsMCKOCtyJF6wXhXDM" }} style={{ width: '100%', height: '100%', borderRadius: 20, borderColor: "white", borderWidth: 1}} resizeMode="cover" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black", fontFamily: "Kanit-Regular" }}>Ask {user?.kwamename ? user?.kwamename : "Kwame"}</Text> 
                <Text style={{ fontSize: 10,  color: "black", fontFamily: "Kanit-Thin" }}>I am your AI bot. I am here to assist you.</Text> 
              </View> 
          </View>

          <>
            <ScrollView  ref={scrollViewRef} onContentSizeChange={() => scrollToBottom()}>
                {isLoading ? (
                    <View > 
                      <ActivityIndicator size={"large"} color={"#43C651"} /> 
                    </View>
                  ) : (
                  <>
                    {messages?.map((msg, i) =>
                      msg?.email === user?.email ? (
                        <View key={i} >
                          <View style={{ alignSelf: "flex-end", marginHorizontal: 10, maxWidth: "70%", backgroundColor: "white", borderWidth: 3, borderColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }} > 
                            <Text style={{ paddingHorizontal: 8, padding: 3, fontFamily: "Kanit-Regular", fontSize: 12 }}>{msg?.message} </Text>
                          </View>
                          <View style={{ alignSelf: "flex-end", marginRight: 10, marginBottom: 10  }}>
                            {msg?.timeID && (
                              <Text style={{ paddingBottom: 6, paddingRight: 3, fontSize: 10, color: "white", padding: 5, fontFamily: "Kanit-Regular", fontSize: 10 }} >
                                {new Date( parseInt(msg?.timeID)).toLocaleTimeString("en-US", {day: "2-digit",  year: "numeric", month: "long", hour: "numeric", minute: "numeric", hour12: true, })}  |  You
                                
                              </Text>
                            )}
                          </View>
                        </View>
                      ) : (
                        <View key={i} style={{ alignSelf: "flex-start", paddingHorizontal: 10  }} >
                          <View style={{ flexDirection: 'row', padding: 5, maxWidth: '75%'}} >
                              <Image
                                  style={{ width: 35, height: 35,  borderRadius: 50,  borderWidth: 1, borderColor: '#999999', alignItems: 'center', justifyContent: 'center', marginHorizontal: 5,  }}
                                  resizeMode="cover"
                                  source={{ uri: "https://fastly.picsum.photos/id/659/300/300.jpg?hmac=PxmRQ6eGErgkq4LdPwpld0eYGMsMCKOCtyJF6wXhXDM" }}
                              />
                            <View >
                                <View style={{ width: 'auto',  backgroundColor: "#272727",  position: 'relative', borderWidth: 3, borderColor: "#272727",  borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10}}>
                                    <Text style={{paddingHorizontal: 5, padding: 10, color: "white", fontFamily: "Kanit-Regular", fontSize: 12 }}>{msg?.message} </Text>  
                                </View> 
                                <View style={{ alignSelf: "flex-start" }}>
                                  {msg?.timeID && (
                                    <Text style={{ paddingBottom: 6, fontSize: 10, color: "white", padding: 5 }}>
                                      {new Date( parseInt(msg?.timeID)).toLocaleTimeString("en-US", {day: "2-digit",  year: "numeric", month: "long", hour: "numeric", minute: "numeric", hour12: true, })}  |  { user?.kwamename ? (user?.kwamename.length > 8 ? user?.kwamename.slice(0, 8) + "..." : user?.kwamename ) : "Kwame" } 
                                    </Text>
                                  )}
                                </View>
                            </View>

                          </View>
                        </View>
                      )
                    )}
                  </>
                )}

              </ScrollView>

              {/* {(previousRegistered === false) && ( */}
                  <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100} style={{marginBottom: 20}} >
                      <View style={{  flexDirection: 'row',  alignItems: 'center',  justifyContent: 'center',  padding: 5, marginHorizontal: 3,  minHeight: 30, marginBottom: 10}}>
                        
                        <View style={{backgroundColor: "white", borderColor: "#e8e8e8", borderWidth: 1,  borderColor: '#000', borderRadius: 10,  margin: 5,}}>
                          <TextInput  value={message}  multiline={true}  onChangeText={setMessage}  placeholder={"Message"}  style={[styles.input,  {width: "85%", minWidth: "85%"},  {minHeight: 40},   {maxWidth:  "85%"}]}secureTextEntry={false}/> 
                        </View>   
                        
                        <TouchableOpacity  style={{marginHorizontal: 3, backgroundColor: "#d4d4d4", padding: 10, borderRadius: 6, }} onPress={sendMessage}>
                          <FontAwesome name="send" size={20} color="gray" />
                        </TouchableOpacity>
                      </View>
                  </KeyboardAvoidingView>
              {/* )} */}
            </>
      </View>
      </ImageBackground>

 
    );
  };


  const styles = StyleSheet.create({
    root: {
      alignItems: "center", 
      padding: 20, 
      marginBottom: 100
    },
  
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', 
    },
  
    messageTitle: {
      paddingLeft: 5
    },

    root1: {
      // alignItems: "center", 
      padding: 3, 
      marginBottom: 100
    },

    horizontal1: {
      flexDirection: 'row', 
      // padding: 5
    },
  
    container: { backgroundColor: "white", borderColor: "#e8e8e8", borderWidth: 1,  borderColor: '#000', borderRadius: 10,  margin: 5,
  },

  input: {
      paddingLeft: 10
  }
  
  }); 

export default AskAIScreen;

