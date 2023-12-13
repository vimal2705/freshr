import React, {
  useCallback,
  useEffect,
  useRef,
} from "react";
import  {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";

import { useMemo } from "react";
import styled, {useTheme} from "styled-components/native";
import {
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { Spacer } from "../spacer/spacer.component";
import {
  Ionicons,
} from "@expo/vector-icons";
import { rgba } from "polished";

const ModalBackground = styled.View`
  border-radius: 15px;
  background-color: #fafafa;
`;

const BackdropContentContainer = styled.View`
  flex: 1;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-left: ${({ theme }) => theme.space[3]};
  height: 40px;
  width: 40px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
`;

export const SortFilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  height: 45px;
  border: 1px solid ${({ theme }) => rgba(theme.colors.brand.quaternary, 1)};
  overflow: hidden;
`;

export const SortFilterContainerSeparator = styled.View`
  height: 45px;
  width: 1px;
  background-color: "white";
`;

export const SortButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.brand.primary : "#25282b"};
`;

export const FileButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.brand.quaternary};
  border-radius: 10px;
`;


export const BottomModal = React.forwardRef(({ children, onClose }, ref) => {
  const initialSnapPoints = useMemo(() => ["10%", "CONTENT_HEIGHT"], [ref]);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        animatedIndex={animatedContentHeight}
        pressBehavior="none"
      />
    ),
    [animatedContentHeight]
  );
  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundComponent={ModalBackground}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose={true}
    >
      <BackdropContentContainer onLayout={handleContentLayout}>
        {children}
      </BackdropContentContainer>
    </BottomSheetModal>
  );
});

export const FilterModal = ({
  showModal,
  toggleShowModal,
  children,
  scrollView = true,
  ...restProps
}) => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const bottomSheetModalRef = useRef(null);
  useEffect(() => {
    if (showModal) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [showModal]);

  const handleClose = () => {
    toggleShowModal();
  };

  return (
    <BottomModal ref={bottomSheetModalRef} {...restProps}>
      <Spacer position="bottom" size="small">
        <CloseButton onPress={handleClose} style={{backgroundColor: "white", shadow: theme.shadows.default}}>
          <Ionicons name="close" size={20} />
        </CloseButton>
      </Spacer>

      {scrollView ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: dimensions.height/1.4,paddingHorizontal:16 }}
        >
          <Spacer position="top" size="medium" />
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </BottomModal>
  );
};









