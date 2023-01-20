import React, {useState,useEffect} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {Loader, Header, AppButton} from '../../componet/index';
import {Colors, Assets, Strings, URL, GlobalStyle} from '../../res/index';
import AddWithdrawView from '../../componet/wallet/AddWithdrawView.js';
import CustomBottomModal from '../../componet/BottomModel/CustomBottomModal';
import {Utility} from '../../utils';

const AddFundScreen = props => {
  const [Selected, setSelected] = useState(false);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [Amount, setAmount] = useState('');
  const [IsLoaderVisible, setIsLoaderVisible] = useState(false);
  const [errorMesage, setErrorMessage] = useState(false);


  function onPressIcon() {
    setSelected(!Selected);
  }

  function submitButton() {
    if (Selected) {
      setIsModalVisible(true);
    } else {
      Utility._showToast('please select payment method');
    }
  }
  function modalCrossHandler() {
    setIsModalVisible(false);
  }
  const parameter = {
    amount: Amount,
  };
  const initiateAmount = async () => {
    setIsLoaderVisible(true);
    try {
      const response = await NetworkManager.fetchRequest(
        URL.END_POINT.initiate_add_Wallet,
        URL.REQUEST_TYPE.postRequest,
        parameter,
      );
      if (response.code === 200) {
        props.navigation.navigate('payPal', {
          Data: response?.data,
          Amount,
        });
        setAmount('');
        setIsLoaderVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function submitModalButton() {
    if (Amount != '' && Amount >=1) {
      setIsModalVisible(false);
      initiateAmount();
    } else {
      setErrorMessage(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.settings.whiteBackArrow}
          onPressLeft={() => props.navigation.goBack()}
          headerTitle={Strings.menu.Add_funds}
          {...props}
        />
      </View>
      {IsModalVisible && (
        <CustomBottomModal
          TopText= {Strings.wallet.add_funds}
          topDescText={Strings.wallet.Add_funds_modalDesc}
          crossButton={modalCrossHandler}
          onChangeText={item => {
            let decimalCount = item.split(".")[1]
            if(!(decimalCount?.length > 2)){
            setAmount(item.trim());
            }
            if (Utility._amountValidation(Number(Amount))) {
              setErrorMessage(false)
            } else {
              setErrorMessage(true)
            }
          }}
          value={Amount}
          submitButton={submitModalButton}
          errorMessage = {Strings.wallet.errMessage}
          isError = {errorMesage}
        
        />
      )}
      <ImageBackground style={{flex: 0.7}} source={Assets.splash.bgFooter}>
        <AddWithdrawView
          sourceImage={
            Selected ? Assets.wallet.selected_dot : Assets.wallet.unSelected_dot
          }
          source2={Assets.wallet.payPal}
          selectIcon={onPressIcon}
        />
      </ImageBackground>
      <View style={styles.submitButton}>
        <AppButton onPress={submitButton} icon={Assets.wallet.continue} style={styles.button}/>
      </View>
      {IsLoaderVisible && <Loader />}
    </View>
  );
};

export default AddFundScreen;

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
  },
  button:{
    paddingBottom:GlobalStyle.size.height / 15,
  }
});
