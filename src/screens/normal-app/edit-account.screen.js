import styled, {useTheme} from 'styled-components/native'
import { SafeArea } from "../../components/utils/safearea.component";
import { useContext, useEffect, useState } from "react";
import { ImageUploadModal } from "../../components/bottom-sheet/ImageUploadModal";
import { EvilIcons, Fontisto, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../components/typography/typography.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { TextInput } from "react-native-paper";
import { Entypo } from '@expo/vector-icons';
import * as yup from "yup";
import mime from "mime";
import { AuthContext } from "../../providers/auth/auth.context";
import { LoadingScreen } from "../loading.screen";
import { GenderCard, GenderCardSelectorContainer, renderGenderForm } from "../../components/helpers/helpers.component";
import { Alert, View } from 'react-native';
import { sendMessage } from '../../providers/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.View`
  flex: 1;
  padding: 16px;
`

const ProfileInfoContainer = styled.View`
  padding: 16px;
  border: 2px solid #25282b;
  border-radius: 10px;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const ProfilePictureContainer = styled.ImageBackground`
  height: 100px;
  width: 100px;
  border-radius: 60px;
  background-color: #25282b;
  position: relative;
  overflow: hidden;
`

const NavContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`


const ButtonCircleBase = styled.TouchableOpacity`
  height: 45px;
  width: 45px;
  border-radius: 45px;
  background-color:  black;
  align-items: center;
  justify-content: center;
  border: 1px solid #25282b;
`

const ImageButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
`

const ButtonNormal = styled.TouchableOpacity`
  height: 45px;
  padding: 0 10px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.brand.primary };
`

const Content = styled.View`
  flex: 1;
  align-items: center;
`

export const FormInput = styled(TextInput).attrs((props) => ({
  mode: "outlined",
  color: 'black',
  // numberOfLines: 1,
  textAlign: { undefined },
  theme: {
    colors:
      { primary: props.theme.colors.brand.primary,
        text: 'black',
        placeholder: 'gray',
        underlineColor: props.theme.colors.brand.primary
      }
  }
}))`
  width: 100%;
  font-size: 14px;
  background-color: white;
  height: 50px;
  font-weight: bold;
`;



const GenderContainerWrapper = styled.View`
  width: 100%;
  border: 2px solid #25282b;
  padding: 16px;
  border-radius: 5px;
`

const GenderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`


export const EditAccountScreen = (props) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {isLoading, user, updateUserInfo} = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [email, setEmail] = useState(user.email);
  const [newGender, setNewGender] = useState(user.gender);
  const [newFirstname, setNewFirstname] = useState(user.firstName)
  const [newLastname, setNewLastname] = useState(user.lastName)


  const isValidInput = (input) => /^[a-zA-Z]+$/.test(input);

const handleFirstNameChange = (text) => {
  if (isValidInput(text) || text === '') {
    setNewFirstname(text);
  } else {
    Alert.alert('Warning', 'Special characters are not allowed in the first name');
  }
};

const handleLastNameChange = (text) => {
  if (isValidInput(text) || text === '') {
    setNewLastname(text);
  } else {
    Alert.alert('Warning', 'Special characters are not allowed in the last name');
  }
};


  console.log("user", user?.gender);
  useEffect(() => {
    setProfilePicture({ uri: user?.photo })
  }, [user])

  const replaceProfile = (result) => {
    setProfilePicture(result);
  };
  const getDeliveryStorage=async()=>{
  
    try {
      const value = await AsyncStorage.getItem(
        "gender"
      )
      console.log("#######################------------->", value);
      if(value){
        if(value=='all'){
          setNewGender('both')
        }
        else{
          setNewGender(value)
        }
      }
    } catch (error) {
      console.log("erorrrrrrrrrrrr",error);
    }
    }

useEffect(()=>{
getDeliveryStorage()
}, [])
  console.log('reduxuser===>>>',user);
  const updateInfo = () => {
    const formData = new FormData();
    if (profilePicture && profilePicture.uri !== user?.photo ) {
      const filename = profilePicture.uri.split('/').pop();
      const newImageUri =  "file:///" + profilePicture.uri.split("file:/").join("");
      formData.append('photo', {...profilePicture, uri: newImageUri, type: mime.getType(newImageUri), name: filename})
    }

    if ( newFirstname!==null && newFirstname?.trim() !== user?.firstName) {
      formData.append('firstName', newFirstname.trim());
    }
    else{
      formData.append('firstName',  user?.firstName);
    } 

    if (newLastname !== null && newLastname?.trim() !== user?.lastName) {
      formData.append('lastName', newLastname.trim());
    }
    else{
      formData.append('lastName', user?.lastName);
    }

    if (newGender !== null &&newGender?.trim() !== user?.gender){
      if(newGender?.trim() != 'both'){
      formData.append('gender', newGender.trim());
      }

    }
    else{ 
      formData.append('gender', user?.gender);  
    }
    console.log(formData);
    if(profilePicture == null || newFirstname ==null || newLastname==null || newGender==null)
    {

      sendMessage(
        "Failure",
        "Please Change Details to Update",
        "warning",
        2500,
        theme.colors.ui.warning
      );
    }
    else{
      console.log('new daata seted',formData);
      console.log(formData);
      updateUserInfo(formData)
    }
   
  };

  if (isLoading) {
    return <LoadingScreen/>
  }
  
  return <SafeArea>
    <Container>
        <NavContainer>
          <ButtonCircleBase onPress={() => editMode ? setEditMode(false) : navigation.goBack()}>
            {!editMode ? <Ionicons name="arrow-back" size={20} color={"white"} /> : <EvilIcons name="close" size={20} color="white"/>}
          </ButtonCircleBase>
          <ButtonNormal onPress={() => editMode ? updateInfo() : setEditMode(true)}>
            <Text variant="caption" style={{ fontSize: 18, color: 'white' }}>
            {editMode ? 'Apply changes' : 'Edit profile'}
            </Text>
          </ButtonNormal>
        </NavContainer>

      <Content>
        <ProfileInfoContainer>
          <ProfilePictureContainer source={profilePicture}>
            {editMode && <ImageButton onPress={() => setShowUploadImage(true)} />}
          </ProfilePictureContainer>

          <Spacer position={"bottom"} size={"large"}/>
          {!editMode ? <>
            <Text
              variant="label"
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: 'black',
              }}
            >
              {`${user.firstName || ''} ${user.lastName || ''}`}
            </Text>
            <Spacer position="bottom" size="medium" />
            <Text
              variant="label"
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: 'black',
              }}
            >
              {email}
            </Text>
          </> : <>
            <FormInput
              value={newFirstname}
              label="First name"
              numberOfLines={5}
              style={{backgroundColor: 'white'}}
              underlineColor={theme.colors.brand.primary}
           onChangeText={handleFirstNameChange}
            
            />
            
            <Spacer position="bottom" size="medium" />
            <FormInput
            value={newLastname}
            label="Last name"
            style={{ backgroundColor: 'white' }}
            underlineColor={theme.colors.brand.primary}
            onChangeText={handleLastNameChange}
          
            />
            <Spacer position="bottom" size="medium" />
          </>}
        </ProfileInfoContainer>

        <Spacer position="bottom" size="large"/>
        {!editMode && <GenderContainerWrapper>
          <Text
            variant="label"
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "black",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            SERVICE LOCATION PREFERENCE
          </Text>
          <Spacer position="bottom" size={"large"} />
          <GenderContainer>
            
            {/* { 
            // <Entypo name="scissors" size={60} color={theme.colors.brand.primary}/>
              user.gender =="both" ? <Entypo name="male" size={60} color={theme.colors.brand.primary}/>:<Fontisto
              name={user.gender}
              size={60}
              color={theme.colors.brand.primary}
            />
            
            } */}
            {
              // <Fontisto
              // name={user.gender}
              // size={60}
              // color={theme.colors.brand.primary}
              // />
              newGender == "male" ?  <Fontisto name="male" size={60} color={theme.colors.brand.primary} />:newGender == "female" ?  <Fontisto
              name="female" size={60} color={theme.colors.brand.primary}/>: newGender == "both" ?
                   <View style={{flexDirection:"row"}}>
        <Fontisto name="female" size={30} color={theme.colors.brand.primary}  />
     
        <Fontisto name="male"  
            size={30} color={theme.colors.brand.primary} />

              </View>:null
            }
            
            <Text
              variant="label"
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "black",
              }}
            >
              {/* {user.gender || 'Both'} */}
              {newGender == 'male' ? "Barber":user.gender == 'female' ? "Salon":newGender == 'both'?"Both":null}
            </Text>
          </GenderContainer>
        </GenderContainerWrapper>}

        {editMode && renderGenderForm(newGender, setNewGender)}

        {/*{editMode && */}
        {/*  <ProfileInfoContainer>*/}
        {/*    <Text*/}
        {/*      variant="label"*/}
        {/*      style={{*/}
        {/*        fontSize: 14,*/}
        {/*        fontWeight: "bold",*/}
        {/*        color: theme.colors.brand.primary,*/}
        {/*        textTransform: 'uppercase',*/}
        {/*        letterSpacing: 2*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      update password*/}
        {/*    </Text>*/}
        {/*    <Spacer position="bottom" size="large" />*/}
        {/*    <Spacer position="bottom" size="medium" />*/}
        {/*  </ProfileInfoContainer>*/}
        {/*}*/}
        </Content>
      <ImageUploadModal
        showModal={showUploadImage}
        toggleShowModal={() => setShowUploadImage(false)}
        addImage={replaceProfile}
      />
    </Container>

  </SafeArea>
}
