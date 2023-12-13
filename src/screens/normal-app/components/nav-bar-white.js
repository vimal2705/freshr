import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../../components/typography/typography.component";
import { BackButton, NavBarContainer, NavBarRight } from "../../../components/navbar/navbar.component";


export const NavBarWhite = ({title, white=false, children, ...restProps}) => {
  const navigation = useNavigation();
  return <NavBarContainer>
    <BackButton onPress={() => navigation.goBack()} elevation={2} style={{backgroundColor: 'white' , marginRight: 20}}>
      <Ionicons name="arrow-back" size={20} color={'black'} />
    </BackButton>
    <Text variant={"caption"} style={{fontSize: 16, color: white ? "white" :  "black"}}>{title}</Text>
    <NavBarRight>
      {children}
    </NavBarRight>
  </NavBarContainer>
}
