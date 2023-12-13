import { setBookingStep } from "../../redux/booking/booking.actions";
import { connect } from "react-redux";
import { CardField, useStripe } from "@stripe/stripe-react-native";

const OrderCheckoutScreen = () => {
  const { confirmPayment } = useStripe();

  return (
    <CardField
      postalCodeEnabled={true}
      placeholders={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />
  );
}

const mapStateToProps = (state) => ({
  booking: state.booking,
});

const mapDispatchToProps = (dispatch) => ({
  setBookingStep: (step) => dispatch(setBookingStep(step)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCheckoutScreen);
