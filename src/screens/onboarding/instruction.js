import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView,Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../providers/auth/auth.context';
import { ScrollView } from 'react-native-gesture-handler';
import { AppContext, AppProvider } from '../../providers/app-provider';
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from '@react-navigation/native';
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
    const { type, back, switchtocustomer } = route.params
    const [specialist, setSpecialist] = useState(null)
    const [host, setHost] = useState(null)
    // console.log(type);
    console.log("code", videourl, type);
    const fetchinst = async () => {
        const res = await loadinstruction(type)
        
            setVideourl(res)
        
        console.log("response of inst", res);
    }
    useEffect(() => {
        fetchinst()
    }, []) 

    useEffect(()=>{
        console.log("normalApp switchtocustomer---------------&&&&&&&&&&&&",switchtocustomer );
        if(switchtocustomer){
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
  const desiredHeight = screenHeight * 0.8;
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            
                {/* <View style={{marginRight:170,bottom:100,transform: [{ rotate: '90deg' }]}}>
                    <YoutubePlayer
                        
                        height={500}
                        width={600}
                        play={true}
                        videoId={videourl ? `${videourl}` : `TO7EgDFe_94`}
                    // onChangeState={onStateChange}
                    />
                </View> */}
            <View style={{ justifyContent: 'center', alignItems: 'center',flex:1 }}>
            
            { videourl &&
            <Video 
            source={{ uri: videourl }} 
            style={{
                width:desiredWidth ,
                height:desiredHeight,
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
                <TouchableOpacity onPress={async () =>{
                    if(type=='client'){
                        if(hasOnboarded){
                            navigation.goBack()
                        }
                        else{
                            await onOnboarding()
                            navigation.navigate('normalApp')
                        }
                    }
                    else if(type=='specialist'){
                        if(back){
                            navigation.goBack()
                        }else{
                        onBecomeSpecialist().then(res => {
                            console.log("become specialist",res);
                            setSpecialist(res);
                          });
                        }
                    }
                    else{
                        if(back){
                            navigation.goBack()
                        }
                        else{
                            onBecomeHost().then(res => {
                            
                                console.log(res);
                                setHost(res);
                              });    
                        }
                                            }
                    
                    // navigation.navigate('saloon')
                }} >
                    <Text style={{ fontSize: 20, backgroundColor:'lightblue', borderRadius:10, paddingHorizontal:20 }}>skip tutorial</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 15, marginHorizontal:30, marginTop:10}}>You can always find this tutorial within settings inside Profile section!</Text>

            </View>
        </SafeAreaView>
    )
}

export default Instruction;

const styles = StyleSheet.create({});
