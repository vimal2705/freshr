import React, { useRef } from "react";
import { Callout, Marker } from "react-native-maps";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";

import { useTheme } from "styled-components/native";
import { View } from "react-native";
import { Text } from "../../components/typography/typography.component";
import { Spacer } from "../../components/spacer/spacer.component";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MapMarker = ({ gender,setSearchLocation= null, active=false, data= null, animated = false, reference=null, coordinate, onPress, isSelected, isBarber=false, isFacility=false, showCallout=true, calloutContent=3,delivery=false, ...restProps}) => {
  const theme = useTheme();
  const marker = useRef();
  const style = {
    // backgroundColor: "white",
    borderRadius: 28,
    height: 28,
    padding: 2,

    // elevation: 2,
    borderWidth: 2,
    borderColor: active ? theme.colors.brand.secondary : 'transparent',
    backgroundColor: 'black',
    elevation: 3,
    position: "relative",
    zIndex: isSelected ? 100 : 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
  let icon = null
  if (isFacility) {
    icon = <View style={{...style, width: 28 }}><FontAwesome name="home" size={18} color={isSelected ?gender == "male"?  "blue" :gender == "female"?"#FA8072": theme.colors.brand.secondary :gender == "male"?  "blue" :gender == "female"?"#FA8072":"white" } /></View>
  }
  if (isBarber) {
    icon = <View style={{...style, width: 28 }}><Feather name="scissors" size={18} color={isSelected ? theme.colors.brand.secondary : 'white'} /></View>
  }
  if (animated) {
    return <Marker.Animated ref={reference} coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        {icon ? icon : <View style={{width: 20, height: 20, borderRadius: 20, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
          <View style={{width: 15, height: 15, borderRadius: 20, backgroundColor: theme.colors.brand.primary, ...theme.shadows.default}} />
        </View>}
        {data && <View tooltip style={{
          ...theme.shadows.default,
          backgroundColor: "transparent",
          alignItems: "center",
          flexDirection: "row",
        }}>
          <View style={{ flexDirection: 'row', backgroundColor: isSelected ? theme.colors.brand.secondary : "black", alignItems: "center", justifyContent: "center", paddingVertical: 4, paddingHorizontal: 6, borderRadius: 30}}>
            <Text variant="caption" style={{ color: "white", fontSize: 14 }}>{isFacility && `${data.availableSeats ? data.availableSeats : data.seatCapacity} seats`}{isBarber && `${data.isQueueing ? (data.backQueue ? `${data.maxQueue - data.backQueue.position} left` : 'empty queue') : (data.frontQueue ? 'busy' : 'free') }`}</Text>
          </View>
        </View>}
      </View>

    </Marker.Animated>
  } else {
    return (<Marker ref={marker} draggable={!(isFacility || isBarber)}
                    onDragEnd={async (e) => { console.log('dragEnd', e.nativeEvent.coordinate); 
                    const key = "del"
                    const coord = [e.nativeEvent.coordinate.longitude, e.nativeEvent.coordinate.latitude]
                    if(delivery){
                      const coordinates = [e.nativeEvent.coordinate.longitude, e.nativeEvent.coordinate.latitude];
  const stringifiedCoordinates = JSON.stringify(coordinates);

  await AsyncStorage.setItem(key, stringifiedCoordinates);
                    }
                    if (setSearchLocation) {
                      console.log("insideeee");
                      setSearchLocation(coord)
                    }
                  console.log("beforeeeee");
                  
                    console.log("afterrrrr");
                  }
                    
                    } onLayout={() => marker.current?.showCallout() } coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <View style={{flexDirection: "column", alignItems: "center"}}>
        {data && <View style={{flexDirection: 'row', ...theme.shadows.default, margin: 1, backgroundColor: isSelected ? theme.colors.brand.secondary : "black", alignItems: "center", justifyContent: "center", paddingVertical: 4, paddingHorizontal: 6, borderRadius: 30}}>
          <Text variant="caption" style={{ color: "white", fontSize: 14 }}>{isFacility && `${ data.availableSeats} seats`}{isBarber && `${data.isQueueing ? (data.backQueue ? `${data.maxQueue - data.backQueue.position} left` : 'empty queue') : (data.frontQueue ? 'busy' : 'free') }`}</Text>
        </View>}
        {icon ? icon : <View style={{width: 20, height: 20, borderRadius: 20, backgroundColor: "black", alignItems: "center", justifyContent: "center"}}>
            <View style={{width: 15, height: 15, borderRadius: 20, backgroundColor: theme.colors.brand.primary, ...theme.shadows.default}} />
          </View>}
      </View>
    </Marker>);
  }
};

export const MapMarkerLocation = (props) => {
  const theme = useTheme();
  const { coordinate } = props;
  return (
    <Marker coordinate={coordinate} draggable>
      <View style={{backgroundColor: "white", padding: 3, ...theme.shadows.default, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
        <FontAwesome
          name="map-marker"
          size={25}
          color={theme.colors.ui.primary}
        />
      </View>

    </Marker>
  );
};
