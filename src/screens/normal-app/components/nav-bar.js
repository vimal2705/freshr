import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../../components/typography/typography.component";
import { BackButton, NavBarContainer, NavBarRight } from "../../../components/navbar/navbar.component";


export const NavBar = ({title, white=false, children, ...restProps}) => {
  const navigation = useNavigation();
  return <NavBarContainer>
    <BackButton onPress={() => navigation.goBack()} elevation={2} style={{backgroundColor: 'black' , marginRight: 20}}>
      <Ionicons name="arrow-back" size={20} color={'white'} />
    </BackButton>
    <Text variant={"caption"} style={{fontSize: 16, color: white ? "black" :  "white"}}>{title}</Text>
    <NavBarRight>
      {children}
    </NavBarRight>
  </NavBarContainer>
}
