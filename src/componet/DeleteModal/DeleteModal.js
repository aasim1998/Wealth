import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {Fonts, GlobalStyle, Strings, Colors, Assets} from '../../res/index';

const DeleteModal = props => {
  const {WithdrawScreen, insufficientAmount,groupCountModal} = props;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.AlertTitleTxt}>
              {WithdrawScreen
                ? Strings.settings.WithdrawModel.header
                : insufficientAmount
                ? Strings.settings.InAmount.header
                : groupCountModal 
                ? Strings.home.groupCountModal.header
                :Strings.settings.DelModel.header
              
                }
            </Text>
            <View style={styles.AlertDelContainer}>
              <Text
                style={[
                  styles.alertDescription,
                  WithdrawScreen
                    ? {marginHorizontal: GlobalStyle.size.width / 40}
                    : null,
                ]}>
                {WithdrawScreen
                  ? Strings.settings.WithdrawModel.desc1
                  : insufficientAmount
                  ? Strings.settings.InAmount.desc1
                  : groupCountModal
                  ? Strings.home.groupCountModal.desc1
                  : Strings.settings.DelModel.desc1}
              </Text>
              <Text style={styles.alertDescription}>
                {WithdrawScreen
                  ? ''
                  : insufficientAmount
                  ? Strings.settings.InAmount.desc2
                  : groupCountModal
                  ? Strings.home.groupCountModal.desc2
                  : Strings.settings.DelModel.desc2}
              </Text>
            </View>
            <TouchableOpacity
              onPress={props.onPressYes}
              style={styles.onPressButton}>
              <Image
                source={
                  WithdrawScreen
                    ? Assets.settings.AddPaypal
                    : insufficientAmount
                    ? Assets.settings.AddFunds
                    : groupCountModal
                    ? Assets.succesModel.successContinue
                    : Assets.settings.delModalBtn
                }
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.cancelContainer}>
              <TouchableOpacity
                onPress={props.onPressCancel}
                style={styles.onPressCancel}
                activeOpacity={0.6}>
                <Text style={styles.cancelTxt}>{Strings.otp.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position:'relative',
    height:GlobalStyle.size.height,
    width:GlobalStyle.size.width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444444b3',
  },
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successTitleContainer: {
    paddingTop: 15,
  },
  AlertTitleTxt: {
    fontSize: 26,
    fontFamily: Fonts.Butler.Bold,
  },
  AlertDelContainer: {
    paddingTop: 19,
  },
  alertDescription: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.textColor.secondary,
  },
  onPressButton: {
    paddingTop: 41,
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

export default DeleteModal;
