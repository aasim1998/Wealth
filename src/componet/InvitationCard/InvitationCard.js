import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CountDown} from 'react-native-customizable-countdown';
import {Assets, Colors, Fonts, GlobalStyle, Strings} from '../../res/index';

const InvitationCard = (props) => {

  const {item} = props
  return (
    <View style={[styles.card, {marginTop: 3}]}>
      <View style={styles.groupInvitationNTitleContainer}>
        <View style={styles.topView}>
          <Text numberOfLines={2} style={styles.groupInvitationTitle}>
            {Strings.home.groupInvitation.groupInvitation}
          </Text>
          <Text style={styles.title}>{item?.title}</Text>
        </View>

        {item?.status != 'Expired' && (
          <View style={styles.viewDetails}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(
                  'CreateAFundGroupNDetailsRaisingRequest',
                  {
                    group_code: item?.group_code,
                    isFromGroupDetails: true,
                    isForInvitation: true,
                    group_id: item?.group_id,
                  },
                )
              }>
              <Text style={styles.viewDetailsTitle}>
                {Strings.home.groupInvitation.viewDetails}
              </Text>
              <View style={styles.viewDetailsUnderLine} />
            </TouchableOpacity>
            <View
              style={{
                marginTop: GlobalStyle.size.height / 80,
                flexWrap: 'wrap',
              }}>
              <CountDown
                ref={ref => (this.myRef = ref)}
                initialSeconds={item?.members[1]?.invite_expires_in}
                onTimeOut={() => {}}
                digitFontSize={15}
                width={GlobalStyle.size.width / 4}
                height={GlobalStyle.size.height / 40}
                gap={1}
                showSeparator={true}
                separatorStyle={{
                  color: '#0a0a0a',
                  fontSize: 12,
                }}
              />
            </View>
          </View>
        )}
      </View>
      {item.status != 'Expired' && (
        <>
          <View style={styles.interestAndCommission}>
            <View style={styles.ComIntArea}>
              <Image
                resizeMode="contain"
                source={
                  item.interest == '1'
                    ? Assets.signup.squareFilled
                    : Assets.signup.squareWithoutFilled
                }
              />
              <Text style={styles.ComIntText}>
                {Strings.home.groupInvitation.interest}
              </Text>
            </View>
            <View style={styles.ComIntArea}>
              <Image
                resizeMode="contain"
                source={
                  item.commission == '1'
                    ? Assets.signup.squareFilled
                    : Assets.signup.squareWithoutFilled
                }
              />
              <Text style={styles.ComIntText}>
                {Strings.home.groupInvitation.comission}
              </Text>
            </View>
          </View>
          <Text numberOfLines={1} style={styles.descText}>
            {Strings.home.groupInvitation.invitationDesc}
          </Text>
        </>
      )}

      <View style={styles.acceptNRejectButtonContainer}>
        {item.status == 'Expired' ? (
          <Text
            style={[
              styles.acceptTitle,
              {color: Colors.pentaColor, fontSize: 16},
            ]}>
            {`${'Group Invitation'} ${item.status}`}
          </Text>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => props.accept(item?.group_code, 1)}
              style={[styles.acceptButton]}>
              <Text style={styles.acceptTitle}>
                {Strings.home.groupInvitation.accept}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.reject(item?.group_code, 2)}
              style={[styles.acceptButton, {borderColor: Colors.pentaColor}]}>
              <Text style={[styles.acceptTitle, {color: Colors.pentaColor}]}>
                {Strings.home.groupInvitation.reject}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Image
        source={Assets.home.groupStrip}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -0.3,
          tintColor:
            item.status == 'Expired'
              ? Colors.pentaColor
              : Colors.borderColor.tertiaryColor,
          width: '110%',
        }}
      />
    </View>
  );
};

export default InvitationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    paddingHorizontal: 15.8,
    paddingTop: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
    marginBottom: GlobalStyle.size.height / 100,
    marginHorizontal: 20,
    borderRightColor: Colors.white,
    borderLeftColor: Colors.white,
    borderTopColor: Colors.white,
    borderBottomColor: Colors.septaColor,
    borderWidth: 0,
  },
  groupInvitationNTitleContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  topView: {
    width: '60%',
  },
  groupInvitationTitle: {
    fontSize: 20,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
  },
  acceptButton: {
    borderWidth: 1,
    borderRadius: GlobalStyle.size.height / 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.septaColor,
    width: '45%',
    height: GlobalStyle.size.height / 20,
  },
  acceptTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.SemiBold,
    color: Colors.primaryColor,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.Butler.Bold,
    color: Colors.secondaryColor,
    paddingVertical: GlobalStyle.size.height / 150,
  },
  viewDetails: {
    alignItems: 'center',
    width: '31.5%',
  },
  viewDetailsTitle: {
    textDecorationLine: 'underline',
    borderColor: Colors.textColor.tertiary,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.textColor.tertiary,
  },

  interestAndCommission: {
    marginTop: GlobalStyle.size.height / 50,
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'space-between',
  },
  ComIntText: {
    fontSize: 15,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    paddingHorizontal: GlobalStyle.size.height / 45,
  },
  descText: {
    marginTop: GlobalStyle.size.height / 30,
    paddingLeft: GlobalStyle.size.height / 100,
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Regular,
  },
  ComIntArea: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    marginRight:'6%'
  },
  acceptNRejectButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: GlobalStyle.size.height / 25,
    paddingBottom: GlobalStyle.size.height / 40,
  },
});
