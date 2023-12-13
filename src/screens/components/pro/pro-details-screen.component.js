import { PaddedContainer, SectionTitle } from "../details-screen.component";
import { View } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  DescriptionContainer,
  QuoteIconContainer,
  Text,
} from "../../../components/typography/typography.component";
import {
  EditButton,
  ModalButton,
} from "../../../components/button/button.component";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import styled, { useTheme } from "styled-components/native";
import { theme } from "../../../infrastructure/theme";
import React, { useState } from "react";
import { FilterModal } from "../../../components/bottom-sheet/bottom-sheet.component";
import {
  FormContainer,
  FormDescriptionInput,
  LengthIndicator,
} from "../../pro-facility/components/pro-facility-form-helper";
import { Row, Separator } from "../../../components/helpers/helpers.component";
import { FacilityDescriptionForm } from "../../pro-facility/components/forms.components";

const ConfigRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const EditFacilityDescriptionModal = ({
  showModal,
  toggleModal,
  title,
  value,
  applyChange
}) => {
  const theme = useTheme();

  return (
    <FilterModal
      showModal={showModal}
      toggleShowModal={toggleModal}
      scrollView={false}
    >
      <PaddedContainer>
        <Spacer position="bottom" size="large" />

        <SectionTitle style={{color: "black"}}>{title}</SectionTitle>
        <Spacer position="bottom" size="large" />

      </PaddedContainer>
      <FacilityDescriptionForm
        onSubmit={(values) => applyChange(values.description)}
        onCancel={() => toggleModal()}
        initValue={value}
        isEdit={true}
        toggleShowModal={toggleModal}
      />
    </FilterModal>
  );
};

export const renderDescription = (title, subtitle, value, editAction, show) => {
  return (
    <>
      <ConfigRow>
        <View style={{ flex: 1 }}>
          <SectionTitle style={{color: "black"}}>{title}</SectionTitle>
          <Spacer position="bottom" size="medium" />
          <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
            {subtitle}
          </Text>
          <Spacer position="bottom" size="large" />
        </View>
        <Spacer position="left" size="medium" />
        {show && <EditButton onPress={editAction}>
          <Entypo name="edit" size={20} color="white" />
        </EditButton>}
      </ConfigRow>
      <DescriptionContainer style={{backgroundColor: "black"}}>
        <QuoteIconContainer style={{ bottom: 0, right: 0 }}>
          <MaterialIcons name="format-quote" size={16} color={"white"} />
        </QuoteIconContainer>
        <Text style={{ lineHeight: 22, fontSize: 14, color: "white" }}>{value}</Text>
      </DescriptionContainer>
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="large" />
    </>
  );
};

export const WelcomeContainer = styled.View`
  padding: 40px ${({ theme }) => theme.space[3]};
  position: relative;
`;

export const WelcomeMessageContainer = styled.View`
  padding: 0px 0px ${({ theme }) => theme.space[3]};
`;

export const WelcomeText = styled(Text)`
  font-size: 30px;
  line-height: 40px;
  color: white;
  font-weight: bold;
`;
