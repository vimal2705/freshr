import styled, { useTheme } from "styled-components/native";
import { Checkbox } from "react-native-paper";
import { View } from "react-native";
import {
 
  MaterialCommunityIcons,
 
} from "@expo/vector-icons";
import { useState } from "react";
const CheckBoxInputContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.ui.quaternary : "white"};
  padding: ${({ theme }) => theme.space[2]} 0px;
`;

const Separator = styled.View`
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
`;

const CheckBoxInputContent = styled.View`
  padding: 0px ${({ theme }) => theme.space[2]};
`;

export const CheckBoxInput = ({ children, value, handleChange, item }) => {
  const theme = useTheme();
  const [rememberMe, setRememberMe] = useState(false);

  // console.log("value", value, children);

  return (
    <View>
      <Separator /> 
      <CheckBoxInputContainer onPress={handleChange} active={value}>
        <CheckBoxInputContent>{children}</CheckBoxInputContent>
        {/* <Checkbox
          status={value ? "checked" : "unchecked"}
          color={theme.colors.brand.primary}
        /> */} 
        {/* { item.catchPhrase != "Coming Soon" &&  */}
         <MaterialCommunityIcons
                      name={value ?   "checkbox-marked":"checkbox-blank-outline"}
                      size={20}
                      color={item?.catchPhrase != "Coming Soon" ? theme.colors.brand.primary : 'lightgrey'}
                      onPress={() => handleChange()}
                    />
                  {/* } */}
      </CheckBoxInputContainer>
      <Separator />
    </View>
  );
};
