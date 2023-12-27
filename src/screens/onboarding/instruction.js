import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../providers/auth/auth.context';
import { ScrollView } from 'react-native-gesture-handler';
import { AppContext, AppProvider } from '../../providers/app-provider';
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
// const windowWidth = Dimensions.get('width');
// import Video from 'react-native-video';
import { Video, ResizeMode } from "expo-av";

// const windowHeight = Dimensions.get('height');

// import { SafeAreaView } from 'react-native-safe-area-context';

const Instruction = ({ route }) => {
  const { onOnboarding, hasOnboarded, onBecomeHost, onBecomeSpecialist } = useContext(AuthContext);
  const { loadinstruction, currentApp } = useContext(AppContext)
  const [videourl, setVideourl] = useState(null)
  const navigation = useNavigation()
  // const route = useRoute()
  const { type, back, switchtocustomer, shouldGoBack } = route.params
  const [specialist, setSpecialist] = useState(null)
  const [host, setHost] = useState(null)
  // console.log(type);
  console.log("code", videourl, type, shouldGoBack);
  const fetchinst = async () => {

    const res = await loadinstruction(type=='host' ? 'fecilities' : type)

    setVideourl(res)

    console.log("response of inst", res);
  }
  useEffect(() => {
    fetchinst()
  }, [])

  useEffect(() => {
    console.log("normalApp switchtocustomer---------------&&&&&&&&&&&&", switchtocustomer);
    if (switchtocustomer) {
      navigation.navigate('normalApp')
    }
  }, [])

  useEffect(() => {
    if (specialist) {
      console.log("inside");
      if (currentApp === 'normal') {
        navigation.navigate("SpecialistVerificationCompletedScreen")
      } else {
        navigation.navigate("SpecialistVerificationCompletedScreenHost")
      }
    }
  }, [specialist])



  useEffect(() => {
    if (host) {
      if (currentApp === 'normal') {
        navigation.navigate("HostVerificationCompletedScreen")
      } else {
        navigation.navigate("HostVerificationCompletedScreenSpecialist")
      }
    }
  }, [host])

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const desiredWidth = screenWidth * 0.95;
  const desiredHeight = screenHeight * 0.7;

  return (
    
      <View style={{ flex: 1, paddingHorizontal: 10,marginTop:40 }}> 
      {
        shouldGoBack && 
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 50 }} onPress={async() => {
            if (type == 'client') {
              if (hasOnboarded) {
                navigation.goBack()
              }
              else {
                await onOnboarding()
                navigation.navigate('normalApp')
              }
            }
            else if (type == 'specialist') {
              if (back) {
                navigation.goBack()
              } else {
                onBecomeSpecialist().then(res => {
                  console.log("become specialist", res);
                  setSpecialist(res);
                });
              }
            }
            else {
              if (back) {
                navigation.goBack()
              }
              else {
                onBecomeHost().then(res => {

                  console.log(res);
                  setHost(res);
                });
              }
            }

           }}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24 }}>Skip Tutorial</Text>
        </View>
      }
        

        <View style={{ justifyContent: 'center', alignItems: 'center',marginVertical:10 }}>
          {videourl &&
            <Video
              source={{ uri: videourl }}
              style={{
                width: desiredWidth,
                height: desiredHeight,
                // backgroundColor:'red'
              }}
              //   resizeMode={Video.RESIZE_MODE_COVER}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              isLooping={true}
              usePoster
              rate={1.0}
              volume={1.0}
              isMuted={false}

            />
          } 

          {
            !shouldGoBack && 
            <>
            <TouchableOpacity style={{ backgroundColor: 'lightblue', height: 40, width: 150, justifyContent: 'space-evenly', alignItems: 'center', borderRadius: 10, flexDirection: 'row',marginVertical:10 }} onPress={async () => {
            if (type == 'client') {
              if (hasOnboarded) {
                navigation.goBack()
              }
              else {
                await onOnboarding()
                navigation.navigate('normalApp')
              }
            }
            else if (type == 'specialist') {
              if (back) {
                navigation.goBack()
              } else {
                onBecomeSpecialist().then(res => {
                  console.log("become specialist", res);
                  setSpecialist(res);
                });
              }
            }
            else {
              if (back) {
                navigation.goBack()
              }
              else {
                onBecomeHost().then(res => {

                  console.log(res);
                  setHost(res);
                });
              }
            }

           
          }} >
            <Text style={{ fontSize: 16 }}>Skip Tutorial</Text>
            <Ionicons name="play-skip-forward" size={20} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18,marginHorizontal:5 }}>You can always find this tutorial within settings inside Profile section!</Text>

            </>
          }
          
        </View>

      </View>
  
  )
}

export default Instruction;

const styles = StyleSheet.create({});
