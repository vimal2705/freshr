import styled, { useTheme } from "styled-components/native";
import { View } from "react-native";
import { Separator } from "../../components/helpers/helpers.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { Entypo } from "@expo/vector-icons";
import { rgba } from "polished";
import { SpecialistContext } from "../../providers/specialist.provider";
import { useContext } from "react";
import { AppContext } from "../../providers/app-provider";

export const Avatar = styled.Image`
  height: 70px;
  width: 70px;
  aspect-ratio: 1;
  border-radius: 100px;
  overflow: hidden;
`;

const ProfileButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]} 0px;
`;

export const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[3]};
  align-items: center;
  background-color: black;
  border-radius: 10px;
  border: 2px solid #25282b;
`;
export const Singupbutton = styled.TouchableOpacity`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[3]};
  align-items: center;
  background-color: black;
  border-radius: 10px;
  border: 2px solid #25282b;
`;


export const ProfileButton = ({ icon, label, description = "", onPress,style }) => {
  const theme = useTheme();
  const {specialist} =useContext(SpecialistContext)
  const {currentApp} = useContext(AppContext)
  return (
    <View>
      <Separator style={{backgroundColor: rgba("#25282b", 0.2)}}/>
      <ProfileButtonContainer onPress={onPress}>
        {icon}
        <Spacer position="left" size="medium" />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color:currentApp=='specialist' ? specialist?.isOnline?"#000" : "#fff" :'#000'
          }}>
            {label}
          </Text>
          {description !== "" && (
            <View>
              <Spacer position="bottom" size="small" />
              <Text style={{ fontSize: 14, color:currentApp=='specialist' ? specialist?.isOnline?"#000" : "#fff" :'#000' }}>
                {description}
              </Text>
            </View>
          )}
        </View>
        <Entypo
          name="chevron-right"
          size={24}
          color={specialist?"#fff" : "#000"}
        />
      </ProfileButtonContainer>
      <Separator style={{backgroundColor: rgba("#fff", 0.2)}}/>
    </View>
  );
};
