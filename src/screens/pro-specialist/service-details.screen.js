import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons, MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState, useContext } from "react";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { DescriptionContainer, QuoteIconContainer, Text } from "../../components/typography/typography.component";
import { SwitchInput } from "./components/switch-component";
import { toggleBottomNavBackground } from "./utils";
import { facilitiesMock } from "../../mocks/facilities-mock";
import { renderConfirmModal } from "./components/modal.component";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { rgba } from "polished";
import { HistoryCard } from "./components/history-card.component";
import { LoadingScreen } from "../loading.screen";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import { SliderBox } from "react-native-image-slider-box";
import { SpecialistContext } from "../../providers/specialist.provider";

const { height, width } = Dimensions.get("window");


const Container = styled.View`
  flex: 1;
  background-color: ${({active, theme}) => active ? theme.colors.brand.white : "black"};
`;

const Gradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const GlassBackground = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Row = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
`;

const PriceContainer = styled.View`
  position: relative;
  padding: 16px;
  border-radius: 15px;
  overflow: hidden;
`;

const CoverImage = styled.ImageBackground`
  height: 250px;
  overflow: hidden;
  width: 100%;
  position: relative;
  background-color: black;
`;

const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatsItem = styled.View`
  background-color: black;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  border: 2px solid #25282b;
  padding: 16px;
  margin-bottom: 2px;
`;

const StatsRowSeparator = styled.View`
  height: 70%;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.ui.primary};
`;

const ServiceDetailsScreen = (props) => {
  const theme = useTheme();

  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");
  const [service, setService] = useState(null);
  const [servicingCnt, setServicingCnt] = useState(0);
  const {specialist, deleteService, onGetServiceStats, isLoading} = useContext(SpecialistContext)


  const [available, setAvailable] = useState(false);
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);

  useEffect(() => {
    toggleBottomNavBackground(available, props.navigation, theme);
  }, [available]);

  useEffect(() => {
    if (props.route.params.service) {
      setService(props.route.params.service);
      setCoverImage({uri: props.route.params.service.photo});
      setDescription(props.route.params.service.description);
      onGetServiceStats(props.route.params.service.id, setServicingCnt);
    }
  }, [props.route])


  const deleteThisService = async () => {
    await deleteService(service.id)
    props.navigation.goBack();
  }

  if (!service || isLoading) {
    return <LoadingScreen/>
  }


  const renderCoverImage = () => {
    return (<View style={{position: "relative"}}>
      <View style={{position: "absolute", left: 32, bottom: 0, paddingVertical: 12, paddingHorizontal: 16, zIndex: 3, backgroundColor: rgba(theme.colors.brand.primary, 1)}}>
        <SectionTitle style={{ color: "white" }}>{service.serviceType.name}</SectionTitle>
      </View>
      <SliderBox
        images={[coverImage]}
        width={width - 32}
        sliderBoxWidth={width - 16}
        sliderBoxHeight={height * 0.25}
        dotColor={theme.colors.brand.primary}
        paginationBoxVerticalPadding={20}
        autoplay
        // style={{
        //   backgroundColor: darkTheme ? "black" : 'white'
        // }}
        // containerStyle={{
        //   backgroundColor: darkTheme ? "black" : 'white'
        // }}
        circleLoop
        resizeMethod={"resize"}
        resizeMode={"cover"}
        paginationBoxStyle={{
          position: "absolute",
          bottom: 0,
          padding: 0,
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          padding: 0,
          margin: 0,
          backgroundColor: "rgba(128, 128, 128, 0.92)",
        }}
        ImageComponentStyle={{
          borderRadius: 15,
          width: "97%",
          marginTop: 5,
          backgroundColor: "black"
        }}
        imageLoadingColor="black"
      />
      </View>);
  };

  const renderDescription = () => {
    return (
      <PaddedContainer>
        <DescriptionContainer style={{backgroundColor: "#25282b", borderColor: "black", padding: 20, textAlign: "center", alignItems: "center"}}>
          <QuoteIconContainer style={{ bottom: 0, right: 0, backgroundColor: "black", borderRadius: 0 }}>
            <MaterialIcons name="format-quote" size={13} color={"white"} />
          </QuoteIconContainer>
          <Text style={{ lineHeight: 22, fontSize: 14, color: "white" }}>{description}</Text>
          <QuoteIconContainer style={{ top: 0, left: 0, backgroundColor: "black", borderRadius: 0}}>
            <MaterialIcons name="format-quote" size={13} color={"white"} />
          </QuoteIconContainer>
        </DescriptionContainer>
      </PaddedContainer>
    );
  };

  const renderRating = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          variant="caption"
          style={{
            fontSize: 24,
            color: theme.colors.brand.primary,
          }}
        >
          {service.rating}
        </Text>
        <Spacer position="left" size="small" />
        <AntDesign name="star" size={20} color={theme.colors.brand.primary} />
      </View>
    );
  };

  const renderStatsRow = () => {
    return (
      <View style={{ backgroundColor: rgba(theme.colors.brand.primary, 0.05) }}>
        <Spacer position="top" size="large" />

        <PaddedContainer>
          <StatsItem style={{ alignItems: "center" }}>
            <Text
              variant="caption"
              style={{
                fontWeight: "bold",
                textDecorationColor: "white",
                textTransform: "uppercase",
                letterSpacing: 1,
                color: theme.colors.brand.primary
              }}
            >
              Cost per service
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.brand.primary }}>$ {service.price.toFixed(2)}</Text>
          </StatsItem>
          <StatsItem style={{ alignItems: "center" }}>
            <Text
              variant="caption"
              style={{
                fontWeight: "bold",
                textDecorationColor: "white",
                textTransform: "uppercase",
                letterSpacing: 1,
                color: theme.colors.brand.primary
              }}
            >
              Duration
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.brand.primary }}>{service.estimatedDuration?.minutes || 30} min</Text>
          </StatsItem>
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />

          <StatsItem style={{ alignItems: "center" }}>
            <Text
              variant="caption"
              style={{
                fontWeight: "bold",
                textDecorationColor: "white",
                color: "white"
              }}
            >
              Total profit
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.brand.primary }}>$ {(servicingCnt * service.price).toFixed(2)}</Text>
          </StatsItem>
          <StatsItem style={{ alignItems: "center" }}>
            <Text
              variant="caption"
              style={{
                fontWeight: "bold",
                textDecorationColor: "white",
                color: "white"
              }}
            >
              Service completed
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.brand.primary }}>{servicingCnt}</Text>
          </StatsItem>

        </PaddedContainer>

        {/*<StatsRow>*/}
          {/*<StatsItem style={{ alignItems: "center" }}>*/}
          {/*  {renderRating()}*/}
          {/*  <Spacer position="bottom" size="medium" />*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      color: theme.colors.ui.primary,*/}
          {/*      textDecorationLine: "underline",*/}
          {/*      fontWeight: "bold",*/}
          {/*      textDecorationColor: "white",*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    reviews (12k)*/}
          {/*  </Text>*/}
          {/*</StatsItem>*/}
          {/*<StatsRowSeparator />*/}



        {/*</StatsRow>*/}
        <Spacer position="top" size="large" />
      </View>
    );
  };

  const renderBeforeHistoryList = () => {
    return (
      <>
        <Spacer position="top" size="large" />
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 0}}>
          <PaddedContainer style={{flexDirection: "row", paddingVertical: 0}}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("SpecialistCreateService", {
                  isEdit: true,
                  service: service
                })
              }
              style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.brand.primary, padding: 8, borderRadius: 2, justifyContent: "space-between" }}
            >
              <Entypo
                name="edit"
                size={14}
                color={"white"}
              />
              <Spacer position="left" size="medium"/>
              <Text variant="caption" style={{ fontSize: 14, color: "white" }}>
                Edit Service
              </Text>
            </TouchableOpacity>
          </PaddedContainer>

          <PaddedContainer style={{flexDirection: "row", paddingVertical: 0}}>
            <TouchableOpacity
              onPress={() => setShowDeleteServiceModal(true)}
              style={{ flexDirection: "row", alignItems: "center", backgroundColor: specialist?.isOnline ? "white" : "black", borderWidth: 2, borderColor: theme.colors.brand.secondary, padding: 8, borderRadius: 2, justifyContent: "space-between" }}
            >
              <AntDesign name="close" size={14} color={theme.colors.brand.secondary} />
              <Spacer position="left" size="medium"/>
              <Text variant="caption" style={{ fontSize: 14, color: specialist?.isOnline ? "black" : "white" }}>
                Delete service
              </Text>
            </TouchableOpacity>
          </PaddedContainer>
        </View>

        <Spacer position="top" size="large" />
        {renderCoverImage()}

        <Spacer position="top" size="large" />
        {renderDescription()}
        <Spacer position="top" size="large" />

        {renderStatsRow()}
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        {service?.history && <PaddedContainer>
          <SectionTitle>History</SectionTitle>
        </PaddedContainer>}
        <Spacer position="top" size="large" />
      </>
    );
  };

  const renderAfterHistoryList = () => {
    return (
      <>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
      </>
    );
  };
  const renderHistory = () => {
    return (
      <View style={{ position: "relative" }}>
        <FlatList
          ListHeaderComponent={renderBeforeHistoryList}
          ListFooterComponent={renderAfterHistoryList}
          showsVerticalScrollIndicator={false}
          data={service?.history || []}
          renderItem={({ item }) => (
            <PaddedContainer key={item.id}>
              <HistoryCard />
              <Spacer position="bottom" size="medium" />
            </PaddedContainer>
          )}
          keyExtractor={(item) => item.id}
          // style={{ backgroundColor: theme.colors.ui.quaternary }}
        />
      </View>
    );
  };
  return (
   <SpecialistScreenHoc showBackButton={true}>
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
     {renderConfirmModal(
       showDeleteServiceModal,
       setShowDeleteServiceModal,
       "Delete service",
       "Are you sure you want to delete this service?",
       deleteThisService
     )}
     <Container active={specialist?.isOnline}>{renderHistory()}</Container>
   </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceDetailsScreen);
