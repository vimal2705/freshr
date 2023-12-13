import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

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

const TypeModalComponent = ({ showModal, toggleShowModal, ...restProps }) => {
  const [gender, setGender] = useState("");
  const[type,setType]=useState("");
  const [genderPro, setGenderPro] = useState("");

  useEffect(() => {
    setGender(restProps.targetGender);
    setGenderPro(restProps.proGender);
  }, [restProps.proGender, restProps.targetGender]);

  const applyFilter = () => {
    restProps.setTargetGender(gender);
    restProps.setProGender(genderPro);
    toggleShowModal();
  };
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      {/* <Spacer position="top" size="large" /> */}
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Pick a  type
          </Text>
          <Spacer position="bottom" size="large" />
        </Spacer>

        <CheckBoxInput
         // value={gender === "male"}
         value={type==="Barber"}
          handleChange={() => setType("Barber")}
        >
          <Text style={{ fontSize: 16 }}>Barber</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Barber</Text>
        </CheckBoxInput>
        <Spacer position="bottom" size="small" />
        <CheckBoxInput
          value={type === "saloon"}
          handleChange={() => setType("saloon")}
        >
          <Text style={{ fontSize: 16 }}>Sallon</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">Sallon</Text>
        </CheckBoxInput>
        <Spacer position="bottom" size="small" />
        <CheckBoxInput
          value={type === "all"}
          handleChange={() => setType("all")}
        >
          <Text style={{ fontSize: 16 }}>All Type</Text>
          <Spacer position="bottom" size="small" />
          <Text variant="caption">All Type</Text>
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
            setGender(restProps.targetGender);
            setGenderPro(restProps.proGender);
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
  proGender: state.booking.proGender,
});

const mapDispatchToProps = (dispatch) => ({
  setTargetGender: (gender) => dispatch(setTargetGender(gender)),
  setProGender: (gender) => dispatch(setProGender(gender)),
});


export const TypeModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TypeModalComponent);


