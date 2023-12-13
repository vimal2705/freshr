import { useContext, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { rgba } from "polished";
import { Checkbox } from "react-native-paper";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import {
  addServiceToCart,
  removeServiceFromCart,
} from "../../redux/booking/booking.actions";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { AuthContext } from "../../providers/auth/auth.context";
import { AppContext } from "../../providers/app-provider";
import { Alert } from "react-native";

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 6px;
`;
const ServiceCardContainer = styled.TouchableOpacity`
  width: 100%;
  background-color: ${({white}) => white ? "white" : "black"};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 2px solid ${({ active, theme }) =>
    active
      ? theme.colors.brand.primary
      : "#25282b"};
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.sizes[1]};
  height: 100px;
`;

const ServiceCardContentContainer = styled.View`
  flex: 1;
  position: relative;
`;

const ServiceRight = styled.View`
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServiceImage = styled.Image.attrs((props) => ({
  resizeMode: "cover",
}))`
  border-radius: ${({ theme }) => theme.sizes[1]};
  height: 85%;
  aspect-ratio: 1;
`;

const Title = styled(Text)`
  font-size: 13px;
  font-weight: bold;
`;

const TileContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Tile = styled.View`
  padding: ${({ theme }) => theme.space[1]};
  justify-content: center;
  align-items: center;
  position: relative;

  background-color: #25282b;
  border-radius: ${({ theme }) => theme.sizes[1]};
`;

const PriceTag = styled.View`
  background-color: #25282b;
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.sizes[1]};
`;

const TileIndicator = styled.View`
  background-color: ${({ active, theme }) =>
    active ? theme.colors.ui.primary : "white"};
  height: 6px;
  width: 6px;
  border-radius: 100px;
  position: absolute;
  top: -3px;
  right: -3px;
`;

const MoneyText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
`;

const FloatingMoreButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: ${({active}) => active ? "transparent" : "black" };
  border-radius: 100px;
  z-index: 1;
`;

const ServiceCard = ({
  disabled=false,
  service = {},
  onMorePress,
  info = false,
  cart,
  addCartItem,
  removeCartItem,
  logout,
  press = null,
  active,
  userr=false,
}) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const[user1,setuser1]=useState();
  // const { onLogout} = useContext(AuthContext)
  // const {  getUser } = useContext(AppContext);

  // const { user } = await getUser();
//   useEffect(()=>{
// (async ()=>{
//   const { user } = await getUser();
//   console.log("mmmmssssssssssssssss", user);
// })()
//   }, [])

console.log("oguserrr",userr);
  const handlePress = async() => {
    // const { user } = await getUser();
    // setuser1(user);

    console.log("myyyyyy userrrrr", userr);
    if(userr){
      Alert.alert('Authorized user requied', 'You need to signup to access the feature', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'SignUp', onPress: () => logout()},
      ]);
    }
  else{
      setChecked((oldValue) => {
        if (!info) {
          if (oldValue) {
            removeCartItem(service);
          } else {
            addCartItem(service);
          }
        }
        return !checked;
      });
    // console.log("");
  }
  };

  useEffect(() => {
    setChecked(cart.filter((item) => item.id === service.id).length > 0);
  }, [cart]);

  const { serviceType, price, forMale, forFemale, photo } = service;

  return (
    <Container active={active}>
      {!info && (
        <FloatingMoreButton onPress={()=>onMorePress()} active={active}>
          <MaterialIcons name="more-horiz" size={20} color={theme.colors.brand.primary}/>
        </FloatingMoreButton>
      )}
      <ServiceCardContainer
        onPress={press ? press : (disabled ? () => null : handlePress)}
        active={!info && checked}
        white={active}
      >
        <ServiceImage source={{ uri: photo }} />
        <Spacer position="left" size="medium" />
        <ServiceCardContentContainer>
          <Title numberOfLines={1} style={{color: active ? theme.colors.ui.primary : "white"}}>{serviceType.name}</Title>
          <Spacer position="bottom" size="medium" />
          <TileContainer>
            <Tile active={forMale}>
              <Ionicons
                name="man"
                size={14}
                color={
                  forMale ? theme.colors.brand.primary : "black"
                }
              />
              <TileIndicator active={forMale} />
            </Tile>
            <Spacer position="left" size="medium" />

            <Tile active={forFemale}>
              <Ionicons
                name="woman"
                size={14}
                color={
                  forFemale ? theme.colors.brand.primary : "black"
                }
              />
              <TileIndicator
                active={forFemale}
              />
            </Tile>
          </TileContainer>
        </ServiceCardContentContainer>
        <ServiceRight>
          <PriceTag>
            <MaterialIcons
              name="attach-money"
              size={14}
              color={"white"}
            />
            <Spacer position="left" size="small" />
            <MoneyText style={{color: "white"}}>{price}</MoneyText>
            <Spacer position="left" size="small" />
          </PriceTag>
          {!info && (
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              color={theme.colors.brand.primary}
            />
          )}
        </ServiceRight>
      </ServiceCardContainer>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  cart: state.booking.services,
});

const mapDispatchToProps = (dispatch) => ({
  addCartItem: (service) => dispatch(addServiceToCart(service)),
  removeCartItem: (service) => dispatch(removeServiceFromCart(service)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ServiceCard);
