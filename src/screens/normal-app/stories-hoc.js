import { SafeArea } from "../../components/utils/safearea.component";
import { Dimensions, FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { renderOrderClient } from "../../utils/renderOrderClient";
import { useContext, useState } from "react";
import { SpecialistContext } from "../../providers/specialist.provider";
import { TopNavContainer } from "../pro-specialist/components/top-nav.component";
import { SmallButton } from "../../components/button/button.component";
import { Text } from "../../components/typography/typography.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Feather, Ionicons } from "@expo/vector-icons";
import { renderConfirmModal } from "../pro-specialist/components/modal.component";
import styled, { useTheme } from "styled-components/native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/navbar/navbar.component";

const ProfileAvatar = styled.ImageBackground`
  height: 44px;
  width: 44px;
  border-radius: 44px;
  overflow: hidden;
  background-color: #25282b;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const StoriesHoc = ({children, showBackButton=false}) => {
  const theme = useTheme();
  const {queue } = useContext(SpecialistContext)
  const navigation = useNavigation();
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {isLoading, error, specialist, goOnline, goOffline, startQueue, stopQueue,specialistServices, loadSpecialistData , orders } = useContext(SpecialistContext)
  const [showQueueConfirmation, setShowQueueConfirmation] = useState(false);
  const [showStopQueueConfirmation, setShowStopQueueConfirmation] =
    useState(false);


  const renderTopNav = () => {
    return (
      <TopNavContainer style={{ backgroundColor: "transparent" }}>
        <Row>
          {showBackButton && <BackButton onPress={() => navigation.goBack()} elevation={2}
                       style={{ backgroundColor: "black", marginRight: 20 }}>
            <Ionicons name="arrow-back" size={20} color={"white"} />
          </BackButton>}
    
        </Row>
      
      </TopNavContainer>
    );
  };
  // const pendingOrders = orders.filter(order => order.status === 'PENDING')
  // const currentOrder = orders.filter(order => order.status === 'IN_TRAFFIC')[0]
  // const ongoingOrder = orders.filter(order => order.status === 'ONGOING')[0]
  // let queue = [...pendingOrders]
  // if (currentOrder) {
  //   queue = [currentOrder, ...queue]
  // }
  // if (ongoingOrder) {
  //   queue = [ongoingOrder, ...queue]
  // }

  const _goOnline = async () => {
    await goOnline();
  }

  const _startQueue = async () => {
    // if (!specialist?.isOnline ) {
    //   await goOnline();
    // }
    await startQueue()
  }

  const _stopQueueCancelAction = async () => {
    // if (!specialist?.isOnline) {
    //   await goOnline();
    // }
  }


  return <SafeArea style={{backgroundColor:  specialist?.isOnline ? theme.colors.brand.white : "black"}}>
    {renderConfirmModal(
      showAvailableConfirmation,
      setShowAvailableConfirmation,
      "Available",
      "Make sure you are ready to get clients and move to requested locations",
      _goOnline,
      null,
      true,
    )}
    {renderConfirmModal(
      showUnavailableConfirmation,
      setShowUnavailableConfirmation,
      "Unavailable",
      "You won't be visible in search results and will not receive any client",
      () => goOffline()
    )}
    {renderConfirmModal(
      showQueueConfirmation,
      setShowQueueConfirmation,
      "Start queue",
      "Make sure you are ready to get clients in the queue",
      _startQueue
    )}
    {renderConfirmModal(
      showStopQueueConfirmation,
      setShowStopQueueConfirmation,
      "Stop queue",
      "You will receive requests one at a time",
      () => stopQueue(),
      _stopQueueCancelAction,
    )}
    {renderTopNav()}

    <FlatList
      data={[1]}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      style={{flex: 0, height: 0,  backgroundColor: "transparent", zIndex: -1}}
      refreshControl={
        <RefreshControl style={{ position: "absolute", top: 10 }} refreshing={refreshing} onRefresh={loadSpecialistData} />
      }
      ListHeaderComponent={<><View style={{flex: 1, minHeight: Dimensions.get("window").height * 0.8, height: "100%",  position: 'relative'}}>

        {children}
        {queue && renderOrderClient({pendingOrders: queue, navigation: navigation, isClient: false, showSpecialist: false, normal: false})}

      </View></>}
      renderItem={() => <View style={{height: 0}}/>}/>
  </SafeArea>
}
