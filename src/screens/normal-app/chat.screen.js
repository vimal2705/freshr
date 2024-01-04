import styled, { useTheme } from "styled-components/native";
import { connect, useDispatch, useSelector } from "react-redux";
import React, { useState, useCallback, useEffect, useContext, } from "react";
import { Actions, Bubble, GiftedChat, InputToolbar, Send } from "react-native-gifted-chat";
import {KeyboardAvoidingView} from "react-native"
import { rgba } from "polished";
import { Feather, FontAwesome, Ionicons ,MaterialIcons} from "@expo/vector-icons";
import { getTokenAndCreateAuthorizationHeader } from "../../providers/utils";
import axios from "axios";
import { BASE_API_URL } from "../../constants";
import { AuthContext } from "../../providers/auth/auth.context";
import { ImageUploadModal } from "../../components/bottom-sheet/ImageUploadModal";
import { View,Text } from "react-native";
import mime from "mime";
import { AppContext } from "../../providers/app-provider";
import { io } from "socket.io-client";
import { useFocusEffect } from '@react-navigation/native';
import socketServices from "./components/Socket";
// import { deviceName } from "expo-device";
import * as Device from 'expo-device';
import { setMessageSeen } from "../../redux/chat/chat_actions";
import navigation from "../../infrastructure/navigation";


const SendButton = styled.View`
  padding: ${({ theme }) => theme.space[2]};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const renderSend = (props) => {
  return (
    <Send {...props}>
      <SendButton>
        <Ionicons name="send" size={30} color={"#5cbcbc"} />
      </SendButton>
    </Send>
  );
};
const renderBubble = (props) => {
  console.log("mmmmmmmmmm",props);
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: rgba("#5cbcbc", 0.8),
        },
        left: {
          backgroundColor: rgba("purple", 0.8),
        },
      }}
      textStyle={{
        right: {
          color: "white",
        },
        left: {
          color: "white",
        },
      }}
      
    />
  );
};


const scrollToBottomComponent = () => {
  return <FontAwesome name="angle-double-down" size={23}  color={"#5cbcbc"} />;
};

// const URL =  'https://bb5f-2405-201-201c-8115-e917-177-98b8-5c8d.ngrok-free.app'

// const socket = io(URL);

const ChatScreen = ({ route,state,navigation }) => {
  // useEffect(()=>{
  //   socketServices.initializeSocket();
  // },[]); 

  console.log('==============-----------=========',state);

  const {order} = route.params
  const {sender, isClient} = route.params 
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([]);
  const {user} = useContext(AuthContext)
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const {fetchMessages} = useContext(AppContext)
  const dispatch = useDispatch();
    const Orderdata = useSelector(state => state.chat)
    console.log(Orderdata);

  useEffect(()=>{
      dispatch(setMessageSeen(false));
      console.log("route.params ",route.params.isClient );
  }, [messages, fetchMessages, sendMessage]) 

  const handleSendImage = (result) => {
   console.log(result)
  };

  const renderActions = (props) => {
    return(
      <Actions
        {...props}
        options={{
          ['send image']: (props) => { setShowImageUploadModal(true)},
        }}
        icon={() => (
          <Ionicons
            name="image"
            size={28}
            color={"#5cbcbc"}
            style={{left:0, bottom:0}}/>
        )}
        onPressActionButton={(props) => { setShowImageUploadModal(true)}}
        onSend={args => console.log(args)}
      />
    )
  }

  useEffect(() => {
    socketServices.initializeSocket();
    const loadMessages = async () => {
      try {
        const config = await getTokenAndCreateAuthorizationHeader();
        const res = await axios.get(`${BASE_API_URL}/users/chat/${order}`, config)
        console.log(res.data)
        setMessages(res.data.data.chat[0].messages);
      } catch (e) {
        console.log(e);
      }
    }
    const receivedMessageListener = (data) => {
      console.log("dataaaa", data);
      console.log("finalllllllllll loggggggg", Device.deviceName ,data.content.text);
      console.log("data.content.order", data);
      console.log("orderrrrr", order);
      if (data.order === order) {
        console.log("giraaaaaaaaa");

        
        const messageExists = messages.some((message) => message._id === data.content._id);
        
        if (!messageExists) {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              { ...data.content, received: true, _id: data.content._id },
            ])
          );
        }
      }
    }
    socketServices.on('recived_message', receivedMessageListener);
    // console.log('here is the result', socket.connect());
    // socket.on('connect_error', (err) => {
    //   if (err.message === 'invalid username') {
    //     console.log("Coudn't load user name")
    //   }
    // })


    // socket.on('user-connected', (user) => {
    //   console.log('connected user', user)
    // })

    
    // useEffect(()=>{
    //     socketServices.on('recived_message',(data)=>{
    //       console.log("dataaaa",data);
    //   console.log("finalllllllllll loggggggg",data.content.text);
    //   console.log("data.content.order",data.order);
    //   console.log("orderrrrr",order);
    //   if (data.order === order) {
    //     console.log("giraaaaaaaaa");
    //     setMessages((previousMessages) =>
    //       GiftedChat.append(previousMessages, [{ ...data.content, received: true }])
    //     );
    //   }
    //     })
    // },[messages])


    // socket.on('is-typing', (data) => {
    //   console.log('is typing');
    //   if (data.order === order) {
    //     setTyping(true)
    //   }
    // });

    // socket.on('stop-typing', (data) => {
    //   if (data.order === order) {
    //     setTyping(false)
    //   }
    // })

    // socket.on('disconnect', () => {
    //   console.log('disconnected')
    // })

    // console.log('after all events added', socket);
    // socketServices.on('recived_message', (data) => {
    //   console.log("dataaaa",data);
    //   console.log("finalllllllllll loggggggg",data.content.text);
    //   console.log("data.content.order",data.order);
    //   console.log("orderrrrr",order);
    //   if (data.order === order) {
    //     console.log("giraaaaaaaaa");
    //     setMessages((previousMessages) =>
    //       GiftedChat.append(previousMessages, [{ ...data.content, received: true, }])
    //     );
    //   }
    // })

    loadMessages();

    return () => {
      // socket.off('connect')
      // socket.off('disconnect')
      // socket.off('is-typing')
      // socket.off('stop-typing')
      // socket.disconnect()
      socketServices.off('recived_message',receivedMessageListener);
      fetchMessages();
    }
  }, []);
  // useEffect(()=>{
    
  // },[])

  const onMessage = (content, from, to)  => {
    console.log("senddddddddddd", Device.deviceName);
    socketServices.emit('send_message', {
      content,
      from, to,
      order
    })
  }

  const sendMessage = async (message) => {
    
    try {
      // socket.emit('stop-typing', {content: "", from: sender, to: message.user._id, order: order})
      console.log("hgfhdhjfdjghfdjgfdgfgjffgfs",message) 
      const config = await getTokenAndCreateAuthorizationHeader(true);
      const res = await axios.post(`${BASE_API_URL}/users/chat/${order}`, { ...message, sender: sender, isClient: isClient }, config)
      console.log("res",res);
      onMessage(message, user._id, route.params.receiver._id)
      console.log("===================sender======================", sender, route.params.receiver._id, user._id, Device.deviceName);
      // setMessages((previousMessages) =>
      //   GiftedChat.append(previousMessages, [{ ...message, received: true }])
      // );
      console.log("msgggggggggggggggggggggggggggggggggggggg",message)
    } catch (e) {
      console.log(e);
    }
  }

  const sendImage = async (image) => {
    try {
      const formData = new FormData()
      console.log('Are we sending the image')
      const filename = image.uri.split('/').pop();
      const newImageUri =  "file:///" + image.uri.split("file:/").join("");
      formData.append('resource', {...image, uri: newImageUri, type: mime.getType(newImageUri), name: filename})
      formData.append('mediaType', image.type.startsWith('image') ? 'IMAGE' : 'VIDEO')
      formData.append('isClient', isClient)
      formData.append('sender', sender)
      formData.append('received', true)
      formData.append('user', {_id: sender})

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [{ _id: `${sender}-{Date.now()}`, image: image.uri, user: {_id: sender}, sent: true }])
      );                                                                                                                                 
      const config = await getTokenAndCreateAuthorizationHeader(false);
      await axios.post(`${BASE_API_URL}/users/chat/${order}`, formData, config)
    } catch (e) {
      console.log(e.request)
    }
  }

  const onSend = useCallback((messages = []) => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    console.log("msgggggggggggggggggggggggggggggggggggggg",messages)

    messages.map(message => sendMessage(message))
  }, []);

  return (
  
  <View style={{flex: 1}}>
    <View style={{height:50 ,marginTop:20, flexDirection:"row"}}>
    <MaterialIcons
    onPress={ () => !isClient ? navigation.navigate("Overview") : navigation.goBack()}
            name="arrow-back"
            size={28}
            color={"#000000"}
            style={{left:0, bottom:0, marginLeft:10,marginTop:25}}/>
      <Text   style={{ marginLeft:10,marginTop:25, fontSize:18,fontWeight:"500"}}>{ route.params.receiver.name }</Text>
    </View>
      <GiftedChat
        inverted={true}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{_id: sender}}
        onInputTextChanged={() => socketServices.emit('is typing', {content: "", to : order})} 
        isTyping={typing}
        // renderBubble={renderBubble}
        alwaysShowSend
        style={{backgroundColor: 'black'}}
        messagesContainerStyle={{backgroundColor: 'black',marginBottom:-20}}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderSend={renderSend}
        renderActions={renderActions}
        
        textInputProps={{style: {color: "white", flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom:20, marginLeft: 8}}}
        containerStyle={{ height: 60, justifyContent:'center', backgroundColor: '#25282b', color: "white"}}
      />
     
      {/* 25282b */}
       <ImageUploadModal
        showModal={showImageUploadModal}
        toggleShowModal={() => setShowImageUploadModal(false)}
        addImage={sendImage}
        noGallery={false}
        allowVideo={false}
      />
      {/* <View style={{ flex: 1 }}> */}
      {/* <GiftedChat
           inverted={true}
           messages={ messages.length>0 ? messages : [{"_id": 1, "createdAt": "2023-08-11T09:16:38.203Z", "image": null, "received": true, "sent": true, "text": "  ", "user": {"_id": 1, "avatar": "", "name": 'Undefined'}}] }
           onSend={(messages) => onSend(messages)}
           user={{_id: sender ? sender : null}}
           onInputTextChanged={() => socket.emit('is typing', {content: "", to : order})}
           isTyping={typing}
           renderBubble={renderBubble}
           alwaysShowSend
           style={{backgroundColor: 'black'}}
           messagesContainerStyle={{backgroundColor: 'black', padding: 10, paddingBottom: 25}}
           scrollToBottom
           scrollToBottomComponent={scrollToBottomComponent}
           renderSend={renderSend}
           renderActions={renderActions}
           textInputProps={{style: {color: "white", flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, marginLeft: 8}}}
           containerStyle={{ paddingVertical:8, height: 60, justifyContent:'center', backgroundColor: '#25282b', color: "white"}} 
           />
             <ImageUploadModal
        showModal={showImageUploadModal}
        toggleShowModal={() => setShowImageUploadModal(false)}
        addImage={sendImage}
        noGallery={false}
        allowVideo={false}
      />  */}
   {/* {
      Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
   } */}
{/* </View> */}
    </View>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);