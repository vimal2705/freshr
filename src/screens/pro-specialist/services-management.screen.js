import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import { Dimensions, View } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  HeaderContainer,
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { rgba } from "polished";
import { FlatGrid } from "react-native-super-grid";
import ServiceCard from "../components/service-card.component";
import { renderConfirmModal } from "./components/modal.component";
import { SwitchInput } from "./components/switch-component";
import { toggleBottomNavBackground } from "./utils";
import { LoadingScreen } from "../loading.screen";
import { SpecialistContext } from "../../providers/specialist.provider";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.brand.white};
`;

const AddServiceButton = styled.TouchableOpacity`
  background-color: black;
  border: 2px solid #25282b;
  border-radius: 5px;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]};
`;

const ServicesManagementScreen = (props) => {
  const theme = useTheme();
  const [available, setAvailable] = useState(false);
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);

  const {specialistServices, specialist} = useContext(SpecialistContext);

  useEffect(() => {
    toggleBottomNavBackground(available, props.navigation, theme);
  }, [available]);


  if (!specialistServices || !specialist) {
    return <LoadingScreen/>
  }

  useEffect(() => {
    console.log(specialistServices);
  }, [specialistServices])


  const renderHeader = () => {
    return (
      <HeaderContainer>
        <Spacer position="top" size="large" />
        <SectionTitle style={{color: specialist?.isOnline ? theme.colors.ui.primary : "white"}}>Your services</SectionTitle>
      </HeaderContainer>
    );
  };

  const renderAddServiceButton = () => {
    return (
      <AddServiceButton
        onPress={() =>
          props.navigation.navigate("SpecialistCreateService", {
            isEdit: false,
            service: null
          })
        }
      >
        <Ionicons
          name="md-add-circle-outline"
          size={24}
          color={"white"}
        />
        <Spacer position="bottom" size="medium" />
        <Text
          variant="caption"
          style={{
            color: "white",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Add service
        </Text>
      </AddServiceButton>
    );
  };

  const renderServices = () => {
    return (
      <PaddedContainer>
        {specialistServices.map((service) => (
          <ServiceCard
            active={specialist?.isOnline}
            key={service.id}
            service={service}
            press={() => props.navigation.navigate("SpecialistServiceDetails", {service: service})}
            info={true}
            style={{ marginBottom: 8 }}
          />
        ))}
      </PaddedContainer>
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
      <Container>
        {specialistServices.length > 0 ? renderHeader() : null}
        <Spacer position="top" size="large" />
        {renderServices()}
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <PaddedContainer>
          <SectionTitle style={{color: specialist?.isOnline ? theme.colors.ui.primary : "white"}}>Add more services</SectionTitle>
          <Spacer position="top" size="medium" />
          <Text variant="caption" style={{color: specialist?.isOnline ? theme.colors.ui.primary : "white"}}>
            You can add 3 more services based on your subscription
          </Text>
          <Spacer position="top" size="large" />
          {renderAddServiceButton()}

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
)(ServicesManagementScreen);
