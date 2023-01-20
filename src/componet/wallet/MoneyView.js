import React from 'react';
import {StyleSheet, Text, Image, TouchableOpacity, View} from 'react-native';

import {
  Colors,
  Assets,
  Strings,
  GlobalStyle,
  URL,
  Fonts,
} from '../../res/index';

const MoneyView = props => {
  return (
    <>
      <View style={styles.moneyContainer}>
        <Text style={styles.moneyInWalletText}>MONEY IN WALLET</Text>
        <View style={styles.totalMoney}>
          <Text style={styles.totalAmountText}>{props.amount}</Text>
        </View>
      </View>

      {/* addFunds and Withdraw button */}
      <View
        style={{
          marginVertical: GlobalStyle.size.height / 25,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity onPress={props.onPressAddFund}>
          <Image source={Assets.wallet.Addfund} resizeMode="cover" />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onPressWithdraw}>
          <Image source={Assets.wallet.Withdraw} resizeMode="cover" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MoneyView;

const styles = StyleSheet.create({
  moneyContainer: {
    alignItems: 'center',
    marginTop: GlobalStyle.size.height / 25,
    justifyContent: 'center',
  },
  moneyInWalletText: {
    fontSize: 13,
    fontFamily: 'SFCompactDisplay-Regular',
    lineHeight: 18,
  },
  totalMoney: {
    justifyContent: 'center',
    marginTop: GlobalStyle.size.height / 40,
    paddingLeft: GlobalStyle.size.width / 25,
  },
  totalAmountText: {
    fontSize: 43,
    marginRight: GlobalStyle.size.width / 27,
    fontFamily: 'Butler-Bold',
    color: '#172224',
  },
  addWithdrawContainer: {
    width: 160,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#12D270',
    borderRadius: 30,
  },
  addWithdrawText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SFCompactDisplay-Bold',
  },
});
