import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import {
  Colors,
  Assets,
  Strings,
  Fonts,
  GlobalStyle,
  URL,
  Constants,
} from '../../res/index';

import {QMarkInfoModal} from '../index';

const CommissionInterest = props => {
  const max_value = +props?.commission?.max;
  const min_value = +props?.commission?.min;
  const com_Value = props?.commissionValue;
  if (com_Value < min_value || com_Value > max_value) {
    console.log('err');
  }

  const [commissionDesc, setCommissionDesc] = useState(false);
  const [InterestDesc, setInterestDesc] = useState(false);
  const [ShowError, setShowError] = useState(false);

  const closeQMarkInfoModalMethod = () => {
    setCommissionDesc(false);
    setInterestDesc(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.CIContainer}>
        <View style={styles.commission}>
          <TouchableOpacity
            onPress={props.commissionHandler}
            disabled={!props.isFromCreateGroup}>
            <Image
              source={
                props.commissions
                  ? Assets.signup.squareFilled
                  : Assets.signup.squareWithoutFilled
              }
            />
          </TouchableOpacity>

          <Text style={styles.CItext}>Commission</Text>
          <TouchableOpacity
            onPress={() => setCommissionDesc(true)}
            style={styles.onPressQmark}>
            <Image
              source={
                commissionDesc
                  ? Assets.createFundGroup.qMarkColored
                  : Assets.createFundGroup.qMark
              }
            />
          </TouchableOpacity>
        </View>
        {/* commission and interest field  */}

        <View>
          <View style={styles.commission}>
            <TouchableOpacity
              onPress={props.setInterest}
              disabled={!props.isFromCreateGroup || props.disableInterset}>
              <Image
                source={
                  props.Interest
                    ? Assets.signup.squareFilled
                    : Assets.signup.squareWithoutFilled
                }
              />
            </TouchableOpacity>
            <Text style={styles.CItext}>Interest</Text>
            <TouchableOpacity onPress={() => setInterestDesc(true)}>
              <Image
                source={
                  InterestDesc
                    ? Assets.createFundGroup.qMarkColored
                    : Assets.createFundGroup.qMark
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* COMISSION */}

      {props.commissions && (
        <View style={styles.containerCom}>
          <Text style={styles.commissionText}>Commission</Text>
          <View style={styles.input}>
          <TextInput
            style={styles.commissionContainer}
            ref={props.commissionRef}
            value={props.commissionValue}
            onChangeText={props.onchangeCommission}
            keyboardType="numeric"
            // placeholder="Enter Commission"
            maxLength={6}
            onBlur={() => setShowError(false)}
            onFocus={() => setShowError(true)}
            editable={!props.disabled}
            color="black"
            {...props}
          />
          <Text style={styles.percentageText}>%</Text>
          </View>
          <View style={styles.line}/>

          {com_Value <= min_value || com_Value >= max_value ? (
            <View style={styles.validationErrorMessageContainer}>
              {ShowError === true && (
                <Text style={styles.errorCommission}>
                  {Strings.fieldValidationErrorMessage.commissionError}{' '}
                  {min_value}% to {max_value}%
                </Text>
              )}
            </View>
          ) : null}
        </View>
      )}
      {(commissionDesc || InterestDesc) && (
        <QMarkInfoModal
          modalVisible={commissionDesc || InterestDesc}
          qMarkInfo={
            commissionDesc
              ? Strings.createFundGroup.commissionQMarkInfo
              : Strings.createFundGroup.InterestQMarkInfo
          }
          modalPosition={
            commissionDesc
              ? GlobalStyle.size.height / 2.5
              : GlobalStyle.size.height / 2.5
          }
          onPressClose={closeQMarkInfoModalMethod}
        />
      )}
    </View>
  );
};

export default CommissionInterest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  CIContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commission: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  CItext: {
    fontSize: 16,
    fontFamily: Fonts.SFCompactDisplay.Medium,
    padding: 8,
  },
  line:{
    height:1.2,
    backgroundColor:'#000',
    opacity:0.8
  },
  commissionText: {
    fontSize: 14,
    color: Colors.secondaryColor,
    fontFamily: Fonts.SFCompactDisplay.Bold,
  },
  input:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  commissionContainer: {
    height: GlobalStyle.size.height / 17,
    justifyContent: 'space-between',
    width:'10%',
    textAlign:'center'
  },
  percentageText:{
    fontSize:14,
    fontWeight:'bold',
    top:1.1,
    left:-3
  },
  textCmsn: {
    fontSize: 16,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    // paddingVertical: 10,
  },
  containerCom: {
    paddingHorizontal: 3,
    marginTop: 20,
  },
  validationErrorMessageContainer: {
    paddingVertical: 3,
    marginTop:3
  },
  errorCommission: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.pentaColor,
    lineHeight: 13,
  },
});
