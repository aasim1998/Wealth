import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ImageBackground} from 'react-native';
import {isLocationEnabled} from 'react-native-device-info';
import {
  Loader,
  Header,
  AppButton,
  DeleteModal,
  PaymentSummaryBox,
} from '../../../componet/index';
import {
  Colors,
  Assets,
  Strings,
  GlobalStyle,
  Fonts,
  URL,
} from '../../../res/index';
import {Utility, NetworkManager} from '../../../utils';

const BenificaryPaymentSummary = props => {
  const {data, groupId, sequence} = props.route.params;
  const [IsLoaderVisible, setIsLoaderVisible] = useState(false);
  const [InsufficientAmount, setInsufficientAmount] = useState(false);

  const submitButton = async () => {
    setIsLoaderVisible(true);
    try {
      const response = await NetworkManager.fetchRequest(
        `${
          URL.END_POINT.processGroupIndividualPayment
        }${'/'}${groupId}${'/'}${sequence}}`,
        URL.REQUEST_TYPE.postRequest,
      );
      setIsLoaderVisible(false);
      if (response.code === 200) {
        console.log(response);
        props.navigation.goBack();
        Utility._showToast(response.message);
      } else if (response.code === 422) {
        setInsufficientAmount(true);
      } else {
        Utility._showToast(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  const onPressCancelInsufficient = () => {
    setInsufficientAmount(false);
  };
  const onPressInsufficient = () => {
    props.navigation.navigate('wallet');
    setInsufficientAmount(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.settings.whiteBackArrow}
          onPressLeft={() => props.navigation.goBack()}
          headerTitle={Strings.menu.payment_summary}
          {...props}
        />
      </View>
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountContainerText}>Total Amount</Text>
        <View style={styles.totalAmount}>
          <Text style={styles.totalAmountText}>$ {data.total_amount}</Text>
        </View>
      </View>
      <PaymentSummaryBox
        text="Contribution Cycle Amount"
        amount={data.contribution_cycle_amt}
      />
      <PaymentSummaryBox text="Commision" amount={data.commission_amt} />
      <PaymentSummaryBox text="Penalty" amount={data.penalty_amt} />
      <PaymentSummaryBox text="Interest" amount={data.interest_amt} />
      {/* appButton */}
      <View style={styles.payButton}>
        <AppButton onPress={submitButton} icon={Assets.home.payNow} />
      </View>
      {IsLoaderVisible && <Loader />}
      {InsufficientAmount && (
        <DeleteModal
          insufficientAmount={true}
          onPressYes={onPressInsufficient}
          onPressCancel={onPressCancelInsufficient}
        />
      )}
    </View>
  );
};

export default BenificaryPaymentSummary;

const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.size.height,
    width: GlobalStyle.size.width,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: GlobalStyle.size.height / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmountContainer: {
    marginTop: GlobalStyle.size.height / 19,
    justifyContent: 'center',
    height: GlobalStyle.size.height / 6,
    alignItems: 'center',
  },
  totalAmountText: {
    fontSize: 50,
    color: Colors.septaColor,
    fontFamily: Fonts.Butler.Light,
  },
  totalAmountContainerText: {
    fontSize: 26,
    fontFamily: Fonts.Butler.Bold,
  },
  totalAmount: {
    margin: GlobalStyle.size.width / 15,
  },
  payButton: {
    paddingTop: GlobalStyle.size.height / 39,
  },
});
