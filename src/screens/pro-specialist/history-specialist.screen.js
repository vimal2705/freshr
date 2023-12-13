import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import { Dimensions, FlatList, RefreshControl, useWindowDimensions, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Spacer } from "../../components/spacer/spacer.component";
import {
  HeaderContainer,
  PaddedContainer,
  PageTitle,
} from "../components/details-screen.component";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import { OrderCard } from "./components/order-card.component";
import { SpecialistContext } from "../../providers/specialist.provider";
import { LineChart, makeGraph } from "./components/graph.component";
import { round } from "react-native-redash";
import { rgba } from "polished";
import { Text } from "../../components/typography/typography.component";
import * as Progress from "react-native-progress";


const GRAPH_HEIGHT = 150;
const GRAPH_WIDTH = Dimensions.get("window").width - 32;


const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const StatsContainer = styled.ScrollView`
  position: relative;
  padding: 8px 0px;
`;

const StatItemContainer = styled.View`
  padding: 16px;
  align-items: center;
`;

const HistorySpecialistScreen = (props) => {
  const theme = useTheme();
  const {history, specialist, refreshing, onRefresh, profitPerDay} = useContext(SpecialistContext)

  // const [balance, setBalance] = useState("");
  // const [progressPlaceHolder, setProgressPlaceHolder] = useState(0);
  //
  // const [graphData, setGraphData] = useState([]);
  //
  //
  //
  // useEffect(() => {
  //   setProgressPlaceHolder(0.3);
  //   const graphDataGen = [makeGraph(profitPerDay)]
  //   setGraphData(graphDataGen);
  // }, []);
  // const updateBalance = (graphIndex) => {
  //   const sum = profitPerDay
  //     .map((val) => val.value)
  //     .reduce((partialSum, a) => partialSum + a, 0);
  //   setBalance(round(sum, 1).toLocaleString("en-US", { currency: "USD" }));
  // };
  //
  // useEffect(() => {
  //   updateBalance(0);
  // }, [graphData]);
  //

  const renderHistory = () => {
    return (
    <FlatList
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={history?.length === 0 ? ['empty'] : history}
      renderItem={({ item }) => {
        if (item === 'empty') {
          return <View style={{flex: 1}}/>
        } else {
          return (
            <OrderCard 
            isSpecialist={true}
            style={{ marginBottom: 10, paddingVertical: 7 }}
            isClient={false} 
            order={item}
            showSpecialist={false} 
            navigation={props.navigation} 
            />
          )
        }
      }}
      keyExtractor={(item) => `completed}-${item.id}`}
    />
    );
  };

  const renderHeader = () => {
    return (
      <HeaderContainer>
        {/*<Spacer position="top" size="large" />*/}
        {/*<Spacer position="bottom" size="large" />*/}
        {/*<PaddedContainer>{renderStats()}</PaddedContainer>*/}
        {/*<Spacer position="bottom" size="large" />*/}
        {/*{graphData.length > 0 && (*/}
        {/*  <LineChart*/}
        {/*    height={GRAPH_HEIGHT}*/}
        {/*    width={GRAPH_WIDTH}*/}
        {/*    data={graphData}*/}
        {/*    fill="transparent"*/}
        {/*    stroke={theme.colors.brand.primary}*/}
        {/*    strokeWidth={3}*/}
        {/*    setBalance={updateBalance}*/}
        {/*  />*/}
        {/*)}*/}
        <PageTitle style={{color: specialist?.isOnline ? "black" : "white"}}>History</PageTitle>
      </HeaderContainer>
    );
  };

  return (
    <SpecialistScreenHoc>
        <Container style={{backgroundColor: specialist?.isOnline ? theme.colors.brand.white : "black"}}>
          {renderHeader()}
          <Spacer position="bottom" size="medium" />
          {/*{renderCalendarComp()}*/}
          <Spacer position="bottom" size="large" />
          {/*<Spacer position="bottom" size="large" />*/}
          <PaddedContainer style={{ flex: 1 }}>
            {renderHistory()}
          </PaddedContainer>
        </Container>
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistorySpecialistScreen);
