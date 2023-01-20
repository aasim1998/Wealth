import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Colors, Fonts, GlobalStyle, Strings, Assets} from '../../res/index';
import {
  NoDataBackroundComponent,
  CustomActivityIndicator,
} from '../../componet/index';
import {TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import RenderCountryCode from './RenderItem';
/**
 * @description:This is countryCode modal
 * @author:Vibhishan
 * @created_on:22/05/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_on:25/10/2021
 */

const GroupListCard = props => {
  const isForFundRasingRequestCard = props?.isForFundRasingRequestCard;
  const isForNotificationsCard = props?.isForNotificationsCard;
  const isGroupInvitationTab = props?.isGroupInvitationTab;
  const loadMore = props.passIsLoaderMoreVisible
  const [isOpenDropDown, setIsOpenDropDown] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = React.useState(true);

  const openBeneficiaryDropDownMethod = index => {
    setSelectedIndex(index);
    if (selectedIndex === index) {
      setIsOpenDropDown(!isOpenDropDown);
    }
  };

  function renderCardHandler({item, index}) {
    return (
      <RenderCountryCode
        item={item}
        index={index}
        isForFundRasingRequestCard={isForFundRasingRequestCard}
        isForNotificationsCard={isForNotificationsCard}
        openBeneficiaryDropDownMethod={openBeneficiaryDropDownMethod}
        isGroupInvitationTab={isGroupInvitationTab}
        isOpenDropDown={isOpenDropDown}
        selectedIndex={selectedIndex}
        {...props}
      />
    );
  }

  const renderloader = ()=>{
    return(
        loadMore ?
          <CustomActivityIndicator /> : null
  )}

 

  return (
    <>
      {props?.groupListData?.length == 0 ? (
        <View style={styles.centeredView}>
          {!isForNotificationsCard && (
            <NoDataBackroundComponent
              noDataIcon={Assets.home.noData}
              noDataFirstDescription={
                isGroupInvitationTab
                  ? Strings.home.groupInvitation.youHaveNot
                  : Strings.home.youHavenNotCreated
              }
              noDataSecondDescription={
                isForFundRasingRequestCard
                  ? Strings.raisingRequest.anyRequestYet
                  : isGroupInvitationTab
                  ? Strings.home.groupInvitation.invitationYet
                  : Strings.home.anyGroup
              }
            />
          )}
        </View>
      ) : (
        <View
          style={[
            styles.centeredView,
            {
              marginTop: isForFundRasingRequestCard
                ? -GlobalStyle.size.height / 3.7
                : -GlobalStyle.size.height / 5,
            },
          ]}>
          <FlatList
            data={props.groupListData}
            renderItem={renderCardHandler}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollBegin={() => {
              setOnEndReachedCalledDuringMomentum(false);
            }}
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum) {
                props.fetchMoreData(); // LOAD MORE DATA
                setOnEndReachedCalledDuringMomentum(true);
              }
            }}
            onEndReachedThreshold={0.001}
            ListFooterComponent={renderloader}
            refreshControl={
              <RefreshControl
                refreshing={props.passRefreshing}
                onRefresh={props.pullToRefresh}
                colors={[Colors.septaColor]}
                title={Strings.home.pullToRefesh}
                tintColor={Colors.septaColor}
                titleColor={Colors.septaColor}
              />
            }
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: -GlobalStyle.size.height / 5,
  },
});

export default GroupListCard;
