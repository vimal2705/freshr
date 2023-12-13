import Modal from "react-native-modal";
import {
  ModalCloseButton,
  ModalView,
  ModalViewPositioning,
} from "../../pro-facility/components/pro-facility-form-helper";
import { View } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Footer,
  FooterRow,
  PaddedContainer,
  SectionTitle,
} from "../../components/details-screen.component";
import { Text } from "../../../components/typography/typography.component";
import { Separator } from "../../../components/helpers/helpers.component";
import { ModalButton } from "../../../components/button/button.component";
import { useTheme } from "styled-components/native";

export const renderConfirmModal = (
  isVisible,
  setIsVisible,
  title,
  description,
  action,
  cancelAction=null,
  isAfter=false,
) => {
  const theme = useTheme();
  return (
    <Modal isVisible={isVisible}>
      <ModalViewPositioning>
        <ModalView>
          <View>
            <Spacer position="top" size="small" />
            <Spacer position="left" size="small">
              <ModalCloseButton onPress={() => {
                setIsVisible(false);
                if (cancelAction) cancelAction();
              }}>
                <Ionicons name="close" size={20} color="white" />
              </ModalCloseButton>
            </Spacer>
            <Spacer position="top" size="small" />
          </View>
          <Spacer position="top" size="large" />

          <PaddedContainer>
            <SectionTitle style={{color: theme.colors.brand.primary}}>{title} </SectionTitle>
            <Spacer position="bottom" size="large" />
            <Text variant="caption" style={{ fontSize: 14, color: "white" }}>
              {description}
            </Text>
            <Spacer position="bottom" size="large" />
          </PaddedContainer>
          <Footer>
            <FooterRow>
              <ModalButton
                onPress={() => {
                  setIsVisible(false);
                  if (cancelAction) cancelAction();
                }}
                style={{ paddingVertical: 8, backgroundColor: "black" }}
              >
                <MaterialIcons name="cancel" size={16} color="white" />
                <Spacer position="left" size="medium" />
                <Text variant="caption" style={{fontSize: 12, color: "white"}}>Cancel</Text>
              </ModalButton>
              <ModalButton
                variant="primary"
                style={{ paddingVertical: 8, backgroundColor: theme.colors.brand.primary }}
                onPress={() => {
                  if (isAfter) {
                    setIsVisible(false);
                    action();
                  } else {
                    action();
                    setIsVisible(false);
                  }
                }}
              >
                <Text variant="caption" style={{fontSize: 12, color: "white"}}>Proceed</Text>
                <Spacer position="left" size="medium" />
                <MaterialIcons name="cancel" size={16} color="white" />
              </ModalButton>
            </FooterRow>
          </Footer>
        </ModalView>
      </ModalViewPositioning>
    </Modal>
  );
};
