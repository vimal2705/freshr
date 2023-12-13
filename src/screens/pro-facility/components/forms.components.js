import * as yup from "yup";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Footer, FooterRow, PaddedContainer, SectionTitle } from "../../components/details-screen.component";
import { Text } from "../../../components/typography/typography.component";
import {
  FormContainer, FormDescriptionInput,
  FormInput, GalleryEmptyContainer,
  LengthIndicator, renderCoverImage,
  renderError, renderImage, renderModal,
  renderSeatsForm,
  SeatIndicator, SeatOccupancyIndicator, UploadButton,
} from "./pro-facility-form-helper";
import { FlatGrid } from "react-native-super-grid";
import { Row, Separator } from "../../../components/helpers/helpers.component";
import { ModalButton } from "../../../components/button/button.component";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Formik } from "formik";
import styled, {useTheme} from "styled-components/native";
import React, { useState, useEffect } from "react";
import { arrayMoveImmutable } from "array-move";
import { View } from "react-native";
import { ImageSelectionModal } from "../../../components/bottom-sheet/ImageSelectionModal";
import * as ImagePicker from 'expo-image-picker';

const Content = styled.View`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
`


export const renderSeat = (key, theme, isOccupied=false, showIndicator=false ) => {
  return (
    <SeatIndicator key={key} backgroundColor={showIndicator && isOccupied ? theme.colors.brand.secondary : "black" }>
      {showIndicator && (<SeatOccupancyIndicator active={isOccupied}><Text variant="caption" style={{color: isOccupied ? theme.colors.brand.secondary: "white"}}>{isOccupied ? "occupied" : "free"}</Text></SeatOccupancyIndicator>)}
      <FontAwesome5 name="chair" size={50} color={"white"} />
    </SeatIndicator>
  );
};

export const renderSeats = (seats, theme, seatsAvailable=-1, showIndicator=false) => {

  return (
    <FlatGrid
      itemDimension={110}
      data={Array.from('x'.repeat(seats))}
      spacing={8}
      renderItem={({ item, index }) => renderSeat(index, theme, seatsAvailable < 0 ? false : index <= (seats - seatsAvailable - 1), showIndicator)}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export const SeatCapacityForm = ({ onSubmit, onCancel, initValue=3, isEdit }) => {
  const theme = useTheme();
  return <Formik
    initialValues={{ seats: initValue}}
    onSubmit={onSubmit}
    validationSchema={yup.object().shape({
      seats: yup.number().integer().min(1).required("Facility must have at least one seat available"),
    })}
  >
    {({ handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        setFieldValue,
        touched }) => (
      <>
        <Content>
          <PaddedContainer style={{ flex: 1 }}>
            {renderSeatsForm(
              () => setFieldValue('seats', values.seats + 1),
              () => setFieldValue('seats', values.seats > 1 ? values.seats - 1 : 1),
              values.seats
            )}
            <Spacer position="bottom" size="large" />
            {renderSeats(values.seats, theme)}
          </PaddedContainer>
          <Spacer position="bottom" size="medium" />
        </Content>
        <Footer style={{backgroundColor: "white"}}>
          <Separator />
          <FooterRow style={{backgroundColor: theme.colors.brand.white}}>
            <ModalButton onPress={onCancel} style={{backgroundColor: "white"}}>
              <AntDesign name="arrowleft" size={16} color={"black"} />
              <Spacer position="left" size="small" />
              <Text style={{color: "black"}}>{isEdit ? 'cancel' : 'Go back'}</Text>
            </ModalButton>
            <ModalButton
              variant="primary"
              style={{ backgroundColor: theme.colors.brand.secondary }}
              onPress={handleSubmit}
            >
              <Text style={{ color: "white" }}>{isEdit ? 'apply' : 'proceed'}</Text>
              <Spacer position="left" size="small" />
              <AntDesign name="arrowright" size={16} color="white" />
            </ModalButton>
          </FooterRow>
        </Footer>
      </>
    )}

  </Formik>
}

export const FacilityNameForm = ({onSubmit, onCancel, initValue="", isEdit=false, toggleShowModal}) => {
  const theme = useTheme();
  const [inputLength, setInputLength] = useState(0);

  return (
    <Formik
      initialValues={{name: initValue}}
      onSubmit={(values) => {
        onSubmit(values);
        if (isEdit) {
          toggleShowModal();
        }
      }}
      validationSchema={yup.object().shape({
        name: yup.string().required("Facility's name cannot be empty"),
      })}
    >
      {({ handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          touched }) =>
        (
          <>
            <Content>
              <PaddedContainer>
                <FormContainer>
                  <FormInput
                    value={values.name}
                    label="Facility's name"
                    onBlur={handleBlur('name')}
                    style={{backgroundColor: 'white', color: 'black'}}
                    color={'black'}
                    underlineColor={theme.colors.brand.primary}
                    onChangeText={(text) => {
                      setInputLength(text.length);
                      setFieldValue('name', text)
                    } }
                  />
                  <LengthIndicator>
                    <Text style={{ fontSize: 18, color: "gray" }}>{inputLength} / 50</Text>
                  </LengthIndicator>
                </FormContainer>
                {touched.name && errors.name && renderError(errors.name)}
                <Spacer position="bottom" size="large" />
                <Spacer position="bottom" size="large" />
                <Spacer position="bottom" size="large" />
              </PaddedContainer>
            </Content>
            <Footer style={{backgroundColor: "white"}}>
              <Separator />
              <FooterRow style={{backgroundColor: theme.colors.brand.white}}>
                <ModalButton onPress={onCancel} style={{backgroundColor: "white"}}>
                  <AntDesign name="arrowleft" size={16} color="black" />
                  <Spacer position="left" size="small" />
                  <Text style={{color: "black"}}>{isEdit ? 'cancel' : 'Go back'}</Text>
                </ModalButton>
                <ModalButton
                  variant="primary"
                  style={{ backgroundColor: theme.colors.brand.secondary }}
                  onPress={handleSubmit}
                >
                  <Text style={{ color: "white" }}>{isEdit ? 'apply' : 'proceed'}</Text>
                  <Spacer position="left" size="small" />
                  <AntDesign name="arrowright" size={16} color="white" />
                </ModalButton>
              </FooterRow>
            </Footer>
          </>
        )}
    </Formik>
  )
}


export const FacilityDescriptionForm = ({onSubmit, onCancel, initValue="", isEdit=false, toggleShowModal}) => {
  const theme = useTheme()
  const [inputLength, setInputLength] = useState(0);

  return (
    <Formik
      initialValues={{description: initValue}}
      onSubmit={values => {
        onSubmit(values);
        if (isEdit) {
          toggleShowModal();
        }
      }}
      validationSchema={yup.object().shape({
        description: yup.string().required("Facility's description cannot be empty"),
      })}
    >
      {({ handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          touched }) =>
        (<>
          <Content>
            <PaddedContainer>
              <FormContainer>
                <FormDescriptionInput
                  label="Facility's description"
                  value={values.description}
                  onBlur={handleBlur('name')}
                  style={{backgroundColor: 'white', color: 'black'}}
                  color={'black'}
                  underlineColor={theme.colors.brand.primary}
                  onChangeText={(text) => {
                    setInputLength(text.length);
                    setFieldValue('description', text);
                  }}
                />
                <LengthIndicator>
                  <Text style={{ fontSize: 18, color: "gray" }}>{inputLength} / 280</Text>
                </LengthIndicator>
              </FormContainer>
              {touched.description && errors.description && renderError(errors.description)}
              <Spacer position="bottom" size="large" />
              <Spacer position="bottom" size="large" />
              <Spacer position="bottom" size="large" />
            </PaddedContainer>
          </Content>
          <Footer style={{backgroundColor: "white"}}>
            <Separator />
            <FooterRow style={{backgroundColor: theme.colors.brand.white}}>
              <ModalButton onPress={onCancel} style={{backgroundColor: "white"}}>
                <AntDesign name="arrowleft" size={16} color="black" />
                <Spacer position="left" size="small" />
                <Text style={{color: "black"}}>{isEdit ? 'cancel' : 'Go back'}</Text>
              </ModalButton>
              <ModalButton
                variant="primary"
                style={{ backgroundColor: theme.colors.brand.secondary }}
                onPress={handleSubmit}
              >
                <Text style={{ color: "white" }}>{isEdit ? 'apply' : 'proceed'}</Text>
                <Spacer position="left" size="small" />
                <AntDesign name="arrowright" size={16} color="white" />
              </ModalButton>
            </FooterRow>
          </Footer>
        </>)}
    </Formik>
  )
}

export const renderGalleryEmpty = (toggleShowFileSelectionModal) => {
  return (
    <GalleryEmptyContainer onPress={toggleShowFileSelectionModal}>
      <Text style={{ color: "black" }}>No image selected</Text>
    </GalleryEmptyContainer>
  );
};
export const renderGallery = (coverImage, gallery, handleSelectImage, FlatGridHeader, FlatGridFooter, show=true) => {
  return (
    <FlatGrid
      ListHeaderComponent={ <>{FlatGridHeader}{renderCoverImage(coverImage?.uri ? coverImage?.uri : coverImage, () => handleSelectImage(coverImage, 0), show)}</>}
      ListFooterComponent={FlatGridFooter}
      data={gallery}
      spacing={2}
      renderItem={({ item, index }) =>
        renderImage(item?.uri ? item?.uri : item, index, () => handleSelectImage(item, index ), show)
      }
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    />
  );
};


export const FacilityGalleryForm = ({ initGallery=[], initCoverImage = null, onSubmit, onCancel, isEdit=false}) => {
  const theme = useTheme();
  const [gallery, setGallery] = useState([]);
  const [coverImage, setCoverImage] = useState(initCoverImage);
  const [error, setError] = useState("")
  const [showFileSelectionModal, setShowFileSelectionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

  useEffect(() => {
    if (gallery.length > 0 && error) {
      setError("")
    }
  }, [gallery])

  const handleSubmit = () => {
    if (gallery.length < 2) {
      setError("Please upload at least 3 images and set a cover")
    } else {
      onSubmit({gallery, coverImage});
    }
  }
  const updateGallery = (images) => {
    const cover = images.pop();
    setGallery(images);
    setCoverImage(cover);
  };

  const pickImage  = async() => {
    
 
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection:true
    });

    console.log(result);
        if (!result.canceled) {

    const cover = result.assets.pop();
    setGallery(result.assets)
    setCoverImage(cover);
        }
       
    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
  };

  //   setShowFileSelectionModal(!showFileSelectionModal);
  // };

  const setActiveImage = () => setSelectedImage(null);

  const moveImageForward = () => {
    setGallery((old) => {
      const moveToIndex = (selectedImageIndex + 1) %  gallery.length ;
      return arrayMoveImmutable(old, selectedImageIndex, moveToIndex);
    });
    setSelectedImage(null);
  };
  const moveImageBackward = () => {
    setGallery((old) => {
      const moveToIndex = (selectedImageIndex - 1) %  gallery.length;
      return arrayMoveImmutable(old, selectedImageIndex, moveToIndex);
    });
    setSelectedImage(null);
  };
  const setImageAsCoverImage = () => {
    const newCover = selectedImage?.uri ? { ...selectedImage } : selectedImage;

    setGallery((old) => {
      const newGallery = [...old];
      newGallery[selectedImageIndex] = coverImage;
      return newGallery;
    });
    setCoverImage( newCover);
    handleSelectImage(null, -1)
  };

  const handleSelectImage = (item, index) => {
    setSelectedImage(item);
    setSelectedImageIndex(index);
  };
  const deleteImage = () => {
    setGallery((old) => {
      const newGallery = [...old];
      newGallery.splice(selectedImageIndex, 1);
      if (selectedImage.filename === coverImage.filename) {
        setCoverImage( { ...newGallery[0] });
      }
      return newGallery;
    });
    handleSelectImage(null, -1)
  };

  const renderFlatGridFooter = () => {
    return (
      <>
        <Spacer position="bottom" size="medium" />
        <Spacer position="bottom" size="large" />
      </>
    );
  };


  const renderHeader = () => {
    return (
      <Row style={{ justifyContent: "space-between" }}>
        <View>
          <SectionTitle style={{color: "black"}}>Gallery</SectionTitle>
          <Spacer position="bottom" size="medium" />
          <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
            Upload some images to advertise your facility
          </Text>
          <Spacer position="bottom" size="large" />
        </View>
        <UploadButton onPress={pickImage} style={{backgroundColor: "white"}}>
          <Feather name="upload" size={18} color={theme.colors.brand.secondary} />
          <Spacer position="left" size="small" />
          <Text style={{color: "black"}}>Upload</Text>
        </UploadButton>
      </Row>
    );
  };

  return (
    <>
      <Container>
        {renderModal(
          selectedImage !== null,
          selectedImage !== coverImage,
          setActiveImage,
          moveImageForward,
          moveImageBackward,
          setImageAsCoverImage,
          deleteImage
        )}
        <Content
          showsVerticalScrollIndicator={false}
        >
          <Spacer position="bottom" size="medium" />
          <Spacer position="bottom" size="large" />
          <PaddedContainer style={{ flex: 1 }}>
            {renderHeader()}
            {!!error && renderError(error)}
            {gallery.length ? renderGallery(coverImage, gallery, handleSelectImage, <View/>, renderFlatGridFooter()) : renderGalleryEmpty(pickImage)}
          </PaddedContainer>
          <Spacer position={"bottom"} size={"large"}/>
        </Content>
        <Footer style={{backgroundColor: "white"}}>
          <Separator style={{backgroundColor: "white"}} />
          <FooterRow style={{backgroundColor: theme.colors.brand.white}}>
            <ModalButton onPress={onCancel} style={{backgroundColor: "white"}}>
              <AntDesign name="arrowleft" size={16} color="black" />
              <Spacer position="left" size="small" />
              <Text style={{color: "black"}}>Cancel</Text>
            </ModalButton>
            <ModalButton
              variant="primary"
              style={{backgroundColor: theme.colors.brand.secondary}}
              onPress={handleSubmit}
            >
              <Text style={{ color: "white" }}> {isEdit ? 'apply' : 'proceed'}</Text>
              <Spacer position="left" size="small" />
              <AntDesign name="arrowright" size={16} color="white" />
            </ModalButton>
          </FooterRow>
        </Footer>
      </Container>
      {/* <ImageSelectionModal
        showModal={showFileSelectionModal}
        toggleShowModal={toggleShowFileSelectionModal}
        updateValue={updateGallery}
      /> */}
    </>
  );
};
