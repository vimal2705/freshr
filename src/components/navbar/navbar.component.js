import styled from "styled-components/native";

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border: 2px solid #25282b; 
`;

export const NavBarContainer = styled.View`
  flex-direction: row;
  padding: 10px 12px;
  align-items: center;
`

export const NavBarRight = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
