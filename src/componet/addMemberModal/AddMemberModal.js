import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import {
  Loader,
  CustomTextInput,
  NoDataBackroundComponent,
} from '../../componet/index';
import {
  Assets,
  Colors,
  Fonts,
  GlobalStyle,
  Strings,
  URL,
} from '../../res/index';
import { NetworkManager, Utility } from '../../utils/index';
import Contacts from 'react-native-contacts';
import { set } from 'react-native-reanimated';

/**
 * @description:This is add group modal
 * @author:Vibhishan
 * @created_on:27/05/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_on:06/01/2022
 */

const AddMemberModal = props => {
  const countryId = props?.passCountryCode;
  const country_Flag = props?.passCountryFlag;
  const [isLoaderVisible, setIsLoaderVisible] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [isFirstNameShowErrorMessage, setIsFirstNameShowErrorMessage] =
    React.useState(false);
  const [isLastNameShowErrorMessage, setIsLastNameShowErrorMessage] =
    React.useState(false);
  const [isMobileShowErrorMessage, setIsMobileShowErrorMessage] =
    React.useState(false);
  const [filterData, setFilterData] = React.useState([]);
  const [
    existingGroupNPhoneContactUsersData,
    setExistingGroupNPhoneContactUsersData,
  ] = React.useState([]);

  const [search, setSearch] = useState('');
  const [newUpdatedData, setNewUpdatedData] = useState([]);

  const existingUserMemmberObj = {};

  const existingUserAddMethod = () => {
    const filteredData = existingGroupNPhoneContactUsersData.filter(
      item => item.isChecked === true,
    );

    filteredData.map(data => {
      // console.log("::<<<<>>>>",JSON.stringify(data))

      existingUserMemmberObj['country_id'] = data.country_id || '';
      existingUserMemmberObj['mobile'] =
        data.mobile || data.phoneNumbers[0].number;
      existingUserMemmberObj['first_name'] = data.first_name || data.givenName;
      existingUserMemmberObj['last_name'] = data.last_name || data.familyName;
      existingUserMemmberObj['flag'] = data.flag;
      filterData.push({ ...existingUserMemmberObj });
    });
    props.getExistingUsersData(filterData);
  };

  //Add method
  const addMethod = () => {
    if (firstName !== '') {
      setIsFirstNameShowErrorMessage(false);
      if (lastName !== '') {
        setIsLastNameShowErrorMessage(false);
        if (mobile !== '') {
          setIsMobileShowErrorMessage(false);
          props.onPressAdd(
            countryId,
            mobile,
            firstName,
            lastName,
            country_Flag,
          );
        } else {
          setIsMobileShowErrorMessage(true);
        }
      } else {
        setIsLastNameShowErrorMessage(true);
      }
    } else {
      setIsFirstNameShowErrorMessage(true);
    }
  };

  //Select existing method
  const selectExistingGroupUsers = (item, index) => {

    var contactList =
      newUpdatedData.length > 0
        ? newUpdatedData
        : existingGroupNPhoneContactUsersData;
    contactList[index].isChecked = !contactList[index].isChecked;
    setExistingGroupNPhoneContactUsersData([...contactList]);
  };

  //Get existing user data
  const getExistingUserData = async () => {
    setIsLoaderVisible(true);
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.get_Associate_members}${'/'}${props.passCurrentUserId}`,
      URL.REQUEST_TYPE.getRequest,
    );
    setIsLoaderVisible(false);
    if (response.code === 200) {
      setExistingGroupNPhoneContactUsersData(
        response?.data?.group_members?.map(item => {
          item.isChecked = false;
          return { ...item };
        }),
      );
    } else {
      Utility._showToast(response.message);
    }
  };

  //Fetch Phone contacts method
  const syncContactMethod = () => {
    //Get Contact List
    if (Platform.OS === 'ios') {
      loadContacts();
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {

        loadContacts();
      });
    }
  };

  //Load Contact Method
  const loadContacts = () => {
    setIsLoaderVisible(true);
    Contacts.getAll()
      .then(contacts => {
        var sortedContacts = null
        if (Platform.OS == 'ios') {
          sortedContacts = contacts.sort((a, b) =>
            a.givenName.localeCompare(b.givenName),
          );
        } else {
          sortedContacts = contacts.sort((a, b) => {
            if (a.displayName > b.displayName) {
              return 1;
            }
            if (a.displayName < b.displayName) {
              return -1;
            }
            return 0;
          });
        }

        setExistingGroupNPhoneContactUsersData(
          sortedContacts?.map(data => {
            data.isChecked = false;
            return { ...data };
          }),
        );

        setIsLoaderVisible(false);
      })
      .catch(e => {
        setIsLoaderVisible(false);
        console.log('error', e);
      });
  };

  //Render existing group contacts
  const renderExistingGroupContact = (item, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => selectExistingGroupUsers(item, index)}
        style={{
          borderBottomWidth:
            index < existingGroupNPhoneContactUsersData.length - 1 ? 1 : 0,
          borderBottomColor: Colors.decaColor,
          paddingVertical: 13,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={
              item.isChecked
                ? Assets.signup.squareFilled
                : Assets.signup.squareWithoutFilled
            }
            style={{ width: 30, height: 30 }}
          />
          <View style={{ paddingLeft: 22 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.SFCompactDisplay.Medium,
                color: Colors.textColor.primaryColor,
              }}>
              {item.name || `${item.givenName} ${item.familyName}`}
            </Text>
          </View>
        </View>
        {item.profile_image != null && item.thumbnailPath != '' ? (
          <Image
            style={{ width: 35, height: 35, borderRadius: 35 / 2 }}
            source={{ uri: item.profile_image }}
          />
        ) : (
          <View
            key={index}
            style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
              borderWidth: 1,
              borderColor: '#EEEEEE',
              marginHorizontal: 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.decaColor,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.SFCompactDisplay.Light,
                color: Colors.textColor.primaryColor,
              }}>
              {item.short_name ||
                Utility._shortName(`${item.givenName} ${item.familyName}`)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  //Existing group contacts
  const existingGroupUsersContact = () => {
    const onSearch = text => {
      console.log(existingGroupNPhoneContactUsersData)
      const updatedList = existingGroupNPhoneContactUsersData.filter(item => {
        const user_name = `${item.name != undefined ? item.name.toUpperCase() : ''}`;
        const firstItemData = `${item.givenName != undefined ? item.givenName.toUpperCase() : ''}`;
        const lastItemData = `${item.familyName != undefined ? item.familyName.toUpperCase() : ''}`;
        const fullItemData = user_name + ' ' + firstItemData + ' ' + lastItemData;
        const textData = text.toUpperCase();
        return (
          user_name.indexOf(textData) > -1 ||
          firstItemData.indexOf(textData) > -1 ||
          lastItemData.indexOf(textData) > -1 ||
          fullItemData.indexOf(textData) > -1
        );
      });

      setNewUpdatedData(updatedList);
      setSearch(text);
    };

    return (
      <View style={{ paddingHorizontal: 10 }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.decaColor,
            paddingVertical: 11,
            justifyContent: 'center',
          }}>
          <View>
            <TextInput
              placeholderTextColor={'#000000'}
              style={[styles.text, styles.bg]}
              placeholder="Search Contact"
              value={search}
              onChangeText={text => {
                onSearch(text);
              }}
            />
          </View>
          {/* <SearchBar/> */}
          {/* <Text
            style={{
              fontSize: 11,
              fontFamily: Fonts.SFCompactDisplay.SemiBold,
              color: Colors.textColor.primaryColor,
            }}>
            {props.passIsExistingGroupUsers
              ? Strings.createFundGroup.selectContactsFromExistingGroup
              : Strings.createFundGroup.selectContactsFromOurPhoneBook}
          </Text> */}
        </View>
        {existingGroupNPhoneContactUsersData.length == 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: GlobalStyle.size.height / 2.1,
            }}>
            <NoDataBackroundComponent
              noDataIcon={Assets.home.noData}
              noDataFirstDescription={Strings.createFundGroup.noUsersFound}
            />
          </View>
        ) : (
          <View style={{ paddingBottom: 100 }}>
            <FlatList
              data={
                newUpdatedData.length > 0
                  ? newUpdatedData
                  : existingGroupNPhoneContactUsersData
              }
              renderItem={({ item, index }) =>
                renderExistingGroupContact(item, index)
              }
              showsVerticalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
    );
  };

  //Enter member manual component
  const enterMember = () => {
    return (
      <View>
        {/*Mobile field*/}
        <View style={styles.fieldContainer}>
          <CustomTextInput
            topPlaceholder={Strings.signup.mobileNumberWithStar}
            placeholder={Strings.signup.enterYourMobileNumber}
            hideButton={false}
            validationErrorMessageShow={
              isMobileShowErrorMessage
                ? isMobileShowErrorMessage
                : props.passIsAlreadyAddedMobileNoShowError
            }
            validationErrorMessage={
              props.passIsAlreadyAddedMobileNoShowError && mobile == 'f'
                ? Strings.fieldValidationErrorMessage.mobileNoAlreadyAdded
                : Strings.login.mobileNotValid
            }
            isCountryCode={true}
            countryFlag={country_Flag}
            countryCode={countryId}
            keyboardType={'number-pad'}
            maxLength={10}
            onPressCountryCode={props.onPressCountryCode}
            onChangeText={mobile => {
              setMobile(mobile.trim());

              setIsMobileShowErrorMessage(false);
            }}
            value={mobile}
          />
        </View>
        {/*First name field*/}
        <View style={styles.fieldContainer}>
          <CustomTextInput
            topPlaceholder={Strings.signup.firstNameWithStar}
            placeholder={Strings.signup.enterYourFirstName}
            hideButton={false}
            maxLength={10}
            validationErrorMessageShow={isFirstNameShowErrorMessage}
            validationErrorMessage={Strings.login.firstNameMustNotBeEmpty}
            onChangeText={firstName => {
              setFirstName(firstName.trim());
              setIsFirstNameShowErrorMessage(false);
            }}
            value={firstName}
          />
        </View>
        {/*Last name field*/}
        <View style={styles.fieldContainer}>
          <CustomTextInput
            topPlaceholder={Strings.signup.lastNameWithStart}
            placeholder={Strings.signup.enterYourLastName}
            hideButton={false}
            maxLength={10}
            validationErrorMessageShow={isLastNameShowErrorMessage}
            validationErrorMessage={Strings.login.lastNameMustNotBeEmpty}
            onChangeText={lastName => {
              setLastName(lastName.trim());
              setIsLastNameShowErrorMessage(false);
            }}
            value={lastName}
          />
        </View>
      </View>
    );
  };

  React.useEffect(() => {
    if (props.passIsExistingGroupUsers) {
      getExistingUserData();
    } else {
      syncContactMethod();
    }
  }, []);

  //Return whole modal components
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={props.addMemberModallVisible}>
        <View style={[styles.centeredView]}>
          <View style={styles.modalView}>
            <View style={{ paddingBottom: 15 }}>
              {props.passIsExistingGroupUsers ? (
                <Text
                  style={{
                    fontFamily: Fonts.Butler.Bold,
                    fontSize: 26,
                    paddingHorizontal: 18,
                  }}>
                  {Strings.createFundGroup.existingGroupUsers}
                </Text>
              ) : props.passIsFromPhoneContacts ? (
                <View style={{ width: '85%' }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Butler.Bold,
                      fontSize: 26,
                      paddingHorizontal: 18,
                    }}>
                    {Strings.createFundGroup.phoneBookContactList}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: Fonts.Butler.Bold,
                    fontSize: 26,
                    paddingHorizontal: 18,
                  }}>
                  {Strings.createFundGroup.enterMember}
                </Text>
              )}
            </View>
            <View style={styles.memberFieldContainer}>
              {props.passIsExistingGroupUsers || props.passIsFromPhoneContacts
                ? existingGroupUsersContact()
                : enterMember()}
            </View>
            {/*Add and cancel buttons components*/}
            <View style={styles.submitNConcelButtonContainer}>
              <TouchableOpacity
                onPress={() =>
                  props.passIsExistingGroupUsers ||
                    props.passIsFromPhoneContacts
                    ? existingUserAddMethod()
                    : addMethod()
                }
                activeOpacity={0.6}
                style={styles.onPressButton}>
                <Image source={Assets.createFundGroup.addButton} />
              </TouchableOpacity>
              <View style={styles.cancelContainer}>
                <TouchableOpacity
                  onPress={props.onPressCancel}
                  style={styles.onPressCancel}
                  activeOpacity={0.6}>
                  <Text style={styles.cancelTxt}>{Strings.otp.cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {isLoaderVisible && <Loader />}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    marginTop: 40,
  },
  modalView: {
    backgroundColor: 'white',
    width: GlobalStyle.size.width / 1.13,
    borderRadius: 5,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitNConcelButtonContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 10,
    marginTop: 5,
  },
  cancelContainer: {
    alignItems: 'center',
    // paddingTop:5,
    marginTop: 24,
  },
  onPressButton: {
    paddingVertical: 0,
    marginTop: GlobalStyle.size.height / 60,
  },
  memberFieldContainer: {
    borderTopWidth: 1,
    borderColor: Colors.decaColor,
    height: GlobalStyle.size.height / 2.1,
  },
  fieldContainer: {
    height: GlobalStyle.size.height / 7.5,
    paddingHorizontal: 18,
  },
  onPressCancel: {
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
  },
  bg: {
    backgroundColor: '#e0e0e0',
    height: Platform.OS == 'ios' ? 35 : 45,
    height: 35,
    marginHorizontal: 5,
    flexDirection: 'row',
    borderRadius: 10,
  },
  text: {
    color: Colors.black,
    paddingLeft: 10,
  },
});

export default AddMemberModal;
