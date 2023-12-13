import { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SceneMap, TabBar, TabBarItem, TabView } from "react-native-tab-view";
import { FlatList, useWindowDimensions, View,RefreshControl } from "react-native";
import { rgba } from "polished";

import { Spacer } from "../../components/spacer/spacer.component";
import { SafeArea } from "../../components/utils/safearea.component";
import { Text } from "../../components/typography/typography.component";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { renderTabBar } from "./utils";
import { TabViewContainer } from "../../components/tabs/tabs.component";
import {
  HeaderContainer,
  PageTitle,
} from "../components/details-screen.component";
import { AppContext } from "../../providers/app-provider";
import axios from "axios";
import { BASE_API_URL } from "../../constants";
import { LoadingScreen } from "../loading.screen";
import { AuthContext } from "../../providers/auth/auth.context";

export const Container = styled.View`
  flex: 1;
`;

const MessagesListContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  flex: 1;
`;

const NotificationsContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  padding: ${({ theme }) => theme.space[3]} 0px;
  flex: 1;
`;

const MessageCardContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[1]};
`;

const Separator = styled.View`
  height: 2px;
  background-color: ${({ theme }) => rgba(theme.colors.ui.primary, 0.05)};
`;

const MessageCardContent = styled.View`
  flex-direction: row;
  flex: 1;
`;

const MessageCardMessagePreview = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  padding-right: ${({ theme }) => theme.space[3]};
`;

const MessageCardStatusContainer = styled.View``;

const MessageCardStatusCnt = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.ui.primary};
`;

const NotificationCardContainer = styled.View.attrs((props) => ({
  style: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    width: 350,
  },
}))`
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.sizes[2]};
  background-color: white;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const NotificationCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const NotificationCardStatus = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.brand.primary : "white"};
  position: absolute;
  top: ${({ theme }) => theme.space[1]};
  left: ${({ theme }) => theme.space[1]};
`;

const NotificationTimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NotificationCard = ({ notification }) => {
  const theme = useTheme();
  const {
    time = "1 hour ago",
    title = "Information",
    content = "lorem ipsum",
    icon,
  } = notification;




  return (
    <NotificationCardContainer>
      <NotificationCardStatus active={true} />
      <NotificationCardHeader>
        <Ionicons
          name="md-information-circle"
          size={30}
          color={theme.colors.brand.primary}
        />
        <NotificationTimeContainer>
          <Ionicons
            name="md-time-outline"
            size={18}
            color={rgba(theme.colors.ui.primary, 0.4)}
          />
          <Spacer position="left" size="small" />
          <Text style={{ fontSize: 12 }}>{time}</Text>
        </NotificationTimeContainer>
      </NotificationCardHeader>
      <Spacer position="bottom" size="large" />
      <Text variant="caption" styled={{ fontSize: 20 }}>
        {title}
      </Text>
      <Spacer position="bottom" size="large" />
      <Text style={{ fontSize: 14, lineHeight: 20 }}>{content}</Text>
      <Spacer position="bottom" size="large" />
    </NotificationCardContainer>
  );
};

const MessageCard = ({ latestMessage, order }) => {
  const theme = useTheme(); 
  const navigation = useNavigation();
  const {user} = useContext(AuthContext)
  const isClient = true
  const receiver =  {
      _id: order?.specialist?.id,
      name: `${order?.specialist?.user.firstName} ${order?.specialist?.user.lastName}`,
      avatar: order?.specialist?.user.photo,
    }
  const latestMessageAvatar = latestMessage.user?._id === order?.specialist?._id ? order?.specialist?.user.photo : order?.client?.photo;
  return (
    <>
      <Spacer position="top" size="medium" />
      <MessageCardContainer
        onPress={() =>  navigation.navigate("Chat", {
            order: order.id,
            orderObj: order,
            sender: order.client.id,
            isClient:isClient,
            receiver:receiver,
          })
        }
      >
        <Avatar.Image source={{ uri: latestMessageAvatar }} />
        <Spacer position="left" size="large" />
        <MessageCardContent>
          <View>
            <Text variant="caption" style={{ fontSize: 14, color: theme.colors.brand.primary }}>
              {`${order?.specialist?.user.firstName} ${order?.specialist?.user.lastName}`}
            </Text>
            <Spacer position="bottom" size="medium" />
            <MessageCardMessagePreview numberOfLines={1} ellipsis="tail" style={{color: "black"}}>
              {latestMessage?.text} 
            </MessageCardMessagePreview>
          </View>
        </MessageCardContent>
        <MessageCardStatusContainer>
          <Text  variant="caption">{latestMessage?.time}</Text>
          <Spacer position="bottom" size="small" />

          {/*<MessageCardStatusCnt>*/}
          {/*  <Text variant="caption" style={{ color: "white" }}>*/}
          {/*    {latestMessage.unreadCnt}*/}
          {/*  </Text>*/}
          {/*</MessageCardStatusCnt>*/}
        </MessageCardStatusContainer>
      </MessageCardContainer>
      <Separator />
    </>
  );
};

// const notificationsData = [
//   {
//     id: 1,
//     title: "Informational",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat justo ac tortor hendrerit",
//     time: "2 hour ago",
//   },
//   {
//     id: 2,
//     title: "Informational",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat justo ac tortor hendrerit",
//     time: "2 hour ago",
//   },
//   {
//     id: 3,
//     title: "Informational",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat justo ac tortor hendrerit",
//     time: "2 hour ago",
//   },
// ];

const InboxScreen = (props) => {
  const layout = useWindowDimensions();
  const [notifications, setNotifications] = useState([]);
  const {chatRooms, fetchMessages, loading,onRefreshMessages,refreshingMessages } = useContext(AppContext)


 

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "messages", title: "Messages" },
    // { key: "notifications", title: "Notifications" },
  ]);

  useEffect(() => {
    fetchMessages();
    console.log("normal app ::::", chatRooms);
  }, []);



  if (loading) {
    return <LoadingScreen/>
  }

  const renderNotifications = () => {
    return (
      <NotificationsContainer>
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationCard notification={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </NotificationsContainer>
    );
  };

  const renderMessages = () => {
    return (
      <MessagesListContainer>
        <FlatList
          data={chatRooms}
          refreshControl={
            <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshingMessages} onRefresh={onRefreshMessages} />
          }
          renderItem={({ item }) => 
            item.messages[item.messages.length - 1] ? <MessageCard latestMessage={item.messages[item.messages.length - 1]} order={item.order} /> : <></>
        }
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </MessagesListContainer>
    );
  };
 

  const renderScene = SceneMap({
    messages: renderMessages,
    // notifications: renderNotifications,
  });

  return (
    <SafeArea>
      <Container>
        <HeaderContainer>
          <Spacer position="top" size="large" />
          <PageTitle style={{color: "black"}}>Inbox</PageTitle> 
          <Spacer position="top" size="large" />
        </HeaderContainer>
        <TabViewContainer style={{backgroundColor: "white"}}>
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </TabViewContainer>
        {/*{renderOrderClient({pendingOrders, navigation: props.navigation})}*/}

      </Container>

    </SafeArea>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(InboxScreen);
