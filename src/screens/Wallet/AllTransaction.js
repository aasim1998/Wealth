import React, {useState, useLayoutEffect, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, FlatList, Text} from 'react-native';
import {Loader, Header} from '../../componet/index';
import {Colors, Assets, Strings, GlobalStyle, URL} from '../../res/index';
import TransactionData from '././../../componet/wallet/TransactionData';
import {CustomActivityIndicator} from '../../componet/index';

const AllTransaction = ({navigation, route}) => {

  const [AllTransaction, setAllTransaction] = useState([]);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [current, setCurrent] = useState(1);
  const [LoadMore, setLoadMore] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setonEndReachedCalledDuringMomentum,
  ] = useState(true);

  // fetch data of first page

  const fetchWalletData = async () => {
    setIsLoaderVisible(true);
    try {
      const response = await NetworkManager.fetchRequest(
        `${URL.END_POINT.all_transaction}${'?'}${'page='}${current}`,
        URL.REQUEST_TYPE.getRequest,
      );

      if (response.code === 200) {
        console.log('Data::::', response.data.total);
        console.log('Data::::', response.data.to);
        setIsLoaderVisible(false);
        setAllTransaction([...AllTransaction, ...response.data?.trns]);
        setCurrent(current + 1);
      } else {
        Utility._showToast(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //fetch more data transaction

  const fetchWalletDataMore = async () => {
    setLoadMore(true);
    try {
      const response = await NetworkManager.fetchRequest(
        `${URL.END_POINT.all_transaction}${'?'}${'page='}${current}`,
        URL.REQUEST_TYPE.getRequest,
      );

      if (response.code === 200) {
        console.log('moreData::::', response.data.total);
        console.log('moreData::::', response.data.to);
        if (AllTransaction.length < response?.data?.total) {
          setCurrent(current + 1);
          setAllTransaction([...AllTransaction, ...response.data?.trns]);
          setLoadMore(false);
        }
      } else {
        Utility._showToast(response.message);
      }
    } catch (error) {
      console.log('Transaction load err', error);
    }
  };

  useLayoutEffect(() => {
    fetchWalletData();
    return setAllTransaction([]);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.settings.whiteBackArrow}
          onPressLeft={() => navigation.goBack()}
          headerTitle={Strings.menu.Transaction}
        />
      </View>
      <ImageBackground style={styles.imageBG} source={Assets.splash.bgFooter} resizeMode='cover'/>
      {AllTransaction.length > 0 ? (
        <View style={styles.AllTransactionContainer}>
          <FlatList
            data={AllTransaction}
            renderItem={({item}) => <TransactionData item={item} />}
            keyExtractor={item => AllTransaction.indexOf(item)}
            onMomentumScrollBegin={() => {
              setonEndReachedCalledDuringMomentum(false);
            }}
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum) {
                fetchWalletDataMore(); // LOAD MORE DATA
                setonEndReachedCalledDuringMomentum(true);
              }
            }}
            onEndReachedThreshold={0.001}
            ListFooterComponent={LoadMore && <CustomActivityIndicator />}
          />
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Text>No Transaction</Text>
        </View>
      )}
      {isLoaderVisible && <Loader />}
    </View>
  );
};

export default AllTransaction;

const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.size.height,
    width: GlobalStyle.size.width,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: GlobalStyle.size.height / 9.5,
  },
  imageBG: {
    height: GlobalStyle.size.height / 2,
  },
  AllTransactionContainer: {
    position: 'absolute',
    marginTop: GlobalStyle.size.height / 9,
    // marginHorizontal:GlobalStyle.size.width/13
    width: GlobalStyle.size.width,
    paddingHorizontal: GlobalStyle.size.width / 25,
    height: GlobalStyle.size.height,
  },
});
