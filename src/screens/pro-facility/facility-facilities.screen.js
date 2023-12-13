import { FacilityScreenHoc } from "./facility-screen-hoc";
import { Spacer } from "../../components/spacer/spacer.component";
import { PaddedContainer, SectionTitle } from "../components/details-screen.component";
import { HostFacilityCard } from "./components/host-facility-card";
import { HostContext } from "../../providers/facility.provider";
import { LargeButton } from "../../components/button/button.component";
import { Text } from "../../components/typography/typography.component";
import { Entypo } from "@expo/vector-icons";
import {useContext,useEffect} from "react";


export const FacilityFacilitiesScreen = (props) => {
  const {error, loadHostData, host, isLoading, history, hostFacilities} = useContext(HostContext)

  useEffect(()=>{
console.log("sdsdd",hostFacilities);
  },[])
  return <FacilityScreenHoc>
    <PaddedContainer>
      <Spacer position="top" size="large" />
      <Spacer position="top" size="large" />
      <LargeButton variant="primary" onPress={() => props.navigation.navigate("SetLocation")}>
        <Text variant="caption" style={{ fontSize: 24, color: "white" }}>
          Add new facility
        </Text>
        <Entypo name="chevron-right" size={24} color="white" />
      </LargeButton>
      <Spacer position="bottom" size="large" />
    </PaddedContainer>
    <PaddedContainer>
      <Spacer position="top" size="large" />
      <SectionTitle style={{color: "black"}}>Your facilities</SectionTitle>
      <Spacer position="top" size="large" />

      {hostFacilities?.map(facility => (
        <HostFacilityCard key={facility.id} facility={facility} onPress={() => props.navigation.navigate("ProFacilityDetails", {facility: facility})}/>
      ))}

    </PaddedContainer>
  </FacilityScreenHoc>
}

