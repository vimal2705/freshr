import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import { SafeArea } from "../../components/utils/safearea.component";
import {
  HeaderContainer,
  PaddedContainer,
  PageTitle,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { FlatList, View } from "react-native";
import React, { useContext, useState } from "react";
import { FacilityScreenHoc } from "./facility-screen-hoc";
import { OrderCard } from "../pro-specialist/components/order-card.component";
import { HostContext } from "../../providers/facility.provider";
const Container = styled.ScrollView`
  flex: 1;
`;
const StatsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]} 0px;
  background-color: ${({ theme, color }) =>
    color ? color : theme.colors.ui.quaternary};
`;
const StatsCard = styled.View`
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;
const StatItem = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const StatItemRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;
const StatsCardHeader = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[3]};
  align-items: center;
  background-color: ${({ color }) => color};
`;
const FacilityAnalyticsScreen = (props) => {
  const theme = useTheme();
  const [showBookingList, setShowBookingList] = useState(false);
  const { history } = useContext(HostContext);
  const isToday = (date) => {
    const currentDate = new Date();
    // Assuming date is a string or a Date object
    const createdAt = new Date(date);
    // Compare the dates
    return (
      createdAt.getDate() === currentDate.getDate() &&
      createdAt.getMonth() === currentDate.getMonth() &&
      createdAt.getFullYear() === currentDate.getFullYear()
    );
  };
  const toggleShowBookingList = () => {
    setShowBookingList(!showBookingList);
  };

  const todayOrders = history.filter((order) => isToday(order.createdAt));
  const previousOrders = history.filter((order) => !isToday(order.createdAt));
  
  const renderHeader = () => {
    return (
      <HeaderContainer>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <PageTitle style={{ color: "black" }}>History</PageTitle>
      </HeaderContainer>
    );
  };
  const renderHistory = (orders) => {
    return (
      <FlatList
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        data={orders.length === 0 ? ["empty"] : orders}
        renderItem={({ item }) => {
          if (item === "empty") {
            return <View style={{ flex: 1 }} />;
          } else {
            return (
              <OrderCard
                style={{ marginBottom: 3, paddingVertical: 7 }}
                isClient={false}
                order={item}
                isHost={true}
                isfrom={"host"}
                showSpecialist={false}
                navigation={props.navigation}
              />
            );
          }
        }}
        keyExtractor={(item) => `completed}-${item.id}`}
      />
    );
  };
  return (
    <FacilityScreenHoc>
      <Container showsVerticalScrollIndicator={false}>
        {renderHeader()}
        <PaddedContainer style={{ flex: 1 }}>
          <Spacer position="top" size="large" />
          <SectionTitle style={{ color: "black" }}>Today's Booking {`(${todayOrders.length})`}</SectionTitle>
          <Spacer position="top" size="medium" />
          {renderHistory(todayOrders)}
          <Spacer position="top" size="large" />
          <SectionTitle style={{ color: "black" }}>Previous Booking history {`(${previousOrders.length})`}</SectionTitle>
          <Spacer position="bottom" size="medium" />
          {renderHistory(previousOrders)}
        </PaddedContainer>
      </Container>
    </FacilityScreenHoc>
  );
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(FacilityAnalyticsScreen);