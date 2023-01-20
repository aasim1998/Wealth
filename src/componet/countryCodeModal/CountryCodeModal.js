import React, { useState,useEffect } from "react";
import {Modal, StyleSheet, Text, Pressable, Image, View, TouchableOpacity, FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import {Colors, Fonts, GlobalStyle, Strings,Assets} from '../../res/index';

/**
* @description:This is countryCode modal
* @author:Vibhishan
* @created_on:27/05/2021
* @param:
* @return:
* @modified_by:Vibhishan
* @modified_on:21/06/2021
*/

const CountryCodeModal = (props) => {

     const isUnpaidMemberModalVisible=props?.isUnpaidMemberModalVisible
     const isFromContactsUs=props?.isFromContactsUs
     const isForDaySelection=props?.passIsForDaySelection
     const passIndexForRestrictDay=props?.passIndexForRestrictDay


     const [search, setSearch] = useState('');
     const [filteredDataSource, setFilteredDataSource] = useState([]);
     const [masterDataSource, setMasterDataSource] = useState([]);



     const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = masterDataSource.filter(
            function (item) {
              const itemData = props.passIsCurrency ? item.currency : isFromContactsUs ? item.title : item.countryName
                ? props.passIsCurrency ? item.currency : isFromContactsUs ? item.title : item.countryName
                : '';
              
              return itemData.indexOf(text) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
      };


     useEffect(() => {
     
      setFilteredDataSource(props.countryCodeData)
      setMasterDataSource(props.countryCodeData)
     }, [])
     
     
     const renderCountryCode=(item, index)=>{

        return(
                 <View>
                  {
                      isUnpaidMemberModalVisible
                      ?
                      <>
                        <TouchableOpacity
                             onPress={()=>props.onPressSelectUnpaidGroupMember(item.full_name, item.id)}
                             style={{paddingVertical: 10, justifyContent: 'center'}}
                        >    
                            <View style={{paddingHorizontal: 5}}>
                                <Text style={{fontSize: 14, fontFamily: Fonts.SFCompactDisplay.Medium, color: Colors.textColor.primaryColor}}>
                                    {item.full_name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                      </>
                      :
                      <>
                     {isForDaySelection
                      ?
                      <>
                        {index>passIndexForRestrictDay&&<>
                            <TouchableOpacity
                                onPress={()=>props.onPressSelectCountryCode(item.countryFlag, item.countryCode, props.passIsCurrency ? item.currency : isFromContactsUs ? item.title : item.countryName, index)}
                                style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}
                            >    
                                <Text>
                                    {props.passIsCurrency ? '' : item.countryFlag}
                                </Text>
                                <View style={{paddingHorizontal: 5}}>
                                    <Text style={{fontSize: 14, fontFamily: Fonts.SFCompactDisplay.Medium, color: Colors.textColor.primaryColor}}>
                                        {props.passIsCurrency ? item.currency : isFromContactsUs ? item.title : item.countryName}
                                    </Text>
                                </View>
                                <Text>
                                    {props.passIsCurrency ? '' : item.countryCode}
                                </Text>
                            </TouchableOpacity>
                            </>}
                        </>
                        :
                        <>
                            <TouchableOpacity
                                onPress={()=>props.onPressSelectCountryCode(item.countryFlag, item.countryCode, props.passIsCurrency ? item.currency : isFromContactsUs ? item.title : item.countryName, index)}
                                style={{flexDirection: 'row', alignItems: 'center',marginVertical:5,padding:8}}
                            >    
                                <Text>
                                    {props.passIsCurrency ? '' : item.countryFlag}
                                </Text>
                                <View style={{paddingHorizontal: 5}}>
                                    <Text style={{fontSize: 14, fontFamily: Fonts.SFCompactDisplay.Medium, color: Colors.textColor.primaryColor}}>
                                        {props.passIsCurrency ? item.currency : isFromContactsUs ? item.title : item.countryName}
                                    </Text>
                                </View>
                                <Text>
                                    {props.passIsCurrency ? '' : item.countryCode}
                                </Text>
                            </TouchableOpacity>
                        </>}

                     </>
                  }
                </View>

           )

     }


     const ItemSeparatorView = () => {
        return (
          // Flat List Item Separator
          <View
            style={{
              height: 0.5,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
        );
      };

    return (

     <View style={styles.centeredView}>
         <Modal
             animationType={'slide'}
             transparent={true}
             visible={props.modalVisible}
         >
          <View style={styles.centeredView}>
             <View style={styles.modalView}>
                     <View style={styles.haderItem}>
                         <Text style={{fontSize: 11, fontFamily: Fonts.SFCompactDisplay.SemiBold, color: Colors.textColor.primaryColor}}>{props.countryModalTitle ? props.countryModalTitle : Strings.signup.selcetCountryCode}</Text>
                         <TouchableOpacity onPress={props.onpressCross}>
                         <Image  source={Assets.wallet.cross}/>
                         </TouchableOpacity>
                     </View>
                         <View style={{width: '100%', backgroundColor: 'grey', height: .5, marginTop: 10}}/>
                         <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(text) => searchFilterFunction(text)}
                            value={search}
                            underlineColorAndroid="transparent"
                            placeholder="Search Here"
                            />
                     <View>
                         <FlatList
                             data={filteredDataSource}
                             renderItem={({item, index})=>renderCountryCode(item, index)}
                             showsVerticalScrollIndicator={true}
                             ItemSeparatorComponent={ItemSeparatorView}
                             keyExtractor={(item, index)=>index.toString()}
                         />
                     </View>
             </View>
          </View>
         </Modal>
     </View>

  );
};

const styles = StyleSheet.create({
  centeredView: {
         flex: 1,
         alignItems: "center",
         backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
         marginTop: 250,
         paddingBottom:65,
         backgroundColor: "#fdfcfc",
         width: GlobalStyle.size.width/1.13,
         borderRadius: 0,
         padding: 15,
         shadowColor: "#000",
         shadowOffset: {
             width: 0,
             height: 2
    },
         shadowOpacity: 0.25,
         shadowRadius: 4,
         elevation: 5,
   },
haderItem:{
    flexDirection:'row',
    justifyContent:'space-between'
   },
textInputStyle: {
    height: 40,
    borderBottomWidth: .5,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#b5b9b8',
    backgroundColor: '#FFFFFF',
  },
});

export default CountryCodeModal;