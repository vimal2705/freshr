import { useTheme } from 'styled-components/native';
import { connect } from "react-redux";
import { View } from "react-native";
import { facilityCreationSetGallery } from "../../redux/facilityCreation/facilityCreation.actions";
import { FacilityGalleryForm } from "./components/forms.components";
import { FacilityScreenHoc } from "./facility-screen-hoc";
import { Spacer } from "../../components/spacer/spacer.component";


const FacilityGalleryScreen = (props) => {
  const theme = useTheme();
  return (
    <FacilityScreenHoc>
      {/*<View style={{flex: 0.6, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.brand.primary}}>*/}
      {/*  <Illustration width={400} height={250} fill={"white"}*/}
      {/*                style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}/>*/}
      {/*</View>*/}
      <FacilityGalleryForm
        onSubmit={(gallery) => {
          props.setFacilityGallery({
            gallery: gallery.gallery,
            coverImage: gallery.coverImage
          })
          props.navigation.navigate("SetFacilityHours")}}
        onCancel={() => props.navigation.goBack()}
      />
      <Spacer position={"bottom"} size={"large"}/>
    </FacilityScreenHoc>
  )
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setFacilityGallery: ({ gallery, coverImage }) => dispatch(facilityCreationSetGallery({ gallery, coverImage }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityGalleryScreen);
