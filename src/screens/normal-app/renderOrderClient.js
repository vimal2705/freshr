import { Dimensions, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { OrderCard } from "../pro-specialist/components/order-card.component";

export const renderOrderClient = ({pendingOrders, navigation}) => {
  return (
    <>
      {pendingOrders.length > 0  && <View style={ {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        paddingVertical: 30,
        backgroundColor: "black",
        flex: 1
      }}>
        <Carousel
          // slideStyle={{width: "100%", backgroundColor: "white"}}
          // layout={'stack'}
          horizontal
          showsHorizontalScrollIndicator={false}
          // layoutCardOffset={9}
          data={pendingOrders}
          renderItem={({ item }) => <OrderCard isClient={true} order={item} key={item.id} showSpecialist={true} navigation={navigation}/>}
          keyExtractor={(item) => `bottom-flat-map-${item.id}`}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={(Dimensions.get("window").width - 50) * 0.97}
        />
      </View>}
    </>
  )
}
