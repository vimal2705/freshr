import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Spacer } from "../spacer/spacer.component";
import { Text } from "../typography/typography.component";
import { FileButton, FilterModal } from "./bottom-sheet.component";
import { useNavigation } from "@react-navigation/native";

export const EditServiceModal = ({ showModal, toggleShowModal, toggleDeleteModal=null, service }) => {
  const navigation = useNavigation();
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="bottom" size="large" />
      <View>
        <FileButton onPress={() => {
          toggleShowModal();
          navigation.navigate("SpecialistCreateService", {
            isEdit: true,
            service: { ...service },
          });
        }
        }>
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={20}
            color="white"
          />
          <Spacer position="left" size="medium" />
          <Text variant="caption" style={{ color: "white", fontSize: 16 }}>
            Edit Service
          </Text>
        </FileButton>
        <Spacer position="bottom" size="large" />
        <FileButton onPress={() => {
          if (toggleDeleteModal) toggleDeleteModal();
          toggleShowModal();
        }}>
          <MaterialCommunityIcons
            name="delete-empty-outline"
            size={20}
            color="white"
          />
          <Spacer position="left" size="medium" />
          <Text variant="caption" style={{ color: "white", fontSize: 16 }}>
            Delete service
          </Text>
        </FileButton>
        <Spacer position="bottom" size="large" />
        <FileButton onPress={toggleShowModal}>
          <Text variant="caption" style={{ color: "white", fontSize: 16 }}>
            Cancel
          </Text>
        </FileButton>
      </View>
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="medium" />
    </FilterModal>
  );
};
