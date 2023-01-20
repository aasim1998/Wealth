import React, { useState, useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainStackNavigator } from './src/navigation/MainStackNavigator';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import * as NavUtil from './src/utils/NavUtil';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { UpdateModal } from './src/componet/index';
import { Utility, NetworkManager } from './src/utils/index';
import { Constants, Strings, URL } from './src/res/index';
import RNRestart from 'react-native-restart';

const App = () => {
  const [currentUserId, setCurrentUserId] = useState('');
  let onBoardingStatus = false;
  // const [onNotificationTapData, setOnNotificationTapData] = useState();
  const notificationTapData = useRef();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  //Api Version check method
  const apiVersionCheckMethod = async () => {
    const response = await NetworkManager.fetchRequest(
      URL.END_POINT.app_update,
      URL.REQUEST_TYPE.getRequest,
    );
    if (response.code === 200) {
      if (
        (response?.data?.android_mandatory_update != 0 &&
          response?.data?.android_version > DeviceInfo.getVersion()) ||
        (response?.data?.ios_mandatory_update != 0 &&
          response?.data?.ios_version > DeviceInfo.getVersion())
      ) {
        setIsUpdateModalVisible(true);
      }
    } else {
      Utility._showToast(response.message);
    }
  };

  //Navigate on appStore and playStore on mandatory update
  const navigationOnAppStoreNPlayStore = () => {
    Utility._openAppStoreNPlayStore(Platform.OS);
    setIsUpdateModalVisible(false);
  };

  const getUserProfileData = async () => {
    const userProfileData = await Utility._retrieveData(
      Constants.storage_keys.USER_PROFILE,
    );
    setCurrentUserId(userProfileData?.userId);
  };

  const getOnBoardingStatus = async () => {
    const status = await Utility._retrieveData(
      Constants.onBoardingVisible.ONBOARDING_STATUS,
    );
    console.log(status)
    if (status != undefined) {
      onBoardingStatus = JSON.parse(status)
    }
    console.log(status)
  };

  const pubNub = new PubNub({
    subscribeKey: Constants.pubNub.subscribeKey,
    publishKey: Constants.pubNub.publishKey,
    uuid: currentUserId,
  });

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      // setOnNotificationTapData(notification);
      notificationTapData.current = notification;
      console.log(':::::', notification);

      if (notification.foreground == false) {

        setTimeout(async () => {
          const userProfileData = await Utility._retrieveData(
            Constants.storage_keys.USER_PROFILE,
          );
          const token = await Utility._retrieveData(
            Constants.storage_keys.USER_TOKEN,
          );
          NetworkManager.setAuthToken(token?.access_token);
          if (userProfileData) {
            if (
              userProfileData?.mobile_verified &&
              userProfileData?.email_verified
            ) {
              navigationOnNotificationTap();
            } else {
              NavUtil.replaceTo('Login');
            }
          } else {
            NavUtil.replaceTo('Onboarding');
          }
        }, 1000);

      } else {

      }

      // process the notification
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:65565', notification.action);
      console.log('NOTIFICATION45445:', notification);
      // process the action
      console.log("::::: ACTION-", notification)

    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    senderID: '562072156926',

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true,
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  const navigationOnNotificationTap = () => {

    let onNotificationTapData = notificationTapData.current;
    console.log('onNotificationTapData:-', onNotificationTapData);

    if (onNotificationTapData) {
      if (Platform.OS == 'ios') {
        const notificationData = JSON.parse(onNotificationTapData?.data.extra);
        if (
          notificationData?.notification_type ==
          Constants.notificationRedirection.groupInvitationListing
        ) {
          NavUtil.navigateTo('Home', {
            isForInvitation: true,
            isFromGroupInvitation: true
          });
        } else if (
          notificationData?.notification_type ==
          Constants.notificationRedirection.groupListing
        ) {
          NavUtil.navigateTo('Home');
        } else if (
          notificationData?.notification_type ==
          Constants.notificationRedirection.groupDetails
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData?.reference_id,
            isFromNotification: true,
          });

        } else if (notificationData.notification_type ==
          Constants.notificationRedirection.withdrawAmount) {
          NavUtil.navigateTo('wallet')

        } else if (notificationData.notification_type ==
          Constants.notificationRedirection.groupPayment) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isFromNotification: true,
            isFromGroupPayment: true
          });

        } else if (notificationData.notification_type ==
          Constants.notificationRedirection.groupUnblock) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isFromNotification: true
          });

        } else if (notificationData.notification_type ==
          Constants.notificationRedirection.groupblock) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isFromNotification: true
          });

        } else if (notificationData.notification_type ==
          Constants.notificationRedirection.groupPaymentBenificary) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isHowYouArePayingOther: true,
            isFromNotification: true,
            isFromPaymentNotification: true
          });

        } else if (onNotificationTapData.data.notification_type ==
          Constants.notificationRedirection.addWallet) {
          NavUtil.navigateTo('wallet');
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupPayment
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupUnblock
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupblock
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupPaymentBenificary
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isHowYouArePayingOther: true,
            isFromNotification: true,
            isFromPaymentNotification: true
          });
        } else if (
          onNotificationTapData.data.notification_type ==
          Constants.notificationRedirection.addWallet
        ) {
          NavUtil.navigateTo('wallet');
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupPaymentSender
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isHowYouArePayingOther: true,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupPaymentRemainder
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isHowYouArePayingOther: true,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupBenificaryPayment
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isHowYouArePayingOther: true,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupBenificaryPaymentOnHold
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: notificationData.reference_id,
            isHowYouArePayingOther: true,
            isFromNotification: true,
          });
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupCompleted
        ) {
          NavUtil.navigateTo('Home');
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupExpired
        ) {
          NavUtil.navigateTo('Home');
        } else if (
          notificationData.notification_type ==
          Constants.notificationRedirection.groupActivation
        ) {
          NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
            group_code: onNotificationTapData.data.reference_id,
            isFromNotification: true,
            isFromGroupActivation: true
          });
          
        } else if (
          notificationData?.notification_type ==
          Constants.notificationRedirection.groupChat
        ) {
          NavUtil.navigateTo('Chat', {
            isFromNotification: true,
            isGroupChat: true,
            memberData: notificationData?.user_detail?.members,
            groupId: onNotificationTapData?.data.reference_id,
            groupName: notificationData?.user_detail?.title,
            userData: {
              passCurrentUserId: notificationData?.receiver_detail?.id,
            },
          });
        } else {
          const userDetails = JSON.parse(notificationData?.user_detail);
          const receverDetails = JSON.parse(notificationData?.receiver_detail);
          NavUtil.navigateTo('Chat', {
            isFromNotification: true,
            userData: {
              userName: `${userDetails?.first_name} ${userDetails?.last_name}`,
              userId: userDetails?.id,
              shortName: userDetails?.short_name,
              memberImage: userDetails?.profile_image,
              passCurrentUserId: receverDetails?.id,
            },
          });
        }
      } else {
        if (onNotificationTapData) {
          if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupInvitationListing
          ) {
            NavUtil.navigateTo('Home', {
              isForInvitation: true,
              isFromGroupInvitation: true
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupListing
          ) {
            NavUtil.navigateTo('Home');
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.withdrawAmount
          ) {
            NavUtil.navigateTo('wallet');
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupDetails
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupPayment
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupUnblock
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupblock
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupPaymentBenificary
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isHowYouArePayingOther: true,
              isFromNotification: true,
              isFromPaymentNotification: true
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.addWallet
          ) {
            NavUtil.navigateTo('wallet');
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupPaymentSender
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isHowYouArePayingOther: true,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupPaymentRemainder
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isHowYouArePayingOther: true,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupBenificaryPayment
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isHowYouArePayingOther: true,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupBenificaryPaymentOnHold
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isHowYouArePayingOther: true,
              isFromNotification: true,
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupCompleted
          ) {
            NavUtil.navigateTo('Home');
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupExpired
          ) {
            NavUtil.navigateTo('Home');
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupActivation
          ) {
            NavUtil.navigateTo('CreateAFundGroupNDetailsRaisingRequest', {
              group_code: onNotificationTapData.data.reference_id,
              isFromNotification: true,
              isFromGroupActivation: true
            });
          } else if (
            onNotificationTapData.data.notification_type ==
            Constants.notificationRedirection.groupChat
          ) {
            const userDetails = JSON.parse(
              onNotificationTapData?.data?.user_detail,
            );
            const receverDetails = JSON.parse(onNotificationTapData?.data?.receiver_detail);
            NavUtil.navigateTo('Chat', {
              isGroupChat: true,
              isFromNotification: true,
              memberData: userDetails?.members,
              groupId: onNotificationTapData?.data.reference_id,
              groupName: userDetails?.title,
              userData: {
                passCurrentUserId: receverDetails?.id,
              },
            });
          } else {
            const userDetails = JSON.parse(
              onNotificationTapData?.data?.user_detail,
            );
            const receiverDetail = JSON.parse(
              onNotificationTapData?.data?.receiver_detail,
            );
            NavUtil.navigateTo('Chat', {
              isFromNotification: true,
              userData: {
                userName: `${userDetails?.first_name} ${userDetails?.last_name}`,
                userId: userDetails?.id,
                shortName: userDetails?.short_name,
                memberImage: userDetails?.profile_image,
                passCurrentUserId: receiverDetail?.id,
              },
            });
          }
        }
      }
    } else {
      NavUtil.navigateTo('Home');
    }
  };

  useEffect(() => {
    apiVersionCheckMethod();
    Platform.OS === 'ios' &&
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
  }, []);

  useEffect(() => {
    getUserProfileData();
  }, []);

  useEffect(() => {
    getOnBoardingStatus();
  }, []);

  useEffect(() => {
    //SetTimeout method

    setTimeout(async () => {
      const userProfileData = await Utility._retrieveData(
        Constants.storage_keys.USER_PROFILE,
      );
      const token = await Utility._retrieveData(
        Constants.storage_keys.USER_TOKEN,
      );
      NetworkManager.setAuthToken(token?.access_token);
      if (userProfileData) {
        if (
          userProfileData?.mobile_verified &&
          userProfileData?.email_verified
        ) {
          navigationOnNotificationTap();
        } else {
          NavUtil.replaceTo('Login');
        }
      } else {
        console.log('onBoardingStatus:-', onBoardingStatus)
        if (onBoardingStatus == true) {
          NavUtil.replaceTo('Login');
        } else {
          NavUtil.replaceTo('Onboarding');
        }
      }
    }, 1000);
  }, [notificationTapData]);

  return (
    <View style={styles.container}>
      <NavigationContainer ref={NavUtil.navigationRef}>
        <PubNubProvider client={pubNub}>
          <MainStackNavigator />
        </PubNubProvider>
      </NavigationContainer>
      {isUpdateModalVisible && (
        <UpdateModal
          modalVisible={isUpdateModalVisible}
          successModelTitle={Strings.appUpdate.pleaseUpdateApp}
          successModelDescription={Strings.appUpdate.updateDescriptions}
          customButtonTitle={Strings.appUpdate.updateButtonTitle}
          passIsActivate={true}
          showCancel={false}
          onPressModelButton={() => navigationOnAppStoreNPlayStore()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
