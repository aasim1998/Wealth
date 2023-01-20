import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Colors,
  Assets,
  Strings,
  GlobalStyle,
  URL,
  Fonts,
} from '../../res/index';
import moment from 'moment';
class TransactionData extends React.PureComponent {
  render() {
    const {item} = this.props;
    const newDate = new Date(item.transaction_date * 1000)
    
    return (
      <View style={styles.TransactionContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.transType}>{item.transaction_type}</Text>
          <View style={styles.dateTime}>
            <Text style={styles.dateText}> {moment(newDate).format('MMM DD YYYY, hh:mm A')}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text
            style={[
              styles.rightContainerText,
              {
                color:
                  item.transaction_type === 'Debited'
                    ? Colors.pentaColor
                    : Colors.septaColor,
              },
            ]}>
            {item.transaction_amount}
          </Text>
        </View>
      </View>
    );
  }
}

export default TransactionData;

const styles = StyleSheet.create({
  TransactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: GlobalStyle.size.height / 70,
    margin: GlobalStyle.size.width / 40,
    borderRadius: GlobalStyle.size.width / 40,
    borderWidth: 0.8,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 4,
  },
  transType: {
    fontSize: 16,
    fontFamily: 'SFCompactDisplay-Regular',
  },
  dateTime: {
    marginVertical: 5,
  },
  dateText: {
    fontFamily: 'SFCompactDisplay-Regular',
    fontSize: 14,
    color: '#8B8B8B',
    marginHorizontal: 2,
  },
  rightContent: {
    justifyContent: 'center',
  },
  rightContainerText: {
    fontFamily: 'SFCompactDisplay-Regular',
    fontSize: 20,
  },
});
