import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";

import { Spacer } from "../spacer/spacer.component";
import { Text } from "../typography/typography.component";
import { CheckBoxInput } from "../form/form-checkbox.component";
import { Row, Separator } from "../helpers/helpers.component";
import { ModalButton } from "../button/button.component";
import { FilterModal } from "./bottom-sheet.component";
import {
  setProGender,
  setTargetGender,
} from "../../redux/booking/booking.actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLayoutEffect } from "react";

const GenderModalComponent = ({ showModal, toggleShowModal, data, ...restProps }) => {
  const [gender, setGender] = useState("");
  const [genderPro, setGenderPro] = useState("");
  const dispatch = useDispatch();
  const gen = useSelector(state=>state.booking.targetGender);

  // useEffect(() => {
  //   setGender(restProps.targetGender);
  //   setGenderPro(restProps.proGender);
  //   console.log("restProps.targetGender",restProps);
  // }, [restProps.proGender, restProps.targetGender]);

  useEffect(()=>{
    // setTargetGender(gen)
    setGender(gen) 
  }, [gen])
  const [storagegender, setstoragegender] = useState(null)
  useEffect(()=>{
    getDeliveryStorage();
  },[showModal])
  const getDeliveryStorage=async()=>{
  
    try {
      const value = await AsyncStorage.getItem(
        "gender"
      )
      console.log("#######################------------->", value);
      if(value){
        setGender(value)
      }
    } catch (error) {
      console.log("erorrrrrrrrrrrr",error);
    }
    }
  const applyFilter =async () => {
    // restProps.setTargetGender(gender);
    // restProps.setProGender(genderPro);

    dispatch(setTargetGender(gender)) 
    toggleShowModal();
    try {
      await AsyncStorage.setItem(
        "gender",
        gender
      )
    } catch (error) {
      console.log("erorrrrrrrrrrrr",error);
    }
  };
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      {/* <Spacer position="top" size="large" /> */}
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Pick a style
          </Text>
          <Spacer position="bottom" size="large" />
        </Spacer>

        <CheckBoxInput
          value={gender === "male"}
          handleChange={() => setGender("male")}
        >
          <Text style={{ fontSize: 16 }}>Masculine Style</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Generally for men</Text>
        </CheckBoxInput>
        <Spacer position="bottom" size="small" />
        <CheckBoxInput
          value={gender === "female"}
          handleChange={() => setGender("female")}
        >
          <Text style={{ fontSize: 16 }}>Feminine style</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Generally for women</Text>
        </CheckBoxInput>
        <Spacer position="bottom" size="small" />
        <CheckBoxInput
          value={gender === "all"}
          handleChange={() => setGender("all")}
        >
          <Text style={{ fontSize: 16 }}>No preference</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Style for all</Text>
        </CheckBoxInput>
      </View>
      <Spacer position="top" size="large" />

      
      <Spacer position="bottom" size="large" />
      <Separator />
      <Row
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}
      >
        <ModalButton
          onPress={() => {
            setGender('all');
            // setGenderPro(restProps.proGender);
          }}
        >
          <Text>Clear all</Text>
        </ModalButton>
        <ModalButton variant="primary" onPress={applyFilter}>
          <Text style={{ color: "white" }}>Apply filters</Text>
        </ModalButton>
      </Row>
    </FilterModal>
  );
};

const mapStateToProps = (state) => ({
  targetGender: state.booking.targetGender,
  // proGender: state.booking.proGender,
});

const mapDispatchToProps = (dispatch) => ({
  setTargetGender: (gender) => dispatch(setTargetGender(gender)),
  // setProGender: (gender) => dispatch(setProGender(gender)),
});

export const GenderModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(GenderModalComponent);
