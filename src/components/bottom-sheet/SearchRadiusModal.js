import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "styled-components/native";
import { View } from "react-native";
import { rgba } from "polished";
import Slider from "@react-native-community/slider";
import { connect, useDispatch, useSelector } from "react-redux";
import { Spacer } from "../spacer/spacer.component";
import { Text } from "../typography/typography.component";
import { Row, Separator } from "../helpers/helpers.component";
import { ModalButton } from "../button/button.component";
import { FilterModal } from "./bottom-sheet.component";
import {setSearchRadius} from "../../redux/booking/booking.actions";
import { SpecialistContext } from "../../providers/specialist.provider";
import mime from "mime";
const SearchRadiusModalComponent = ({
                                      showModal,
                                      toggleShowModal,
                                      ...restProps
                                    }) => {
  const theme = useTheme();
  const [curValue, setCurValue] = useState(20);
  const {updateSpecialistInfo} = useContext(SpecialistContext);
  const dispatchh = useDispatch();
  const distance = useSelector(state=>state.booking.searchRadius)
  useEffect(()=>{
    setCurValue(distance)
  }, [distance])
  useEffect(() => {
    setCurValue(restProps.searchRadius);
  }, [restProps.searchRadius]);
  const applyFilter = async () => {
    const formData = new FormData();
    formData.append('distance', curValue * 1000)
    await updateSpecialistInfo(formData)
    // restProps.setSearchRadius(curValue);
    dispatchh(setSearchRadius(curValue));
    toggleShowModal();
  };
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Distance</Text>
          <Spacer position="bottom" size="large" />
        </Spacer>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "white", paddingVertical: 16, paddingHorizontal: 2}}>
          <View style={{ flex: 1 }}>
            <Slider
              value={curValue}
              minimumValue={1}
              step={1}
              thumbTintColor={theme.colors.brand.secondary}
              maximumValue={20}
              onValueChange={(value) => setCurValue(value)}
              minimumTrackTintColor={theme.colors.brand.secondary}
              maximumTrackTintColor={rgba(theme.colors.brand.quaternary, 0.5)}
            />
          </View>
          <Spacer position="right" size="medium" />
          {curValue && (
            <Text variant="caption" style={{ fontSize: 16 }}>
              {curValue} km
            </Text>
          )}
        </View>
      </View>
      <Spacer position="bottom" size="large" />
      <Separator />
      <Row
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}
      >
        <ModalButton onPress={() => setCurValue(restProps.searchRadius)}>
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
  searchRadius: state.booking.searchRadius,
});
const mapDispatchToProps = (dispatch) => ({
  setSearchRadius: (radius) => dispatch(setSearchRadius(radius)),
});
export const SearchRadiusModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchRadiusModalComponent);