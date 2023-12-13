import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import { SafeArea } from "../../components/utils/safearea.component";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import { AntDesign, Fontisto, Ionicons } from "@expo/vector-icons";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import React, { useContext, useEffect, useState } from "react";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { rgba } from "polished";
import DropDownPicker from "react-native-dropdown-picker";
import CurrencyInput from "react-native-currency-input";
import { TextInput } from "react-native-paper";
import {
  ActionButton,
  ButtonContainer,
} from "../../components/button/process-action-button.component";
import { LinearGradient } from "expo-linear-gradient";
import {  SelectButton } from "../onboarding/set-gender-screen";
import { LoadingScreen } from "../loading.screen";
import { ImageUploadModal } from "../../components/bottom-sheet/ImageUploadModal";
import { renderConfirmModal } from "./components/modal.component";
import { SpecialistContext } from "../../providers/specialist.provider";
import mime from "mime";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import Slider from "@react-native-community/slider";

const Container = styled.View`
  min-height: ${Dimensions.get("window").height - 150};
  flex: 1;
`;

const CoverImage = styled.ImageBackground`
  height: 130px;
  flex: 1;
  width: 100%;
  background-color: ${({theme}) => theme.colors.brand.quaternary};
  background-size: contain;
  background-position: center;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
`;

const CoverImageIndicator = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  border-radius: 3px;
  padding: 8px;
  background-color: black;
  top: 5px;
  left: 5px;
`;

const ServiceItemIcon = styled.Image`
  height: 40px;
  width: 40px;
  border-radius: 5px;
  overflow: hidden;
`;

const Gradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const DescriptionInput = styled(TextInput).attrs((props) => ({
  mode: "outlined",
  color: props.active ? "black" : "white",
  maxLength: 280,
  multiline: true,
  textAlign: { undefined },
  theme: {
    colors:
      { primary: props.theme.colors.brand.primary,
        text: props.active ? "black" : "white",
        placeholder: props.active ? "black" : "white",
        underlineColor: props.theme.colors.brand.primary
      }
  }
}))`
  width: 100%;
  font-size: 14px;
  background-color: black;
  font-weight: bold;
`;

const CreateServiceScreen = (props) => {
  const { isEdit = false } = props.route.params;
  const theme = useTheme();
  const {onCreateService, specialist, updateService, deleteService, isLoading, error} = useContext(SpecialistContext)
  const mockImage =
    "https://i.pinimg.com/originals/83/1b/5d/831b5dfdc5a785b1603054452698d5a8.jpg";

  const choices = [
    {
      value: "none",
      title: "For everyone",
      description: "Styles for everyone",
    },
    {
      value: "male",
      title: "Masculine Style",
    },
    {
      value: "female",
      title: "Feminine Style",
    },
  ];


  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [coverImage, setCoverImage] = useState({
    uri: mockImage,
  });
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState('none')
  const [value, setValue] = useState(null);
  const [price, setPrice] = React.useState(10);
  const [serviceDescription, setServiceDescription] = useState("");
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(30)

  const renderServiceIcon = (icon) => {
    return <ServiceItemIcon source={{ uri: icon }} />;
  };

  const verifyForm = () => {
    if (isEdit) return true;
    return !!value && serviceDescription;
  }

  useEffect(() => {
    setIsFormCompleted(verifyForm())
  }, [value, serviceDescription])

  useEffect(() => {
    if (value && !isEdit) {
      const serviceType = props.serviceTypes.filter(s => s.id === value)[0]
      setCoverImage({uri: serviceType.photo});
      setPrice(serviceType.minimumPrice);
      setServiceDescription(serviceType.description)
    }
  }, [value])

  useEffect(() => {
    if (props.route.params.service) {
      console.log(props.route.params.service.id)
      setCoverImage({uri: props.route.params.service.photo});
      if (props.route.params.service.forFemale && props.route.params.service.forMale) {
        setGender('none')
      } else if ( props.route.params.service.forFemale ) {
        setGender('female')
      } else {
        setGender('male')
      }
      setPrice(props.route.params.service.price);
      setServiceDescription(props.route.params.service.description);
      setValue(props.route.params.service.serviceType.id)
      setServiceId(props.route.params.service.id)
      setCurrentDuration(props.route.params.service.estimatedDuration?.minutes || 30);
    }
  }, [props.route])

// console.log('999999',props.serviceTypes);
  const [items, setItems] =
  useState(props.serviceTypes.map
    (service => ({label: service.name, value: service.id, key: service.id, id: service.id, 
      icon: () => renderServiceIcon(service.photo)})));

  const renderSelectService = () => {
    return (
      <PaddedContainer>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <DropDownPicker
          listMode="MODAL"
          searchPlaceholder="search service"
          placeholder="Select service"
          style={{
            borderColor: theme.colors.brand.primary,
            elevation: 2
          }}
          listItemContainer={{
            height: 60,
          }}
          dropDownContainerStyle={{
            height: 600
          }}
          listItemContainerStyle={{
            height: 60,
          }}
          theme={"DARK"}
          searchable={true}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </PaddedContainer>
    );
  };

  const renderPriceInput = () => {
    return (
      <PaddedContainer style={{ position: "relative", alignItems: "center", flex: 1, height: 100, backgroundColor: 'black', borderRadius: 4, borderWidth: 2, borderColor: "#25282b" }}>
        {/*<Gradient*/}
        {/*  colors={[theme.colors.brand.primary, theme.colors.brand.quaternary]}*/}
        {/*  start={[0, 1]}*/}
        {/*  end={[1, 0]}*/}
        {/*/>*/}
        <Spacer position="bottom" size="large" />
        <SectionTitle style={{ color: "white" }}>Price</SectionTitle>
        <Spacer position="bottom" size="large" />
     

        <CurrencyInput
            value={price}
            onChangeValue={setPrice}
          style={{
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.colors.brand.primary,
          }}
          prefix="$"
          delimiter=","
          separator="."
          precision={1}
          onChangeText={(formattedValue) => {
            console.log(formattedValue); // $2,310.46
          }}
        />
      </PaddedContainer>
    );
  };

  const replaceCoverImage = (result) => setCoverImage(result);

  const renderForm = () => {
    return (
      <View>
        <View style={{ flex: 1, padding: 8, borderWidth: 2, borderColor: "#25282b"}}>
          <CoverImage source={coverImage} resizeMode="contain">
            <TouchableOpacity
              style={{ width: "100%", height: "100%" }}
              onPress={() => setShowImageUploadModal(true)}
            />
            <CoverImageIndicator
              style={{ backgroundColor: rgba(theme.colors.brand.secondary, 0.9) }}
            >
              <Text style={{fontSize: 10, color: "white"}}>Change image</Text>
            </CoverImageIndicator>
          </CoverImage>
        </View>
      </View>
    );
  };

  const renderFinishButton = () => {
    return (
      <ButtonContainer
        style={{ ...theme.shadows.default, backgroundColor: specialist?.isOnline ? "white" : "black" }}
      
      >
        <ActionButton
          height={55}
          disabled={!isFormCompleted}
          onPress={() => {
            if (!isEdit) {
              setShowCreateServiceModal(true);
            } else {
              setShowUpdateServiceModal(true);
            }
          }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            {isEdit ? "Complete edit" : "Create service"}
          </Text>
        </ActionButton>
      </ButtonContainer>
    );
  };

  const renderDeleteButton = () => {
    return (
        <PaddedContainer
          style={{}}
        >
          <TouchableOpacity
            onPress={() => setShowDeleteServiceModal(true)}
            style={{ backgroundColor: specialist?.isOnline ? "white" : 'black', paddingVertical: 12, borderRadius: 5, borderWidth: 2, borderColor: theme.colors.brand.secondary, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

          <AntDesign name="close" size={20} color={theme.colors.brand.secondary} />
          <Spacer position="left" size="large" />
          <Text variant="caption" style={{ fontSize: 13, color: specialist?.isOnline ? "black":  "white" }}>
            Delete service
          </Text>
          </TouchableOpacity>

        </PaddedContainer>
    );
  };

  const renderDurationSlider = () => {
    return (
      <View style={{padding: 8, borderWidth: 1, borderRadius: 3, borderColor: "#25282b"}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <Text variant={'caption'} style={{color: 'white'}}> Estimated max duration in minutes</Text>

          <Text variant={'caption'} style={{color: theme.colors.brand.primary}}> {currentDuration} min</Text>
        </View>
        <Spacer position="bottom" size="small"/>
        <Slider
          value={currentDuration}
          step={1}
          minimumValue={15}
          thumbTintColor={theme.colors.brand.primary}
          fillColor={rgba(theme.colors.brand.primary, 0.5)}
          geodesic
          maximumValue={180}
          onSlidingComplete={(value) => {
            setCurrentDuration(value);
          }}
          minimumTrackTintColor={theme.colors.brand.primary}
          maximumTrackTintColor={rgba(theme.colors.brand.primary, 0.5)}
        />
        <Spacer position="bottom" size="small" />
      </View>
    );
  };

  const renderSelectGender = () => {
    return (
      <PaddedContainer>
        {/*<LongSelectButton*/}
        {/* */}
        {/*</LongSelectButton>*/}
        <Spacer position="bottom" size="large" />

        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
          <SelectButton
            key={"gender-none"}
            style={{padding: 8, elevation: 1}}
            active={gender === choices[0].value}
            onPress={() => setGender(choices[0].value)}
          >
            <Text
              variant="caption"
              style={{
                fontSize: 16,
                color:"white",
              }}
            >
              {choices[0].title}
            </Text>
            <Spacer position="bottom" size="large" />
            <Text
              variant="caption"
              style={{
                fontSize: 12,
                color: "white",
              }}
            >
              {choices[0].description}
            </Text>
          </SelectButton>
          <Spacer position="right" size="small" />
          <SelectButton
            key={"gender-male"}
            style={{elevation: 1}}
            active={gender === choices[1].value}
            onPress={() => setGender(choices[1].value)}
          >
            <Fontisto
              name={choices[1].value}
              size={50}
              color={
                gender !== choices[1].value
                  ? theme.colors.brand.quaternary
                  : "white"
              }
            />
            <Spacer position="bottom" size="large" />
            <Text
              variant="caption"
              style={{
                fontSize: 14,
                color: "white",
              }}
            >
              {choices[1].title}
            </Text>
          </SelectButton>
          <Spacer position="right" size="small" />
          <SelectButton
            key={"gender-female"}
            style={{elevation: 1}}
            active={gender === choices[2].value}
            onPress={() => setGender(choices[2].value)}
          >
            <Fontisto
              name="female"
              size={50}
              color={
                gender !== choices[2].value
                  ? theme.colors.brand.quaternary
                  : "white"
              }
            />
            <Spacer position="bottom" size="large" />
            <Text
              variant="caption"
              style={{
                fontSize: 14,
                color: "white",
              }}
            >
              {choices[2].title}
            </Text>
          </SelectButton>
        </View>
      </PaddedContainer>
    )
  }

  const renderFlatListHeader = () => {
    return (<>
      {!isEdit && renderSelectService()}
      {value  ?
        <View>
        <Spacer position="top" size="large"/>
        <PaddedContainer>
          <View style={{flexDirection: 'column'}}>
            {renderForm()}
            <Spacer position="bottom" size="large"/>
           
            {renderPriceInput()}
          </View>
          <Spacer position="bottom" size="large"/>
          {renderDurationSlider()}
          <Spacer position="top" size="large" />
          {/* <Spacer position="top" size="large" /> COMMENT THIS LINE */}
          {/*<Text variant="caption" style={{fontSize: 16, color: "white"}}>Describe service </Text>  COMMENT THIS LINE  */}
           <Spacer position="top" size="large"/>
          <DescriptionInput
            label="Service's description"
            numberOfLines={5}
            style={{backgroundColor: specialist?.isOnline ? "white" : 'black', color: specialist?.isOnline ? "black" : 'white', height: 90}}
            color={'white'}
            active={specialist?.isOnline}
            underlineColor={theme.colors.brand.primary}
            value={serviceDescription}
            onChangeText={(text) => {
              setServiceDescription(text);
            }}
          />
        </PaddedContainer>
        <PaddedContainer>
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Text variant="caption" style={{fontSize: 16, color: "white"}}>Service for</Text>
        </PaddedContainer>
        {renderSelectGender()}
        <Spacer position="bottom" size="large" />
          {isEdit && renderDeleteButton()}
          <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
      </View> : <View/>} 
      <ImageUploadModal
        showModal={showImageUploadModal}
        toggleShowModal={() => setShowImageUploadModal(false)}
        addImage={replaceCoverImage}
        noGallery={false}
      />
      <Spacer position="bottom" size="large" />
    </>) 
  }

  const deleteThisService = async () => {
    await deleteService(serviceId)
  }

  if (isLoading) {
    return <LoadingScreen/>
  }


  const createFormData = () => {
    const formData = new FormData();
    const filename = coverImage.uri.split('/').pop();
    const newImageUri =  "file:///" + coverImage.uri.split("file:/").join("");

    formData.append('photo', coverImage.height ? {...coverImage, uri: newImageUri, type: mime.getType(newImageUri), name: filename} : coverImage.uri );
    formData.append("description", serviceDescription);
    formData.append('forMale', gender === 'male' || gender === 'none');
    formData.append('forFemale', gender === 'female' || gender === 'none');
    formData.append('duration', currentDuration);
    formData.append('price', price )
    return formData
  }

  const createService = () => {
    const data = createFormData()
    data.append('serviceType', value);
    onCreateService(data).then(res =>  !error && props.navigation.navigate('SpecialistServiceDetails', {service: res})).catch(e => props.navigation.goBack()) ;
  }

  const editService = () => {
    const data = createFormData();
    updateService(serviceId, data).then(res => {
      console.log(res);
      !error && props.navigation.navigate('SpecialistServiceDetails', {service: res});
    })
  }

  return (
    <SpecialistScreenHoc showBackButton={true}>
      {!isEdit && renderConfirmModal(
        showCreateServiceModal,
        setShowCreateServiceModal,
        "Create service",
        "Creating a service will reduce your total number of possible service.",
        createService
      )}
      {isEdit && renderConfirmModal(
        showUpdateServiceModal,
        setShowUpdateServiceModal,
        "Edit service",
        "Update service information",
        editService
      )}
      {renderConfirmModal(
        showDeleteServiceModal,
        setShowDeleteServiceModal,
        "Delete service",
        "Are you sure you want to delete this service?",
        deleteThisService
      )}
      <Container>
        {renderFlatListHeader()}
      </Container>
      {renderFinishButton()}
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({
  serviceTypes: state.services.serviceTypes,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateServiceScreen);
