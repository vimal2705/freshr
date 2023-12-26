import { FlatList, useWindowDimensions, View,Image, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import { SafeArea } from "../../components/utils/safearea.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { renderTabBar } from "./utils";
import { connect } from "react-redux";
import { Container } from "./inbox.screen";
import { TabViewContainer } from "../../components/tabs/tabs.component";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  
  FavButton,
  HeaderContainer,
  PageTitle,
} from "../components/details-screen.component";
import { TouchableOpacity } from "react-native";
import { Text } from "../../components/typography/typography.component";
import { AppContext } from "../../providers/app-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../infrastructure/theme";
import { BASE_API_URL } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import styled, { useTheme } from "styled-components/native";

const FavoritesScreen = (props) => {
  const navigation=useNavigation();
  const layout = useWindowDimensions();
  const { loadFilters, getUser, refreshSearch, isLoading, search,  onGetOrders } = useContext(AppContext);
  const[favspecialists,setFavspecialists]=useState([]);
  const[favfacilities,setFavfacilitiesa]=useState([]);
  const [loader,setload] = useState(true)
  const [storiesdata,setstoriesData] = useState([])
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "facilities", title: "Facilities" },
    { key: "professionals", title: "Professionals" },
  ]);
  const isFocused = useIsFocused();
  const ProfilePictureGradient = styled(LinearGradient)`
  position: absolute;
  width:60px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 200px;
  border-width:2px;
`;


  
  const loadFav = async() =>{
    
    const { user } = await getUser();
    // console.log("favvvvvvv",user.favorites.specialists[2].firstName);


  
    const tempspecialists=[];
    const token = await SecureStore.getItemAsync("token");
    console.log("token",token);
    const config = {headers: {
      Authorization: `Bearer ${token}`,
    }
    }
   const res = await axios.get(`${BASE_API_URL}/users/favorites/specialists`,config
    )
    const dataspecialists = res.data.data.user;
    console.log("ddd",res.data.data.user);
for(let i=0;i<dataspecialists.length;i++){

      for (let j = 0; j < user.favorites.specialists.length; j++) {
        console.log(dataspecialists[i].specialist.user == user.favorites.specialists[j].id);
   if (dataspecialists[i].specialist.user == user.favorites.specialists[j].id ) {
    console.log("SSSssss",user.favorites.specialists[j].firstName);
    tempspecialists.push({"firstName":user.favorites.specialists[j].firstName, "lastName":user.favorites.specialists[j].lastName, "photo":user.favorites.specialists[j].photo ,"id":dataspecialists[i].specialist.user,"_id":dataspecialists[i].specialist._id, "stories":dataspecialists[i].stories })
   }   
   
      }   
    } 
    setstoriesData(tempspecialists)

    console.log("SssS",tempspecialists);

//     for(let i=0;i<dataspecialists.length;i++){
//       // setFirstName([...firstName, data[i].firstName]);
//       tempspecialists.push({"firstName":dataspecialists[i].firstName, "lastName":dataspecialists[i].lastName, "photo":dataspecialists[i].photo ,"id":dataspecialists[i].id})

//       // console.log("nameeeeee",data[i].firstName);
      
//     }  for(let i=0;i<datafacilities.length;i++){
//       // setFirstName([...firstName, data[i].firstName]);
//       tempfacilities.push({"firstName":datafacilities[i].name, "photo":datafacilities[i].coverImage,"id":datafacilities[i].id})

// console.log(datafacilities[i].name);
      
//     }

   setFavspecialists(user.favorites.specialists);
   setFavfacilitiesa(user.favorites.facilities)

  }
useEffect(()=>{


 loadFav();

},[routes,isFocused])
// useEffect(() => {


//   // Return the function to unsubscribe from the event so it gets removed on unmount

// }, [isFocused]);

const handleFavButtonPress = async (id)=>{

    console.log("--------------");
    const token = await SecureStore.getItemAsync("token");
    console.log("token",token);
    const config = {headers: {
      Authorization: `Bearer ${token}`,
    },
     data:{specialists:`${id}`}
    }
    axios.delete(`${BASE_API_URL}/users/favorites`,config
    ).then(loadFav())
  

  }
  const handleFavButtonPressfac = async (id)=>{

    console.log("--------------");
    const token = await SecureStore.getItemAsync("token");
    console.log("token",token);
    const config = {headers: {
      Authorization: `Bearer ${token}`,
    },
     data:{facilities:`${id}`}
    }
    axios.delete(`${BASE_API_URL}/users/favorites`,config
    ).then(loadFav())
  

  }
  const sendFacilityyy=(idd)=>{
    console.log("favvvvvvvvitemmmmmmmmmm",idd);
    navigation.navigate("Home", {
      id:idd,
      data:'false'
    });
  }

  const sendproff=(idd)=>{
    console.log("favvvvvvvvitemmmmmmmmmm",idd);
    navigation.navigate("Home", {
      id:idd,
      // fromfav:true,
      data:"true",
      spid: "null"
    });
  }
  const renderFacilities = () => {
    return (
      <ScrollView
      showsVerticalScrollIndicator={false}
      >
        <Spacer position="top" size="large" />
       
        {
          favfacilities.map((item, i) => {

            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical: 5 }}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center'  }}>
                  <TouchableOpacity onPress={() => sendFacilityyy(item._id)}>
                    <Image source={{ uri: item.coverImage }} style={{ width: 60, height: 60, borderRadius: 40}} />

                  </TouchableOpacity>
                  <Text style={{width:200, fontSize: 16, fontWeight: 'bold' }}> {item.name} </Text>
                </View>

                <FavButton onPress={() => console.log("sdfsdf", item)}>
                  <MaterialIcons
                    name={"favorite"}
                    size={30}
                    color={theme.colors.brand.primary}
                  />
                </FavButton>
</View>
         
            )
          })
        }
      </ScrollView>
    );
  };

  const renderProfessionals = () => {
    return (
      <ScrollView
      showsVerticalScrollIndicator={false}
      >
        <Spacer position="top" size="large" />
        {
       storiesdata?.map((item,i)=>{
            
            return(
              
              <TouchableOpacity
              onPress={()=>sendproff(item._id)}
              // onPress={()=>console.log("moxaaaa",item._id)}
              >    
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical: 5,marginHorizontal:5 }}>

{/* <Text></Text> */}
{/* <Image source={require(`${item.photo}`)}/> */}
<View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
{item.stories.length > 0 && (
  <ProfilePictureGradient
    colors={[theme.colors.brand.secondary, "#753a88"]}
    start={[0, 1]}
    end={[1, 0]}
  />
)}
<TouchableOpacity
  onPress={() => {
    console.log("fff", item.stories);
    if (item.stories.length > 0) { props.navigation.navigate("SpecialistStory", { stories: item.stories }) }
  }
  }
>
  <Image source={{ uri: item.photo }} style={{ width: 56, height: 56, borderRadius: 40 }} />
</TouchableOpacity>
  <Text style={{width:200,fontSize: 16, fontWeight: 'bold'}}>{item.firstName}{item.lastName}</Text>
</View>

  <FavButton onPress={() => handleFavButtonPress(favspecialists[i].id)}>
    <MaterialIcons
      name={"favorite"}
      size={30}
      color={theme.colors.brand.primary}
    />
  </FavButton>


</View>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    );
  };

  const renderScene = SceneMap({
    facilities: renderFacilities,
    professionals: renderProfessionals,
  });
 
  return (
    <SafeArea>
      <Container style={{backgroundColor: "transparent"}}>
        <HeaderContainer>
          <Spacer position="top" size="large" />
          <PageTitle style={{color: "black"}}>Favorites</PageTitle>
          <Spacer position="top" size="large" />
        </HeaderContainer>
        <TabViewContainer style={{backgroundColor: "transparent"}}>
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </TabViewContainer>
      </Container>
    </SafeArea>
  );}
;

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesScreen);