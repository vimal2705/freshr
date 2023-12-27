import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import React, { useEffect, useState, useContext } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { useInterval } from "usehooks-ts";
import { rgba } from "polished";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { Video,ResizeMode } from "expo-av";
import { EditImageModal } from "../../components/bottom-sheet/EditImageModal";
import { ImageUploadModal } from "../../components/bottom-sheet/ImageUploadModal";
import { SpecialistContext } from "../../providers/specialist.provider";
import { LoadingScreen } from "../loading.screen";
import mime from "mime";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import { useNavigation } from "@react-navigation/native";
import { Animated } from "react-native";

const Container = styled.View`
  flex: 1;
`;

const ImageContainer = styled.View`
  flex: 1;
  background-color: black;
  justify-content: center;
  align-items: center;
  min-height: ${Dimensions.get("window").height - 80};
  position: relative;
`;

const StatusImage = styled.ImageBackground`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.ui.primary};
`;

const NavButton = styled.TouchableOpacity`
  height: 100%;
  flex: 1;
  position: relative;
`;

const NavButtonContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: row;
  width: 100%;
  height: 100%;
  z-index: 4;
`;

const ProgressBarContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 16px;
`;

const ProgressBar = styled.View`
  flex: 1;
  height: 4px;
  border-radius: 20px;
  background-color: ${({ theme }) => rgba(theme.colors.ui.quaternary, 0.9)};
  margin: 4px;
`;

const ProgressBarIndicator = styled.View`
  background-color: ${({ theme, active }) =>
    active ? rgba(theme.colors.brand.quaternary, 0.6) : "transparent"};
  height: 100%;
  border-radius: 20px;
`;

const TopNavContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  z-index: 3;
`;

const NavigationButton = styled.TouchableOpacity`
  height: 44px;
  width: 44px;
  border-radius: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => rgba(theme.colors.ui.primary, 0.3)};
`;

const ProfilePicture = styled.Image`
  height: 44px;
  width: 44px;
  border-radius: 44px;
  overflow: hidden;
`;

const SpecialistStoryScreen = ({ route, ...restProps }) => {
  const navigation = useNavigation();
  const { isLoading, postStory, specialistStories, deleteStory, specialist } = useContext(SpecialistContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [gallery, setGallery] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [status, setStatus] = useState({});
  const [videoDuration, setVideoDuration] = useState(null);

  useEffect(() => {
    let timer = setTimeout(() => {
      navigation.navigate('Profile');
    }, videoDuration || 10000);

    Animated.timing(showProgressBar, {
      toValue: 5,
      duration: videoDuration || 10000,
      useNativeDriver: false,
    }).start();

    return () => clearTimeout(timer);
  }, [videoDuration, navigation]);

  const [showProgressBar, setShowProgressBar] = useState(new Animated.Value(0));

  const progreeAnimation = showProgressBar.interpolate({
    inputRange: [0, 5],
    outputRange: ['0%', '100%'],
  });

  // console.log("video durationnnnnnnnn", videoDuration);

  useEffect(() => {
    console.log("ssssss", specialistStories);
    setGallery([...specialistStories]);
    setShowEditImageModal(false);
  }, [specialistStories]);

  useInterval(() => {
    if (progress >= 300) {
      setActiveIndex((prev) => (prev + 1) % specialistStories.length);
      setProgress(0);
    } else {
      setProgress((old) => old + 5);
    }
  }, 300);

  useEffect(() => {
    if (status && status.didJustFinish) {
      moveNext();
    }
  }, [status]);

  const deleteAction = async () => {
    await deleteStory(gallery[activeIndex]._id);
  };

  const addImageToStory = (result) => {
    const formData = new FormData();
    const filename = result.uri.split('/').pop();
    const newImageUri = "file:///" + result.uri.split("file:/").join("");
    formData.append('resource', { ...result, uri: newImageUri, type: mime.getType(newImageUri), name: filename });
    formData.append('mediaType', result.type.startsWith('image') ? 'IMAGE' : 'VIDEO');
    postStory(formData);
    console.log("doneeeeeeeeeeeee");
  };

  if (isLoading || !specialistStories) {
    return <LoadingScreen />;
  }

  const moveNext = () => {
    setActiveIndex((prev) =>
      prev - 1 < 0 ? gallery.length - 1 : (prev - 1) % gallery.length
    );
    setProgress(0);
    setStatus({});
  };

  const moveBack = () => {
    setActiveIndex((prev) => (prev + 1) % gallery.length);
    setProgress(0);
    setStatus({});
  };

  const onPlaybackStatusUpdate = (status) => {
    setStatus(status);
    if (status.isLoaded && !status.isLooping && videoDuration === null) {
      setVideoDuration(status.durationMillis);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const desiredWidth = screenWidth * 1;
  const desiredHeight = screenHeight * 0.8;
  return (
    <SpecialistScreenHoc showBackButton={true}>
      <View style={{ flex: 1, backgroundColor: 'black', alignItems: "center" }}>
        <Container>
          <TopNavContainer>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <NavigationButton onPress={() => setShowEditImageModal(true)}>
                <Feather name="more-horizontal" size={24} color="white" />
              </NavigationButton>
            </View>
          </TopNavContainer>
          <ImageContainer>
            <View style={{
              height: 5,
              width: '95%',
              borderWidth: 1,
              backgroundColor: 'gray',
              position: 'absolute',
              top: 18
            }}>
              <Animated.View style={{
                height: '100%',
                backgroundColor: 'white',
                width: progreeAnimation
              }}>
              </Animated.View >
            </View>
            <NavButtonContainer>
              <NavButton onPress={moveNext} />
              <NavButton onPress={moveBack} />
            </NavButtonContainer>
            {specialistStories[activeIndex] && specialistStories[activeIndex].mediaType === "VIDEO" ? (
              <Video
                style={{
                  width: desiredWidth,
                  height:desiredHeight
                }}
                // resizeMode={Video.RESIZE_MODE_COVER}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={true}
                isLooping={false}
                usePoster
                rate={1.0}
                volume={1.0}
                isMuted={false}
                source={{ uri: specialistStories[activeIndex].resource }}
                autoplay={true}
                onPlaybackStatusUpdate={(status) => onPlaybackStatusUpdate(status)}
              />
            ) : (
              specialistStories[activeIndex] && <StatusImage source={{ uri: specialistStories[activeIndex].resource }} />
            )}
          </ImageContainer>
        </Container>
        <ImageUploadModal
          showModal={showImageUploadModal}
          toggleShowModal={() => setShowImageUploadModal(false)}
          addImage={addImageToStory}
          noGallery={true}
          allowVideo={true}
        />
        <EditImageModal
          deleteAction={deleteAction}
          showModal={showEditImageModal}
          toggleShowModal={() => setShowEditImageModal(false)}
        />
      </View>
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialistStoryScreen);
