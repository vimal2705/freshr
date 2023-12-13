import { Text } from "../../../components/typography/typography.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import styled from "styled-components/native";
import { rgba } from "polished";
import { Row } from "../../../components/helpers/helpers.component";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment/moment";

const WorkTimeContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const TimeContainer = styled.View`
  position: relative;
  z-index: 20;
  flex-direction: row;
  align-items: center;
`;

const TimeTextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 2px;
  position: relative;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;


export const renderTimeText = (value, size = 36) => {
  return (
    <TimeTextContainer>
      <Text
        variant="caption"
        style={{ fontSize: size, color: "white", textTransform: 'uppercase'}}
      >
        {value}
      </Text>
    </TimeTextContainer>
  );
};

export const HourButton = styled.TouchableOpacity.attrs((props) => ({
  shadowColor: rgba(props.theme.colors.brand.primary, 0.5),
  shadowOffset: {
    width: 10,
    height: 10,
  },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 10,
}))`
  flex: 1;
  padding: 16px 4px;
  background-color: ${({ color }) => color};
  border-color: 2px solid ${({borderColor}) => borderColor ? borderColor : "#25282b"};
  border-radius: 5px;
`;

export const renderHourButton = (label, value, toggle, openingHour, closingHour, theme) => {
  return (
    <HourButton
      color={label === 'opening' ? theme.colors.brand.secondary : "#25282b"}
      borderColor={label === 'opening' ? theme.colors.brand.secondary : "#25282b"}
      onPress={toggle}
    >
      <Row style={{justifyContent: "center"}}>
        {label === "opening" ? (
          <FontAwesome5 name="door-open" size={20} color="white" />
        ) : (
          <FontAwesome5 name="door-closed" size={20} color="white" />
        )}
        <Spacer position="left" size="medium" />
        <Text variant="caption" style={{ color: "white", fontSize: 20 }}>
          {`${label} hour`}
        </Text>
      </Row>
      <Spacer position="bottom" size="large"/>
      {label === 'opening' && openingHour && renderTime(openingHour, "")}
      {label !== 'opening' && closingHour && renderTime(closingHour, "")}
    </HourButton>);
};

export const renderHourButtons = (openingHour, closingHour, togglePickerOpening, togglePickerClosing, theme) => {
  return (
    <ButtonContainer>
      {renderHourButton("opening", openingHour, togglePickerOpening, openingHour, closingHour, theme)}
      <Spacer position="left" size="large" />
      {renderHourButton("closing", closingHour, togglePickerClosing, openingHour, closingHour, theme)}
    </ButtonContainer>
  );
};

export const renderTime = (value, label, size = 26, isBookingCard = false) => {
  console.log(value);

  return (
    <WorkTimeContainer isBookingCard={isBookingCard}>
      {!isBookingCard && (
        <>
          <Text variant="caption" style={{ fontSize: 14 }}>
            {label}
          </Text>
          <Spacer position="bottom" size="small" />
        </>
      )}
      <TimeContainer opening={label === 'opening'}>
        {renderTimeText(moment(value).format('hh:mm a'), size)}
      </TimeContainer>
    </WorkTimeContainer>
  );
};
