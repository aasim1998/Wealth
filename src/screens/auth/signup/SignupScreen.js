import React, {useRef,useState,useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  AppButton,
  CustomTextInput,
  CountryCodeModal,
  Loader,
  SuccessModal,
  Header,
} from '../../../componet/index';
import {
  Colors,
  Assets,
  Strings,
  Fonts,
  GlobalStyle,
  URL,
  Constants,
} from '../../../res/index';
import {NetworkManager, Utility} from '../../../utils/index';

/**
 * @description:This is signup screen
 * @author:Vibhishan
 * @created_on:27/05/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_on:29/05/2021
 */

const SignupScreen = props => {
  const [isCountryCodeModalVisible, setIsCountryCodeModalVisible] =
    React.useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryId, setCountryId] = useState('+1');
  const [country_Flag, setCountry_Flag] = useState('🇺🇸');
  const [mobile, setMobile] = useState('');
  const [isFirstNameShowErrorMessage, setIsFirstNameShowErrorMessage] =
    useState(false);
  const [isLastNameShowErrorMessage, setIsLastNameShowErrorMessage] =
    useState(false);
  const [isEmailShowErrorMessage, setIsEmailShowErrorMessage] =
    useState(false);
  const [isMobileShowErrorMessage, setIsMobileShowErrorMessage] =
    useState(false);
  const [isPasswordShowErrorMessage, setIsPasswordShowErrorMessage] =
    useState(false);
  const [
    isConfirmPasswordShowErrorMessage,
    setIsConfirmPasswordShowErrorMessage,
  ] = useState(false);
  const firstNameInput = useRef(null);
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const mobileInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);

  //Field blank Method
  const emptyfieldMethod = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setMobile('');
  };

  //SignUp method
  const singupMethod = async () => {
    const registerParameters = {
      firstName: firstName,
      lastName: lastName,
      email: email.toLocaleLowerCase(),
      password: password,
      countryId: countryId,
      mobile: mobile,
      flag: country_Flag,
    };
    

    if (firstName !== ''){
      setIsFirstNameShowErrorMessage(false);
      if (lastName !== '') {
        setIsLastNameShowErrorMessage(false)
        if (Utility._emailValidation(email)) {
            setIsEmailShowErrorMessage(false)
          if (mobile !== '' && mobile.length == 10) {
              setIsMobileShowErrorMessage(false)
              if (Utility._passwordValidation(password)) {
                setIsPasswordShowErrorMessage(false);
                if (password === confirmPassword) {
                  setIsConfirmPasswordShowErrorMessage(false);    
                  
                  setIsLoaderVisible(true);
                const response = await NetworkManager.fetchRequest(
                  URL.END_POINT.register,
                  URL.REQUEST_TYPE.postRequest,
                  registerParameters,
                );
                setIsLoaderVisible(false);
                if (response.code == 200) {
                  emptyfieldMethod();
                  NetworkManager.setAuthToken(
                    response?.data?.token?.access_token,
                  );
                  Utility._storeData(
                    Constants.storage_keys.USER_PROFILE,
                    response?.data?.profile,
                  );
                  Utility._storeData(
                    Constants.storage_keys.USER_TOKEN,
                    response?.data?.token,
                  );
                  Utility._showToast(response.message);
                  props.navigation.replace('EmailVerify', {
                    signupPassData: {
                      isFromSignup: true,
                      emailFromSingup: email,
                    },
                  });
                } else {
                  Utility._showToast(response.message);
                }
                } else {
                    setIsConfirmPasswordShowErrorMessage(true);
                    confirmPasswordInput.current.focus();           
                  }
              }else{
                  setIsPasswordShowErrorMessage(true);
                  passwordInput.current.focus();
               }
            } else {
                setIsMobileShowErrorMessage(true);
                mobileInput.current.focus();       
              }
          } else {
             setIsEmailShowErrorMessage(true);
             emailInput.current.focus();
          }
      }else {
        setIsLastNameShowErrorMessage(true);
        lastNameInput.current.focus();           
       }
    }else{
      setIsFirstNameShowErrorMessage(true);
      firstNameInput.current.focus();
    }
  }
  //   if (firstName !== '') {
  //     setIsFirstNameShowErrorMessage(false);
  //     if (lastName !== '') {
  //       setIsLastNameShowErrorMessage(false);
  //       if (Utility._emailValidation(email)) {
  //         setIsEmailShowErrorMessage(false);
  //         if (mobile !== '' && mobile.length == 10) {
  //           setIsMobileShowErrorMessage(false);
  //           if (Utility._passwordValidation(password)) {
  //             setIsPasswordShowErrorMessage(false);
  //             if (password === confirmPassword) {
  //               setIsConfirmPasswordShowErrorMessage(false);
  //               setIsLoaderVisible(true);
  //               const response = await NetworkManager.fetchRequest(
  //                 URL.END_POINT.register,
  //                 URL.REQUEST_TYPE.postRequest,
  //                 registerParameters,
  //               );
  //               setIsLoaderVisible(false);
  //               if (response.code == 200) {
  //                 emptyfieldMethod();
  //                 NetworkManager.setAuthToken(
  //                   response?.data?.token?.access_token,
  //                 );
  //                 Utility._storeData(
  //                   Constants.storage_keys.USER_PROFILE,
  //                   response?.data?.profile,
  //                 );
  //                 Utility._storeData(
  //                   Constants.storage_keys.USER_TOKEN,
  //                   response?.data?.token,
  //                 );
  //                 Utility._showToast(response.message);
  //                 props.navigation.replace('Otp', {
  //                   signupPassData: {
  //                     isFromSignup: true,
  //                     emailFromSingup: email,
  //                   },
  //                 });
  //               } else {
  //                 Utility._showToast(response.message);
  //               }
  //             } else {
  //               setIsConfirmPasswordShowErrorMessage(true);
  //               confirmPasswordInput.current.focus();
  //             }
  //           } else {
  //             setIsPasswordShowErrorMessage(true);
  //             passwordInput.current.focus();
  //           }

  //         //   if (Utility._passwordValidation(password)) {
  //         //     setIsPasswordShowErrorMessage(false);
  //         //     if (password === confirmPassword) {
  //         //       setIsConfirmPasswordShowErrorMessage(false);
  //         //       setIsLoaderVisible(true);
  //         //       const response = await NetworkManager.fetchRequest(
  //         //         URL.END_POINT.register,
  //         //         URL.REQUEST_TYPE.postRequest,
  //         //         registerParameters,
  //         //       );
  //         //       setIsLoaderVisible(false);
  //         //       if (response.code == 200) {
  //         //         emptyfieldMethod();
  //         //         NetworkManager.setAuthToken(
  //         //           response?.data?.token?.access_token,
  //         //         );
  //         //         Utility._storeData(
  //         //           Constants.storage_keys.USER_PROFILE,
  //         //           response?.data?.profile,
  //         //         );
  //         //         Utility._storeData(
  //         //           Constants.storage_keys.USER_TOKEN,
  //         //           response?.data?.token,
  //         //         );
  //         //         Utility._showToast(response.message);
  //         //         props.navigation.replace('EmailVerify', {
  //         //           signupPassData: {
  //         //             isFromSignup: true,
  //         //             emailFromSingup: email,
  //         //           },
  //         //         });
  //         //       } else {
  //         //         Utility._showToast(response.message);
  //         //       }
  //         //     } else {
  //         //       setIsConfirmPasswordShowErrorMessage(true);
  //         //       confirmPasswordInput.current.focus();
  //         //     }
  //         //   } else {
  //         //     setIsPasswordShowErrorMessage(true);
  //         //     passwordInput.current.focus();
  //         //   }
  //         // } else {
  //           setIsMobileShowErrorMessage(true);
  //           mobileInput.current.focus();
  //         }
  //       } else {
  //         setIsEmailShowErrorMessage(true);
  //         emailInput.current.focus();
  //       }
  //     } else {
  //       setIsLastNameShowErrorMessage(true);
  //       lastNameInput.current.focus();
  //     }
  //   } else {
  //     setIsFirstNameShowErrorMessage(true);
  //     firstNameInput.current.focus();
  //   }
  // };
  //Goback method
  const goBackMethod = () => {
    props.navigation.goBack();
  };

  //Select country code method
  const selcetCountryCodeMethod = (flag, code) => {
    setCountry_Flag(flag);
    setCountryId(code);
    setIsCountryCodeModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          headerImg={Assets.splash.preLoginHeaderBg}
          onPressLeftIcon={Assets.forgotPassword.backArrow}
          onPressLeft={goBackMethod}
          headerTitle={''}
        />
      </View>
      <View style={styles.keyboardAwareScroll}>
        <KeyboardAwareScrollView
          style={styles.keyboardAwareScroll}
          bounces={true}
          showsVerticalScrollIndicator={false}>
          {/*Create account title component*/}
          <View style={styles.createAccountNPleaseFillTheFormContainer}>
            <View>
              <Text style={styles.createAccountTxt}>
                {Strings.signup.createAccount}
              </Text>
            </View>
            <View style={styles.pleaseFillTheForm}>
              <Text style={styles.pleaseFillTheFormTxt}>
                {Strings.signup.pleaseFillTheForm}
              </Text>
            </View>
          </View>
          {/*Top fields container*/}
          <View style={styles.topFieldsContainer}>
            {/*First name field*/}
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.firstNameWithStar}
                placeholder={Strings.signup.enterYourFirstName}
                hideButton={false}
                validationErrorMessageShow={isFirstNameShowErrorMessage}
                validationErrorMessage={Strings.login.firstNameMustNotBeEmpty}
                onChangeText={firstName => {
                  setFirstName(firstName.trim());
                  if (firstName !== '') {
                    setIsFirstNameShowErrorMessage(false);
                  } else {
                    setIsFirstNameShowErrorMessage(true);
                  }
                }}
                value={firstName}
                passRef={firstNameInput}
              />
            </View>
            
            {/*Last name field*/}
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.lastNameWithStart}
                placeholder={Strings.signup.enterYourLastName}
                hideButton={false}
                validationErrorMessageShow={isLastNameShowErrorMessage}
                validationErrorMessage={Strings.login.lastNameMustNotBeEmpty}
                onChangeText={lastName => {
                  setLastName(lastName.trim());
                  if (lastName !== '') {
                    setIsLastNameShowErrorMessage(false);
                  } else {
                    setIsLastNameShowErrorMessage(true);
                  }
                }}
                value={lastName}
                passRef={lastNameInput}
              />
            </View>
            {/*Email address field*/}
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.emailAddressWithStar}
                placeholder={Strings.login.enterYourEmailAddress}
                hideButton={false}
                maxLength={100}
                keyboardType='email-address'
                validationErrorMessageShow={isEmailShowErrorMessage}
                validationErrorMessage={
                  email === ''
                    ? Strings.login.emailShouldNotBeEmpty
                    : Strings.login.pleaseEnterAValidEmail
                }
                onChangeText={email => {
                  setEmail(email.trim());
                  if (Utility._emailValidation(email)) {
                    setIsEmailShowErrorMessage(false);
                  } else {
                    setIsEmailShowErrorMessage(true);
                  }
                }}
                autoCapitalize='none'
                value={email}
                passRef={emailInput}
              />
            </View>
            {/*Mobile no field*/}
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.mobileNumberWithStar}
                placeholder={Strings.signup.enterYourMobileNumber}
                hideButton={false}
                validationErrorMessageShow={isMobileShowErrorMessage}
                validationErrorMessage={
                  mobile == ''
                    ? Strings.login.mobileNoShouldNotBeEmpty
                    : Strings.login.mobileNotValid
                }
                isCountryCode={true}
                countryFlag={country_Flag}
                countryCode={countryId}
                keyboardType={'number-pad'}
                maxLength={10}
                onPressCountryCode={() => setIsCountryCodeModalVisible(true)}
                onChangeText={mobile => {
                  setMobile(mobile.trim());
                  if (mobile !== '' && mobile.length == 10) {
                    setIsMobileShowErrorMessage(false);
                  } else {
                    setIsMobileShowErrorMessage(true);
                  }
                }}
                value={mobile}
                passRef={mobileInput}
              />
            </View>
          </View>

          {/*Bottom fields container*/}
          <View style={styles.bottomFieldsContainer}>
            {/*Password fields container*/}
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.password}
                placeholder={Strings.signup.enterYourPassword}
                hideButton={true}
                validationErrorMessageShow={isPasswordShowErrorMessage}
                validationErrorMessage={
                  password === ''
                    ? Strings.fieldValidationErrorMessage.passwordCannotBeBlank
                    : Strings.login.pleaseEnterAValidPassword
                }
                onChangeText={password => {
                  setPassword(password.trim());
                  if (Utility._passwordValidation(password)) {
                    setIsPasswordShowErrorMessage(false);
                  } else {
                    setIsPasswordShowErrorMessage(true);
                  }
                }}
                value={password}
                passRef={passwordInput}
              />
            </View>
            {/*Confirm Password fields container*/}
            <View style={styles.fieldContainer1}>
              <CustomTextInput
                topPlaceholder={Strings.signup.confirmPassword}
                placeholder={Strings.signup.enterYourConfirmPassword}
                hideButton={true}
                validationErrorMessageShow={isConfirmPasswordShowErrorMessage}
                validationErrorMessage={
                  confirmPassword === ''
                    ? Strings.fieldValidationErrorMessage.passwordCannotBeBlank
                    : Strings.login.passwordNConfirmPasswordSame
                }
                onChangeText={confirmPassword => {
                  setConfirmPassword(confirmPassword.trim());
                  if (password === confirmPassword) {
                    setIsConfirmPasswordShowErrorMessage(false);
                  } else {
                    setIsConfirmPasswordShowErrorMessage(true);
                  }
                }}
                value={confirmPassword}
                passRef={confirmPasswordInput}
              />
            </View>
            {/*Accept checkBoxContainer container*/}
            <View style={styles.acceptCheckBoxContainer}>
              <TouchableOpacity
                onPress={() => setIsAccept(!isAccept)}
                activeOpacity={0.6}>
                <Image
                  source={
                    isAccept
                      ? Assets.signup.squareFilled
                      : Assets.signup.squareWithoutFilled
                  }
                />
              </TouchableOpacity>
              <View style={styles.acceptTitleContainer}>
                <Text>{Strings.signup.iAccept}</Text>
              </View>
              <TouchableOpacity
                style={[styles.onPressTNC, {marginLeft: 3}]}
                onPress={() =>
                  props.navigation.navigate('StaticContents', {
                    isFromScreen: Strings.staticContents?.termsOfUse,
                  })
                }
                activeOpacity={0.6}>
                <Text style={styles.tNCTitle}>
                  {Strings.login.termsNConditions}
                </Text>
              </TouchableOpacity>
              <View style={styles.andTitleContainer}>
                <Text style={styles.tNCTitle}>{Strings.signup.andIcon}</Text>
              </View>
              <TouchableOpacity
                style={styles.onPressTNC}
                onPress={() => props.navigation.navigate('StaticContents')}
                activeOpacity={0.6}>
                <Text style={styles.tNCTitle}>
                  {Strings.login.privacyPolicy}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/*Footer component container*/}
          <ImageBackground
            source={Assets.onboarding.footerBg}
            style={styles.footerContainer}>
            {/* <View></View> */}
            <View>
              {isAccept ? (
                <AppButton
                  onPress={() => singupMethod()}
                  icon={Assets.signup.register}
                />
              ) : (
                <View style={[styles.onPressResend]}>
                  <Text style={styles.onPressResendTxt}>
                    {Strings.login.register}
                  </Text>
                </View>
              )}
              <View style={styles.alreadyAccountNlLoginTitleContainer}>
                <Text style={styles.alreadyAccountTitle}>
                  {Strings.signup.alreadyHaveAnAccount}
                </Text>
                <TouchableOpacity
                  style={styles.onPressLogin}
                  onPress={() => props.navigation.goBack()}
                  activeOpacity={0.6}>
                  <Text style={styles.loginTitle}>{Strings.login.login}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </KeyboardAwareScrollView>
      </View>
      {isCountryCodeModalVisible && (
        <CountryCodeModal
          modalVisible={isCountryCodeModalVisible}
          countryCodeData={Strings.signup.countryId.countryCodeData}
          onPressSelectCountryCode={selcetCountryCodeMethod}
          onpressCross={()=>setIsCountryCodeModalVisible(false)}
        />
      )}
      {isLoaderVisible && <Loader />}
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 9,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flex: 1,
  },
  keyboardAwareScroll: {
    flex: 8,
  },
  fieldContainer: {
    height: GlobalStyle.size.height / 7.5,
  },
  fieldContainer1: {
    paddingTop: 15,
  },
  topFieldsContainer: {
    paddingHorizontal: 20,
  },
  middleFieldsContainer: {
    backgroundColor: Colors.nonaColor,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: GlobalStyle.size.height / 25,
    marginTop: GlobalStyle.size.height / 70,
  },

  bottomFieldsContainer: {
    padding: 20,
  },
  acceptCheckBoxContainer: {
    height: GlobalStyle.size.height / 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 25,
  },
  acceptTitleContainer: {
    paddingLeft: 10,
  },
  onPressTNC: {
    borderBottomWidth: 0.5,
    borderColor: Colors.textColor.tertiary,
  },
  tNCTitle: {
    color: Colors.textColor.tertiary,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Light,
  },
  andTitleContainer: {
    paddingHorizontal: 3,
  },
  alreadyAccountNlLoginTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  alreadyAccountTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.black,
  },
  onPressLogin: {
    borderBottomWidth: 0.5,
    borderColor: Colors.textColor.tertiary,
    marginLeft: 5,
  },
  loginTitle: {
    color: Colors.textColor.tertiary,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
  },
  createAccountNPleaseFillTheFormContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: GlobalStyle.size.height / 5,
  },
  createAccountTxt: {
    fontSize: 26,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
  },
  pleaseFillTheFormTxt: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.textColor.secondary,
  },
  footerContainer: {
    height:GlobalStyle.size.height/3.55,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  onPressResend: {
    borderRadius: 30,
    borderWidth: 1.5,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.textColor.secondary,
    width: GlobalStyle.size.width / 1.09,
  },
  onPressResendTxt: {
    fontSize: 18,
    fontFamily: Fonts.SFCompactDisplay.Bold,
    color: Colors.textColor.secondary,
  },
  onPressCancel: {
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
  },
});


