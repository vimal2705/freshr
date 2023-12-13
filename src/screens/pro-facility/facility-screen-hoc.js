import styled, { useTheme } from "styled-components/native";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavButton, TopNavContainer } from "../pro-specialist/components/top-nav.component";
import { BackButton } from "../../components/navbar/navbar.component";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Dimensions, FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { SmallButton } from "../../components/button/button.component";
import { Text } from "../../components/typography/typography.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { SafeArea } from "../../components/utils/safearea.component";
import { HostContext } from "../../providers/facility.provider";
import { AuthContext } from "../../providers/auth/auth.context";


const ProfileAvatar = styled.ImageBackground`
  height: 44px;
  width: 44px;
  border-radius: 44px;
  overflow: hidden;
  background-color: #25282b;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const FacilityScreenHoc = ({children, showBackButton=false}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {isLoading, error, host, loadHostData  } = useContext(HostContext)
  const {user} = useContext(AuthContext);


  const renderTopNav = () => {
    return (
      <TopNavContainer style={{ backgroundColor: "transparent" }}>
        <Row>
          {showBackButton && <BackButton onPress={() => navigation.goBack()} elevation={2}
                                         style={{ backgroundColor: "black", marginRight: 20 }}>
            <Ionicons name="arrow-back" size={20} color={"white"} />
          </BackButton>}
          {!showBackButton && <TouchableOpacity onPress={() => navigation.navigate("EditUserProfileScreenHost")}>
            <ProfileAvatar source={{ uri: user.photo }} />
          </TouchableOpacity>}
        </Row>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <NavButton
            color={"white"}
            onPress={() => navigation.navigate("Menu")}
          >
            <Feather name="menu" size={24} color={ "black"} />
          </NavButton>
        </View>
      </TopNavContainer>
    );
  };


  return <SafeArea style={{backgroundColor: theme.colors.brand.white}}>
    {renderTopNav()}

    <FlatList
      data={[1]}
      keyboardShouldPersistTaps={'always'}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      style={{flex: 0, height: 0,  backgroundColor: theme.colors.brand.white, zIndex: -1}}
      refreshControl={
        <RefreshControl style={{ position: "absolute", top: 10 }} refreshing={refreshing} onRefresh={loadHostData} />
      }
      ListHeaderComponent={<><View style={{flex: 1, minHeight: Dimensions.get("window").height * 0.9, height: "100%",  position: 'relative', backgroundColor: theme.colors.brand.white}}>
        {children}
      </View></>}
      renderItem={() => <View style={{height: 0}}/>}/>
  </SafeArea>
}
