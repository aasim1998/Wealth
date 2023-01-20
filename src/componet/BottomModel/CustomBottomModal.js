import React from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {Colors, Assets, Strings, GlobalStyle, Fonts} from '../../res/index';
import {AppButton} from '../../componet/index';

const CustomBottomModal = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onPressClose}>
      <View style={styles.centeredView1}>
       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{alignItems: 'flex-end', paddingHorizontal: 10}}
            onPress={props.crossButton}>
            <Image
              source={Assets.wallet.cross}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          <>
            <Text style={styles.topText1}>{props.TopText}</Text>
            <Text style={styles.topText2}>{props.topDescText}</Text>
          </>

          <View style={styles.enterAmount}>
            <Text style={styles.label}>Enter amount</Text>
            <TextInput
              style={styles.textInput}
              placeholder="$1000"
              color="black"
              keyboardType= 'decimal-pad'
              {...props}
            />
            {
              props.isError && (
                <Text style={styles.text}>{props.errorMessage}</Text>
              )
            }
          </View>
          <View style={styles.submitButton}>
            <AppButton
              onPress={props.submitButton}
              icon={Assets.wallet.continue}
            />
          </View>
        </View>
     </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CustomBottomModal;

const styles = StyleSheet.create({
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    height: GlobalStyle.size.height / 2.4,
    backgroundColor: Colors.bgColor.primaryColor,
    borderTopLeftRadius: GlobalStyle.size.width / 15,
    borderTopRightRadius: GlobalStyle.size.width / 15,
    shadowColor: '#3de45c',
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 5,
    paddingHorizontal: GlobalStyle.size.width / 10,
    justifyContent: 'center',
  },
  topText1: {
    fontSize: 20,
    color: '#172224',
    fontFamily: 'Butler-Bold',
  },
  topText2: {
    fontSize: 13,
    color: '#8B8B8B',
  },
  enterAmount: {
    marginVertical: GlobalStyle.size.height / 30,
  },
  label: {
    fontSize: 14,
    color: '#172224',
  },
  textInput: {
    marginTop: GlobalStyle.size.width / 30,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  submitButton: {
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 15,
  },
  text:{
    color:Colors.pentaColor,
    fontSize:14
  }
});
