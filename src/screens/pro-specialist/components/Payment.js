import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal, ScrollView,Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styled from "styled-components/native";
import { AppContext } from '../../../providers/app-provider';
import SelectDropdown from 'react-native-select-dropdown'
import { SpecialistContext } from '../../../providers/specialist.provider';
import Snackbar from 'react-native-snackbar-component';

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border: 2px solid #25282b; 
`;
const Payment = () => {

  // const[formdataa,setformdataa]={{}}
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [bankListVisible, setBankListVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState(null);
  const { bankDetails } = useContext(AppContext);
  const { setSpecialistidd, onGetSpecialistidd, specialist, specialistidd } = useContext(SpecialistContext)
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  console.log("-----------909090909090", mobileNumber);
  useEffect(async () => {
    await onGetSpecialistidd(specialist._id)
  }, [])

  useEffect(() => {
    if (specialistidd) {
      console.log("specialistttdataaaaaaaaaaaaaaajhahahjahkjahkjakj", specialistidd);
    }
    if (specialistidd?.bankAccountHolderName) {
      setAccountHolderName(specialistidd.bankAccountHolderName)
    }
    if (specialistidd?.bankAccountNumber) {
      setAccountNumber(specialistidd.bankAccountNumber)
    }
    if (specialistidd?.bankMobile) {
      console.log("mobileeeee^^^^^^^^^^^^^^^^^^^^^^^^^", specialistidd.bankMobile);
      setMobileNumber(specialistidd.bankMobile.toString())
    }
    if (specialistidd?.bankName) {
      console.log("bank nameeeeeeeeeeeeeee", specialistidd?.bankName);
      // setSelectedBank('hiiiiii')
      setSelectedBank(specialistidd?.bankName)
    }
    if (specialistidd?.accountType) {
      setSelectedAccountType(specialistidd?.accountType);
    }
  }, [specialistidd])
  console.log("specilisttttttttttfrom paymentttt", specialist);
  const accountTypes = ['Savings', 'Checking'];
  const { updateSpecialistInfo } = useContext(SpecialistContext);

  const banks = ['Royal Bank of Canada', 'Toronto-Dominion Bank', 'bank of Nova Scotia', 'Bank of Montreal', 'Canadian Imperial Bank of Commerce', 'National Bank of Canada', 'Desjardins Group', 'HSBC Bank Canada', 'Laurentian Bank of Canada', 'ATB Financial']; // Replace with your actual list of banks

  const handleAccountTypeChange = (type) => {
    // formData.append('accountType',type)
    console.log("typeeeee", type);

    setSelectedAccountType(type);

  };

  const handleBankPress = () => {
    setBankListVisible(!bankListVisible);
  };
  const navigation = useNavigation();


  const handleBankSelect = (bank) => {

    setSelectedBank(bank);
    setBankListVisible(false);
  };
  const showSnackbar = (text) => {
    setSnackbarText(text);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 4000);
  };

  const sendDataa = async () => {
    if ( !selectedAccountType || !accountHolderName || !accountNumber || !mobileNumber || !selectedBank) {
      showSnackbar('Please fill in all fields');
      return;
    }
    if (accountNumber.length < 8 || accountNumber.length > 13) {
      showSnackbar('Account number should be between 8 to 13');
      return;
    }
  
    // Validate mobile number length
    if (mobileNumber.length < 8 || mobileNumber.length > 13) {
      showSnackbar('Mobile number should be between 8 to 13');
      return;
    }
  
    const formData = new FormData();
    // selectedAccountType
    formData.append("accountType", selectedAccountType)
    formData.append("bankAccountHolderName", accountHolderName)
    formData.append("bankAccountNumber", Number(accountNumber))
    formData.append("bankMobile", Number(mobileNumber))
    formData.append("bankName", selectedBank)
    showSnackbar('Submission successful');
    console.log("formdataaaaa", formData);

    // const data = {
    //   accountType: selectedAccountType,
    //   bankAccountHolderName: accountHolderName,
    //   bankAccountNumber: Number(accountNumber) ,
    //   bankMobile:Number(mobileNumber),
    //   bankName: selectedBank,
    // };
    const param = "true";
    await updateSpecialistInfo(formData, param)
    navigation.goBack()
    console.log("ttypeeeeofselecteddddd", selectedAccountType);

    // console.log('Sending data:', data);
  };

  useEffect(() => {
    const bank = bankDetails()
    console.log("bankdetailsss--->", bank);
  }, [])


  return (
    <ScrollView>
      <View style={styles.container}>

        <View style={{ flexDirection: 'row', marginTop: 50, alignItems: 'center', paddingHorizontal: 10, gap: 30 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderRadius: 50 }}>
            <Ionicons name="arrow-back" size={20} color={"white"} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Payment Information</Text>
        </View>
        <View style={styles.Innercontainer}>


          <View style={styles.radioContainer}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Account Type</Text>
            {accountTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.radioButton}
                onPress={() => handleAccountTypeChange(type)}

              >
                {selectedAccountType == type && (
                  <MaterialIcons name="radio-button-checked" size={24} color="black" />
                )}
                {selectedAccountType != type && (
                  <MaterialIcons name="radio-button-unchecked" size={24} color="black" />
                )}
                <Text style={{ color: '#000', fontSize: 15, fontWeight: '500' }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>



          <SelectDropdown
            data={banks}
            buttonStyle={styles.input2}
            defaultButtonText={selectedBank ? selectedBank : "Select a Bank"}
            rowTextStyle={{ fontSize: 14 }}
            buttonTextStyle={{ fontSize: 15, fontWeight: '500', color: '#000' }}
            label="Categories"
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              setSelectedBank(selectedItem);

              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />
          <TextInput style={styles.input} value={accountHolderName} placeholder='Account holder name' placeholderTextColor={'gray'} onChangeText={(val) => setAccountHolderName(val)} />

          {/* <TextInput style={styles.input} placeholder='List of the bank' /> */}
          <TextInput style={styles.input} value={accountNumber} placeholder='Account number' placeholderTextColor={'gray'} keyboardType='numeric' onChangeText={(val) => setAccountNumber(val)} />
          <TextInput style={styles.input} value={mobileNumber} placeholder='Mobile number' placeholderTextColor={'gray'} keyboardType='phone-pad' onChangeText={(val) => setMobileNumber(val)} />
          <TouchableOpacity style={styles.button} activeOpacity={1} onPress={() => sendDataa()}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Submit</Text>
          </TouchableOpacity>

        </View>
        <View style={{height:180}}>
        <Snackbar
          visible={snackbarVisible}
          textMessage={snackbarText}
          backgroundColor="#333" // Adjust the background color
          accentColor="#fff" // Adjust the text color
        />
        </View>
        
      </View>
      
    </ScrollView>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Innercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  title: {
    color: '#000',
    fontSize: 30,
    // marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    width: '85%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    width: '85%',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  input2: {
    borderWidth: 1,
    width: '85%',
    height: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    height: 60,
    width: '85%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10
  },



});

export default Payment;