import styled from "styled-components/native";
import { TextInput } from "react-native-paper";
import { rgba } from "polished";
import Modal from "react-native-modal";
import { Dimensions, View } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { AntDesign, Entypo, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PaddedContainer } from "../../components/details-screen.component";
import { Text } from "../../../components/typography/typography.component";
import { Separator } from "../../../components/helpers/helpers.component";
import React from "react";

const {width} = Dimensions.get("window")

export const FormContainer = styled.View`
  position: relative;
`;

export const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  border-radius: 2px;
  background-color: ${({color}) => color};
`

export const FormInput = styled(TextInput).attrs((props) => ({
  color: props.theme.colors.ui.primary,
  maxLength: 50,
  numberOfLines: 3,
  multiline: true,
  textAlign: { undefined },
  theme: {
    colors:
      { primary: props.theme.colors.brand.primary,
        text: 'black',
        placeholder: "black",
        underlineColor: props.theme.colors.brand.primary
      }
  }
}))`
  background-color: white;
  width: 100%;
  height: 200px;
  font-size: 40px;
  font-weight: bold;
  padding: 0 10px;
`;

export const SeatFormContainer = styled.View`
  height: 170px;
  background-color: white;
  border: 2px solid ${({theme}) => theme.colors.brand.secondary};
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const SeatIndicator = styled.View`
  height: 110px;
  width: 110px;
  border-radius: 10px;
  background-color: ${({backgroundColor}) => backgroundColor};
  border: 2px solid #25282b;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const SeatOccupancyIndicator = styled.View`
  position: absolute;
  top: 8px;
  padding: 2px 4px;
  left: 0;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: ${({theme, active}) => active ? "white" : theme.colors.brand.secondary };
`

export const SeatFormButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.secondary};
  height: 44px;
  width: 44px;
  border-radius: 100px;
`;

export const SeatCounterIndicator = styled.View`
  background-color: ${({ theme }) => theme.colors.brand.secondary};
  padding: ${({ theme }) => theme.space[2]};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const FormDescriptionInput = styled(TextInput).attrs((props) => ({
  color: props.theme.colors.ui.primary,
  maxLength: 280,
  multiline: true,
  textAlign: { undefined },
  theme: {
    colors:
      { primary: props.theme.colors.brand.primary,
        text: 'black',
        placeholder: 'black',
        underlineColor: props.theme.colors.brand.primary
      }
  },
}))`
  width: 100%;
  height: 250px;
  background-color: white;
  font-size: 18px;
  font-weight: bold;
`;

export const LengthIndicator = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
`;

export const GalleryImage = styled.ImageBackground`
  aspect-ratio: 1;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
`;

export const CoverImage = styled.ImageBackground`
  border-radius: 5px;
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
`;

export const CoverImageTag = styled.View`
  background-color: ${({ theme }) => rgba(theme.colors.ui.primary, 0.5)};
  padding: ${({ theme }) => theme.space[2]};
  position: absolute;
  top: 5px;
  left: 5px;
`;

export const ImageSettingButton = styled.TouchableOpacity`
  height: 25px;
  width: 25px;
  border-radius: 100px;
  background-color: white;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 5px;
  top: 5px;
`;

export const ModalViewPositioning = styled.View`
  flex-direction: row;
  justify-content: center;
`;


export const ModalView = styled.View`
  min-width: 300px;
  max-width: ${width - 40};
  background-color: black;
  border: 2px solid #25282b;
  border-radius: ${({ theme }) => theme.sizes[1]};
  overflow: hidden;
`;

export const ModalCloseButton = styled.TouchableOpacity`
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.ui.primary};
  width: 30px;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SettingsButtonContainer = styled.View`
  background-color: black;
  border: 1px solid #25282b;
`;

export const SettingButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: black;
  border: 1px solid #25282b;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[3]};
`;

export const GalleryEmptyContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: white;
  border: 2px solid #25282b;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const UploadButton = styled.TouchableOpacity`
  border: 2px solid ${({theme}) => theme.colors.brand.secondary};
  flex-direction: row;
  height: 40px;
  align-items: center;
  padding: 0px 10px;
  border-radius: 30px;
`;

export const renderError = (message) => {
  return (
    <View>
      <Spacer position="top" size="small" />
      <ErrorContainer color={"#FF0D10"}>
        <MaterialIcons name="error-outline" size={14} color={"white"} />
        <Spacer position="left" size="small" />

        <Text style={{ fontSize: 12, color: "white" }}>
          {message}
        </Text>
      </ErrorContainer>
      <Spacer position="top" size="small" />
    </View>
  )
}

export const renderModal = (
  isVisible,
  isCover,
  setActive,
  moveForward,
  moveBackward,
  setAsCoverImage,
  deleteCurrentImage
) => {
  return (
    <Modal isVisible={isVisible}>
      <ModalViewPositioning>
        <ModalView>
          <View>
            <Spacer position="top" size="small" />
            <Spacer position="left" size="small">
              <ModalCloseButton onPress={setActive}>
                <Ionicons name="close" size={20} color="white" />
              </ModalCloseButton>
            </Spacer>
            <Spacer position="top" size="small" />
          </View>
          {isCover && (
            <PaddedContainer style={{backgroundColor: "black"}}>
              <Spacer position="bottom" size="large" />
              <SettingsButtonContainer>
                <SettingButton onPress={moveForward}>
                  <Text variant="caption" style={{ fontSize: 14, color: "white" }}>
                    Move forward
                  </Text>
                  <AntDesign name="arrowright" size={24} color="white" />
                </SettingButton>
                <Separator />
                <SettingButton onPress={moveBackward}>
                  <Text variant="caption" style={{ fontSize: 14, color: "white"}}>
                    Move backward
                  </Text>
                  <AntDesign name="arrowleft" size={24} color="white" />
                </SettingButton>
                <Separator />
                <SettingButton onPress={setAsCoverImage}>
                  <Text variant="caption" style={{ fontSize: 14, color: "white" }}>
                    Use as cover image
                  </Text>
                  <AntDesign name="staro" size={24} color="white" />
                </SettingButton>
              </SettingsButtonContainer>
              <Spacer position="bottom" size="large" />
              <Spacer position="bottom" size="medium" />
            </PaddedContainer>
          )}
          <Separator />
          <SettingButton
            style={{
              marginBottom: -1,
            }}
            onPress={deleteCurrentImage}
          >
            <Text variant="caption" style={{ fontSize: 14 }}>
              Delete image
            </Text>
            <AntDesign name="delete" size={24} />
          </SettingButton>
        </ModalView>
      </ModalViewPositioning>
    </Modal>
  );
};

export const renderImage = (item, index, selectImage, show=true) => {
  return (
    <GalleryImage key={index} source={{ uri: item }}>
      {show && <ImageSettingButton onPress={() => selectImage(item, index)}>
        <Feather name="more-horizontal" size={20} color="black" />
      </ImageSettingButton>}
    </GalleryImage>
  );
};

export const renderCoverImage = (image, selectImage, show=true) => {
  return (
    <>
      {image && (
        <CoverImage source={{ uri: image }} resizeMode="cover">
          {show && <ImageSettingButton onPress={() => selectImage(image, -1)}>
            <Feather name="more-horizontal" size={20} color="black" />
          </ImageSettingButton>}
          <CoverImageTag>
            <Text
              variant="caption"
              style={{
                fontWeight: "normal",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              cover image
            </Text>
          </CoverImageTag>
        </CoverImage>
      )}
      <Spacer position="bottom" size="small" />
    </>
  );
};

export const renderSeatsForm = (increase, reduce, cnt) => {
  return (
    <SeatFormContainer>
      <SeatFormButton onPress={reduce}>
        <Entypo name="minus" size={24} color="white" />
      </SeatFormButton>
      <Spacer position="left" size="large" />
      <Spacer position="left" size="large" />
      <Text variant="caption" style={{ fontSize: 16, color: "black" }}>
        How many seats
      </Text>
      <Spacer position="left" size="large" />
      <Spacer position="left" size="large" />
      <SeatFormButton onPress={increase}>
        <Entypo name="plus" size={24} color="white" />
      </SeatFormButton>
      <SeatCounterIndicator>
        <Text variant="caption" style={{ color: "white" }}>
          {cnt}
        </Text>
      </SeatCounterIndicator>
    </SeatFormContainer>
  );
};
