import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import { connect } from "react-redux";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import { Dimensions, View } from "react-native";
import {
  AntDesign,
  Feather, Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useContext, useRef, useState, useEffect} from "react";
import { TextInput } from "react-native-paper";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import {
  GenderCard,
  GenderCardSelectorContainer,
  renderGenderForm,
  Row,
} from "../../components/helpers/helpers.component";
import Rheostat from "react-native-rheostat";
import MapView, { Circle } from "react-native-maps";
import mapStyles from "../components/mapStyles.json";
import { rgba } from "polished";
import { MapMarker } from "../components/map-marker.component";
import { FlatGrid } from "react-native-super-grid";
import {
  ServiceCardGallery,
  ServiceCardGalleryInfoContainer,
  ServiceCardGalleryMoreButton,
} from "./components/service-gallery.component";
import { EditServiceModal } from "../../components/bottom-sheet/EditServiceModal";
import { ImageUploadModal } from "../../components/bottom-sheet/ImageUploadModal";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import mime from "mime";
import { SpecialistContext } from "../../providers/specialist.provider";
import Slider from "@react-native-community/slider";
import { getBoundsOfDistance } from "geolib";
import { ActionButton, ButtonContainer } from "../../components/button/process-action-button.component";
import { renderConfirmModal } from "./components/modal.component";
import { LoadingScreen } from "../loading.screen";

const Container = styled.View`
  flex: 1;
`;

const HeaderSection = styled.View`
  align-items: center;
  padding: 32px 0;
`;

const ProfilePicture = styled.ImageBackground`
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 100px;
  background-color: #25282b;
`;

const ProfilePictureContainer = styled.TouchableOpacity`
  align-items: center;
`;

export const FormInput = styled(TextInput).attrs((props) => ({
  mode: "outlined",
  color: 'black',
  multiline: true,
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
  font-weight: bold;
`;

export const LengthIndicator = styled.View`
  position: absolute;
  top: -12px;
  right: 0px;
`;

const MapLocationContainer = styled.View`
  height: 240px;
  border-radius: 0px;
  overflow: hidden;
`;

const MapLocation = styled(MapView)`
  height: 100%;
  border-radius: 0px;
  overflow: hidden;
`;

const EditProfileScreen = (props) => {
  const theme = useTheme();
  const {specialist, updateSpecialistInfo, isLoading} = useContext(SpecialistContext)
  const [region, setRegion] = useState(null)
  const [currentRadius, setCurrentRadius] = useState(3);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [newFirstname, setNewFirstname] = useState();
  const [newLastname, setNewLastname] = useState();
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [isUpdated, setIsUpdated ] = useState(false);
  const mapRef = useRef();

  const [profilePicture, setProfilePicture] = useState();
  // const [name, setName] = useState("John doe");
  // const [nameInputLength, setNameInputLength] = useState(name.length);
  // const [showNameInputLength, setShowNameInputLength] = useState(false);
  const [bio, setBio] = useState();
  const [services, setServices] = useState([]);
  const [newGender, setNewGender] = useState()


  const replaceProfile = (result) => {
    setProfilePicture(result);
  };

  useEffect(() => {
    setIsUpdated(isFormCompleted())
  }, [newFirstname, newFirstname, bio, currentRadius, profilePicture, region])

  useEffect(() => {
    console.log("Sssdddadaaa",specialist);
    setRegion({latitude: specialist?.location.coordinates[1], longitude: specialist?.location.coordinates[0], latitudeDelta: 0.08, longitudeDelta: 0.08})
    setCurrentRadius(specialist?.distance / 1000 || 3)
    setNewFirstname(specialist?.user?.firstName || '')
    console.log("firstname::::::::", specialist?.user);
    setNewLastname(specialist?.user?.lastName || '')
    setProfilePicture({uri: specialist?.user?.photo || ''})
    setServices(specialist?.services)
    setBio(specialist?.bio || '')
    setNewGender(specialist?.user?.gender)
    fitMapToCircle();
  }, [specialist])

  useEffect(() => {
    fitMapToCircle();
  }, [currentRadius])

  const isFormCompleted = () => {
    return (
      (newFirstname !== specialist?.user?.firstName) ||
      (newGender !== specialist?.user?.gender) ||
      (specialist?.user?.lastName !== newLastname) ||
      (specialist?.bio !== bio) ||
      (region !== null && (region.latitude !== specialist?.location.coordinates[1] || region.longitude !== specialist?.location.coordinates[0])) ||
      (currentRadius !== specialist?.distance) ||
      (profilePicture && profilePicture.uri !== specialist?.user.photo)
    )
  }
  const updateInfo = () => {
    const formData = new FormData();
    if (profilePicture && profilePicture.uri !== specialist?.user?.photo ) {
      const filename = profilePicture.uri.split('/').pop();
      const newImageUri =  "file:///" + profilePicture.uri.split("file:/").join("");
      formData.append('photo', {...profilePicture, uri: newImageUri, type: mime.getType(newImageUri), name: filename})
    }
    if (region !== null && region !== undefined && (region.latitude !== specialist?.location.coordinates[1] || region.longitude !== specialist?.location.coordinates[0])) {
      formData.append('location[type]', 'Point')
      formData.append('location[coordinates][0]', region.longitude)
      formData.append('location[coordinates][1]', region.latitude)
      formData.append('location[address]', "No address for now",)
    }
    if (bio !== specialist?.bio) {
      formData.append('bio', bio);
    }

    if (specialist?.user?.lastName !== newLastname?.trim()) {
      formData.append("lastName", newLastname?.trim())
    }

    if (specialist?.user?.firstName !== newFirstname?.trim()) {
      formData.append("firstName", newFirstname?.trim())
    }
    if (newGender?.trim() !== specialist?.user?.gender) {
      formData.append('gender', newGender?.trim());
    }

    if (currentRadius !== specialist?.distance) {
      formData.append('distance', currentRadius * 1000)
    }
    console.log(formData);
    updateSpecialistInfo(formData)
  };

  async function fitMapToCircle() {
    const coordinates = {latitude: region.latitude, longitude: region.longitude};
    const radiusBoundaries = getBoundsOfDistance(coordinates, currentRadius * 1000);

    mapRef.current?.fitToCoordinates(radiusBoundaries, {
      edgePadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    });
  }



  if (isLoading) {
    return <LoadingScreen/>
  }

  const renderForm = () => {
    return (
      <View>
        {/*<View style={{ position: "relative" }}>*/}
        {/*  <FormInput*/}
        {/*    value={name}*/}
        {/*    label="user name"*/}
        {/*    onChangeText={(text) => {*/}
        {/*      setName(text);*/}
        {/*      setNameInputLength(text.length);*/}
        {/*    }}*/}
        {/*    onFocus={() => setShowNameInputLength(!showNameInputLength)}*/}
        {/*  />*/}
        {/*  <LengthIndicator>*/}
        {/*    {showNameInputLength && (*/}
        {/*      <Text style={{ fontSize: 14, color: "gray" }}>*/}
        {/*        {nameInputLength} / 50*/}
        {/*      </Text>*/}
        {/*    )}*/}
        {/*  </LengthIndicator>*/}
        {/*</View>*/}
        {/*<Spacer position="bottom" size="large" />*/}
        <FormInput
          value={newFirstname}
          label="First name"
          numberOfLines={1}
          style={{backgroundColor: 'white'}}
          underlineColor={theme.colors.brand.primary}
          onChangeText={(text) => {
            setNewFirstname(text);
          }}
        />
        <Spacer position="bottom" size="medium" />
        <FormInput
          value={newLastname}
          label="Last name"
          numberOfLines={1}
          style={{backgroundColor: 'white'}}
          underlineColor={theme.colors.brand.primary}
          onChangeText={(text) => {
            setNewLastname(text);
          }}
        />
        <Spacer position="bottom" size="medium" />
        <View style={{ position: "relative" }}>
          <FormInput
            value={bio}
            label="Bio"
            numberOfLines={5}
            maxLength={280}
            style={{backgroundColor: 'white', height: 80}}
            underlineColor={theme.colors.brand.primary}
            onChangeText={(text) => {
              setBio(text);
            }}
          />
          {/*<LengthIndicator>*/}
          {/*  {showBioInputLength && (*/}
          {/*    <Text style={{ fontSize: 14, color: "gray" }}>*/}
          {/*      {bioInputLength} / 280*/}
          {/*    </Text>*/}
          {/*  )}*/}
          {/*</LengthIndicator>*/}
        </View>
      </View>
    );
  };

  const renderRadiusSlider = () => {
    return (
      <View style={{padding: 8, borderWidth: 1, borderRadius: 3, borderColor: theme.colors.brand.primary}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <Text variant={'caption'} style={{color: 'black'}}> Change max travel distance</Text>

          <Text variant={'caption'} style={{color: theme.colors.brand.primary}}> {currentRadius} km</Text>
        </View>
        <Spacer position="bottom" size="small"/>
        <Slider
          minimumValue={1}
          value={currentRadius}
          step={1}
          thumbTintColor={theme.colors.brand.primary}
          fillColor={rgba(theme.colors.brand.primary, 0.5)}
          geodesic
          maximumValue={20}
          onSlidingComplete={(value) => {
            setCurrentRadius(value);
          }}
          minimumTrackTintColor={theme.colors.brand.primary}
          maximumTrackTintColor={rgba(theme.colors.brand.primary, 0.5)}
        />
        <Spacer position="bottom" size="small" />
      </View>
    );
  };
  const renderMap = () => {
    return (
      <MapLocationContainer>
        <MapLocation
          ref={mapRef}
          customMapStyle={mapStyles}
          initialRegion={{latitude: specialist?.location.coordinates[1], longitude: specialist?.location.coordinates[0], latitudeDelta: 0.08, longitudeDelta: 0.08}}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChangeComplete={(e) => {
            setRegion({ ...e });
          }}
        >
          <Circle
            center={region}
            radius={currentRadius > 0 ? currentRadius * 1000 : 0}
            strokeColor={theme.colors.brand.primary}
            strokeWidth={3}
            fillColor={rgba(theme.colors.brand.primary, 0.3)}
            zIndex={2}
          />
          <MapMarker
            coordinate={{
              latitude: region?.latitude || 0,
              longitude: region?.longitude || 0,
            }}
            isSelected={true}
            onPress={() => null}
          />
        </MapLocation>
      </MapLocationContainer>
    );
  };

  const renderBeforeGallery = () => {
    return (
      <>
        {renderHeaderSection()}
        <Spacer position="bottom" size="large" />
        <PaddedContainer>
          {renderForm()}
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="large" />
        </PaddedContainer>
          {renderMap()}
        <PaddedContainer>
          <Spacer position="bottom" size="large" />
          {renderRadiusSlider()}
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Text variant="caption" style={{color: "black"}}> Style Offer</Text>
          <Spacer position="top" size="large" />

          {renderGenderForm(newGender, setNewGender, "specialist")}
          <Spacer position="top" size="large" />
          {/*<View*/}
          {/*  // onPress={() => setShowGalleryModal(true)}*/}
          {/*  style={{ flexDirection: "row", alignItems: "center" }}*/}
          {/*>*/}
          {/*  /!*<SectionTitle style={{ lineHeight: 24, color: 'white' }}>*!/*/}
          {/*  /!*  Edit services*!/*/}
          {/*  /!*</SectionTitle>*!/*/}
          {/*  /!*<Spacer position="left" size="medium" />*!/*/}
          {/*  /!*<Entypo name="edit" size={13} color="black" />*!/*/}
          {/*</View>*/}
        </PaddedContainer>
      </>
    );
  };



  const renderAfterGallery = () => {
    return (
      <>
        <Spacer position="bottom" size="large" />
        <Spacer position="top" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
      </>
    );
  };

  const renderGallery = () => {
    return (
      <FlatGrid
        ListHeaderComponent={renderBeforeGallery()}
        // ListFooterComponent={renderAfterGallery()}
        data={[]}
        spacing={1}
        renderItem={({ item, index }) => (
          <View>
            {/*<ServiceCardGallery source={{uri: item.photo}}>*/}
              {/*<ServiceCardGalleryMoreButton*/}
              {/*  onPress={() => {*/}
              {/*    setSelectedService({ ...item });*/}
              {/*    setShowEditServiceModal(true);*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Feather name="more-horizontal" size={20} color="white" />*/}
              {/*</ServiceCardGalleryMoreButton>*/}
              {/*<ServiceCardGalleryInfoContainer>*/}
              {/*  <Text variant="caption" style={{ color: "white", fontSize: 14 }}>*/}
              {/*    {item.name}*/}
              {/*  </Text>*/}
              {/*  <Spacer position="bottom" size="medium" />*/}
              {/*  <View*/}
              {/*    style={{*/}
              {/*      flexDirection: "row",*/}
              {/*      alignItems: "center",*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <View*/}
              {/*      style={{*/}
              {/*        flexDirection: "row",*/}
              {/*        alignItems: "center",*/}
              {/*        paddingVertical: 2,*/}
              {/*        paddingHorizontal: 8,*/}
              {/*        borderRadius: 30,*/}
              {/*        backgroundColor: "white",*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <MaterialIcons*/}
              {/*        name="attach-money"*/}
              {/*        size={16}*/}
              {/*        color={theme.colors.brand.quaternary}*/}
              {/*      />*/}
              {/*      <Spacer position="left" size="small" />*/}
              {/*      <Text*/}
              {/*        variant="caption"*/}
              {/*        style={{*/}
              {/*          color: theme.colors.brand.quaternary,*/}
              {/*          fontSize: 18,*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        {item.price}*/}
              {/*      </Text>*/}
              {/*    </View>*/}
              {/*  </View>*/}
              {/*</ServiceCardGalleryInfoContainer>*/}
            {/*</ServiceCardGallery>*/}
          </View>

        )}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderHeaderSection = () => {
    return (
      <HeaderSection>
        <ProfilePictureContainer onPress={() => setShowImageUploadModal(true)}>
          <ProfilePicture source={profilePicture} />
          <Spacer position="bottom" size="small" />
          <Text variant="caption" style={{color: 'black'}}>Change profile picture</Text>
        </ProfilePictureContainer>
      </HeaderSection>
    );
  };


  const renderFinishButton = () => {
    return (
      <ButtonContainer>
        <ActionButton
          height={55}
          disabled={!isUpdated}
          onPress={async() =>{setShowUpdateInfoModal(true)}}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
             Update info
          </Text>
        </ActionButton>
      </ButtonContainer>
    );
  };

  return (
    <SpecialistScreenHoc showBackButton={true} style={{backgroundColor: "transparent"}}>
      {renderConfirmModal(
        showUpdateInfoModal,
        setShowUpdateInfoModal,
        "Update personal information",
        "Are you sure you wanna to proceed with action",
        updateInfo
      )}
      <Container>{renderBeforeGallery()}{renderAfterGallery()}</Container>
      {renderFinishButton()}
      <ImageUploadModal
        showModal={showImageUploadModal}
        toggleShowModal={() => setShowImageUploadModal(false)}
        addImage={replaceProfile}
      />
      {/*<EditServiceModal*/}
      {/*  service={{ ...selectedService }}*/}
      {/*  showModal={selectedService && showEditServiceModal}*/}
      {/*  toggleShowModal={() => {*/}
      {/*    setShowEditServiceModal(false)*/}
      {/*  }}*/}
      {/*/>*/}
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
