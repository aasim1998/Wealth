import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Colors,
  Assets,
  Strings,
  GlobalStyle,
  Fonts,
  URL,
} from '../../res/index';

const PaymentSummaryBox = ({text, amount}) => {
  return (
    <View>
      <View style={styles.group}>
        <Text style={styles.groupText}>{text}</Text>
        <Text style={styles.groupAmountText}>$ {amount}</Text>
      </View>
    </View>
  );
};

export default PaymentSummaryBox;

const styles = StyleSheet.create({
  group: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.4,
    marginHorizontal: GlobalStyle.size.width / 25,
    marginVertical: GlobalStyle.size.width / 35,
    height: GlobalStyle.size.height / 10,
    borderColor: Colors.textColor.secondary,
    borderRadius: GlobalStyle.size.width / 35,
  },
  groupText: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.textColor.secondary,
    margin: 5,
  },
  groupAmountText: {
    fontSize: 26,
    fontFamily: Fonts.Butler.Bold,
    margin: 5,
  },
});
