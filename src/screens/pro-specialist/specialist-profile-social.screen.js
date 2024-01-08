import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";

import { SafeArea } from "../../components/utils/safearea.component";
import React, { useContext, useEffect, useState } from "react";
import { RatingComponent } from "../components/rating.component";
import { Rating } from "react-native-elements";
import { RatingRow } from "../../components/rating/rating.component";
import { ReviewButton } from "../components/details-screen.component";
import { ReviewContext } from "../../providers/review.provider";
import { ReviewButtonText } from "../components/details-screen.component";
import { RatingContainer } from "../../components/rating/rating.component";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import { Dimensions, TouchableOpacity, View,Share } from "react-native";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SwitchInput } from "./components/switch-component";
import { Spacer } from "../../components/spacer/spacer.component";
import { renderConfirmModal } from "./components/modal.component";
import { Text } from "../../components/typography/typography.component";
import { FlatGrid } from "react-native-super-grid";
import { LinearGradient } from "expo-linear-gradient";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Switch } from "react-native-paper";

// import moment from "moment";
// import * as Progress from "react-native-progress";

import { rgba } from "polished";
import { IconButton, SmallButton } from "../../components/button/button.component";
import {
  ServiceCardGallery,
  ServiceCardGalleryInfoContainer,
  ServiceCardGalleryMoreButton,
} from "./components/service-gallery.component";
import Modal from "react-native-modal";
import {
  ModalCloseButton,
  ModalView,
  ModalViewPositioning,
} from "../pro-facility/components/pro-facility-form-helper";
import { EditServiceModal } from "../../components/bottom-sheet/EditServiceModal";
import { SearchRadiusModal } from "../../components/bottom-sheet/SearchRadiusModal";
import { ImageUploadModal } from "../../components/bottom-sheet/ImageUploadModal";
import { SpecialistContext } from "../../providers/specialist.provider";
import { LoadingScreen } from "../loading.screen";
import mime from "mime";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
`;

const HeaderSection = styled.View`
  align-items: center;
  padding: 32px 0;
  padding-bottom: 0;
`;

const ShareIcon = styled.TouchableOpacity`
padding: 10px ${({ theme }) => theme.space[4]};
background-color: black;
border-radius: 5px;
border: 2px solid #25282b;
flex-direction: row;
align-items: center;
justify-content: center;
`;

const ProfilePictureContainer = styled.View`
  position: relative;
  width: 118px;
  height: 118px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ProfilePictureGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 200px;
`;

const ProfilePicture = styled.ImageBackground`
  width: 110px;
  height: 110px;
  border-radius: 100px;
  overflow: hidden;
`;

const StatsRowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatsItem = styled.View`
  justify-content: center;
  flex: 1;
  padding: 0px ${({ theme }) => theme.space[3]};
`;

const StatsRowSeparator = styled.View`
  height: 40%;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.ui.border};
`;

const EditProfileButton = styled.TouchableOpacity`
  padding: 10px ${({ theme }) => theme.space[4]};
  background-color: black;
  border-radius: 5px;
  border: 2px solid #25282b;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DistanceButton = styled.TouchableOpacity`
  padding: 10px ${({ theme }) => theme.space[3]};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.brand.quaternary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StoryButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
  border-radius: 30px;
  background-color: ${({theme}) => theme.colors.brand.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const QueueToggle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #25282b;
`;

const SpecialistProfileSocialScreen = (props) => {
  const theme = useTheme();
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [story, setStory] = useState([]);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showServiceEditMenu, setShowServiceEditMenu] = useState(false);
  const [showNoStoryModal, setShowNoStoryModal] = useState(false);
  const [showQueueConfirmation, setShowQueueConfirmation] = useState(false);
  const [showStopQueueConfirmation, setShowStopQueueConfirmation] = useState(false);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const {reviews,ratings,onGetReviews} =useContext(ReviewContext)
  const navigation=useNavigation();


  const {specialistServices, isLoading, goOnline, goOffline, startQueue, deleteService, stopQueue, specialistStories, postStory, specialist} = useContext(SpecialistContext)


  useEffect(async()=>{
    console.log("check",specialist);
       
    const data=await onGetReviews(specialist._id,'specialist')  
    console.log("dataaaaaaaaaaspecccccccccccc",data);


  },[])

  const generateLink= async()=>{
    try {
      const link = await dynamicLinks().buildLink({
          link: `https://freshr.ca/Home/specialist=${specialist._id}/data=${true}/facility=${null}`,
          domainUriPrefix: 'https://freshr.page.link',
          android: {
              packageName: 'com.freshr.freshrapp',
          },
          // ios: {
          //     appStoreId: '123456789',
          //     bundleId: 'com.deepLinkingProjectBundleId',
          // },
      })
      console.log('link:', link)
      return link
  } catch (error) {
      console.log('Generating Link Error:', error)
  }
  }
  
  const deleteThisService = async () => {
    await deleteService(selectedService?.id)
  }
  const toggleDeleteServiceModal = () => {
    setShowDeleteServiceModal(old => !old);
  }
  let name = `${(specialist?.user?.firstName || '') + ' ' + (specialist.User?.lastName || '')}`
  name = !name.trim() ?  'Name not set' : name;
  const about =  specialist.bio || "You haven't set a description. Please set one as it is important for you so sell yourself right";
  const profilePicture = specialist.user?.photo || ''

  if (isLoading) {
    return <LoadingScreen/>
  }

  const addImageToStory = (result) => {
    const formData = new FormData();
    const filename = result.uri.split('/').pop();
    const newImageUri =  "file:///" + result.uri.split("file:/").join("");
    formData.append('resource', {...result, uri: newImageUri, type: mime.getType(newImageUri), name: filename})
    formData.append('mediaType', result.type.startsWith('image') ? 'IMAGE' : 'VIDEO')
    postStory(formData)
  };


  const renderRating = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          variant="caption"
          style={{
            fontSize: 24,
            color: theme.colors.brand.primary,
          }}
        >
          4.3
        </Text>
        <Spacer position="left" size="small" />
        <AntDesign name="star" size={20} color={theme.colors.brand.primary} />
      </View>
    );
  };

  const renderFav = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          variant="caption"
          style={{
            fontSize: 24,
            color: "black",
          }}
        >
          120
        </Text>
        <Spacer position="left" size="small" />
        <AntDesign name="heart" size={20} color="black" />
      </View>
    );
  };

  const renderStatsRow = () => {
    return (
      <StatsRowContainer>
        <StatsRow>
          {/*<StatsItem style={{ alignItems: "flex-end" }}>*/}
            {/*{renderRating()}*/}
          {/*  <Spacer position="bottom" size="medium" />*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      color: theme.colors.ui.primary,*/}
          {/*      textDecorationLine: "underline",*/}
          {/*      fontWeight: "bold",*/}
          {/*      textDecorationColor: "white",*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    reviews (12k)*/}
          {/*  </Text>*/}
          {/*</StatsItem>*/}

          <StatsRowSeparator />
          <ProfilePictureContainer >
            {specialistStories?.length > 0 && (
              <ProfilePictureGradient
                colors={[theme.colors.brand.secondary, "#753a88"]}
                start={[0, 1]}
                end={[1, 0]}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                if (specialistStories?.length > 0) props.navigation.navigate("SpecialistStory")
              }}
              onLongPress={() =>
                specialist?.isOnline
                  ? setShowImageUploadModal(true)
                  : setShowNoStoryModal(true)
              }
            >
              <ProfilePicture source={{ uri: profilePicture }} style={{backgroundColor: '#25282b', borderWidth: 1, color: 'black'}}/>
            </TouchableOpacity>
            {specialistStories?.length <= 0 && (
              <StoryButton
                onPress={() =>
                  specialist?.isOnline
                    ? setShowImageUploadModal(true)
                    : setShowNoStoryModal(true)
                }
              >
                <Ionicons
                  name="add"
                  size={28}
                  color={theme.colors.brand.quaternary}
                />
              </StoryButton>
            )}
          </ProfilePictureContainer>
          <StatsRowSeparator />

          {/*<StatsItem style={{ alignItems: "flex-start" }}>*/}
          {/*  {renderFav()}*/}
          {/*  <Spacer position="bottom" size="medium" />*/}
          {/*  <TouchableOpacity*/}
          {/*    onPress={() => null}*/}
          {/*    style={{ flexDirection: "row", alignItems: "center" }}*/}
          {/*  >*/}
          {/*    <Text*/}
          {/*      style={{*/}
          {/*        color: theme.colors.ui.primary,*/}
          {/*        textDecorationLine: "underline",*/}
          {/*        fontWeight: "bold",*/}
          {/*        textDecorationColor: "white",*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      favorites*/}
          {/*    </Text>*/}
          {/*    <Spacer position="left" size="small" />*/}
          {/*    <AntDesign name="arrowright" size={20} color="black" />*/}
          {/*  </TouchableOpacity>*/}
          {/*</StatsItem>*/}
          {/*<StatsRowSeparator />*/}
        </StatsRow>
      </StatsRowContainer>
    );
  };

  const renderQueueToggle = () => {
    return (
      <View>
        <QueueToggle>
          <View>
            <Text variant="caption" style={{color: "white"}}>Use queue</Text>
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" style={{color: "white"}}>Pile up services requests in queue</Text>
          </View>
          <SmallButton primary={specialist.isQueueing}
                       onPress={() => specialist.isQueueing ? setShowStopQueueConfirmation(true) : setShowQueueConfirmation(true) }>
            <Text variant="caption" style={{color: "white"}}>{specialist.isQueueing ? 'Stop queue' : 'Start queue'}</Text>
          </SmallButton>
        </QueueToggle>
        <Spacer position="bottom" size="large" />
      </View>
    );
  };

  const renderHeaderSection = () => {
    return (
      <PaddedContainer>
        <HeaderSection>
          <Text
            style={{
              fontSize:24,
              fontWeight: "bold",
              color: specialist?.isOnline ? theme.colors.ui.primary : "white"
            }}
          >
            {name}
          </Text>
          <Spacer position="bottom" size="large" />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/*<Spacer position="left" size="large" />*/}
            <View style={{ flex: 1 }}>{renderStatsRow()}</View>
          </View>
          <RatingRow>
            <RatingComponent rating={ratings} />
            {/* <Text>{reviews.length}</Text> */}
            <TouchableOpacity onPress={() => {navigation.navigate("Reviews")}}>
                <Text
                  style={{ textDecorationLine: "underline", fontWeight: "bold", color:specialist?.isOnline ? theme.colors.ui.primary : "white" }}
                >
                  {reviews?.length} reviews
                </Text>
              </TouchableOpacity>


            {/* <ReviewButton onPress={() => navigation.navigate("Reviews")}>
              <ReviewButtonText>{5}</ReviewButtonText>
              <Spacer position="right" size="small" />
              <ReviewButtonText>reviews</ReviewButtonText>
              <Spacer position="right" size="medium" />
           
            </ReviewButton> */}
          </RatingRow>
          <Spacer position="bottom" size="large" />
          <Text style={{ textAlign: "center", lineHeight: 22, color: specialist?.isOnline ? theme.colors.ui.primary : "white" }}>{about}</Text>
          <Spacer position="bottom" size="large" />
        
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EditProfileButton
              onPress={async () => { props.navigation.navigate("SpecialistEditProfile")}}
            >
              <Text variant="caption" style={{ fontSize: 16, color: "white" }}>
                Edit profile
              </Text>
            </EditProfileButton>
            <Spacer position="left" size="medium" />
            <DistanceButton onPress={() => setShowRadiusModal(true)}>
              <MaterialCommunityIcons
                name="radius-outline"
                size={20}
                color="white"
              />
              <Spacer position="left" size="small" />

              <Text variant="caption" style={{ fontSize: 16, color: "white" }}>
                {specialist.distance / 1000 || '_'} km
              </Text>
            </DistanceButton>

            {/* <Entypo name='share' size={20} color='#000' /> */}
            <ShareIcon
            style={{left:10}}
            onPress={async () => {
            // try {
              // await Share.share({message:`https://wan.qps.mybluehost.me/Home/${specialist._id}/${true}/${null}`,url:`https://wan.qps.mybluehost.me/Home/${specialist._id}/${true}/${null}`})
            //     .then((res) => {
            //       console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeee",res);
            //     })
            //     .catch((err) => {
            //       err && console.log(err);
            //     });
            // }
            // catch (e) {
            //   console.log(e.message)
            // }
        
            const getLink = await generateLink()
        try {
           await Share.share({
                message: getLink,
            });
        } catch (error) {
            console.log('Sharing Error:', error)
        }


          }} >
            <Entypo name='share' size={20} color='#fff' />
          </ShareIcon>

          </View>
        </HeaderSection>
        <Spacer position="bottom" size="large" />
      </PaddedContainer>
    );
  };
  const renderBeforeGallery = () => {
    return (
      <>
        {renderHeaderSection()}
        {specialist?.isOnline && renderQueueToggle()}

        {specialistServices.length > 0 && <PaddedContainer>
          <TouchableOpacity
            onPress={() => setShowServiceEditMenu((old) => !old)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <SectionTitle style={{ lineHeight: 24, color:specialist?.isOnline ? theme.colors.ui.primary : "white" }}>Services</SectionTitle>
            <Spacer position="left" size="medium" />
            <Entypo name="edit" size={13} color={specialist?.isOnline ? theme.colors.ui.primary : "white"} />
          </TouchableOpacity>
        </PaddedContainer>}
        <Spacer position="top" size="large" />
      </>
    );
  };

  const renderAfterGallery = () => {
    return <Spacer position="top" size="large" />;
  };

  const renderGallery = () => {
    return (
      <FlatGrid
        ListHeaderComponent={renderBeforeGallery()}
        ListFooterComponent={renderAfterGallery()}
        itemDimension={(Dimensions.get("window").width - 32 - 2 * 3 * 2) / 3}
        data={specialistServices}
        spacing={1}
        renderItem={({ item, index }) => (
          <TouchableOpacity key={item.id} onPress={() => props.navigation.navigate('SpecialistServiceDetails', {service: item})}>
            <ServiceCardGallery source={{uri: item.photo}} >
              {showServiceEditMenu && (
                <ServiceCardGalleryMoreButton
                  onPress={() => {
                    setSelectedService(item);
                    setShowEditServiceModal(true);
                  }}
                >
                  <Feather name="more-horizontal" size={20} color="white" />
                </ServiceCardGalleryMoreButton>
              )}
              <ServiceCardGalleryInfoContainer>
                <Text variant="caption" style={{ color: "white", fontSize: 14 }}>
                  {item.serviceType.name}
                </Text>
                <Spacer position="bottom" size="medium" />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 2,
                      paddingHorizontal: 0,
                      borderRadius: 30,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <MaterialIcons
                      name="attach-money"
                      size={16}
                      color={theme.colors.brand.secondary}
                    />
                    <Text
                      variant="caption"
                      style={{
                        color: theme.colors.brand.secondary,
                        fontSize: 18,
                      }}
                    >
                      {item.price}
                    </Text>
                  </View>
                </View>
              </ServiceCardGalleryInfoContainer>
            </ServiceCardGallery>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderStoryModal = () => {
    return (
      <Modal isVisible={showNoStoryModal}>
        <ModalViewPositioning>
          <ModalView>
            <View>
              <Spacer position="top" size="small" />
              <Spacer position="left" size="small">
                <ModalCloseButton onPress={() => setShowNoStoryModal(false)}>
                  <Ionicons name="close" size={20} color="white" />
                </ModalCloseButton>
              </Spacer>
              <Spacer position="top" size="small" />
            </View>
            <Spacer position="top" size="large" />

            <PaddedContainer>
              <SectionTitle style={{color: "white"}}>Restricted </SectionTitle>
              <Spacer position="bottom" size="large" />
              <Text variant="caption" style={{ fontSize: 14, color: "white" }}>
                You have to be online to post on story
              </Text>
              <Spacer position="bottom" size="large" />
            </PaddedContainer>
          </ModalView>
        </ModalViewPositioning>
      </Modal>
    );
  };

  return (
    <SpecialistScreenHoc>
      {renderStoryModal()}
      {renderConfirmModal(
        showQueueConfirmation,
        setShowQueueConfirmation,
        "Start queue",
        "Make sure you are ready to get clients in the queue",
        () => startQueue()
      )}

      {renderConfirmModal(
        showStopQueueConfirmation,
        setShowStopQueueConfirmation,
        "Stop queue",
        "You will receive requests one at a time",
        () => stopQueue()
      )}
   
      {/*{renderConfirmModal(*/}
      {/*  showAvailableConfirmation,*/}
      {/*  setShowAvailableConfirmation,*/}
      {/*  "Available",*/}
      {/*  "Make sure you are ready to get clients and move to requested locations",*/}
      {/*  () => goOnline()*/}
      {/*)}*/}
      {/*{renderConfirmModal(*/}
      {/*  showUnavailableConfirmation,*/}
      {/*  setShowUnavailableConfirmation,*/}
      {/*  "Unavailable",*/}
      {/*  "You won't be visible in search results and will not receive any client",*/}
      {/*  () => goOffline()*/}
      {/*)}*/}
      {renderConfirmModal(
        showDeleteServiceModal,
        setShowDeleteServiceModal,
        "Delete service",
        "Are you sure you want to delete this service?",
        deleteThisService
      )}
        

      <Container showsVerticalScrollIndicator={false}>
        {renderGallery()}
      </Container>
    
      <ImageUploadModal
        showModal={showImageUploadModal}
        toggleShowModal={() => setShowImageUploadModal(false)}
        addImage={addImageToStory}
        noGallery={true}
        allowVideo={true}
      />
      <SearchRadiusModal
        showModal={showRadiusModal}
        toggleShowModal={() => setShowRadiusModal(false)}
      />
      <EditServiceModal
        service={{ ...selectedService }}
        showModal={selectedService && showEditServiceModal}
        toggleShowModal={() => {
          setShowEditServiceModal(false)
        }}
        toggleDeleteModal={toggleDeleteServiceModal}
      />

      {/*<ImageSelectionModal*/}
      {/*  showModal={showGalleryModal}*/}
      {/*  toggleShowModal={() => setShowGalleryModal(false)}*/}
      {/*  updateValue={() => null}*/}
      {/*/>*/}
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialistProfileSocialScreen);