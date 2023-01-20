import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Loader,
  Header,
  CreateFundGroupBar,
  GroupSelectionComponent,
  FilterComponent,
  GroupListCard,
  AppButton,
  DeleteModal,
} from '../../componet/index';
import {
  Colors,
  Assets,
  Strings,
  GlobalStyle,
  URL,
  Fonts,
} from '../../res/index';
import { NetworkManager, Utility } from '../../utils/index';
import { useFocusEffect } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

/**
 * @description:This is home screen
 * @author:Vibhishan
 * @created_on:27/05/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_by:RAJGAURAV
 * @modified_on:31/01/2022
 */

const HomeScreen = props => {
  const isForInvitation = props?.route?.params?.isForInvitation;

  const [isFilter, setIsFilter] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [invitationReceivedData, setInvitationReceivedData] = useState([]);
  const [raiseRequestData, setRaiseRequestData] = useState([]);
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [invitationCurrentPage, setInvitationCurrentPage] = useState(1);
  const [fundRaisingCurrentPage, setFundRaisingCurrentPage] = useState(1);
  const [isGroupMoreData, setIsGroupMoreData] = useState(true);
  const [isInvitationMoreData, setIsInvitationMoreData] = useState(true);
  const [isFundRaisingMoreData, setIsFundRaisingMoreData] = useState(true);
  // const [isFetchFilterMoreData, setIsFetchFilterMoreData] = useState(false);
  const [isGroupInvitation, setIsGroupInvitation] = useState(
    isForInvitation == true ? true : false,
  );
  const [title, setTitle] = useState();
  const [groupSelectedIndex, setGroupSelectedIndex] = useState(
    isForInvitation == true ? 1 : 0,
  );
  const [isResetShow, setIsResetShow] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [showGrouplimitModal, setshowGrouplimitModal] = useState(false);
  const [payPerGo, setpayPerGo] = useState(false);

  const isFetchFilterMoreData = useRef(false);

  const isFromScreen = props?.route?.params?.isFromScreen;
  const isFromNotificationGroupInvitation = props?.route?.params?.isFromGroupInvitation;

  const isForFundGroupScreen =
    isFromScreen == undefined || isFromScreen == Strings.menu.menuList[0].title;
  const isForFundRaiseScreen =
    isFromScreen == undefined || isFromScreen == Strings.menu.menuList[1].title;

  const checkNewNotification = async () => {
    const response = await NetworkManager.fetchRequest(
      URL.END_POINT.unraed_count,
      URL.REQUEST_TYPE.getRequest,
    );
    if (response > 0) {
      setIsNotification(true);
    } else {
      setIsNotification(false);
    }
  };

  //Send fcm token
  const sendTokenMethod = async (fcmToken, device, voipToken) => {
    const tokenParameters = {
      fcm_token: fcmToken,
      device_type: device,
      voip_token: voipToken,
    };
    try {
      const response = await NetworkManager.fetchRequest(
        URL.END_POINT.send_fcm,
        URL.REQUEST_TYPE.postRequest,
        tokenParameters,
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFromNotificationGroupInvitation == true) {
      setGroupSelectedIndex(1)
    }
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        sendTokenMethod(token?.token, token?.os, '');
      },
    });
  }, []);

  //Fetching group list method
  const fetchGroupListData = async () => {
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.user_groups
      }${'?'}${'page='}${1}${'&invitation_status='}${1}${'&filter='}${isFetchFilterMoreData.current
        ? Strings.home.filter.filterByData[0].title == title
          ? Strings.home.filter.createdByMe
          : Strings.home.filter.invited
        : ''
      }`,
      URL.REQUEST_TYPE.getRequest,
    );
    setIsLoaderVisible(false);
    setRefreshing(false);
    if (response.code === 200) {
      if (response.data.paypergo_applicable === '1') {
        setpayPerGo(true);
      }
      setGroupsData([...response?.data?.groups]);
      setGroupCurrentPage(2);
      fetchGroupInvitationListData();
      console.log(response?.data?.groups);
    } else {
      Utility._showToast(response.message);
    }
  };

  //Fetch Group List More data method is used pagination
  const fetchGroupListDataMore = async () => {
    setIsLoadMore(true);

    if (isGroupMoreData) {
      const response = await NetworkManager.fetchRequest(
        `${URL.END_POINT.user_groups
        }${'?'}${'page='}${groupCurrentPage}${'&invitation_status='}${1}${'&filter='}${isFetchFilterMoreData.current
          ? Strings.home.filter.filterByData[0].title == title
            ? Strings.home.filter.createdByMe
            : Strings.home.filter.invited
          : ''
        }`,
        URL.REQUEST_TYPE.getRequest,
      );

      if (response.code === 200) {
        if (groupsData.length < response?.data?.total) {
          setGroupCurrentPage(groupCurrentPage + 1);
          setGroupsData([...groupsData, ...response.data.groups]);
          setIsGroupMoreData(groupsData.length < response?.data?.total);
          // setIsGroupMoreData(false)
        } else {
          setIsGroupMoreData(false);
        }
      } else {
        Utility._showToast(response.message);
      }
    }
    setIsLoadMore(false);
  };

  //Fetching group list method
  const fetchGroupInvitationListData = async () => {
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.user_groups
      }${'?'}${'page='}${1}${'&invitation_status='}${0}`,
      URL.REQUEST_TYPE.getRequest,
    );
    setIsLoaderVisible(false);
    setRefreshing(false);

    if (response.code === 200) {
      console.log(response?.data?.groups)
      setInvitationReceivedData([...response?.data?.groups]);
      setInvitationCurrentPage(2);
    } else {
      Utility._showToast(response.message);
    }
  };

  //Fetch Invitation List More data method is used for pagination
  const fetchGroupInvitationListDataMore = async () => {
    if (isInvitationMoreData) {
      const response = await NetworkManager.fetchRequest(
        `${URL.END_POINT.user_groups
        }${'?'}${'page='}${invitationCurrentPage}${'&invitation_status='}${0}`,
        URL.REQUEST_TYPE.getRequest,
      );
      // setRefreshing(false)
      setIsLoadMore(false);
      if (response.code === 200) {
        if (invitationReceivedData.length < response?.data?.total) {
          setInvitationCurrentPage(invitationCurrentPage + 1);
          setInvitationReceivedData([
            ...invitationReceivedData,
            ...response?.data?.groups,
          ]);
          setIsInvitationMoreData(
            invitationReceivedData?.length < response?.data?.total,
          );
        } else {
          setIsInvitationMoreData(false);
        }
      } else {
        Utility._showToast(response.message);
      }
    }
    setIsLoadMore(false);
  };

  //Fetching raiser list method
  const fetchRaiseRequestListData = async () => {
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.fundRaiserGroup}${'?'}${'page='}${1}`,
      URL.REQUEST_TYPE.getRequest,
    );
    setIsLoaderVisible(false);
    if (response.code === 200) {
      setRaiseRequestData([...response?.data?.groups?.data]);
      setFundRaisingCurrentPage(2);
    } else {
      Utility._showToast(response.message);
    }
  };

  //Fetch Request Raise List More data method is used for pagination
  const fetchRaiseRequestListDataMore = async () => {
    if (isFundRaisingMoreData) {
      const response = await NetworkManager.fetchRequest(
        `${URL.END_POINT.fundRaiserGroup
        }${'?'}${'page='}${fundRaisingCurrentPage}`,
        URL.REQUEST_TYPE.getRequest,
      );
      //    setRefreshing(false)
      setRefreshing(false);
      if (response?.code === 200) {
        if (raiseRequestData.length < response?.data?.group?.meta?.total) {
          setFundRaisingCurrentPage(fundRaisingCurrentPage + 1);
          setRaiseRequestData([
            ...raiseRequestData,
            { ...response?.data?.groups?.data },
          ]);
          setIsFundRaisingMoreData(
            raiseRequestData.length < response?.data?.group?.meta?.total,
          );
        } else {
          setIsFundRaisingMoreData(false);
        }
      } else {
        Utility._showToast(response.message);
      }
    }
    setIsLoadMore(false);
  };

  const acceptNRejectGroupInvitationMethod = async (
    group_code,
    acceptedStatus,
  ) => {
    setIsLoaderVisible(true);
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.accept_reject_group
      }${'/'}${group_code}${'?'}${'&accept_status='}${acceptedStatus}`,
      URL.REQUEST_TYPE.putRequest,
    );
    setIsLoaderVisible(false);
    if (response?.code === 200) {
      setInvitationReceivedData(
        invitationReceivedData.filter(filter => {
          return filter.group_code !== group_code;
        }),
      );
      Utility._showToast(response?.message);
    } else {
      Utility._showToast(response?.message);
    }
  };

  //PullToFresh method
  const pullToRefreshMethod = () => {
    setRefreshing(true);

    checkNewNotification();
    if (isForFundGroupScreen) {
      if (isGroupInvitation) {
        setInvitationCurrentPage(1);
        setIsInvitationMoreData(true);
        fetchGroupInvitationListData();
      } else {
        // console.log('pullToRefreshMethod2222');
        setGroupCurrentPage(1);
        setIsInvitationMoreData(true);
        setIsGroupMoreData(true);
        fetchGroupListData();
      }
    } else {
      setFundRaisingCurrentPage(1);
      setIsFundRaisingMoreData(true);
      fetchRaiseRequestListData();
    }
  };

  //Reset method on home screen
  const resetMethod = () => {
    setIsLoaderVisible(true);
    isFetchFilterMoreData.current = false;
    setGroupCurrentPage(1);
    setTitle('');
    setIsResetShow(false);
    setIsFilter(false);
    setIsGroupMoreData(true);
    fetchGroupListData();
    checkNewNotification();
  };

  //Get data after filter apply
  const filteredFetchedData = () => {
    setIsLoaderVisible(true);
    // setIsFetchFilterMoreData(true);
    setGroupsData([]);
    isFetchFilterMoreData.current = true;
    setIsGroupMoreData(true);
    setGroupCurrentPage(1);
    setIsResetShow(true);
    setIsFilter(false);
    fetchGroupListData();
    checkNewNotification();
  };

  //Menu Button method
  const menuMethod = () => {
    if (isFilter) {
      setIsFilter(false);
    } else {
      props.navigation.navigate('Menu');
    }
  };

  //Create a Fund method
  const createAFundGroupMethod = () => {
    if (payPerGo && isForFundGroupScreen) {
      setshowGrouplimitModal(true);
    } else {
      props.navigation.navigate('CreateAFundGroupNDetailsRaisingRequest', {
        isFromCreateGroup: true,
        isForFundRasingRequests: !isForFundGroupScreen,
      });
    }
  };
  const groupCountHandler = () => {
    setshowGrouplimitModal(false);
    props.navigation.navigate('CreateAFundGroupNDetailsRaisingRequest', {
      isFromCreateGroup: true,
      isForFundRasingRequests: !isForFundGroupScreen,
    });
  };
  //All groups method
  const allGroupsMethod = () => {
    setIsLoaderVisible(true);
    setGroupCurrentPage(1);
    setIsGroupInvitation(false);
    setIsResetShow(false);
    setIsGroupMoreData(true);
    fetchGroupListData();
    checkNewNotification();
  };

  //Group invitations
  const groupInvitationsMethod = () => {
    setIsLoaderVisible(true);
    setInvitationCurrentPage(1);
    setIsGroupInvitation(true);
    setIsResetShow(false);
    setIsInvitationMoreData(true);
    fetchGroupInvitationListData();
    checkNewNotification();
  };

  //This method is used for
  const fetchMoreDataMethod = () => {
    setIsLoadMore(true);

    if (isForFundGroupScreen) {
      if (isGroupInvitation) {
        fetchGroupInvitationListDataMore();
      } else {
        // setIsGroupMoreData(true)
        fetchGroupListDataMore();
      }
    } else {
      fetchRaiseRequestListDataMore();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoaderVisible(true);
      if (isForFundGroupScreen)
        if (groupSelectedIndex === 0) {
          fetchGroupListData();
          checkNewNotification();
        } else {
          fetchGroupInvitationListData();
          checkNewNotification();
        }
      else {
        fetchRaiseRequestListData();
        checkNewNotification();
      }
    }, []),
  );

  function walletHandler() {
    props.navigation.navigate('wallet', {
      isNotifications: isNotification,
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={
            isFilter ? Assets.settings.whiteBackArrow : Assets.home.menu
          }
          onPressLeft={menuMethod}
          onPressRightIcon={
            isFilter
              ? Assets.home.filter.resetIcon
              : isNotification
                ? Assets.home.notification
                : Assets.home.notificationWithoutDot
          }
          isFilter={isFilter}
          onPressRight={resetMethod}
          home={isForFundGroupScreen}
          headerTitle={
            isFilter
              ? Strings.home.groupDetails.filter.filter
              : isForFundGroupScreen
                ? Strings.home.fundGroups
                : Strings.menu.menuList[1].title
          }
          walletIcon={Assets.home.wallet}
          onPressWalletIcon={walletHandler}
          {...props}
        />
      </View>
      <View style={styles.keyboardAwareScroll}>
        <ImageBackground
          style={styles.topComponentContainer}
          source={Assets.splash.bgFooter}>
          {/**/}
          {isFilter && (
            <>
              <View style={styles.selectFilterTitleNLineContainer}>
                <Text style={styles.selectFilterTitle}>
                  {Strings.home.filter.selectFilter}
                </Text>
                <View style={styles.whiteLine}></View>
              </View>
              {Strings.home.filter.filterByData.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.onPressCheckBox}
                    onPress={() => setTitle(item.title)}
                    activeOpacity={1}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.SFCompactDisplay.Bold,
                      }}>
                      {item.title}
                    </Text>
                    <Image
                      source={
                        title == item.title
                          ? Assets.signup.circleFilled
                          : Assets.signup.circleWithoutFilled
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </>
          )}
          {!isFilter && (
            <>
              <View style={styles.createFundContainer}>
                <CreateFundGroupBar
                  onPressCreateFundGroupBar={() => createAFundGroupMethod()}
                  isFundRaising={!isForFundGroupScreen}
                  createFundGroupTitle={
                    isForFundGroupScreen
                      ? Strings.home.fundGroup
                      : Strings.menu.menuList[0].title
                  }
                />
              </View>
              {isForFundGroupScreen && (
                <View style={styles.groupSelectionContainer}>
                  <GroupSelectionComponent
                    onPressAllGroups={allGroupsMethod}
                    onPressGroupsInvitations={groupInvitationsMethod}
                    passGroupSelectedIndex={groupSelectedIndex}
                    groupCounts={groupsData?.length}
                    invitationReceiveCounts={invitationReceivedData?.length}
                  />
                </View>
              )}
              <View style={[styles.filterContainer]}>
                <FilterComponent
                  onPressFilter={() => setIsFilter(true)}
                  onPressReset={resetMethod}
                  filterDataCounts={groupsData?.length}
                  setFilterIcon={
                    isResetShow
                      ? Assets.home.filter.filteredIcon
                      : Assets.home.filter.filterIcon
                  }
                  isResetShow={isResetShow}
                  isShowFilter={!isGroupInvitation}
                  isForFundGroupScreen={isForFundGroupScreen}
                  totalRasingRequests={raiseRequestData?.length}
                />
              </View>
            </>
          )}
        </ImageBackground>

        {!isFilter && (
          <>
            <GroupListCard
              groupListData={
                isForFundGroupScreen
                  ? isGroupInvitation
                    ? invitationReceivedData
                    : groupsData
                  : raiseRequestData
              }
              fetchMoreData={fetchMoreDataMethod}
              passGroupUsersData={isForFundGroupScreen}
              isGroupInvitationTab={isGroupInvitation}
              onPressAccept={acceptNRejectGroupInvitationMethod}
              onPressReject={acceptNRejectGroupInvitationMethod}
              isForFundRasingRequestCard={!isForFundGroupScreen}
              passIsLoaderMoreVisible={isLoadMore}
              passRefreshing={refreshing}
              pullToRefresh={pullToRefreshMethod}
              {...props}
            />
          </>
        )}
        {isFilter && (
          <View style={styles.buttonContainer}>
            <AppButton
              onPress={filteredFetchedData}
              icon={Assets.home.filter.applyButton}
            />
          </View>
        )}
      </View>
      {showGrouplimitModal && (
        <DeleteModal
          groupCountModal={true}
          onPressYes={groupCountHandler}
          onPressCancel={() => setshowGrouplimitModal(false)}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: GlobalStyle.size.height / 2.5,
  },
  createFundContainer: {
    height: GlobalStyle.size.height / 12.98,
  },
  groupSelectionContainer: {
    height: GlobalStyle.size.height / 21.1,
    marginVertical: 12,
  },
  filterContainer: {
    height: GlobalStyle.size.height / 40,
  },
  buttonContainer: {
    paddingVertical: GlobalStyle.size.height / 2.7,
  },
  selectFilterTitle: {
    fontSize: 16,
    fontFamily: Fonts.SFCompactDisplay.Bold,
    color: Colors.white,
  },
  selectFilterTitleNLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteLine: {
    backgroundColor: Colors.white,
    height: 0.5,
    width: GlobalStyle.size.width / 1.58,
    marginLeft: GlobalStyle.size.width / 60,
  },
  onPressCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: GlobalStyle.size.height / 40,
    paddingBottom: GlobalStyle.size.height / 70,
  },
});

export default HomeScreen;
