import styled from "styled-components/native";
import { rgba } from "polished";

export const IconButton = styled.TouchableOpacity`
  height: 44px;
  width: 44px;
  border-radius: 100px;
  overflow: hidden;
  // border: 1px solid ${({ theme }) => theme.colors.brand.quaternary};
  align-items: center;
  justify-content: center;
  background-color: ${({ active, activeColor, inactiveColor }) =>
    active ? activeColor : inactiveColor};
`;

export const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 35px;
  border-radius: 60px;
  overflow: hidden;
  padding: 0px 10px;
  background-color: ${({ theme, active }) =>  active ? theme.colors.brand.secondary : "white"};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.brand.quaternary : "black"};
`;

export const CancelButton = styled.TouchableOpacity`
  height: 54px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #25282b;
`;

export const ModalButton = styled.TouchableOpacity`
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.ui.primary
      : theme.colors.ui.quaternary};
  padding: 10px 8px;
  border-radius: 5px;
  border: 2px solid #25282b;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const ModalButton1 = styled.TouchableOpacity`
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.ui.primary
      : theme.colors.ui.quaternary};
  padding: 10px 8px;
  width:100px
  border-radius: 5px;
  border: 2px solid #25282b;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LargeButton = styled.TouchableOpacity.attrs((props) => ({
  shadowColor: props.theme.colors.ui.border,
  shadowOffset: {
    width: 10,
    height: 10,
  },
  shadowOpacity: 1,
  shadowRadius: 5,
  elevation: 6,
}))`
  height: 80px;
  background-color: ${({ theme, variant }) =>
    variant === "primary"
      ? rgba(theme.colors.brand.primary, 1)
      : theme.colors.brand.primary};
  padding: 0px 32px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
`;

export const EditButton = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.secondary};
`;

export const CTAButton = styled.TouchableOpacity.attrs((props) => ({
  shadowColor: props.theme.colors.ui.border,
  shadowOffset: {
    width: 10,
    height: 10,
  },
  shadowOpacity: 1,
  shadowRadius: 5,
  elevation: 6,
}))`
  background-color: white;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: 5px;
  position: relative;
`;

export const NavButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 54px;
  border-radius: 60px;
  overflow: hidden;
  position: relative;
`;

export const SmallButton = styled.TouchableOpacity.attrs(props => ({
  shadow: props.theme.shadows.default
}))`
  padding: 4px 8px;
  background-color: ${({theme, primary}) => primary ? theme.colors.brand.primary : theme.colors.brand.secondary};
  border-radius: 5px;
`
