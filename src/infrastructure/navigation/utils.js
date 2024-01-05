import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { View, Text, Platform } from "react-native";
import { AppContext } from "../../providers/app-provider";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import socketServices from "../../screens/normal-app/components/Socket";
import { useState } from "react";
import { setMessageSeen } from "../../redux/chat/chat_actions";

export const TAB_ICON = {
  Explore: (size, color) => <Feather name="home" size={size} color={color} />,
  Favorites: (size, color) => (
    <MaterialIcons name="favorite-border" size={size} color={color} />
  ),
  Inbox: (size, color) => {
    // const { UnreadMessage } = useContext(AppContext)
    // const unreadMessaage=useSelector((state)=>state.chat.seen)
    // const dispatch=useDispatch();
    const unreadMessaage=useSelector((state)=>state.chat.seen) 
    
  // useEffect(()=>{
  //   socketServices.initializeSocket(); 
  //   socketServices.on('recived_message',(msg)=>{
  //     console.log("miracleee ---------------rr------------------------------------ miracleeee",msg);
  //     if( msg.to!==msg.from){
  //       console.log("-=-=-=-=-------------------------",msg.to,msg.from);
  //       console.log("_______________________________________________fataaaaaaaaaaaaaaaaaaaaaa_____________________________________________________________________"); 
  //     dispatch(setMessageSeen(true));

  
  //     }
  //     // else{
  //     //   dispatch(setMessageSeen(false))
  //     // }
      
  // })
  
  // },[])

    
  // const[unreadMessaage,setunreadMessaage]=useState('');
  // useEffect(()=>{
  //   socketServices.initializeSocket(); 
  //   socketServices.on('recived_message',(msg)=>{
  //     console.log("miracleee ---------------rr------------------------------------ miracleeee",msg);
  //     if( msg.to!==msg.from){
        
  //       console.log("_______________________________________________fataaaaaaaaaaaaaaaaaaaaaa_____________________________________________________________________"); 
  //       // dispatch(setMessageSeen(true));
  //       setunreadMessaage(true);
  
  //     }
      
  // })
  
  // },[])
   
    return (
      <View>
        {
           unreadMessaage ?
            <View style={{ position: 'absolute', backgroundColor: 'red', width: 15, height: 15, top: 0, right: 0, borderRadius: 50, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: unreadMessaage > 10 ? 8 : 10, color: '#fff' }}>
                {/* {UnreadMessage > 10 ? 10 + '+' : UnreadMessage} */}
                {1}
              </Text>
            </View>
            : <></>
        }
          <Ionicons name="md-chatbox-outline" size={size} color={color} />
      </View>
    )
  },
  Orders: (size, color) => (
    <Feather name="scissors" size={size} color={color} />
  ),
  Account: (size, color) => (
    <Ionicons name="md-person-outline" size={size} color={color} />
  ),
};

export const PRO_TAB_ICON = {
  Overview: (size, color) => <Feather name="home" size={size} color={color} />,
  Analytics: (size, color) => (
    <Ionicons name="analytics" size={size} color={color} />
  ),
  Menu: (size, color) => <Feather name="menu" size={size} color={color} />,
  Inbox: (size, color) => {
    // const { UnreadMessage } = useContext(AppContext)
    // const UnreadMessage=useSelector((state)=>console.log("-=-=statesashhh",state.chat)) 
    const unreadMessaage=useSelector((state)=>state.chat.seen)
    // console.log("unreadMeassageeeeeee",unreadMessaage);
    // const unreadMessaage=useSelector((state)=>state.chat.seen)
  //   const[unreadMessaage,setunreadMessaage]=useState('');
  // useEffect(()=>{
  //   socketServices.initializeSocket(); 
  //   socketServices.on('recived_message',(msg)=>{
  //     console.log("miracleee ---------------rr------------------------------------ miracleeee",msg);
  //     if( msg.to!==msg.from){
        
  //       console.log("_______________________________________________fataaaaaaaaaaaaaaaaaaaaaa_____________________________________________________________________"); 
  //       // dispatch(setMessageSeen(true));
  //       setunreadMessaage(false);
  
  //     }
      
  // })
  
  // },[])

    return (
      <View>
        {
          unreadMessaage?
            <View style={{ position: 'absolute', backgroundColor: 'red', width: 15, height: 15, top: 0, right: 0, borderRadius: 50, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: unreadMessaage > 10 ? 8 : 10, color: '#fff' }}>
                {/* {UnreadMessage > 10 ? 10 + '+' : UnreadMessage} */}
                {1}
              </Text>
            </View>
            : <></>
        }
          <Ionicons name="md-chatbox-outline" size={size} color={color} />
      </View>
    )
  },
  Profile: (size, color) => (
    <Ionicons name="md-person-outline" size={size} color={color} />
  ),
  Facilities: (size, color) => <MaterialCommunityIcons name="home-group" size={size} color={color} />,
  History: (size, color) => <FontAwesome name="history" size={size} color={color} />,
  Reserve: (size, color) => (<FontAwesome5 name="chair" size={size} color={color} />),
};

export const getStyledScreenOptions = (icons, theme, num) => {
  return ({ route }) => {
    const renderIcon = icons[route.name];
    return {
      headerShown: false,
      tabBarActiveTintColor: theme.colors.brand.quaternary,
      tabBarInactiveTintColor: "white",
      tabBarIcon: ({ size, color }) => {
        return renderIcon(size, color);
      },
      backgroundComponent: () => (
        <View style={{ backgroundColor: 'transparent' }} />
      ),
      tabBarStyle: {
        borderTopWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.brand.primary,
        height: Platform.OS == 'ios' ?90:65,
        zIndex: 4,
        marginTop: 0,
        padding: 5,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 6,
      },
      tabBarItemStyle: {
        fontFamily: theme.fonts.body,
        alignItems: "center",
        justifyContent: "center",
        height: "80%",
        borderRadius: 30,
        padding: 4,
        marginHorizontal: 6,
      },
      tabBarActiveBackgroundColor: "white",
    };
  };
};