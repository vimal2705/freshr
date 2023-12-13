import {useTheme} from 'styled-components/native';
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";

import { Spacer } from "../spacer/spacer.component";
import { Text } from "../typography/typography.component";
import Rheostat, { AreaRheostat } from "react-native-rheostat";
import { Row, Separator } from "../helpers/helpers.component";
import { ModalButton } from "../button/button.component";
import { FilterModal } from "./bottom-sheet.component";
import {
  setCurrentPriceRange,
} from "../../redux/booking/booking.actions";

const PriceRangeModalComponent = ({
                                    showModal,
                                    toggleShowModal,
                                    ...restProps
                                  }) => {
  const [curValue, setCurValue] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    setCurValue(restProps.priceRange);
    console.log("Ssad",restProps);
  }, []);

  const onRheostatValUpdated = (payload) => {
    setCurValue(payload.values);
  };

  const applyFilter = () => {
    restProps.setPriceRange(curValue);
    toggleShowModal();
  };

  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Price range</Text>
          <Spacer position="bottom" size="large" />
          {curValue && (
            <Text
              variant="caption"
              style={{ fontSize: 16, fontWeight: "bold" }}
            >
              <Feather name="dollar-sign" size={16} />
              {curValue[0]} - <Feather name="dollar-sign" size={16} />
              {curValue[1]}
            </Text>
          )}
        </Spacer>
        <Rheostat
          values={curValue}
          min={4}
          max={1000}
          theme={{
            rheostat: { themeColor: theme.colors.brand.secondary, grey: "#fafafa" },
          }}
          onValuesUpdated={onRheostatValUpdated}
        />
        <Spacer position="bottom" size="large" />
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
        <ModalButton onPress={() => setCurValue([...restProps.priceRange])}>
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
  priceRange: state.booking.priceRange,
});

const mapDispatchToProps = (dispatch) => ({
  setPriceRange: (range) => dispatch(setCurrentPriceRange(range)),
});


export const PriceRangeModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceRangeModalComponent);
