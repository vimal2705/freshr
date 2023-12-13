import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import React, { useEffect, useState } from "react";
import { rgba } from "polished";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import { View } from "react-native";
import { Spacer } from "../components/spacer/spacer.component";
import { SectionTitle } from "./components/details-screen.component";
import ServiceCard from "./components/service-card.component";
import FacilityCard from "./components/facility-card.component";
import SpecialistCard from "./components/specialist-card.component";
import {
  ActionButton,
  ButtonContainer,
} from "../components/button/process-action-button.component";
import { ServiceDetailsModal } from "../components/bottom-sheet/bottom-sheet.component";
import { setBookingStep } from "../redux/booking/booking.actions";
import { Text } from "../components/typography/typography.component";
import BookingStepper from "./components/booking-stepper.component";
import { CancelButton } from "../components/button/button.component";

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.space[3]};
  margin-bottom: 100px;
`;

const Separator = styled(DashedLine)`
  flex-direction: row;
  height: 3px;
`;

const CenteredRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.sizes[2]};
  border: 1px solid ${({ theme }) => rgba(theme.colors.ui.primary, 0.05)};
`;

const PriceCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.sizes[1]};
  background-color: ${({ theme }) => theme.colors.ui.primary};
`;

const PriceContainer = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[2]};
  background-color: white;
  border-radius: ${({ theme }) => theme.sizes[1]};
  align-items: center;
  justify-content: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const EditButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  border-radius: 5px;
  padding: ${({ theme }) => theme.space[2]};
`;

const BookingReviewScreen = ({ booking, navigation, ...restProps }) => {
  const theme = useTheme();
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log("ASDa");
    setTotalPrice(
      booking.services.reduce(
        (result, currentService) => result + currentService.price,
        0
      )
    );
    restProps.setBookingStep(2);
  }, []);

  const handleShowViewMore = (service) => {
    setSelectedService(service);
  };
  const handleCloseViewMore = () => {
    setSelectedService(null);
  };
  return (
    <View style={{ flex: 1 }}>
      <BookingStepper pageStep={2} />
      <Container showsVerticalScrollIndicator={false}>
        <Content>
          <Row>
            <SectionTitle>Services</SectionTitle>
            <EditButton
              onPress={() =>
                navigation.navigate("SpecialistDetails", { edit: true })
              }
            >
              <Entypo name="edit" size={20} />
            </EditButton>
          </Row>
          <Spacer position="bottom" size="medium" />
          <View style={{ flex: 1 }}>
            {booking.services.map((service) => (
              <Spacer key={service.id} position="bottom" size="medium">
                <ServiceCard
                  service={service}
                  info={true}
                  press={() => handleShowViewMore(service)}
                />
              </Spacer>
            ))}
          </View>

          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />
          <Separator
            axis="horizontal"
            dashLength={8}
            dashThickness={2}
            dashGap={5}
            dashColor={rgba(theme.colors.ui.primary, 0.1)}
          />
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />
          <Row>
            <SectionTitle>The facility</SectionTitle>
          </Row>
          <Spacer position="bottom" size="medium" />
          <CenteredRow>
            <FacilityCard facility={booking.facility} />
          </CenteredRow>
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />
          <Separator
            axis="horizontal"
            dashLength={8}
            dashThickness={2}
            dashGap={5}
            dashColor={rgba(theme.colors.ui.primary, 0.1)}
          />
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />
          <SectionTitle>Your specialist</SectionTitle>
          <Spacer position="bottom" size="medium" />
          {booking.specialist && (
            <SpecialistCard
              specialist={booking.specialist}
              active={true}
              navigation={navigation}
            />
          )}
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />
          <Separator
            axis="horizontal"
            dashLength={8}
            dashThickness={2}
            dashGap={5}
            dashColor={rgba(theme.colors.ui.primary, 0.1)}
          />
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />
          <PriceCard>
            <Text variant="caption" style={{ color: "white", fontSize: 22 }}>
              Total
            </Text>
            <PriceContainer>
              <MaterialIcons
                name="attach-money"
                size={22}
                color={theme.colors.ui.primary}
              />
              <Spacer position="left" size="large" />
              <Text variant="caption" style={{ fontSize: 22 }}>
                {totalPrice}
              </Text>
            </PriceContainer>
          </PriceCard>

          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="large" />

          <CancelButton onPress={() => navigation.navigate("Map")}>
            <AntDesign name="close" size={14} color="white" />
            <Spacer position="left" size="small" />
            <Text variant="caption" style={{ color: "white" }}>
              Cancel booking and go back to map
            </Text>
          </CancelButton>
        </Content>
      </Container>
      <ButtonContainer
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }}
      >
        {/*<ActionButton*/}
        {/*  height={50}*/}
        {/*  style={{ backgroundColor: theme.colors.ui.primary }}*/}
        {/*  onPress={() => navigation.navigate("Checkout")}*/}
        {/*>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      color: "white",*/}
        {/*      fontWeight: "bold",*/}
        {/*      fontSize: 16,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Cancel booking*/}
        {/*  </Text>*/}
        {/*</ActionButton>*/}
        {/*<Spacer position="left" size="small" />*/}
        <ActionButton
          height={50}
          onPress={() => navigation.navigate("OrderCompleted")}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Checkout
          </Text>
        </ActionButton>
      </ButtonContainer>
      {selectedService && (
        <ServiceDetailsModal
          showModal={true}
          toggleShowModal={handleCloseViewMore}
          service={selectedService}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  booking: state.booking,
});

const mapDispatchToProps = (dispatch) => ({
  setBookingStep: (step) => dispatch(setBookingStep(step)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingReviewScreen);
