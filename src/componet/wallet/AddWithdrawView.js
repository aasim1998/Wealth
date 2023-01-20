import React from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const AddWithdrawView = props => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={props.selectIcon}>
          <Image
            source={props.sourceImage}
            resizeMode="contain"
            style={{paddingHorizontal: 30}}
          />
        </TouchableOpacity>
        <Image source={props.source2} resizeMode="contain" />
      </View>
    </View>
  );
};

export default AddWithdrawView;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
