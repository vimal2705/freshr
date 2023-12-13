import { getRegionForCoordinates } from "./map.component";
import mapStyles from "./mapStyles.json";
import { MapMarker } from "./map-marker.component";
import MapView, { AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useTheme } from "styled-components/native";
import * as Location from "expo-location";
import { sendMessage } from "../../providers/utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePubNub } from "pubnub-react";
import platform from "react-native-web/dist/exports/Platform";
import { useSelector } from "react-redux";
import { Platform } from "react-native";
import socketServices from "../normal-app/components/Socket";
import { AppContext } from "../../providers/app-provider";
export const MapBooking = ({selectedFacility, isClient, searchLocation, specialistLocation, clientSetters, specialistSetters, order=null, ...restProps}) => {
  const { fetchLiveLocation } = useContext(AppContext)
  const theme = useTheme();
  const [specialistInitLocation, setSpecialistInitLocation] = useState({
    latitude: specialistLocation[1],
    longitude: specialistLocation[0]
  })
  const [currentSpecialistLocation, setCurrentSpecialistLocation] = useState({
    latitude: specialistLocation[1],
    longitude: specialistLocation[0]
  })
  const [initLocation, setInitLocation] = useState({ latitude: searchLocation[1], longitude: searchLocation[0] })
  const [currentLocation, setCurrentLocation] = useState({ latitude: searchLocation[1], longitude: searchLocation[0] });
  const [status, requestPermission] = Location.useForegroundPermissions();
  const mapRef = useRef(null)
  const specialistMarkerRef= useRef(null)
  const markerRef = useRef(null)
  const pubnub = usePubNub();
  const [allPoints, setAllPoints] = useState([]);
  const [host, setHost] = useState([])
  const [userloc, setUserloc] = useState({})
  const [livespecialist, setLivespecialist] = useState(null)
  const [liveclient, setLiveclient] = useState(null)
  useEffect(()=>{

    socketServices.initializeSocket()
    
    socketServices.on('Send_Location_ChangeSP',(dataa)=>{
      if(isClient){
      console.log("SOcket Location",(dataa.loc.coords));
      setLivespecialist(dataa.loc.coords)
  console.log("liveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeloccccccccccccccccccccccccccccccccccccccccccccccc",livespecialist);
}
      
    })
    

    
    socketServices.on('Send_Location_ChangeCLI',(dataa)=>{
      if(!isClient){
      console.log("SOcket Location CLI",(dataa.loc.coords));
      setLiveclient(dataa.loc.coords)
  console.log("client liveeee",liveclient);
}
    })
  },[])


  useEffect(() => {
    const findLoc = async () => {
      console.log("startt");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("endd", status);
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        console.log("noooooooooooooooooooo");
        return;
      }
    const isAndroid = Platform.OS == 'android';
    console.log("here");
    let location = await Location.getCurrentPositionAsync();
    console.log("location:::::::", location);
      // setUserloc(location.coords)
      setInitLocation(location.coords)
    }
    console.log("outtt");
    findLoc()
  }, []);
  const sendCurrentLocation = async () => {
    try {
      await pubnub.publish({
        channel: `${order.id}-location`,
        message: {...currentLocation, uuid: pubnub.getUUID()},
      })
    } catch (e) {
      console.log('error', e)
    }
  }
  useEffect(() => {
    console.log("asdddddddd",selectedFacility);
    if (pubnub && order && order.id) {
      pubnub.addListener({
        status: function(statusEvent) {
          if (statusEvent.category === "PNConnectedCategory") {
            sendCurrentLocation();
          }
        },
        message: function(msg) {
          if (msg.message.uuid !== pubnub.getUUID()) {
            if (msg.message.uuid === order.specialist.uuid) {
              setCurrentSpecialistLocation({latitude: msg.message.latitude, longitude: msg.message.longitude})
            } else {
              setCurrentLocation({latitude: msg.message.latitude, longitude: msg.message.longitude})
            }
          }
          // console.log('message', msg.message);
        },
        presence: function(presenceEvent) {
          // This is where you handle presence. Not important for now :)
        }
      })
      pubnub.subscribe({
        channels: [`${order.id}-location`]
      })
    }
    (async () => {
      console.log("unkaaaa before ");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("unka afterr", status);
      if (status !== 'granted') {
        sendMessage(
          "Failure",
          'Please allow geolocation',
          "warning",
          2500,
          theme.colors.ui.warning
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (order.specialist.id === pubnub.getUUID()) {
        setCurrentSpecialistLocation(location.coords)
        setSpecialistInitLocation(location.coords);
      } else {
        console.log("doneee", searchLocation, location);
        setCurrentLocation(location.coords);
        setInitLocation(location.coords);
      }
      setCurrentLocation(location.coords);
      setInitLocation(location.coords);

      let backPerm = await Location.requestBackgroundPermissionsAsync();
      let locations = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 10000
        },
       async (loc) => {
        // console.log('current location', loc.coords)
        if (order.specialist.id === pubnub.getUUID()) {
          setCurrentSpecialistLocation(loc.coords)
          setInitLocation(loc.coords);
        } else {
          setCurrentLocation(loc.coords);
          setInitLocation(loc.coords);
        }
        if(!isClient){

          console.log("chnaingggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg--------------<<<<<<",loc);
          // const {orderr}= await fetchLiveLocation(order._id,specialistlocation=[loc.coords.longitude,loc.coords.latitude],clientloction=[]);
        try {
            socketServices.emit('Location_ChangeSP',{
              loc
            })

          } catch (error) {
            console.log("nooooooooolocccccccccccc",error);
          }
        }
        else{

          // console.log("chnainggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggcliiiiiiiii--------------<<<<<<");
          // const {orderr}= await fetchLiveLocation(order._id,specialistlocation=[],clientloction=[loc.coords.longitude,loc.coords.latitude]);
        try {
          console.log("Cliofsocket[][][][][][][][][][][][][][][][][][][][][][][][][][]",loc);
            socketServices.emit('Location_ChangeCLI',{
              loc
            })

          } catch (error) {
            console.log("nooooooooolocccccccccccc",error);
          }
        }
        
      
        // setCurrentLocation(loc.coords)
      });
    })();
  }, [])
  // console.log("mera: ", userloc);
  // console.log("unka: ", initLocation);
  // console.log("myyyyyyyyyyyyyyyyyyyyyyyyyyy~~~~~~~~~~~~~~~~~~~~~~~~~~>>>>>>>>>>>>>", order.specialistlocation);
  useEffect(() => {
    if (order.id && order.status === 'IN_TRAFFIC') {
      sendCurrentLocation();
    }
    if(platform.OS === 'android'){
      markerRef.current?.animateMarkerToCoordinate(currentLocation);
      specialistMarkerRef.current?.animateMarkerToCoordinate(currentSpecialistLocation);
    } else {
      new AnimatedRegion(markerRef.current?.coordinate).timing(currentLocation).start()
      new AnimatedRegion(specialistMarkerRef.current?.coordinate).timing(currentLocation).start()
    }
  }, [currentLocation, currentSpecialistLocation])
  // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHMMMMMMMMMMMMMMMMMMMMMMMMMHHHH", order.selectedLocation);
  const centerMap = () => {
    mapRef.current?.fitToCoordinates([
      initLocation,
      {latitude:host?.length>0 ? host[1] : selectedFacility ==null ? searchLocation[1] :selectedFacility.location.coordinates[1], 
        longitude: host?.length>0 ? host[0] : selectedFacility ==null ? searchLocation[0] :selectedFacility.location.coordinates[0]},
      specialistInitLocation,
    ], {
      edgePadding: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 10,
      }
    })
  }
 if ( !specialistLocation) {
   return null;
 }
//  [-73.772495649755, 45.50483250299082]
// console.log("mmm", initLocation);
const h = useSelector(state=>state.locationn)
useEffect(()=>{
  if(order?.selectedLocation){
    setHost(order?.selectedLocation)
  }
  else{
  setHost(h)
}
  console.log("mmmsss", h, order?.client?.searchLocation?.coordinates);
}, [h])

// console.log("");
  return (

    <MapView
      ref={mapRef}
      customMapStyle={mapStyles}
      style={{
        minHeight: 320,
        width: "100%",
        flex: 1
      }}
      onLayout={() => centerMap()}
    >
      <MapMarker
        isFacility={true}
        coordinate={{
          latitude: host?.length>0 ? host[1] : selectedFacility ==null ? searchLocation[1] :selectedFacility.location.coordinates[1],
          longitude: host?.length>0 ? host[0] : selectedFacility ==null ? searchLocation[0] :selectedFacility.location.coordinates[0] ,
        }}
        isSelected={true}
        onPress={() => null}
      />
      <MapMarker
        animated={true}
        reference={markerRef}
        coordinate={!isClient? liveclient? liveclient: {
          latitude: order?.client?.searchLocation?.coordinates[1],
          longitude: order?.client?.searchLocation?.coordinates[0],
        }:initLocation}
        isSelected={true}
        onPress={() => null}
      />

      <MapMarker
        isBarber={true}
        animated={true}
        reference={specialistMarkerRef}
        coordinate={!isClient?initLocation:  livespecialist ? livespecialist :   order.specialistlocation?.length>0?{latitude: order.specialistlocation[1],
          longitude: order.specialistlocation[0]}: currentSpecialistLocation}
        // coordinate={{latitude:order?.specialistlocation[1] , longitude:order?.specialistlocation[0]}}
        isSelected={true}
        onPress={() => null}
      />

      <MapViewDirections
        origin={!isClient?liveclient?liveclient:{
          latitude: order?.client?.searchLocation?.coordinates[1],
          longitude: order?.client?.searchLocation?.coordinates[0],
        }:initLocation}
        destination={{latitude: host?.length>0 ? host[1] : selectedFacility ==null ? searchLocation[1] :selectedFacility.location.coordinates[1], 
          longitude: host?.length>0 ? host[0] : selectedFacility ==null ? searchLocation[0] :selectedFacility.location.coordinates[0]}}
        apikey={'AIzaSyCOv8bKnTUh_03fuq11mXQPBEx9-TF3bWE'}
        strokeWidth={8}
        optimizeWaypoints={true}
        followUserLocation
        loadingEnabled
        strokeColor={theme.colors.brand.primary}
        onReady={(results) => {
          if (clientSetters) {
            clientSetters.distance(results.distance.toFixed(1))
            clientSetters.time(results.duration.toFixed(0))
          }
        }}
      />
      <MapViewDirections
        origin={!isClient?initLocation:  livespecialist ? livespecialist :   order.specialistlocation?.length>0?{latitude: order?.specialistlocation[1],
          longitude: order?.specialistlocation[0]}: currentSpecialistLocation}
        destination={{latitude: host?.length>0 ? host[1] : selectedFacility ==null ? searchLocation[1] :selectedFacility.location.coordinates[1],
           longitude: host?.length>0 ? host[0] : selectedFacility ==null ? searchLocation[0] :selectedFacility.location.coordinates[0]}}
        apikey={'AIzaSyCOv8bKnTUh_03fuq11mXQPBEx9-TF3bWE'}
        strokeWidth={5}
        optimizeWaypoints={true}
        strokeColor={"black"}
        onReady={(results) => {
          if (specialistSetters) {
            specialistSetters.distance(results.distance.toFixed(1))
            specialistSetters.time(results.duration.toFixed(0))
          }
        }
      }
      />
    </MapView>
  )
}