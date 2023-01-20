import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ImageBackground} from 'react-native';
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

const PaymentSummary = props => {
  const [SummaryData, setSummaryData] = useState([]);
  const [IsloaderVisible, setIsloaderVisible] = useState(false);
  const [InsufficiantModel, setInsufficiantModel] = useState(false);

  console.log(props.route.params.group_code, props.route.params.group_code);

  const submitButton = async () => {
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.activate_group}${'/'}${
        props?.route?.params?.group_code
      }`,
      URL.REQUEST_TYPE.putRequest,
    );

    if (response.code == 200) {
     
      props.navigation.navigate('Home');
      Utility._showToast(response.message);
    } else if (response.code === 422) {
      setInsufficiantModel(true);
    } else {
      Utility._showToast(response.message);
    }
  };

  const getPaymentSummary = async () => {
    setIsloaderVisible(true);
    try {
      const response = await NetworkManager.fetchRequest(
        `${URL.END_POINT.payment_summary}${'/'}${
          props?.route?.params?.group_id
        }`,
        URL.REQUEST_TYPE.getRequest,
      );

      if (response.code === 200) {
        setIsloaderVisible(false);
        setSummaryData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPressInsufficient = () => {
    setInsufficiantModel(false);
    props.navigation.navigate('wallet');
  };
  const onPressCancelInsufficient = () => {
    setInsufficiantModel(false);
  };

  useEffect(() => {
    let flag = true
    if(flag){
      getPaymentSummary();
    }
    return ()=> {
      flag =false
    }
  }, []);

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
          <Text style={styles.totalAmountText}>
            $ {SummaryData.total_amount}
          </Text>
        </View>
      </View>
      {/* bottomContainer */}

      <View style={styles.bottomContainer}>
        <PaymentSummaryBox
          text="Group Pricing"
          amount={SummaryData.group_amount}
        />
        <PaymentSummaryBox text="Tax Amount" amount={SummaryData.tax_amount} />
      </View>

      {/* appButton */}
      <View style={styles.payButton}>
        <AppButton onPress={submitButton} icon={Assets.home.payNow} />
      </View>
      {IsloaderVisible && <Loader />}
      {InsufficiantModel && (
        <DeleteModal
          insufficientAmount={true}
          onPressYes={onPressInsufficient}
          onPressCancel={onPressCancelInsufficient}
        />
      )}
    </View>
  );
};

export default PaymentSummary;

const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.size.height,
    width: GlobalStyle.size.width,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: GlobalStyle.size.height / 9.5,
  },
  totalAmountContainer: {
    marginTop: GlobalStyle.size.height / 12,
    justifyContent: 'center',
    height: GlobalStyle.size.height / 4,
    alignItems: 'center',
  },
  totalAmountContainerText: {
    fontSize: 26,
    fontFamily: Fonts.Butler.Bold,
  },
  totalAmount: {
    margin: GlobalStyle.size.width / 15,
  },
  totalAmountText: {
    fontSize: 50,
    color: Colors.septaColor,
    fontFamily: Fonts.Butler.Light,
  },
  payButton: {
    paddingTop: GlobalStyle.size.height / 12,
  },
});
