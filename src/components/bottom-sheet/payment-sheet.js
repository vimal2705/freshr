import {useTheme} from 'styled-components/native';
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";

import { Spacer } from "../spacer/spacer.component";
import { Text } from "../typography/typography.component";
import Rheostat, { AreaRheostat } from "react-native-rheostat";
import { Row, Separator } from "../helpers/helpers.component";
import { ModalButton,ModalButton1 } from "../button/button.component";
import { FilterModal } from "./bottom-sheet.component";
import {
  setCurrentPriceRange,
} from "../../redux/booking/booking.actions";
import { useStripe } from '@stripe/stripe-react-native';
import { AppContext } from '../../providers/app-provider';

const Paymentsheetcomponent = ({
                                    showModal,
                                    toggleShowModal,
                                    ...restProps
                                  }) => {
  const [curValue, setCurValue] = useState(null);
  const theme = useTheme();

  const { ongoingOrder, paydata } = useContext(AppContext);
console.log("paydataaaaaaaaaaaaaaaaaaaaaaaa", paydata);

  useEffect(() => {
    setCurValue(restProps.priceRange);
    console.log("Ssad",restProps);
  }, []);

  console.log("ongoingorderrr",ongoingOrder);

  const onRheostatValUpdated = (payload) => {
    setCurValue(payload.values);
  };
  const{initPaymentSheet,presentPaymentSheet}=useStripe();
//   pi_3OQO41CnZhSvaL8u0vNjYMgi_secret_EgD3Uk28NejC2LNSlxuljuYQf ek_test_YWNjdF8xTTUxSzFDblpoU3ZhTDh1LE9wQjM2ZkRGd2NiQUdIOFROaURSaXdRMjFJaVlLT04_00bWS9oPFI undefined

  const initialize =async () => {
    const { error } = await initPaymentSheet({
        customerId: null,
        customerEphemeralKeySecret: paydata ? paydata.ephemeralKey : 'ek_test_YWNjdF8xTTUxSzFDblpoU3ZhTDh1LE9wQjM2ZkRGd2NiQUdIOFROaURSaXdRMjFJaVlLT04_00bWS9oPFI',
        paymentIntentClientSecret: paydata ? paydata.paymentIntent : 'pi_3OQO41CnZhSvaL8u0vNjYMgi_secret_EgD3Uk28NejC2LNSlxuljuYQf',
        merchantDisplayName: 'Freshr',
        style: "alwaysLight",
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
      });

      if(error){
        console.log("nottttt initializedddddddddd");
      }
      else{
        console.log("initializedddddddddddddddddddddd");
      }
  }


  useEffect(()=>{
    initialize()
    console.log("donee");
  }, [])


  const applyFilter = async() => {
    console.log("commimnggggggg");
    const{error,paymentOption}=await presentPaymentSheet();
    console.log("payyyoptionssssssssss",paymentOption);
    if(error){
        console.log("errrorrrrrr",error.message);
    }
    else{
        showModal=false;
        toggleShowModal();
    }
    
  };


  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      <Spacer position="top" size="large" />
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
      <View style={{flexDirection:"row" ,justifyContent:"space-between"}}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Service charge</Text>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>${ongoingOrder?.price/100}</Text>
          {/* <Text style={{ fontSize: 22, fontWeight: "bold" }}>${95}</Text> */}

          </View>
          
      <View style={{flexDirection:"row" ,justifyContent:"space-between"}}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Seat charge</Text>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>${5}</Text>
          </View>
          <Spacer position="bottom" size="large" />
          <View style={{flexDirection:"row" ,justifyContent:"space-between"}}>
            <Text
              variant="caption"
              style={{ fontSize: 16, fontWeight: "bold" }}
            >
              Total Price 
            </Text>
            <Text
              variant="caption"
              style={{ fontSize: 16, fontWeight: "bold" }}
            >
            ${((ongoingOrder?.price)/100)+5}
            </Text>
            </View>
          
        </Spacer>
     
        <Spacer position="bottom" size="large" />
      </View>
      <Spacer position="bottom" size="large" />
      <Separator />
      {/* <Row
        style={{
          justifyContent: "space-between",
        
          paddingHorizontal: 8,
          paddingVertical: 16,
          alignContent:"center"
        }}
      > */}
      <View style={{justifyContent:'center',alignItems:'center',marginVertical:20}}>
        <ModalButton1 variant="primary" onPress={()=>applyFilter()} >
          <Text style={{ color: "white" }}>Pay Now</Text>
        </ModalButton1>
      </View>
      {/* </Row> */}
    </FilterModal>
  );
};

const mapStateToProps = (state) => ({
  priceRange: state.booking.priceRange,
});

const mapDispatchToProps = (dispatch) => ({
  setPriceRange: (range) => dispatch(setCurrentPriceRange(range)),
});


export const Paymentsheet = connect(
  mapStateToProps,
  mapDispatchToProps
)(Paymentsheetcomponent);
