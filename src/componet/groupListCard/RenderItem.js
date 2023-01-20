import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Colors, Fonts, GlobalStyle, Strings, Assets} from '../../res/index';
import {TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import {InvitationCard} from '../index';

class RenderCountryCode extends PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {
      isForFundRasingRequestCard,
      isForNotificationsCard,
      openBeneficiaryDropDownMethod,
      isGroupInvitationTab,
      isOpenDropDown,
      item,
      index,
      selectedIndex,
    } = this.props;

    return (
      <>
        {index == 0 && !isForNotificationsCard && (
          <View style={styles.addMobCard}>
            <BannerAd
              unitId={TestIds.BANNER}
              size={BannerAdSize.LARGE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdLoaded={() => {
                console.log('Advert loaded');
              }}
              onAdFailedToLoad={error => {
                console.error('Advert failed to load: ', error);
              }}
            />
          </View>
        )}
        {
          this.props?.isGroupInvitationTab ? (
            //Group Invitation card start line
            <InvitationCard item={item} {...this.props} accept = {this.props.onPressAccept} reject = {this.props.onPressReject} />
          ) : //Group Invitation card end line
          isForFundRasingRequestCard ? (
            //Rasing Request card start line
            <TouchableOpacity
              disabled={true}
              activeOpacity={0.7}
              style={
                isForNotificationsCard
                  ? styles.notificationCard
                  : [
                      styles.card,
                      {
                        borderBottomColor: Colors.septaColor,
                        paddingBottom: GlobalStyle.size.height / 55,
                        marginTop: 3,
                      },
                    ]
              }>
              <View style={{paddingTop: 8}}>
                <Text
                  style={
                    isForNotificationsCard
                      ? styles.notificationTitle
                      : styles.groupTitle
                  }>
                  {item?.title}
                </Text>
                <Text
                  style={
                    isForNotificationsCard
                      ? styles.notificationDescription
                      : styles.groupDescriptionTitle
                  }>
                  {isForNotificationsCard ? item.message : item?.description}
                </Text>
                {isForNotificationsCard && (
                  <Text style={styles.notificationTime}>{item.created_at}</Text>
                )}
              </View>
              {!isForNotificationsCard && (
                <>
                  <View style={styles.bankAppNameNbankIdContainer}>
                    <Text style={styles.bankAppName}>
                      {`${'Bank/App Name:  '}`}
                      <Text
                        style={
                          styles.cyclePeriodDate
                        }>{`${item.bank_name}`}</Text>
                    </Text>
                    <Text style={styles.bankAppName}>
                      {`${'Banking#/App ID:  '}`}
                      <Text
                        style={
                          styles.cyclePeriodDate
                        }>{`${item.banking_id}`}</Text>
                    </Text>
                  </View>
                  <View style={styles.lineView}></View>
                  <TouchableOpacity
                    style={styles.plusNMinusContainer}
                    onPress={() => openBeneficiaryDropDownMethod(index)}
                    activeOpacity={1}>
                    <Text style={styles.invitedUserMobileNo}>
                      {`${'Invited users mobile number'}  (${
                        this.props.groupListData[index]?.users?.length
                      } Members)`}
                    </Text>
                    <Image
                      source={
                        isOpenDropDown && selectedIndex === index
                          ? Assets.howYouNOthersPaying.minusCircle
                          : Assets.howYouNOthersPaying.plusCircle
                      }
                    />
                  </TouchableOpacity>
                  {isOpenDropDown && selectedIndex === index ? (
                    this.props.groupListData[index]?.users?.map(
                      (item, index) => {
                        return (
                          <View key={index}>
                            {
                              <View
                                style={styles.flagCountryCodeMobileNoContainer}>
                                <View style={styles.flagCountruIdContainer}>
                                  <Text>{item?.flag}</Text>
                                  <Text style={styles.countryIdTitle}>
                                    {item.country_id}
                                  </Text>
                                </View>
                                <View style={styles.mobileNoContainer}>
                                  <Text style={styles.countryIdTitle}>
                                    {item.contact_no}
                                  </Text>
                                </View>
                              </View>
                            }
                          </View>
                        );
                      },
                    )
                  ) : (
                    <View style={styles.flagCountryCodeMobileNoContainer}>
                      <View style={styles.flagCountruIdContainer}>
                        <Text>
                          {this.props.groupListData[index]?.users[0]?.flag}
                        </Text>
                        <Text style={styles.countryIdTitle}>
                          {
                            this.props.groupListData[index]?.users[0]
                              ?.country_id
                          }
                        </Text>
                      </View>
                      <View style={styles.mobileNoContainer}>
                        <Text style={styles.countryIdTitle}>
                          {
                            this.props.groupListData[index]?.users[0]
                              ?.contact_no
                          }
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
              <Image
                source={Assets.home.groupStrip}
                style={styles.groupStrip}
              />
            </TouchableOpacity>
          ) : (
            //Rasing Request card end line
            
            //Group list card start line
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={item.status == 'Expired'}
              onPress={() =>
                this.props.navigation.navigate(
                  'CreateAFundGroupNDetailsRaisingRequest',
                  {
                    group_code: item?.group_code,
                    group_id: item?.group_id,
                  },
                )
              }
              style={[styles.card, {marginTop: 3}]}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={styles.cyclePeriodTitle}>
                    {`${'Cycle Period - '}`}
                    <Text
                      style={styles.cyclePeriodDate}>{`${Utility._appDateFormat(
                      item.start_date,
                    )} ${'-'} ${Utility._appDateFormat(item.end_date)}`}</Text>
                  </Text>
                  <Text style={styles.cyclePeriodTitle}>
                    {`${'Active Period - '}`}
                    <Text
                      style={styles.cyclePeriodDate}>{`${Utility._appDateFormat(
                      item.active_start_date,
                    )} ${'-'} ${Utility._appDateFormat(
                      item.active_end_date,
                    )}`}</Text>
                  </Text>
                </View>
                <Text
                  style={{
                    color:
                      item?.status === 'Active'
                        ? Colors.septaColor
                        : item.status == 'Expired'
                        ? Colors.pentaColor
                        : item.status == 'Completed'
                        ? '#002060'
                        : Colors.tertiary,
                    fontSize: 11,
                    fontFamily: Fonts.SFCompactDisplay.Light,
                  }}>
                  {item?.status}
                </Text>
              </View>

              <View style={{paddingTop: 8}}>
                <Text style={styles.groupTitle}>{item?.title}</Text>
                <Text style={styles.groupDescriptionTitle}>
                  {item?.description}
                </Text>
              </View>

              <View style={styles.scrollViewContainer}>
                <ScrollView
                  horizontal={true}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}>
                  {this.props.groupListData[index]?.members?.map(
                    (item, index) => {
                      return (
                        <View key={index}>
                          {index === 5 ? (
                            <View
                              style={{
                                width: 35,
                                height: 35,
                                borderRadius: 35 / 2,
                                borderWidth: 1,
                                borderColor: '#EEEEEE',
                                marginHorizontal: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text>
                                {`${'+'}${
                                  this.props.groupListData[index]?.members
                                    .length
                                }`}
                              </Text>
                            </View>
                          ) : index > 5 ? (
                            <></>
                          ) : item.profile_image !== null ? (
                            <Image
                              style={{
                                width: 35,
                                height: 35,
                                borderRadius: 35 / 2,
                                marginHorizontal: 2,
                              }}
                              source={{uri: item.profile_image}}
                            />
                          ) : (
                            <View
                              style={{
                                width: 35,
                                height: 35,
                                borderRadius: 35 / 2,
                                borderWidth: 1,
                                borderColor: '#EEEEEE',
                                marginHorizontal: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontFamily: Fonts.SFCompactDisplay.SemiBold,
                                  color: Colors.septaColor,
                                }}>
                                {item?.short_name}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    },
                  )}
                </ScrollView>
                <View>
                  <Text style={styles.currencyTitle}>
                    {Strings.fieldPlaceHolder.selectCurrency}
                  </Text>
                  <View style={styles.currencyContainer}>
                    <Text style={styles.currency}>{item?.currency}</Text>
                  </View>
                </View>
              </View>
              <Image
                source={Assets.home.groupStrip}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -0.3,
                  tintColor:
                    item?.status === 'Active'
                      ? Colors.septaColor
                      : item.status == 'Expired'
                      ? Colors.pentaColor
                      : item.status == 'Completed'
                      ? '#002060'
                      : Colors.tertiary,
                  width: '110%',
                }}
              />
            </TouchableOpacity>
          )
          //Group list card end line
        }
      </>
    );
  }
}

export default RenderCountryCode;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: -GlobalStyle.size.height / 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    paddingHorizontal: 15.8,
    paddingTop: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
    marginBottom: GlobalStyle.size.height / 100,
    marginHorizontal: 20,
    borderRightColor: Colors.white,
    borderLeftColor: Colors.white,
    borderTopColor: Colors.white,
    borderBottomColor: Colors.septaColor,
    borderWidth: 0,
  },
  addMobCard: {
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
    marginBottom: GlobalStyle.size.height / 100,
    marginHorizontal: 20,
    borderColor: Colors.white,
    borderWidth: 0,
  },
  acceptButton: {
    borderWidth: 1,
    borderRadius: GlobalStyle.size.height / 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.septaColor,
    width: GlobalStyle.size.width / 2.7,
    height: GlobalStyle.size.height / 20,
  },
  acceptTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.SemiBold,
    color: Colors.primaryColor,
  },
  groupInvitationNTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -0.3,
    tintColor: Colors.septaColor,
    width: '110%',
  },
  groupInvitationTitle: {
    fontSize: 20,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
    paddingVertical: GlobalStyle.size.height / 150,
  },
  onPressViewDetails: {
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
    justifyContent: 'flex-end',
  },
  viewDetails: {
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  viewDetailsTitle: {
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.textColor.tertiary,
  },
  viewDetailsUnderLine: {
    borderBottomWidth: 0.5,
    borderColor: Colors.textColor.tertiary,
  },
  acceptNRejectButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: GlobalStyle.size.height / 25,
    paddingBottom: GlobalStyle.size.height / 40,
  },
  groupTitle: {
    fontSize: 20,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
  },
  groupDescriptionTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.secondaryColor,
  },
  cyclePeriodTitle: {
    fontSize: 11,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.tertiary,
  },
  cyclePeriodDate: {
    fontSize: 11,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.textColor.primaryColor,
  },
  currencyTitle: {
    fontSize: 9,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.tertiary,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 18,
  },
  currency: {
    fontSize: 14,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
  },
  currencyContainer: {
    paddingLeft: 4,
  },
  bankAppName: {
    fontSize: 12,
    color: Colors.tertiary,
    fontFamily: Fonts.SFCompactDisplay.Light,
  },
  plusNMinusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: GlobalStyle.size.height / 65,
  },
  lineView: {
    height: 1,
    backgroundColor: '#DCDCDC',
    marginVertical: GlobalStyle.size.height / 55,
  },
  bankAppNameNbankIdContainer: {
    paddingTop: GlobalStyle.size.height / 100,
  },
  invitedUserMobileNo: {
    fontSize: 11,
    fontFamily: Fonts.SFCompactDisplay.SemiBold,
    color: Colors.textColor.primaryColor,
  },
  flagCountryCodeMobileNoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  flagCountruIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryIdTitle: {
    paddingLeft: GlobalStyle.size.width / 80,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.black,
  },
  mobileNoContainer: {
    paddingLeft: GlobalStyle.size.width / 40,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.SemiBold,
    color: Colors.secondaryColor,
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.secondaryColor,
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.tertiary,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    paddingHorizontal: 15.8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: GlobalStyle.size.height / 95,
    marginHorizontal: 20,
    borderRightColor: Colors.white,
    borderLeftColor: Colors.white,
    borderTopColor: Colors.white,
    borderBottomColor: Colors.septaColor,
    borderWidth: 0,
    paddingBottom: GlobalStyle.size.height / 105,
  },
  interestAndCommission: {
    marginTop: GlobalStyle.size.height / 50,
    flexDirection: 'row',
    // paddingLeft: 3,
    flexWrap: 'wrap',
  },
  ComIntText: {
    fontSize: 15,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    paddingHorizontal: GlobalStyle.size.height / 45,
  },
  descText: {
    marginTop: GlobalStyle.size.height / 30,
    paddingLeft: GlobalStyle.size.height / 100,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
  },
});
