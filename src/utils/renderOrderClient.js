import {useTheme} from 'styled-components/native';
import { Dimensions, FlatList, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useState } from "react";
import { Spacer } from "../components/spacer/spacer.component";
import { OrderCard } from "../screens/pro-specialist/components/order-card.component";

export const renderOrderClient = ({pendingOrders, navigation=null, normal=false, showSpecialist=true, isClient=true}) => {
  const theme = useTheme();
  const [activeSlide, setActiveSlide] = useState(0)
  
  const carousel = (
    <View style={{flex: 1, minHeight: Dimensions.get("window").height * 0.68, height: "100%", backgroundColor: "black"}}>
      <Carousel
        // slideStyle={{width: "100%", backgroundColor: "white"}}
        // layout={'stack'}
        showsHorizontalScrollIndicator={false}
        // layoutCardOffset={9}
        data={pendingOrders}
        renderItem={({ item }) => <OrderCard isClient={isClient} order={item} key={item.id} showSpecialist={showSpecialist} navigation={navigation} isSpecialist={true}/>}
        keyExtractor={(item) => `bottom-flat-map-${item.id}`}
        sliderWidth={Dimensions.get("window").width}
        itemWidth={(Dimensions.get("window").width - 24) * 0.97}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      {pendingOrders.length > 1 && <>
        <Spacer position={"bottom"} size={"medium"}/>
        <Pagination
          dotsLength={pendingOrders.length}
          activeDotIndex={activeSlide}
          containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingVertical: 0 }}
          dotStyle={{
            width: 20,
            height: 20,
            borderRadius: 20,
            marginHorizontal: 8,
            backgroundColor: theme.colors.brand.primary
          }}
          inactiveDotStyle={{
            // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </> }
    </View>
    )

  const verticalList = (
    <FlatList
      horizontal={false}
      showsVerticalScrollIndicator={false}
      data={pendingOrders}
      renderItem={({ item }) => <OrderCard  style={{marginBottom: 4, paddingVertical: 7}} isClient={isClient} order={item} key={item.id} showSpecialist={showSpecialist} navigation={navigation}/>}
    />
  )
  return (
    <>
      {pendingOrders.length > 0  &&
        <>
          {normal ? verticalList : <View style={ {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            paddingVertical: 30,
            paddingTop: 40,
            backgroundColor: "black",
            flex: 1
          }}>
            {carousel}
          </View>}
        </>}
    </>
  )
}
