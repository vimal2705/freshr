import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import {
  Text,
} from "../../components/typography/typography.component";
import { ReviewContext } from "../../providers/review.provider";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import {
  AntDesign, Entypo,
  Feather, Ionicons,
} from "@expo/vector-icons";
import { RatingComponent } from "../components/rating.component";
import { Rating } from "react-native-elements";
import { RatingRow } from "../../components/rating/rating.component";

import { ReviewButton } from "../components/details-screen.component";

import { ReviewButtonText } from "../components/details-screen.component";

import { TouchableOpacity, View,ScrollView, Share } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FilterModal,
} from "../../components/bottom-sheet/bottom-sheet.component";
import {
  renderCoverImage,
  renderImage,
  renderModal,
  UploadButton,
} from "./components/pro-facility-form-helper";
import {
  EditButton,
  ModalButton,
} from "../../components/button/button.component";
import { Row, Separator } from "../../components/helpers/helpers.component";
import { FlatGrid } from "react-native-super-grid";
import { arrayMoveImmutable } from "array-move";
import { SeatsOccupancy } from "./components/pro-facility-card";
import { padding, rgba } from "polished";
import { createImageFormData, renderCalendar } from "./utils";
import { HourButton, renderHourButtons, renderTime } from "./components/time-view.helper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  EditFacilityDescriptionModal,
  renderDescription,
} from "../components/pro/pro-details-screen.component";

import { ImageSelectionModal } from "../../components/bottom-sheet/ImageSelectionModal";
import { FacilityBookingList } from "../../components/bottom-sheet/FacilityBookingListModal";
import moment from "moment";
import {
  FacilityGalleryForm,
  FacilityNameForm,
  renderGallery,
  renderSeats,
  SeatCapacityForm,
} from "./components/forms.components";
import { HostContext } from "../../providers/facility.provider";
import { renderFacilityAddress } from "./components/host-facility-card";
import MapView from "react-native-maps";
import { MapMarker } from "../components/map-marker.component";
import mapStyles from "../components/mapStyles.json";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
`;

const Title = styled(Text)`
  margin-top: -8px;
  font-size: 34px;
  font-weight: bold;
  line-height: 45px;
  color: ${({ theme }) => theme.colors.ui.primary};
`;

const ConfigRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SeatsOccupancyContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => rgba(theme.colors.brand.primary, 0.1)};
  border-radius: 10px;
`;

const DeleteFacilityButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ui.primary};
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

const NavBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`


const BalanceContainer = styled.View`
  flex: 1;
  padding: 16px;
`;


const EditFacilityNameModal = ({ showModal, toggleModal, value, applyChange}) => {

  return (
    <FilterModal
      showModal={showModal}
      toggleShowModal={toggleModal}
      scrollView={false}
    >
      <PaddedContainer>
        <Spacer position="bottom" size="large" />

        <SectionTitle style={{color: "black"}}>Edit facility's name</SectionTitle>
        <Spacer position="bottom" size="large" />
      </PaddedContainer>
      <FacilityNameForm
        onSubmit={(values) => applyChange(values.name)}
        onCancel={() => toggleModal()}
        initValue={value}
        isEdit={true}
        toggleShowModal={toggleModal}
      />
    </FilterModal>
  );
};


const EditWorkingHoursModal = ({ opening, closing, showModal, toggleModal, applyChange }) => {
  const theme = useTheme();
  const [openingHour, setOpeningHour] = useState(opening);
  const [closingHour, setClosingHour] = useState(closing);
  const [showOpeningPicker, setShowOpeningPicker] = useState(false);
  const [showClosingPicker, setShowClosingPicker] = useState(false);
  const updateOpeningHour = (e, selectedValue) => {
    if (selectedValue) {
      setOpeningHour(selectedValue);
    }
    setShowOpeningPicker(!showOpeningPicker);
  };

  const updateClosingHour = (e, selectedValue) => {
    if (selectedValue) {
      setClosingHour(selectedValue);
    }
    setShowClosingPicker(!showClosingPicker);
  };

  const renderTimePicker = (value, updateValue, min = false) => {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        value={value}
        mode="time"
        is24Hour={false}
        onChange={updateValue}
        minimumDate={min ? openingHour : null}
      />
    );
  };

  return (



    <FilterModal
      showModal={showModal}
      toggleShowModal={toggleModal}
      scrollView={false}
    >
     
      <PaddedContainer>
        <Spacer position="bottom" size="large" />

        <SectionTitle style={{color: "black"}}>Edit facility's working hours</SectionTitle>
        <Spacer position="bottom" size="large" />

        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        {renderHourButtons(openingHour, closingHour, () => setShowOpeningPicker(!showOpeningPicker), () => setShowClosingPicker(!showClosingPicker), theme)}
        {showOpeningPicker && renderTimePicker(openingHour, updateOpeningHour)}
        {showClosingPicker &&
          renderTimePicker(closingHour, updateClosingHour, true)}
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
      </PaddedContainer>
      <Row
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}
      >
        <ModalButton onPress={() => toggleModal()} style={{backgroundColor: "white"}}>
          <Text style={{color: "black"}}>Cancel</Text>
        </ModalButton>
        <ModalButton variant="primary" style={{backgroundColor: theme.colors.brand.secondary}} onPress={() => {
          applyChange({ openingHour, closingHour });
          toggleModal();
        }}>
          <Text style={{ color: "white" }}>Apply change</Text>
        </ModalButton>
      </Row>
    
    </FilterModal>
    
  );
};

const EditSeatCapacityModal = ({ showModal, toggleModal, value, applyChange}) => {
  const theme = useTheme();

  return (

    <FilterModal
      showModal={showModal}
      toggleShowModal={toggleModal}
      scrollView={true}
    >
      <PaddedContainer>
        <Spacer position="bottom" size="large" />

        <SectionTitle style={{color: "black"}}>Edit seat capacity</SectionTitle>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
      </PaddedContainer>
      <SeatCapacityForm
        onSubmit={(values) => {
          applyChange(values.seats);
          toggleModal();
        }}
        onCancel={() => toggleModal()}
        initValue={value}
        isEdit={true}
      />
    </FilterModal>

  );
};

const EditGalleryModal = ({ showModal, toggleModal, value, applyChange }) => {
  const theme = useTheme();

  return (
    <FilterModal
      showModal={showModal}
      toggleShowModal={toggleModal}
      scrollView={false}
    >
      <FacilityGalleryForm
        initGallery={value.gallery}
        initCoverImage={value.coverImage}
        onSubmit={(gallery) => {
          applyChange(gallery);
          toggleModal();
        }}
        onCancel={() => toggleModal()}
      />
    </FilterModal>
  );
};

const ProFacilityDetailsScreen = (props) => {
  const theme = useTheme();

const navigation=useNavigation();
  const [facilityHistory, setFacilityHistory] = useState([])
  const [gallery, setGallery] = useState(props.route.params.facility.gallery);
  const [about, setAbout] = useState(props.route.params.facility.description);
  const [name, setName] = useState(props.route.params.facility.name)
  const [openingHour, setOpeningHour] = useState(moment(props.route.params.facility.openingTime).toDate());
  const [closingHour, setClosingHour] = useState(moment(props.route.params.facility.closingTime).toDate());
  const [coverImage, setCoverImage] = useState( props.route.params.facility.coverImage);
  const [seats, setSeats] = useState(props.route.params.facility.seatCapacity);
  const {reviews,ratings,onGetReviews} =useContext(ReviewContext)
  const fixedrating="";
  console.log("ratingsssssssssssssssssss",ratings?.toFixed(1));
  console.log("propspspspspspspspsps",props.route.params.facility._id);

  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [editFacility, setEditFacility] = useState(false)
  const [showEditGalleryModal, setShowEditGalleryModal] = useState(false)
  const [showEditDescriptionModal, setShowEditDescriptionModal] =
    useState(false);
  const [showEditSeatCapacityModal, setShowEditSeatCapacityModal] =
    useState(false);
  const [showEditWorkingHoursModal, setShowEditWorkingHoursModal] =
    useState(false);
    const {onGetFacilityDetails,facility} =useContext(HostContext)
  const [showBookingList, setShowBookingList] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");


  const loadHistory = async () => {
    const res = await onGetFacilityBookingHistory(props.route.params.facility.id);
    setFacilityHistory(res);
  }
  useEffect(() => {
    console.log("SSsssssssssssss",props.route.params.facility);
    loadHistory();
    
    onGetReviews(props.route.params.facility.id,'facility')  
    onGetFacilityDetails(props.route.params.facility.id)
  }, []);

  const onDayPress = useCallback((day) => {
    console.log(day);
    setSelectedDay(day.dateString);
    toggleShowBookingList();
  }, []);


  const handleShowEditNameModal = () =>
    setShowEditNameModal(!showEditNameModal);
  const handleShowEditDescriptionModal = () =>
    setShowEditDescriptionModal(!showEditDescriptionModal);
  const handleShowEditSeatCapacityModal = () =>
    setShowEditSeatCapacityModal(!showEditSeatCapacityModal);
  const handleShowWorkingHoursModal = () =>
    setShowEditWorkingHoursModal(!showEditWorkingHoursModal);
  const handleShowEditGalleryModal = () =>
    setShowEditGalleryModal(!showEditGalleryModal);
  const toggleShowBookingList = () => {
    setShowBookingList(!showBookingList);
  };

  const cancelEdit = () => {
    setFacility(props.route.params.facility)
  }

  const setFacility = (facility) => {
    setGallery(facility.gallery);
    setAbout(facility.description);
    setName(facility.name);
    setOpeningHour(moment(facility.openingTime).toDate());
    setClosingHour(moment(facility.closingTime).toDate());
    setCoverImage(facility.coverImage);
    setSeats(facility.seatCapacity);
  }

  const createFacilityFormData = () => {
    const occupiedSeats = props.route.params.facility.availableSeats +(seats -props.route.params.facility.seatCapacity)
    const availableSeats =occupiedSeats <0 ? 0 : occupiedSeats
    const formData = new FormData();
    formData.append('name', name);
    // formData.append('street', props.street);
    // formData.append('city', props.city);
    // formData.append('country', props.country);
    // formData.append('region', props.region);
    // formData.append('postcode', props.postcode);
    // formData.append('coords', JSON.stringify({
    //   type: "Point",
    //   coordinates: [props.coords.longitude, props.coords.latitude],
    // }));
    // formData.append('aptSuite', props.aptSuite);
    formData.append('closingTime', `${closingHour}`);
    formData.append('openingTime', `${openingHour}`);
    formData.append('description', about);
    formData.append('seatCapacity', seats);
    formData.append('availableSeats', availableSeats);
    if (coverImage !== props.route.params.facility.coverImage) {
      formData.append('coverImage', createImageFormData(coverImage));
    }
    if (gallery !== props.route.params.facility.gallery) {
      const newGallery =  gallery.map(image => createImageFormData(image))
      newGallery.forEach(el => {
        formData.append('gallery', el)
      })
    }
    return formData;
  }

  const updateFacility = async () => {
    const formData = createFacilityFormData();
    console.log(formData);

    const facility = await onUpdateFacility(props.route.params.facility.id, formData);
    if (!error) {
      console.log("DDdd",props.route.params.facility);
      setFacility(facility);
    } else {
      cancelEdit();
    }
    setEditFacility(false);
  }

  const renderEditNameModal = () => {
    return (
      <EditFacilityNameModal
        showModal={showEditNameModal}
        toggleModal={handleShowEditNameModal}
        value={name}
        applyChange={(text) => setName(text)}
      />
    );
  };

  const renderEditDescriptionModal = () => {
    return (
      <EditFacilityDescriptionModal
        showModal={showEditDescriptionModal}
        toggleModal={handleShowEditDescriptionModal}
        title={"Edit's facility description"}
        value={about}
        applyChange={(text) => setAbout(text)}
      />
    );
  };

  const renderEditSeatCapacityModal = () => {
    return (
      <EditSeatCapacityModal
        showModal={showEditSeatCapacityModal}
        toggleModal={handleShowEditSeatCapacityModal}
        value={seats}
        applyChange={(value) => setSeats(value)}
      />
    );
  };
 const renderEditGalleryModal = () => {
    return (
      <EditGalleryModal
        showModal={showEditGalleryModal}
        toggleModal={handleShowEditGalleryModal}
        value={{ gallery, coverImage }}
        applyChange={(gallery) => {
          setGallery(gallery.gallery);
          setCoverImage(gallery.coverImage)
        }}
      />
    );
  };

  const renderEditWorkingHoursModal = () => {
    return (
      <EditWorkingHoursModal
        opening={openingHour}
        closing={closingHour}
        applyChange={values => {
          setClosingHour(values.closingHour);
          setOpeningHour(values.openingHour);
        }}
        showModal={showEditWorkingHoursModal}
        toggleModal={handleShowWorkingHoursModal}
      />
    );
  };

  const renderHours = () => {
    return (
      <>
        <ConfigRow>
          <View style={{ flex: 1 }}>
            <SectionTitle style={{color: "black"}}>Hours</SectionTitle>
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
              Working hours of the facility
            </Text>
            <Spacer position="bottom" size="large" />
          </View>
          <Spacer position="left" size="medium" />
          {editFacility && <EditButton onPress={handleShowWorkingHoursModal}>
            <Entypo name="edit" size={20} color="white" />
          </EditButton>}
        </ConfigRow>
        <ConfigRow>
          {renderHourButtons(openingHour, closingHour, () => null, () => null, theme)}
        </ConfigRow>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
      </>
    );
  };


  const renderSeatCapacity = () => {
    // const occupiedSeats = props.route.params.facility.seatCapacity - !!props.route.params.facility.availableSeats
    // const availableSeats = seats - occupiedSeats
    const occupiedSeats = props.route.params.facility.availableSeats +(seats -props.route.params.facility.seatCapacity)
   const availableSeats = occupiedSeats <0 ?0: occupiedSeats
    return (
      <>
        <ConfigRow> 
          <View style={{ flex: 1 }}>
            <SectionTitle style={{color: "black"}}>Seat capacity</SectionTitle>
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
              Seats available for rent
            </Text>
            <Spacer position="bottom" size="large" />
          </View>
          <Spacer position="left" size="medium" />
          {editFacility && <EditButton onPress={handleShowEditSeatCapacityModal}>
            <Entypo name="edit" size={20} color="white" />
          </EditButton>}
        </ConfigRow>
        <SeatsOccupancyContainer>
          <SeatsOccupancy seatCapacity={seats} bookedSeats={availableSeats || 0} />
        </SeatsOccupancyContainer>
        {renderSeats(seats, theme, availableSeats, true)}
      </>
    );
  };

  const renderRating = () => {
 
    return (
      <RatingContainer>
       <RatingComponent rating={ratings?.toFixed(1)} />
      </RatingContainer>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <ConfigRow>
          <View style={{ flex: 1 }}>
            <Title style={{color: "black"}}>{name}</Title>
          </View>
          <Spacer position="left" size="medium" />
          {editFacility && <EditButton onPress={handleShowEditNameModal}>
            <Entypo name="edit" size={20} color="white" />
          </EditButton>}
        </ConfigRow>

        {!editFacility && (<>

            <ConfigRow style={{ alignItems: "center" }}>
             {renderRating()}
            
               <ReviewButton>
               {/* <TouchableOpacity onPress={()=>console.log('helllo')}> */}
               <TouchableOpacity onPress={() => {navigation.navigate("Reviews")}} style={{flexDirection:'row'}}>
               
               <ReviewButtonText>{reviews?.length}</ReviewButtonText>
     <Spacer position="right" size="small" />
      <ReviewButtonText>reviews</ReviewButtonText>
      </TouchableOpacity>
     <Spacer position="right" size="medium" />
  {/* </TouchableOpacity> */}

   
  </ReviewButton>

          </ConfigRow>
          </>)}

        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        {renderFacilityAddress(props.route.params.facility.address, theme)}
        <Spacer position="bottom" size="medium"/>
        <MapView
          region={{
            latitude: props.route.params.facility.location.coordinates[1],
            longitude: props.route.params.facility.location.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={mapStyles}
          style={{
            height: 150,
            width: "100%"
          }}
        >
          <MapMarker
            coordinate={{
              latitude: props.route.params.facility.location?.coordinates[1],
              longitude: props.route.params.facility.location?.coordinates[0],
            }}
            isSelected={true}
            onPress={() => null}
          />
        </MapView>
        {editFacility && <>
          <Spacer position="top" size="large"/>
          <View style={{padding: 16, backgroundColor: theme.colors.brand.secondary, borderRadius: 5}}>
            <Text variant="caption" style={{color: "white"}}>Location cannot be edited, please create a new facility in case you want to update location and delete this one. Delete button can be found at the bottom of the page</Text>
          </View>
        </>}
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <Row style={{ justifyContent: "space-between" }}>
          <View>
            <SectionTitle style={{color: "black"}}>Gallery</SectionTitle>
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
              Images advertising your facility
            </Text>
            <Spacer position="bottom" size="large" />
          </View>
          {editFacility && <UploadButton onPress={() => setShowEditGalleryModal(true)} style={{backgroundColor: "white"}}>
            <Feather name="upload" size={18} color={"black"} />
            <Spacer position="left" size="small" />
            <Text style={{color: "black"}}>replace images</Text>
          </UploadButton>}
        </Row>
        <Spacer position="top" size="large" />
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        {renderDescription(
          "About",
          "Pitch about your facility",
          about,
          handleShowEditDescriptionModal,
          editFacility
        )}
        <Spacer position="top" size="large" />
        {renderHours()}
        <Spacer position="top" size="large" />
        {renderSeatCapacity()}
        {!editFacility && (
          <>
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <SectionTitle style={{color: "white"}}>Booking history</SectionTitle>
            <Spacer position="top" size="medium" />
            <BalanceContainer style={{backgroundColor: "black", borderRadius: 4, borderWidth: 2, borderColor: "#25282b", flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  textTransform: "uppercase",
                  color: theme.colors.ui.quaternary,
                  letterSpacing: 1,
                }}
              >
                Total reservations
              </Text>
              <Spacer position="bottom" size="large" />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ color: "white", fontSize: 35, fontWeight: "bold" }}
                >
                  {facilityHistory?.length}
                </Text>
              </View>
            </BalanceContainer>
          </>
        )}
        <Spacer position="top" size="large" />

        <Spacer position="top" size="large" />

        {editFacility && <DeleteFacilityButton style={{borderColor: theme.colors.brand.secondary, borderWidth: 2}}>
          <AntDesign name="delete" size={24} color="white" />
          <Spacer position="right" size="large" />
          <Text style={{ fontSize: 16, color: "white" }}>Delete facility</Text>
        </DeleteFacilityButton>}

        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
      </>
    );
  };

  const renderNavBar = () => {
    return <PaddedContainer style={{shadow: theme.shadows.default, marginBottom: 0}}>
      <NavBarContainer style={{marginBottom: 0}}>
        {!editFacility && <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={24} color={"black"} />
        </TouchableOpacity>}
        <ShareIcon
            style={{left:10}}
            onPress={async () => {
            try {
              const data = false
              const spid = null
              await Share.share({message:`freshr://Home/${props.route.params.facility._id}/${data}/${spid}`,url:`freshr://Home/${props.route.params.facility._id}/${data}/${spid}`})
                .then((res) => {
                  console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeee",res);
                })
                .catch((err) => {
                  err && console.log(err);
                });
            }
            catch (e) {
              console.log(e.message)
            }
          }} >
            <Entypo name='share' size={20} color='#fff' />
          </ShareIcon>
        {!editFacility && <DeleteFacilityButton onPress={() => setEditFacility(true)} style={{backgroundColor: theme.colors.brand.secondary, paddingVertical: 8}}>
          <Entypo name="edit" size={14} color="white" />
          <Spacer position="left" size="small" />
          <Text variant="caption" style={{ fontSize: 12, color: "white" }}>Edit facility</Text>
        </DeleteFacilityButton>}
        {editFacility && (
          <DeleteFacilityButton
            onPress={() => {
              setEditFacility(false);
              cancelEdit();
            }}
            style={{backgroundColor: "white",  paddingVertical: 8}}
          >
            <Ionicons name="close-outline" size={14} color={theme.colors.ui.warning} />
            <Spacer position="left" size="small" />
            <Text style={{ fontSize: 12, color: theme.colors.ui.warning }}>cancel</Text>
          </DeleteFacilityButton>)}
        {editFacility && <DeleteFacilityButton onPress={() => updateFacility()} style={{backgroundColor: theme.colors.brand.secondary, paddingVertical: 8}}>
          <Ionicons name="ios-checkmark-circle-outline" size={14} color="white" />
          <Spacer position="left" size="small" />
          <Text variant="caption" style={{ fontSize: 12, color: "white" }}>Apply change</Text>
        </DeleteFacilityButton>}
      </NavBarContainer>
    </PaddedContainer>
  }

  console.log(reviews,"reviewwwogoigogigogiogiogigogogooggo");

  return (
    <SafeArea>
      {renderNavBar()}
      <Container>
        <Spacer position="top" size="large" />
       
        <PaddedContainer style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>{renderGallery(coverImage, gallery, () => null, renderHeader(), renderFooter(), false)}</View>
        </PaddedContainer>
      </Container>
      {renderEditNameModal()}
      {renderEditDescriptionModal()}
      {renderEditSeatCapacityModal()}
      {renderEditWorkingHoursModal()}
      {renderEditGalleryModal()}

      <FacilityBookingList
        showModal={showBookingList}
        toggleShowModal={toggleShowBookingList}
        navigation={props.navigation}
        date={selectedDay}
      />
    </SafeArea>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProFacilityDetailsScreen);
