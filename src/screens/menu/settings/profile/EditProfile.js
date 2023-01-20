import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';
import {
  Loader,
  Header,
  CustomTextInput,
  AppButton,
  SelectImageModal,
} from '../../../../componet/index';
import {
  Colors,
  Assets,
  Strings,
  Fonts,
  GlobalStyle,
  URL,
  Constants,
} from '../../../../res/index';
import { NetworkManager, Utility } from '../../../../utils/index';

/**
 * @description:This is profile screen
 * @author:Vibhishan
 * @created_on:03/06/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_on:14/07/2021
 */

const EditProfile = props => {
  const [isLoaderVisible, setIsLoaderVisible] = React.useState(false);
  const [profileImageURL, setProfileImageURL] = React.useState(
    props?.route?.params?.profilePassData?.profile_image,
  );
  const [firstName, setFirstName] = React.useState(
    props?.route?.params?.profilePassData?.first_name,
  );
  const [lastName, setLastName] = React.useState(
    props?.route?.params?.profilePassData?.last_name,
  );
  const [PaypalEmail, setPaypalEmail] = React.useState(
    props?.route?.params?.profilePassData?.paypal,
  );
  const [isSelectImageModalVisible, setIsSelectImageModalVisible] =
    React.useState(false);

  const [isFirstNameShowErrorMessage, setIsFirstNameShowErrorMessage] =
    React.useState(false);
  const [isLastNameShowErrorMessage, setIsLastNameShowErrorMessage] =
    React.useState(false);
  const [PaypalEmailErrorMessage, setPaypalEmailErrorMessage] =
    React.useState(false);

  const { email, country_id, flag, mobile, short_Name, mobile_verified } =
    props?.route?.params?.profilePassData;

  const firstNameInput = useRef(null);
  const lastNameInput = useRef(null);
  const paypalInput = useRef(null);
  console.log(flag)

  //Go back method
  const goBackMethod = () => {
    props.navigation.goBack();
  };

  //Upadte profile method
  const updateProfileMethod = async () => {
    const updateProfileParameters = {
      firstName: firstName,
      lastName: lastName,
      paypalEmailId: PaypalEmail,
      avatar: profileImageURL !== null ? profileImageURL : '',
    };
    if (firstName !== '') {
      setIsFirstNameShowErrorMessage(false);
      if (lastName !== '') {
        setIsLastNameShowErrorMessage(false);
        if (PaypalEmail !== '') {
          setPaypalEmailErrorMessage(false);
          setIsLoaderVisible(true);
          const response = await NetworkManager.fetchRequest(
            URL.END_POINT.update_profile,
            URL.REQUEST_TYPE.putRequest,
            updateProfileParameters,
          );
          setIsLoaderVisible(false);
          if (response.code == 200) {
            Utility._storeData(
              Constants.storage_keys.USER_PROFILE,
              response?.data?.profile,
            );
            Utility._storeData(
              Constants.storage_keys.USER_TOKEN,
              response?.data?.token,
            );
            Utility._showToast(response.message);
            props.navigation.goBack();
          } else {
            Utility._showToast(response.message);
          }
        } else {
          setPaypalEmailErrorMessage(true);
          paypalInput.current.focus();
        }
      } else {
        setIsLastNameShowErrorMessage(true);
        lastNameInput.current.focus();
      }
    } else {
      setIsFirstNameShowErrorMessage(true);
      firstNameInput.current.focus();
    }
  };

  //UploadImageOnS3 method
  const uploadImageOnS3Method = () => {
    setIsSelectImageModalVisible(true);
  };

  //Take photo method
  const takePhotoMethod = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      compressImageQuality: 0.2,
      cropping: true,
    }).then(response => {
      if (response.size < 5242880) {
        console.log(response);
        setIsSelectImageModalVisible(false);
        const file = {
          uri: response?.path,
          name: Date.now(),
          type: 'image/png',
        };
        const options = {
          keyPrefix: Constants.devS3Bucket.keyPrefix,
          bucket: Constants.devS3Bucket.bucket,
          region: 'us-east-1',
          accessKey: Constants.devS3Bucket.accessKey,
          secretKey: Constants.devS3Bucket.secretKey,
          successActionStatus: 200,
        };
        setIsLoaderVisible(true);
        RNS3.put(file, options)
          .then(response => {
            console.log('response:-', response)
            setProfileImageURL(null);
            setIsLoaderVisible(false);
            if (response?.status === 200) {
              setProfileImageURL(response?.headers?.Location);
            } else {
              Utility._showToast(
                Strings.fieldValidationErrorMessage.imageNotUploadedOnS3,
              );
            }
          })
          .catch(error => {
            console.log('S3 bucket error', error);
            setIsSelectImageModalVisible(false);
          });
      } else {
        Utility._showToast(
          'Clicked image size is grater than 5 MB please reset your resolution and try again',
        );
      }
    });
  };

  //Choose from gallery method
  const chooseFromGalleryMethod = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      compressImageQuality: 0.2,
      cropping: true,
    })
      .catch(err => console.log(err))
      .then(response => {
        if (response.size < 5242880) {
          console.log(response.size);
          setIsSelectImageModalVisible(false);
          const file = {
            uri: response?.path,
            name: Date.now(),
            type: 'image/png',
          };
          const options = {
            keyPrefix: Constants.devS3Bucket.keyPrefix,
            bucket: Constants.devS3Bucket.bucket,
            region: 'us-east-1',
            accessKey: Constants.devS3Bucket.accessKey,
            secretKey: Constants.devS3Bucket.secretKey,
            successActionStatus: 200,
          };
          setIsLoaderVisible(true);
          RNS3.put(file, options)
            .then(response => {
              setProfileImageURL(null);
              setIsLoaderVisible(false);
              if (response?.status === 200) {
                setProfileImageURL(response?.headers?.location);
              } else {
                Utility._showToast(
                  Strings.fieldValidationErrorMessage.imageNotUploadedOnS3,
                );
              }
            })
            .catch(error => {
              console.log('S3 bucket error', error);
              setIsSelectImageModalVisible(false);
            });
        } else {
          Utility._showToast('please select less than 5 MB');
        }
      });
  };

  //Cancel method
  const cancelMethod = () => {
    setIsSelectImageModalVisible(false);
  };

  //Mobile otp
  const mobileOtpMethod = () => {
    props.navigation.navigate('VerifyMobile', { mobileNo: mobile });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          onPressLeftIcon={Assets.settings.whiteBackArrow}
          onPressLeft={goBackMethod}
          headerTitle={Strings.profile.editProfile}
        />
      </View>
      <View style={styles.keyboardAwareScroll}>
        <KeyboardAwareScrollView
          style={styles.keyboardAwareScroll}
          bounces={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            style={styles.topComponentContainer}
            source={Assets.splash.bgFooter}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImgContainer}>
                <View style={styles.profileImgCircle}>
                  {profileImageURL === null ? (
                    <View>
                      <Text style={styles.shortNameTitle}>{short_Name}</Text>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: profileImageURL }}
                      style={styles.profileImg}
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={uploadImageOnS3Method}
                  style={styles.addPictureContainer}>
                  <Text style={styles.addPictureTxt}>
                    {Strings.profile.changePicture}
                  </Text>
                </TouchableOpacity>
                <View style={styles.maximumUploadFileSizeTxtContainer}>
                  <Text style={styles.maximumUploadFileSizeTxt}>
                    {Strings.profile.maximumUploadFileSize}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.fieldsContainer}>
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.firstName}
                hideButton={false}
                editable={true}
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
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.lastName}
                hideButton={false}
                editable={true}
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
            <View style={styles.fieldContainer}>
              <CustomTextInput
                topPlaceholder={Strings.signup.paypalEmailWithStar}
                hideButton={false}
                editable={true}
                validationErrorMessageShow={PaypalEmailErrorMessage}
                validationErrorMessage="please Enter paypal email"
                onChangeText={lastName => {
                  setPaypalEmail(lastName.trim());
                  if (lastName !== '') {
                    setPaypalEmailErrorMessage(false);
                  } else {
                    setPaypalEmailErrorMessage(true);
                  }
                }}
                value={PaypalEmail}
                passRef={paypalInput}
              />
            </View>
            <View style={styles.fieldContainer}>
              <CustomTextInput
                isFromEdit={true}
                topPlaceholder={Strings.login.emailAddress}
                maxLength={100}
                hideButton={false}
                editable={false}
                isEditButton={true}
                txtColor={Colors.tertiary}
                value={email?.toLowerCase()}
              />
            </View>
            <View style={styles.fieldContainer}>
              <CustomTextInput
                disabled={true}
                isFromEdit={true}
                topPlaceholder={Strings.signup.mobileNumberWithStar}
                hideButton={false}
                editable={true}
                isEditButton={true}
                txtColor={Colors.tertiary}
                countryCodeTxtColor={Colors.tertiary}
                tintColor={Colors.tertiary}
                isVerifeidMobile={mobile_verified == 1 ? true : false}
                onPressMobileVerification={() => mobileOtpMethod()}
                validationErrorMessageShow={false}
                validationErrorMessage={Strings.login.pleaseEnterAValidEmail}
                isCountryCode={true}
                countryFlag={flag ? flag : '🇺🇸'}
                countryCode={country_id ? country_id : '+1'}
                value={mobile}
              />
            </View>
            <View style={styles.buttonContainer}>
              <AppButton
                onPress={() => updateProfileMethod()}
                icon={Assets.profile.saveButton}
              />
              <View style={styles.cancelContainer}>
                <TouchableOpacity
                  onPress={() => props.navigation.goBack()}
                  style={styles.onPressCancel}
                  activeOpacity={0.6}>
                  <Text style={styles.cancelTxt}>{Strings.otp.cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      {isLoaderVisible && <Loader />}
      {isSelectImageModalVisible && (
        <SelectImageModal
          modalVisible={isSelectImageModalVisible}
          onPressTakePhoto={() => takePhotoMethod()}
          onPressChooseFromGallery={() => chooseFromGalleryMethod()}
          onPressCancel={() => cancelMethod()}
        />
      )}
    </View>
  );
};

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
  topComponentContainer: {
    height: GlobalStyle.size.height / 2.5,
    paddingHorizontal: 20,
  },
  shortNameTitle: {
    fontSize: 70,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.primaryColor,
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: GlobalStyle.size.height / 15,
    justifyContent: 'center',
  },
  profileImgCircle: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderColor: 'white',
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  addPictureContainer: {
    alignItems: 'center',
    paddingTop: 11,
    marginHorizontal: 38,
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
  },
  addPictureTxt: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Medium,
    color: Colors.textColor.tertiary,
  },
  profileImgContainer: {
    alignItems: 'center',
  },
  maximumUploadFileSizeTxtContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  maximumUploadFileSizeTxt: {
    fontSize: 11,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.tertiary,
  },
  fieldContainer: {
    height: GlobalStyle.size.height / 8.1,
    width: '90%',
  },
  fieldsContainer: {
    alignItems: 'center',
    paddingVertical: 0,
    marginTop: -GlobalStyle.size.height / 30,
  },
  buttonContainer: {
    paddingVertical: GlobalStyle.size.height / 30,
  },
  cancelContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelTxt: {
    color: Colors.textColor.tertiary,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
  },
  onPressCancel: {
    borderBottomWidth: 1,
    borderColor: Colors.textColor.tertiary,
  },
});

export default EditProfile;
