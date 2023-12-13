import styled, { useTheme } from "styled-components/native";
import { connect, useSelector } from "react-redux";
import { SafeArea } from "../../components/utils/safearea.component";
import React, { useContext, useEffect, useState ,useCallback} from "react";
import { useWindowDimensions, View } from "react-native";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import {
  HeaderContainer,
  PaddedContainer,
  PageTitle,
} from "../components/details-screen.component";
import { SceneMap, TabView } from "react-native-tab-view";
import { renderTabBar } from "../normal-app/utils";
import { renderConfirmModal } from "./components/modal.component";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import { SpecialistContext } from "../../providers/specialist.provider";
import ChatScreen from "../normal-app/chat.screen";
import navigation from "../../infrastructure/navigation";
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
`;

const InboxSpecialistScreen = (props) => {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [available, setAvailable] = useState(false);
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);
  const {specialist} = useContext(SpecialistContext) 

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "messages", title: "Messages" },
    // { key: "notifications", title: "Notifications" },
  ]);

  const Orderdata = useSelector(state => state.chat)
  console.log('===<>',Orderdata);

  const {queue } = useContext(SpecialistContext) 
  console.log("mxssssssssss ----====-----====----======>>>>>>>>>>", queue);
  const isClient = false;
const navigation = useNavigation()
useEffect(()=>{
  // navigation.navigate('Chat')
  if(queue.length > 0){
  navigation.navigate("Chat", {
    order: queue[0]._id,
    sender: isClient ? queue[0].client._id : queue[0].specialist._id,
    isClient: isClient,
    receiver: {
      _id: !isClient ? queue[0].client._id : queue[0].specialist._id,
      name: !isClient ? `${queue[0].client.firstName} ${queue[0].client.lastName}` : `${queue[0].specialist.user.firstName} ${queue[0].specialist.user.lastName}`,
      avatar: "",
    },
  })
}
},[])

useFocusEffect(
  useCallback(() => {
    const unsubscribe = () => {

    if(queue.length > 0){
      navigation.navigate("Chat", {
        order: queue[0]._id,
        sender: isClient ? queue[0].client._id : queue[0].specialist._id,
        isClient: isClient,
        receiver: {
          _id: !isClient ? queue[0].client._id : queue[0].specialist._id,
          name: !isClient ? `${queue[0].client.firstName} ${queue[0].client.lastName}` : `${queue[0].specialist.user.firstName} ${queue[0].specialist.user.lastName}`,
          avatar: "",
        },
      })
    };
  }
    return unsubscribe();
  }, [queue])
);



// navigation.navigate("Chat", {
//   order: order.id,
//   sender: isClient ? order.client.id : order.specialist.id,
//   isClient: isClient,
//   receiver: {
//     _id: !isClient ? order.client.id : order.specialist.id,
//     name: !isClient ? `${order.client.firstName} ${order.client.lastName}` : `${order.specialist.user.firstName} ${order.specialist.user.lastName}`,
//     avatar: "",
//   },
// })
  const renderMessages = () => {
    return (
      <View>
        <Spacer position="top" size="large" />
        <Text variant="caption" style={{color: "white"}}>Messages</Text>
      </View>
    );
  };

  // const renderNotifications = () => {
  //   return (
  //     <View>
  //       <Spacer position="top" size="large" />
  //       <Text variant="caption" style={{color: "white"}}>Notifications</Text>
  //     </View>
  //   );
  // };

  const renderHeader = () => {
    return (
      <HeaderContainer>
        <Spacer position="top" size="large" />
        <PageTitle style={{color: specialist?.isOnline ? "black" : "white"}}>Inbox</PageTitle>
      </HeaderContainer>
    );
  };

  const renderScene = SceneMap({
    messages: renderMessages,
    // notifications: renderNotifications,
  });

  return (
    // <ChatScreen
    
    // />
    // <SpecialistScreenHoc>
    <>
    {renderConfirmModal(
        showAvailableConfirmation,
        setShowAvailableConfirmation,
        "Available",
        "Make sure you are ready to get clients and move to requested locations",
        () => setAvailable(true)
      )}
      {renderConfirmModal(
        showUnavailableConfirmation,
        setShowUnavailableConfirmation,
        "Unavailable",
        "You won't be visible in search results and will not receive any client",
        () => setAvailable(false)
      )}
      <Container>
        {renderHeader()}
        <Spacer position="bottom" size="large" />
        <PaddedContainer style={{ flex: 1 }}>
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </PaddedContainer>
      </Container>
      </>
    // </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InboxSpecialistScreen);
