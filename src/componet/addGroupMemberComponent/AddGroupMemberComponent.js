import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Colors, Assets, Strings, Fonts} from '../../res/index';
import {Utility} from '../../utils';
import {CountryCodeModal} from '../index';

const AddGroupMemberComponent = props => {
  const [isCountryModelVisible, setisCountryModelVisible] = useState(false);
  const [selectedIndex, setselectedIndex] = useState();

  const onPressCountryIDHandler = index => {
    setisCountryModelVisible(true);
    setselectedIndex(index);
  };

  const selectedCountryCode = (flag, c_id) => {
    setisCountryModelVisible(false);
    const mobile = props.passMemberData[selectedIndex].mobile;
    props.onChangeCountryCode(flag, c_id, mobile);
  };

  return (
    <View style={styles.container}>
      {/*Cycle period title and questionmarkAction component*/}
      <View style={styles.groupTitleContainer}>
        <Text style={styles.groupTitle}>
          {Strings.createFundGroup.addGroupMembers}
        </Text>
      </View>
      {/*Cycle period title and questionmarkAction component*/}
      <View style={styles.addGroupMembersOptionsContainer}>
        <View style={styles.addGroupsOptionsTitleContainer}>
          <Text style={styles.addGroupsOptionsTitle}>
            {Strings.createFundGroup.addGroupMembersFromFollowingOptions}
          </Text>
        </View>
        {/*Add from existing*/}
        <TouchableOpacity
          onPress={props.onPressAddExistingFrom}
          style={styles.addFromTitleNForwardIconContainer}
          activeOpacity={0.4}>
          <Image source={Assets.createFundGroup.forwardIcon} />
          <View style={styles.addFromExistingTitleContainer}>
            <Text style={styles.addFromExistingTitle}>
              {Strings.createFundGroup.addFromExisting}
            </Text>
          </View>
        </TouchableOpacity>
        {/*Add from contacts*/}
        {props.isFromCreateGroup && (
          <TouchableOpacity
            onPress={props.onPressAddFromContacts}
            style={styles.addFromTitleNForwardIconContainer}
            activeOpacity={0.4}>
            <Image source={Assets.createFundGroup.forwardIcon} />
            <View style={styles.addFromExistingTitleContainer}>
              <Text style={styles.addFromExistingTitle}>
                {Strings.createFundGroup.addFromPhone}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {/*Enter member*/}
        <TouchableOpacity
          onPress={props.onPressEnterMember}
          style={styles.enterMemberContainer}
          activeOpacity={0.4}>
          <Image source={Assets.createFundGroup.forwardIcon} />
          <View style={styles.addFromExistingTitleContainer}>
            <Text style={styles.addFromExistingTitle}>
              {Strings.createFundGroup.enterMember}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/*Total members title container*/}
      <View style={{paddingVertical: 21, paddingHorizontal: 8}}>
        {props.isFromCreateGroup && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: Fonts.SFCompactDisplay.SemiBold,
                color: Colors.secondaryColor,
              }}>
              {`${Strings.createFundGroup.total} ${props?.passMemberData?.length} ${Strings.createFundGroup.member}`}
            </Text>
            <View style={styles.line}></View>
          </View>
        )}
        {props?.passMemberData?.map((item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 21,
                borderBottomWidth: 1,
                borderColor: Colors.decaColor,
              }}
              key={index}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.SFCompactDisplay.Medium,
                    color: Colors.secondaryColor,
                  }}>
                  {index + 1}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 9,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('ViewProfile', {
                        passFromBeneficiary: {
                          isFromBeneficiary: true,
                          passIsCurrentUser:
                            item?.mobile == props?.passCurrentUserMobile,
                          isCoordinated_by_me: props.passIsCoordinated_by_me,
                          pass_profile_image: item.profile_image,
                          isExternal: item.is_external,
                          pass_first_name: item.first_name,
                          pass_last_name: item.last_name,
                          pass_email: item.email,
                          pass_short_name: item.short_name
                            ? item.short_name
                            : Utility._shortName(
                                `${item.first_name} ${item.last_name}}`,
                              ),
                          pass_mobile: item.mobile,
                          pass_country_id: item.country_id,
                          pass_flag: item.flag,
                          pass_bank_name: item.bank_name,
                          pass_banking_id: item.banking_id,
                          pass_bank_account_name: item.bank_account_name,
                          passPayPalEmail: item.paypal_email_id,
                          pass_isMobileVerified: item.mobile_verified,
                          pass_isEmailVerified: item.email_verified,
                        },
                      })
                    }>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.SFCompactDisplay.Medium,
                        color: Colors.secondaryColor,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.secondaryColor,
                      }}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <View
                      style={{
                        height: 0.4,
                        backgroundColor: Colors.secondaryColor,
                      }}></View>
                  </TouchableOpacity>
                  {props.isFromReuseGroup
                    ? item.userId == props.passCurrentUserID && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: Fonts.SFCompactDisplay.Medium,
                            color: Colors.secondaryColor,
                          }}>
                          {`(${'Coordinator'})`}
                        </Text>
                      )
                    : index === 0 && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: Fonts.SFCompactDisplay.Medium,
                            color: Colors.secondaryColor,
                          }}>
                          {`(${'Coordinator'})`}
                        </Text>
                      )}
                </View>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{paddingLeft: 0, flexDirection: 'row'}}>
                  {/* <TextInput
                    style={styles.sequenceInputContainer}
                    maxLength={4}
                    editable={index != 0 && item.flag == undefined}
                    onChangeText={(item,index) =>
                        props.onChangeCountryCode(item,index,item.mobile)}
                    keyboardType={'phone-pad'}
                    value={props.passMemberData[index].country_id}
                  /> */}
                  {
                    // console.log(JSON.stringify(item,null,2))
                  }
                  <TouchableOpacity
                    onPress={() => onPressCountryIDHandler(index)}
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    disabled={!(index != 0 && item.flag == undefined)}
                    {...props}>
                    <Text>{item.flag ? item.flag : '--'}</Text>
                    <View
                      style={{
                        paddingHorizontal: 6,
                        color: Colors.black,
                      }}>
                      <Text>{item.country_id}</Text>
                    </View>
                    <View style={{paddingRight: 6}}>
                      <Image
                        source={Assets.signup.triangleUp}
                        style={{
                          height: 4.5,
                          width: 7,
                          marginVertical: 0.75,
                          tintColor: Colors.black,
                        }}
                      />
                      <Image
                        source={Assets.signup.triangleDown}
                        style={{
                          height: 4.5,
                          width: 7,
                          marginVertical: 0.75,
                          tintColor: Colors.black,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.countryCodeNMobileTxt}>
                    {`${''}${item.mobile}`}
                  </Text>
                </View>
                {props.isFromReuseGroup
                  ? item.userId != props.passCurrentUserID && (
                      <TouchableOpacity
                        onPress={() => props.removeMember(item.mobile)}
                        disabled={index == 0}
                        style={{padding: 6}}>
                        <Image source={Assets.createFundGroup.cross} />
                      </TouchableOpacity>
                    )
                  : index != 0 && (
                      <TouchableOpacity
                        onPress={() => props.removeMember(item.mobile)}
                        disabled={index == 0}
                        style={{padding: 6}}>
                        <Image source={Assets.createFundGroup.cross} />
                      </TouchableOpacity>
                    )}
              </View>
            </View>
          );
        })}
      </View>
      {isCountryModelVisible && (
        <CountryCodeModal
          countryModalTitle={Strings.signup.selcetCountryCode}
          modalVisible={isCountryModelVisible}
          onpressCross={() => setisCountryModelVisible(false)}
          countryCodeData={Strings.signup.countryId.countryCodeData}
          onPressSelectCountryCode={selectedCountryCode}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Bold,
    color: Colors.secondaryColor,
  },
  addGroupMembersOptionsContainer: {
    borderColor: Colors.decaColor,
    borderWidth: 1,
  },
  addGroupsOptionsTitleContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.decaColor,
    marginHorizontal: 10,
    paddingVertical: 11,
    justifyContent: 'center',
  },
  addGroupsOptionsTitle: {
    fontSize: 11,
    fontFamily: Fonts.SFCompactDisplay.SemiBold,
    color: Colors.textColor.primaryColor,
  },
  addFromExistingTitleContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
    marginLeft: 14.33,
  },
  addFromExistingTitle: {
    fontSize: 16,
    fontFamily: Fonts.SFCompactDisplay.Medium,
    color: Colors.textColor.tertiary,
  },
  addFromTitleNForwardIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: Colors.decaColor,
  },
  enterMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 13,
  },
  line: {
    height: 1,
    backgroundColor: Colors.decaColor,
    width: '55%',
  },
  sequenceInputContainer: {
    height: 12,
    minWidth: 20,
    borderBottomWidth: 1,
    borderRadius: 2,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Medium,
    color: Colors.textColor.pentaColor,
    padding: 0,
    alignSelf: 'center',
  },
  countryCodeNMobileTxt: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Medium,
    color: Colors.secondaryColor,
    alignSelf: 'center',
  },
});

export default AddGroupMemberComponent;
