import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Share,
  Text,
  Button,
} from 'react-native';
import {
  Header,
  MenuListComponent,
  Loader,
  DeleteModal,
  SuccessModal,
} from '../../../../componet/index';
import {
  Constants,
} from '../../../../res/index';
import { Colors, Assets, Strings, GlobalStyle, URL } from '../../../../res/index';
import { NetworkManager, Utility } from '../../../../utils/index';

/**
 * @description:This is home screen
 * @author:Vibhishan
 * @created_on:27/05/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_on:01/10/2021
 */

const SettinsScreen = props => {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);

  //Menu Button method
  const goBackMethod = () => {
    props.navigation.goBack();
  };

  //Share method
  const shareMethod = async () => {
    try {
      const result = await Share.share({
        message: Strings.settings.shareMesage,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //delete Account

  const deleteAccount = async () => {
    setIsAlertModalVisible(true);
  };

  //Logout method
  const logoutMethod = async () => {
    setIsLoaderVisible(true);
    const response = await NetworkManager.fetchRequest(
      URL.END_POINT.logout,
      URL.REQUEST_TYPE.postRequest,
    );
    if (response.code === 200) {
      setIsLoaderVisible(false);
      Utility._showToast(response?.message);
      Utility._removeAllData();
      Utility._storeData(Constants.onBoardingVisible.ONBOARDING_STATUS, JSON.stringify(true));
      props.navigation.navigate('Login');
    } else {
      Utility._showToast(response?.message);
      Utility._removeAllData();
      props.navigation.navigate('Login');
    }
  };

  const manageNotificationSwitch = val => {
    setIsSwitchEnabled(val);
    manageNotificationsMethod();
  };

  //Fetch profile method
  const fetchUserProfileData = async () => {
    const response = await NetworkManager.fetchRequest(
      URL.END_POINT.profile,
      URL.REQUEST_TYPE.getRequest,
    );
    if (response.code === 200) {
      setIsSwitchEnabled(
        response?.data?.profile?.is_notification_enabled == 1 ? true : false,
      );
    } else {
      Utility._showToast(response.message);
    }
  };

  //Manage notification method
  const manageNotificationsMethod = async () => {
    const setNotificationParameters = {
      is_notification_enabled: !isSwitchEnabled,
    };
    const response = await NetworkManager.fetchRequest(
      URL.END_POINT.set_notification,
      URL.REQUEST_TYPE.putRequest,
      setNotificationParameters,
    );
    if (response.code === 200) {
      // fetchUserProfileData();
      Utility._showToast(response?.message);
    } else {
      Utility._showToast(response?.message);
    }
  };

  // delete account model handler
  const allowDeleteHandler = async () => {
    try {
      const response = await NetworkManager.fetchRequest(
        URL.END_POINT.delete_account,
        URL.REQUEST_TYPE.postRequest,
      );
      console.log(response.code);
      if (response.code === 200) {
        setIsAlertModalVisible(false);
        Utility._removeAllData();
        Utility._showToast(response?.message);
        setTimeout(() => {
          props.navigation.navigate('Login');
        }, 3000)
      } else if (response.code === 422) {
        Utility._showToast(response?.message);
      } else {
        Utility._showToast(response?.message);
      }
      console.log(response);
    } catch (error) {
      console.log('DelResponse', error);
    }
  };
  const onPressCancelHandler = () => {
    setIsAlertModalVisible(false);
  };

  //Fetch profile data from login
  useEffect(() => {
    fetchUserProfileData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.settings.whiteBackArrow}
          onPressLeft={goBackMethod}
          headerTitle={Strings.settings.settings}
        />
      </View>

      <View style={styles.keyboardAwareScroll}>
        <ImageBackground
          style={styles.topComponentContainer}
          source={Assets.splash.bgFooter}></ImageBackground>
        <View style={styles.menuListComponentContainer}>
          <MenuListComponent
            data={Strings.settings.settingsList}
            onPressMenuList={() => logoutMethod()}
            onPressRateApp={() => alert(Strings.underDevlopment)}
            onPressShareApp={() => shareMethod()}
            onPressDeleteAccount={() => deleteAccount()}
            trackColor={{ false: Colors.octaColor, true: Colors.primaryColor }}
            thumbColor={Colors.white}
            onValueChange={val => manageNotificationSwitch(val)}
            value={isSwitchEnabled}
            {...props}
          />
        </View>
      </View>
      {isAlertModalVisible && (
        <DeleteModal
          onPressYes={allowDeleteHandler}
          onPressCancel={onPressCancelHandler}
        />
      )}
      {isLoaderVisible && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 9,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flex: 1,
  },
  keyboardAwareScroll: {
    flex: 8,
  },
  topComponentContainer: {
    height: GlobalStyle.size.height / 2.5,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  menuListComponentContainer: {
    position: 'absolute',
  },
});

export default SettinsScreen;
