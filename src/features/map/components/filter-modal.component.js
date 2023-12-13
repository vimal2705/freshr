import React, { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components/native";

import { AreaRheostat } from "react-native-rheostat";
import {Dimensions, useWindowDimensions, View} from "react-native";
import { Searchbar } from "react-native-paper";

import {BottomModal, CloseButton} from "../../../components/modal/bottom-sheet-modalcomponent";
import { Text } from "../../../components/typography/typography.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Ionicons } from "@expo/vector-icons";
import { CheckBoxInput } from "../../../components/form/form-checkbox.component";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Suggestion } from "./suggestion.component";

const ModalContent = styled.ScrollView`
  flex: 1;
  padding: 0px ${({ theme }) => theme.space[3]};
`;

const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: #ccc;
`;


const ModalFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[3]};
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.ui.primary
      : theme.colors.ui.quaternary};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.sizes[1]};
`;

export const FilterModal = ({ showModal, toggleShowModal, children }) => {
  const dimensions = useWindowDimensions()
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
    <BottomModal ref={bottomSheetModalRef}>
      <Spacer position="bottom" size="small">
        <CloseButton onPress={handleClose}>
          <Ionicons name="close" size={20} />
        </CloseButton>
      </Spacer>

      <ModalContent showsVerticalScrollIndicator={false} style={{maxHeight: dimensions.height / 1.4}}>
        <Spacer position="top" size="medium" />
        {children}
        <Spacer position="bottom" size="large" />
      </ModalContent>

      <Separator />
      <ModalFooter>
        <ModalButton>
          <Text>Clear all</Text>
        </ModalButton>
        <ModalButton variant="primary">
          <Text style={{ color: "white" }}>Apply filters</Text>
        </ModalButton>
      </ModalFooter>
    </BottomModal>
  );
};

export const PriceRangeModal = ({
  showModal,
  toggleShowModal,
  updateValue,
  value,
}) => {
  const theme = useTheme();
  const onRheostatValUpdated = (payload) => {
    updateValue(payload.values);
  };
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Price range</Text>
          <Spacer position="bottom" size="large" />
          <Text>
            ${value[0]} - ${value[1]}
          </Text>
        </Spacer>
        <AreaRheostat
          values={[8, 150]}
          min={0}
          max={16}
          theme={{
            rheostat: { themeColor: "gray", grey: "#fafafa" },
          }}
          onValuesUpdated={onRheostatValUpdated}
          svgData={[
            2, 10, 40, 85, 85, 91, 35, 53, 24, 50, 10, 40, 95, 85, 40, 12,
          ]}
        />
      </View>
      <Spacer position="bottom" size="large" />
    </FilterModal>
  );
};

export const GenderModal = ({
  value,
  showModal,
  toggleShowModal,
  updateValue,
}) => {
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Pick gender</Text>
          <Spacer position="bottom" size="large" />
        </Spacer>

        <CheckBoxInput
          value={value.men}
          handleChange={() => updateValue("men")}
        >
          <Text style={{ fontSize: 16 }}>Men's style</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Haircut for men</Text>
        </CheckBoxInput>
        <Spacer position="bottom" size="small" />
        <CheckBoxInput
          value={value.women}
          handleChange={() => updateValue("women")}
        >
          <Text style={{ fontSize: 16 }}>Women's style</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Haircut for women</Text>
        </CheckBoxInput>
        <Spacer position="bottom" size="small" />
        <CheckBoxInput
          value={value.both}
          handleChange={() => updateValue("both")}
        >
          <Text style={{ fontSize: 16 }}>Unspecified</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Haircut for either</Text>
        </CheckBoxInput>
      </View>
      <Spacer position="bottom" size="large" />
    </FilterModal>
  );
};

export const ServiceTypeModal = ({
  value,
  showModal,
  toggleShowModal,
  updateValue,
}) => {
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Pick service type
          </Text>
          <Spacer position="bottom" size="large" />
        </Spacer>
        <View>
          <CheckBoxInput
            value={value.haircut}
            handleChange={() => updateValue("haircut")}
          >
            <Text style={{ fontSize: 16 }}>Haircut</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">Get that new haircut</Text>
          </CheckBoxInput>
          <Spacer position="bottom" size="small" />
          <CheckBoxInput
            value={value.hairColoring}
            handleChange={() => updateValue("hairColoring")}
          >
            <Text style={{ fontSize: 16 }}>Hair coloring</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">Get your right color</Text>
          </CheckBoxInput>
          <Spacer position="bottom" size="small" />
          <CheckBoxInput
            value={value.beardSculpting}
            handleChange={() => updateValue("beardSculpting")}
          >
            <Text style={{ fontSize: 16 }}>Beard sculpting</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">The right shape of beard</Text>
          </CheckBoxInput>
          <Spacer position="bottom" size="small" />
          <CheckBoxInput
            value={value.scalpMassage}
            handleChange={() => updateValue("scalpMassage")}
          >
            <Text style={{ fontSize: 16 }}>Scalp massage</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">Relax your head</Text>
          </CheckBoxInput>
        </View>
      </View>

      <Spacer position="bottom" size="large" />
    </FilterModal>
  );
};

export const SortFilterModal = ({
  value,
  showModal,
  toggleShowModal,
  updateValue,
}) => {
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Sort by</Text>
          <Spacer position="bottom" size="large" />
        </Spacer>
        <View>
          <CheckBoxInput
            value={value.rating}
            handleChange={() => updateValue("rating")}
          >
            <Text style={{ fontSize: 16 }}>Rating</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">The best of the best</Text>
          </CheckBoxInput>
          <Spacer position="bottom" size="small" />
          <CheckBoxInput
            value={value.distance}
            handleChange={() => updateValue("distance")}
          >
            <Text style={{ fontSize: 16 }}>Distance</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">Close to you</Text>
          </CheckBoxInput>
          <Spacer position="bottom" size="small" />
          <CheckBoxInput
            value={value.price}
            handleChange={() => updateValue("price")}
          >
            <Text style={{ fontSize: 16 }}>Sort by price</Text>
            <Spacer position="bottom" size="small" />
            <Text variant="caption">The best deals</Text>
          </CheckBoxInput>
        </View>
      </View>
      <Spacer position="bottom" size="large" />
    </FilterModal>
  );
};

const GOOGLE_PLACES_API_KEY = "API_KEY_ID";

const Search = styled(Searchbar).attrs((props) => ({
  selectionColor: "black",
}))`
  border-radius: ${({ theme }) => theme.sizes[2]};
  elevation: 0;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  color: ${({ theme }) => theme.colors.ui.primary};
  font-size: 12px;
`;

export const LocationModal = ({ value, showModal, toggleShowModal }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText(value);
  }, [value]);

  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Change location
          </Text>
          <Spacer position="bottom" size="large" />
        </Spacer>
        <View>
          <GooglePlacesAutocomplete
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en", // language of the results
            }}
            onPress={(data, details) => console.log(data, details)}
            textInputProps={{
              InputComp: Search,
            }}
            suppressDefaultStyles
            placeholder="search location"
          />
        </View>

        <View>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
          <Spacer position="bottom" size="medium" />
          <Suggestion value="Koblenz metternich">
            <Ionicons name="location" size={20} />
          </Suggestion>
        </View>
      </View>
      <Spacer position="bottom" size="large" />
    </FilterModal>
  );
};

export const ServicesModal = ({ value, showModal, toggleShowModal }) => {
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Browse services
          </Text>
          <Spacer position="bottom" size="large" />
        </Spacer>
        <View>
          <Search placeholder="search services" />
        </View>
      </View>
      <Spacer position="bottom" size="large" />
    </FilterModal>
  );
};
