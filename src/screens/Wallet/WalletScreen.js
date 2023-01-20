import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Loader, Header} from '../../componet/index';
import {
  Colors,
  Assets,
  Strings,
  GlobalStyle,
  URL,
  Fonts,
} from '../../res/index';
import MoneyView from '../../componet/wallet/MoneyView';
import TransactionData from '../../componet/wallet/TransactionData';
import {NetworkManager, Utility} from '../../utils/index';
import {useFocusEffect} from '@react-navigation/native';

const WalletScreen = props => {
  const [WalletData, setWalletData] = useState();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoaderVisible(true);
    try {
      const response = await NetworkManager.fetchRequest(
        URL.END_POINT.wallet_amount,
        URL.REQUEST_TYPE.getRequest,
      );

      if (response.code === 200) {
        setWalletData(response.data);
        setIsLoaderVisible(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkNewNotification = async () => {
    const response = await NetworkManager.fetchRequest(
      URL.END_POINT.unraed_count,
      URL.REQUEST_TYPE.getRequest,
    );
    if (response > 0) {
      setIsNotification(true);
    }else{
      setIsNotification(false)
    }
  };

  useFocusEffect(
    useCallback(() => {
      let check = true;
      if (check) {
        fetchWalletData();
        checkNewNotification();
      }
      return () => {
        check = false;
      };
    }, []),
  );

  const menuMethod = () => {
    return props.navigation.goBack();
  };
  const onPressViewAllHandler = () => {
    return props.navigation.navigate('AllTransaction');
  };

  const onPressAddFunds = () => {
    return props.navigation.navigate('AddFundScreen');
  };
  const onPressWithdraw = () => {
    return props.navigation.navigate('Withdraw');
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.home.menu}
          onPressLeft={menuMethod}
          onPressRightIcon={
            isNotification
              ? Assets.home.notification
              : Assets.home.notificationWithoutDot
          }
          headerTitle={Strings.menu.menuList[2].title}
          {...props}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.septaColor]}
            title={Strings.home.pullToRefesh}
            tintColor={Colors.septaColor}
            titleColor={Colors.septaColor}
          />
        }>
        <ImageBackground style={{}} source={Assets.splash.bgFooter}>
          {/* moneyView */}
          <MoneyView
            onPressAddFund={onPressAddFunds}
            onPressWithdraw={onPressWithdraw}
            amount={WalletData?.wallet?.wallet_balance}
          />
          {/* transactionView */}
          <View style={styles.someTrans}>
            <View style={styles.innerContainer}>
              <Text style={styles.latestTransaction}>
                {Strings.wallet.latest}
              </Text>
              <TouchableOpacity
                style={styles.viewAllContainer}
                onPress={onPressViewAllHandler}>
                <Text style={styles.viewAllText}>View All</Text>
                <Image source={Assets.wallet.arrowIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {/* transaction data */}

        {WalletData?.last_trns.length > 0 ? (
          <ScrollView>
            {WalletData?.last_trns.map(item => {
              return (
                <View key={WalletData?.last_trns.indexOf(item)}>
                  <TransactionData item={item} />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noData}>
            <Text>{Strings.wallet.no_latest}</Text>
          </View>
        )}
        {isLoaderVisible && <Loader />}
      </ScrollView>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.size.height,
    width: GlobalStyle.size.width,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: GlobalStyle.size.height / 9.5,
  },

  someTrans: {
    paddingHorizontal: GlobalStyle.size.height / 27,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: GlobalStyle.size.height / 50,
  },
  latestTransaction: {
    fontSize: 16,
    fontFamily: 'SFCompactDisplay-Bold',
    color: '#000',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    paddingHorizontal: 10,
    color: '#12D270',
    fontFamily: 'SFCompactDisplay-Medium',
    fontSize: 13,
  },
  Transacton: {
    paddingBottom: GlobalStyle.size.height,
  },
  noData: {
    alignItems: 'center',
    paddingVertical: GlobalStyle.size.height / 5,
  },
});
