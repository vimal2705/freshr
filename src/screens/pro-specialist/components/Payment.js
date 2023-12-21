import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styled from "styled-components/native";


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
  const [mobileNumber, setMobileNumber] = useState('');

  const accountTypes = ['Savings', 'Current'];
  const banks = ['Royal Bank of Canada','Toronto-Dominion Bank','bank of Nova Scotia','Bank of Montreal','Canadian Imperial Bank of Commerce','National Bank of Canada','Desjardins Group','HSBC Bank Canada','Laurentian Bank of Canada','ATB Financial']; // Replace with your actual list of banks

  const handleAccountTypeChange = (type) => {
    
    console.log("typeeeee",type);
    setSelectedAccountType(type);
  };

  const handleBankPress = () => {
    setBankListVisible(!bankListVisible);
  };
  const navigation=useNavigation();

  
  const handleBankSelect = (bank) => {
   
    setSelectedBank(bank);
    setBankListVisible(false);
  };

  const sendDataa = () => {
    const data = {
      accountType: selectedAccountType,
      selectedBank: selectedBank,
      accountHolderName: accountHolderName,
      accountNumber: accountNumber,
      mobileNumber: mobileNumber,
    };

    
    console.log('Sending data:', data);
  };

 

  return (
    <>
        <BackButton onPress={() => navigation.goBack()} elevation={2}
                       style={{ backgroundColor: "black", marginRight: 20 }}>
            <Ionicons name="arrow-back" size={20} color={"white"} />
          </BackButton>
    <View style={styles.container}>
  
      <Text style={styles.title}>Payment</Text>

      <View style={styles.radioContainer}>
        <Text>Account Type</Text>
        {accountTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.radioButton}
            onPress={() => handleAccountTypeChange(type)}
            
          >
            {selectedAccountType === type && (
              <MaterialIcons name="radio-button-checked" size={24} color="black" />
            )}
            {selectedAccountType !== type && (
              <MaterialIcons name="radio-button-unchecked" size={24} color="black" />
            )}
            <Text style={{ color: '#000' }}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>


      <TouchableOpacity style={styles.input} onPress={handleBankPress}>
        <Text>{selectedBank || 'Select Bank'}</Text>
      </TouchableOpacity>

      {bankListVisible && (
        <View style={{height:100,width:'80%',marginBottom:10}}>
        <FlatList
          data={banks}
          renderItem={({ item }) => (
            <View style={{marginBottom:5,height:30,borderRadius:10,backgroundColor:'#000',paddingHorizontal:20,justifyContent:'center'}}>
            <TouchableOpacity onPress={() => handleBankSelect(item)}  >
              <Text style={{color:'#fff'}}>{item}</Text>
            </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item}
        />
        </View>
      )}

      <TextInput style={styles.input} placeholder='Account holder name' onChangeText={(val)=>setAccountHolderName(val)}/>
     
      {/* <TextInput style={styles.input} placeholder='List of the bank' /> */}
      <TextInput style={styles.input} placeholder='Account number' keyboardType='numeric' onChangeText={(val)=>setAccountNumber(val)}/>
      <TextInput style={styles.input} placeholder='Mobile number' keyboardType='phone-pad' onChangeText={(val)=>setMobileNumber(val)} />
      <TouchableOpacity style={styles.button} activeOpacity={1} onPress={()=>sendDataa()}>
        <Text style={{ color: '#fff' }}>Account Details</Text>
      </TouchableOpacity>

     
    
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontSize: 30,
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    width: '80%',
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
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    height: 50,
    width: '80%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  

  
});

export default Payment;
