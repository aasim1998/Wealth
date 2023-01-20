import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {Loader, Header, AppButton, DeleteModal} from '../../componet/index';
import {Colors, Assets, Strings, GlobalStyle, URL} from '../../res/index';
import AddWithdrawView from '../../componet/wallet/AddWithdrawView.js';
import CustomBottomModal from '../../componet/BottomModel/CustomBottomModal';
import {NetworkManager, Utility} from '../../utils';

const WithdrawScreen = props => {
  const [Selected, setSelected] = useState(false);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [Amount, setAmount] = useState('');
  const [IsLoaderVisible, setIsLoaderVisible] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [InsufficientAmount, setInsufficientAmount] = useState(false);
  const [errorMesage, setErrorMessage] = useState(false);

  function onPressIcon() {
    setSelected(!Selected);
  }

  function submitButton() {
    if (Selected) {
      setIsModalVisible(true);
    } else {
      Utility._showToast(Strings.wallet.selectPaymentMetod);
    }
  }

  function modalCrossHandler() {
    setIsModalVisible(false);
  }

  const withdraw_parameter = {
    withdraw_amount: Amount,
  };

  async function submitModalButton() {
    if (Amount != '' && Amount >= 1) {
      setIsModalVisible(false);
      setIsLoaderVisible(true);
      try {
        const response = await NetworkManager.fetchRequest(
          URL.END_POINT.Withdraw,
          URL.REQUEST_TYPE.postRequest,
          withdraw_parameter,
        );
        console.log(response);

        if (response.code === 200) {
          setIsLoaderVisible(false);
          setAmount('');
          Utility._showToast(response.message);
          setTimeout(() => {
            props.navigation.navigate('wallet');
          }, 2000);
        } else if (response.code === 400) {
          setIsLoaderVisible(false);
          setAmount('');
          Utility._showToast(response.message);
        } else if (response.code === 422) {
          setIsLoaderVisible(false);
          console.log(response.message);
          // setAlertModal(true);
          if (
            response.message ===
            Strings.wallet.insufficienAmount
          ) {
            setInsufficientAmount(true);
          } else {
            setAlertModal(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorMessage(true);
    }
  }
  const onPressAddPaypal = () => {
    props.navigation.navigate('ViewProfile',{
      isFromScreen :'My Profile'
    });
    setAlertModal(false);
  };
  const onPressCancel = () => {
    setAlertModal(false);
  };
  const onPressCancelInsufficient = () => {
    setInsufficientAmount(false);
  };
  const onPressInsufficient = () => {
    props.navigation.navigate('wallet');
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.settings.whiteBackArrow}
          onPressLeft={() => props.navigation.goBack()}
          headerTitle={Strings.menu.Withdraw_amount}
          {...props}
        />
      </View>

      {IsModalVisible && (
        <CustomBottomModal
          TopText={Strings.wallet.withdraw_fund}
          topDescText={Strings.wallet.withdraw_fund_modalDesc}
          crossButton={modalCrossHandler}
          onChangeText={item => {
            let decimalCount = item.split('.')[1];
            if (!(decimalCount?.length > 2)) {
              setAmount(item.trim());
            }
            if (Utility._amountValidation(Number(Amount))) {
              console.log('Amount', Amount);
              setErrorMessage(false);
            } else {
              setErrorMessage(true);
            }
          }}
          value={Amount}
          submitButton={submitModalButton}
          errorMessage={Strings.wallet.errMessage}
          isError={errorMesage}
        />
      )}

      <ImageBackground style={{flex: 1}} source={Assets.splash.bgFooter}>
        <AddWithdrawView
          sourceImage={
            Selected ? Assets.wallet.selected_dot : Assets.wallet.unSelected_dot
          }
          source2={Assets.wallet.payPal}
          selectIcon={onPressIcon}
        />
      </ImageBackground>
      <View style={styles.submitButton}>
        <AppButton onPress={submitButton} icon={Assets.wallet.continue} />
      </View>
      {IsLoaderVisible && <Loader />}
      {alertModal && (
        <DeleteModal
          WithdrawScreen={alertModal}
          onPressYes={onPressAddPaypal}
          onPressCancel={onPressCancel}
        />
      )}
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

export default WithdrawScreen;

const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.size.height,
    width: GlobalStyle.size.width,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: GlobalStyle.size.height / 9.5,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: GlobalStyle.size.width / 10,
  },
});
