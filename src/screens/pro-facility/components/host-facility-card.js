import styled, { useTheme } from 'styled-components/native'
import { ContainerGradient } from "../../../components/background/glass-background";
import { rgba } from "polished";
import { View } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/typography.component";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const CardContainer = styled.TouchableOpacity.attrs(props => ({
  shadow: props.theme.shadows.default,
}))`
  border-radius: 10px;
  overflow: hidden;
  background-color: black;
  border: 2px solid #25282b;
`

const CardMediaContainer = styled.ImageBackground`
  position: relative;
  height: 230px;
  justify-content: space-between;
  padding: 16px;
`

const CardInfoContainer = styled.View`
  padding: 20px 16px;
`

const Chip = styled.View.attrs(props => ({
  shadow: props.theme.shadows.default,
}))`
  border-radius: 50px;
  padding: 8px 16px;
  background-color: ${({color, solid=false}) => solid ? color: rgba(color, 0.5)};
`

const ChipContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const AddressContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Address = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const renderFacilityAddress = (address, theme) => {
  return <AddressContainer>
    <Ionicons name="location" size={24} color={theme.colors.brand.secondary} />
    <Spacer position="left" size="medium"/>
    <Address>
      <Text variant="caption" style={{color: "black"}}>{address}</Text>
    </Address>
  </AddressContainer>
}


export const HostFacilityCard = ({facility, ...restProps}) => {
  const theme = useTheme();
  const isOpened = moment(Date.now()).isBefore(moment(facility.closingTime)) && moment(Date.now()).isAfter(moment(facility.openingTime))
  return <CardContainer {...restProps}>
    <CardMediaContainer source={{uri:facility.coverImage}}>
      <ContainerGradient
        colors={[rgba("black", 0.6), rgba("black", 0.1)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View>
        <Text variant="caption" style={{fontSize: 24, color: theme.colors.brand.secondary}}>{facility.name}</Text>
      </View>
      <ChipContainer>
        {facility.isOperational && (
          <View style={{flexDirection: "row"}}>
            <Chip color={theme.colors.brand.secondary}>
              <Text variant="caption" style={{ fontWeight: "light", color: "white"}}>operational</Text>
            </Chip>
            <Spacer position="left" size="medium"/>
          </View>
        )}
        {isOpened ? (
          <View style={{flexDirection: "row"}}>
            <Chip color={theme.colors.brand.secondary}>
              <Text variant="caption" style={{ fontWeight: "light", color: "white"}}>opened</Text>
            </Chip>
            <Spacer position="left" size="medium"/>
          </View>) : (
          <View style={{flexDirection: "row"}}>
            <Chip color={theme.colors.brand.quaternary}>
              <Text variant="caption" style={{ fontWeight: "light", color: "white"}}>closed</Text>
            </Chip>
          </View>
        )}
      </ChipContainer>
    </CardMediaContainer>
    <CardInfoContainer>
      {renderFacilityAddress(facility.address, theme)}
      <Spacer position="bottom" size="large"/>
      <ChipContainer>
        <View style={{flexDirection: "row"}}>
          <Chip color={theme.colors.brand.secondary} solid>
            <Text variant="caption" style={{ fontWeight: "light", color: "white"}}>{facility.seatCapacity} seats</Text>
          </Chip>
          <Spacer position="left" size="large"/>
        </View>
        <View style={{flexDirection: "row"}}>
          <Chip color={theme.colors.brand.quaternary} solid>
            <Text variant="caption" style={{ fontWeight: "light", color: "white"}}>{ facility.availableSeats } seats available</Text>
          </Chip>
          <Spacer position="left" size="medium"/>
        </View>
      </ChipContainer>
    </CardInfoContainer>
  </CardContainer>
}
