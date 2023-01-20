import React, {useRef, useState, useEffect} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';

import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import {
  AppButton,
  Loader,
  Header,
  CustomTextInput,
  CyclePeriodComponent,
  PaymentTypeComponent,
  AddGroupMemberComponent,
  CountryCodeModal,
  SuccessModal,
  SuccessScreenComponent,
  AddMemberModal,
  QMarkInfoModal,
  CommissionInterest,
} from '../../componet/index';
import {
  Colors,
  Assets,
  Strings,
  Fonts,
  GlobalStyle,
  URL,
  Constants,
} from '../../res/index';
import {NetworkManager, Utility} from '../../utils/index';

/**
 * @description:This is create group fund raising and fund group details screen
 * @author:Raj Gaurav
 * @created_on:10/06/2021
 * @param:
 * @return:
 * @modified_by:Raj Gaurav
 * @modified_on:30/11/2021
 */

const CreateAFundGroupNDetailsNFundRaisingRequestScreen = props => {
  // console.log(JSON.stringify(props.route.params.data, null, 2));

  const {title,
     description,
      recurrance_type,
       amount,currency,
       coordinated_by_me,
       coordinator,
       members,member_count} = props.route.params.data;
  
      //  console.log(">><<<<",JSON.stringify(members,null,2))

  const IncomingRecurence =
    recurrance_type.charAt(0).toUpperCase() + recurrance_type.slice(1);

  const [groupTitle, setGroupTitle] = useState(title);
  const [isGroupTitleInfo, setIsGroupTitleInfo] = useState(false);
  const [isShowGroupTitleError, setIsShowGroupTitleError] = useState(false);
  const [isGroupDescriptionInfo, setIsGroupDescriptionInfo] = useState(false);
  const [isShowGroupDescriptionError, setIsShowGroupDescriptionError] =
    useState(false);
  const [isCheckBox, setIsCheckBox] = useState();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [isSuccessScreenVisible, setIsSuccessScreenVisible] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [isCountryCodeModalVisible, setIsCountryCodeModalVisible] =
    useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [
    isConfirmSendingRequestNConfirmModalVisible,
    setIsConfirmSendingRequestNConfirmModalVisible,
  ] = useState(false);

  const [isCyclePeriodInfo, setIsCyclePeriodInfo] = useState(false);
  const [isAmountToBePaid, setIsAmountToBePaid] = useState(false);
  const [isActivePeriodInfo, setIsActivePeriodInfo] = useState(false);
  const [isCyclePeriodShowStartDateError, setIsCyclePeriodShowStartDateError] =
    useState(false);
  const [
    isCyclePeriodShowFinishDateError,
    setIsCyclePeriodShowFinishDateError,
  ] = useState(false);
  const [isCurrencyShowError, setIsCurrencyShowError] = useState(false);
  const [isDueDayShowError, setIsDueDayShowError] = useState(false);
  const [isDueDateShowError, setIsDueDateShowError] = useState(false);
  const [isDeadLineDayShowError, setIsDeadLineDayShowError] = useState(false);
  const [isDeadLineDateShowError, setIsDeadLineDateShowError] = useState(false);
  const [isNumberOfMemberShowError, setIsNumberOfMemberShowError] =
    useState(false);
  const [isRecurrenceTypeShowError, setIsRecurrenceTypeShowError] =
    useState(false);
  const [isGroupMemberShowError, setIsGroupMemberShowError] = useState(false);
  const [isAlreadyAddedMobileNoShowError, setIsAlreadyAddedMobileNoShowError] =
    useState(false);
  const [isShowRandom, setIsShowRandom] = useState(true);
  const [isCountryCode, setIsCountryCode] = useState(false);
  const [isCurrency, setIsCurrency] = useState(false);
  const [isAmountToBePaidShowError, setIsAmountToBePaidShowError] =
    useState(false);
  const [
    isActivePeriodStartDateShowError,
    setIsActivePeriodStartDateShowError,
  ] = useState(false);
  const [
    isActivePeriodFinishDateShowError,
    setIsActivePeriodFinishDateShowError,
  ] = useState(false);
  const [isDueDay, setIsDueDay] = useState(false);
  const [isDeadLineDay, setIsDeadLineDay] = useState(false);
  const [isCyclePeriodStartDate, setIsCyclePeriodStartDate] = useState(false);
  const [isCyclePeriodFinishDate, setIsCyclePeriodFinishDate] = useState(false);
  const [isActivePeriodStartDate, setIsActivePeriodStartDate] = useState(false);
  const [isActivePeriodFinishDate, setIsActivePeriodFinishDate] =
    useState(false);
  const [groupDetails, setGroupDetails] = useState([]);
  const [isDueDate, setIsDueDate] = useState(false);
  const [countryId, setCountryId] = useState('+1');
  const [coordinatorCId, setCoordinatorCId] = useState('');
  const [countryFlag, setCountryFlag] = useState('🇺🇸');

  const [groupDescription, setGroupDescription] = useState(description);
  const [Currency, setCurrency] = useState(currency);
  const [amountToBePaid, setAmountToBePaid] = useState(amount);
  const [date, setDate] = useState(0);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserMobile, setCurrentUserMobile] = useState('');
  const [invitedUserMobile, setInvitedUserMobile] = useState('');

  const [dueDate, setDueDate] = useState('');
  const [deadLineDate, setDeadLineDate] = useState('');
  const [cycleStartDate, setCycleStartDate] = useState('');
  const [cycleFinishDate, setCycleFinishDate] = useState('');
  const [activeStartDate, setActiveStartDate] = useState('');

  const [recurenceType, setRecurenceType] = useState(IncomingRecurence);
  const [numberOfMember, setNumberOfMember] = useState(member_count);
  const [
    currentSequenceUnpaidMembersData,
    setCurrentSequenceUnpaidMembersData,
  ] = useState([]);
  const [unPaidMemberName, setUnPaidMemberName] = useState('');
  const [isUnpaidMemberModalVisible, setIsUnpaidMemberModalVisible] =
    useState(false);
  const [senderId, setSenderId] = useState('');
  const [activeDaysLeft, setActiveDaysLeft] = useState('');

  const [isExistingGroupUsers, setIsExistingGroupUsers] = useState(false);
  const [isFromPhoneContacts, setIsFromPhoneContacts] = useState(false);

  const [isRemove, setIsRemvoe] = useState(false);
  const [isRemoveInvitedUser, setIsRemoveInvitedUser] = useState(false);
  const [isCoordinated_by_me, setIsCoordinated_by_me] = useState(coordinated_by_me);
  const [isActivate, setIsActivate] = useState(false);
  const [indexForRestrictDay, setIndexForRestrictDay] = useState(0);
  const [isForDaySelection, setIsForDaySelection] = useState(false);

  const [memberData, setMemberData] = useState([]);
  const [expiryTime, setExpiryTime] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [invComData, setInvComData] = useState([]);
  const [Interest, setInterest] = useState(false);
  const [CommissionInput, setCommissionInput] = useState('');
  const [Commission, setCommission] = useState(false);
  const [ContiSequence, setContiSequence] = useState(false);

  const groupTitleInput = useRef(null);
  const groupDescriptionInput = useRef(null);
  const numberOfMembersInput = useRef(null);
  const commissionRef = useRef();

  const memmberObj = {};

  //Cycle period finish date on the basis of active period start date selection
  const activeFinishDateCalculated =
    recurenceType == 'Weekly'
      ? Utility._appDateFormat(
          Utility._calculatedNextDate(activeStartDate, numberOfMember * 7 - 1),
        )
      : recurenceType == 'Bi-weekly'
      ? Utility._appDateFormat(
          Utility._calculatedNextDate(activeStartDate, numberOfMember * 15 - 1),
        )
      : Utility._appDateFormat(
          Utility._calculatedNextDate(activeStartDate, numberOfMember * 30 - 1),
        );

  //Cycle period finish date as api parameters
  const activeFinishDateCalculatedAsApiParameter =
    recurenceType == 'Weekly'
      ? Utility._calculatedNextDate(
          Utility._apiParameterDateFormat(activeStartDate),
          numberOfMember * 7 - 1,
        )
      : recurenceType == 'Bi-weekly'
      ? Utility._calculatedNextDate(
          Utility._apiParameterDateFormat(activeStartDate),
          numberOfMember * 15 - 1,
        )
      : Utility._calculatedNextDate(
          Utility._apiParameterDateFormat(activeStartDate),
          numberOfMember * 30 - 1,
        );

  //Cycle period days difference
  var cyclePeriodDaysDifference = Utility._dateDifferenceCalculated(
    Utility._appDateFormat(cycleStartDate),
    Utility._appDateFormat(activeFinishDateCalculated),
  );
  var isValidCyclePeriod =
    cyclePeriodDaysDifference == 0
      ? cyclePeriodDaysDifference >= 14
      : !(cyclePeriodDaysDifference >= 14);

  //Active period and cycle period days difference
  var activeNCycleStartPeriodDaysDifference = Utility._dateDifferenceCalculated(
    Utility._appDateFormat(cycleStartDate),
    Utility._appDateFormat(activeStartDate),
  );
  var isValidActivePeriod = !(activeNCycleStartPeriodDaysDifference > 0);
  var isValidDeadLineDate =
    Utility._dayDifferenceCalculatedBasisOfDateNPaymentPeriodTypeSelection(
      new Date(activeStartDate),
      new Date(deadLineDate),
      recurenceType,
    ) &&
    !(Utility._appDateFormat(deadLineDate) <= Utility._appDateFormat(dueDate));
  var isActiveStartNDueDate =
    Utility._dayDifferenceCalculatedBasisOfDateNPaymentPeriodTypeSelection(
      new Date(activeStartDate),
      new Date(dueDate),
      recurenceType,
    );
  var isDueDateValid = !isActiveStartNDueDate;

  //Select date from date picker
  const onChange = (event, selectedDate) => {
    if (Platform.OS == 'android') {
      setIsDatePickerVisible(false);
      if (event.type == 'set') {
        setDate(selectedDate);
        if (isCyclePeriodStartDate) {
          setCycleStartDate(selectedDate);
          setIsCyclePeriodShowStartDateError(false);
        } else if (isActivePeriodStartDate) {
          setActiveStartDate(selectedDate);
          setIsActivePeriodStartDateShowError(false);
        } else if (isDueDate) {
          setDueDate(selectedDate);
          setIsDueDateShowError(false);
        } else {
          setDeadLineDate(selectedDate);
          setIsDeadLineDayShowError(false);
        }
      }
    }
    if (Platform.OS == 'ios') {
      setDate(selectedDate);
      if (isCyclePeriodStartDate) {
        setCycleStartDate(selectedDate);
        setIsCyclePeriodShowStartDateError(false);
      } else if (isActivePeriodStartDate) {
        setActiveStartDate(selectedDate);
        setIsActivePeriodStartDateShowError(false);
      } else if (isDueDate) {
        setDueDate(selectedDate);
        setIsDueDateShowError(false);
      } else {
        setDeadLineDate(selectedDate);
        setIsDeadLineDayShowError(false);
      }
    }
  };

  const datePickerCancel = () => {
    setIsDatePickerVisible(false);
  };

  const datePickerDone = () => {
    setIsDatePickerVisible(false);
  };

  //Goback Button method
  const goBackMethod = () => {
    props.navigation.goBack();
  };

  //Payment Type Checkbox Method
  const checkBoxMethod = title => {
    if (recurenceType != '') {
      setIsRecurrenceTypeShowError(false);
    }
    setDueDate('');
    setDeadLineDate('');
    setIsCheckBox(title);
    setRecurenceType(title);
    setIsRecurrenceTypeShowError(false);
  };

  //Create group method
  const createNEditGroupMethod = async () => {

    for(let updatedData of memberData){
      // console.log(">><<<<",JSON.stringify(updatedData,null,2))
      updatedData.is_accepted = false
      updatedData.status = ""
    }

    const createGroupParameters = {
      title: groupTitle,
      description: groupDescription,
      start_date: Utility._apiParameterDateFormat(cycleStartDate),
      end_date: activeFinishDateCalculatedAsApiParameter,
      active_start_date: Utility._apiParameterDateFormat(activeStartDate),
      active_end_date: activeFinishDateCalculatedAsApiParameter,
      due_date: Utility._apiParameterDateFormat(dueDate),
      deadline_date: Utility._apiParameterDateFormat(deadLineDate),
      currency: Currency,
      invite_expiry_hours: expiryTime,
      commission_rate: CommissionInput,
      interest_applicable: Interest,
      amount: amountToBePaid,
      recurrance_type:
        recurenceType == 'Weekly'
          ? 'weekly'
          : recurenceType == 'Bi-weekly'
          ? 'biweekly'
          : 'monthly',
      member_count: numberOfMember,
      members: memberData,
      random_order: isShowRandom == true ? 0 : 1,
    };
    // console.log("<>>>",createGroupParameters)
    if (groupTitle != '') {
      setIsShowGroupTitleError(false);
      if (groupDescription != '' && groupDescription.length >= 20) {
        setIsShowGroupDescriptionError(false);
        if (
          numberOfMember != '' &&
          numberOfMember > 1 &&
          numberOfMember <= 20
        ) {
          setIsNumberOfMemberShowError(false);
          if (recurenceType != '') {
            setIsRecurrenceTypeShowError(false);
            if (cycleStartDate != '') {
              setIsCyclePeriodShowStartDateError(false);
              if (Currency != '') {
                setIsCurrencyShowError(false);
                if (amountToBePaid != '' && amountToBePaid > 0) {
                  setIsAmountToBePaidShowError(false);
                  if (activeStartDate != '') {
                    setIsActivePeriodStartDateShowError(false);
                    if (dueDate != '') {
                      setIsDueDateShowError(false);
                      if (deadLineDate != '') {
                        setIsDeadLineDateShowError(false);
                        if (
                          numberOfMember != '' &&
                          numberOfMember > 1 &&
                          numberOfMember <= 20
                        ) {
                          setIsNumberOfMemberShowError(false);
                          if (memberData.length != 0 && memberData.length > 1) {
                            setIsGroupMemberShowError(false);
                            if (memberData.length == parseInt(numberOfMember)) {
                              setIsGroupMemberShowError(false);
                              if (isCountryCodeEnterEveryOne() == undefined) {
                                {
                                  /*Api call*/
                                }
                                setIsLoaderVisible(true);
                                const response =
                                  await NetworkManager.fetchRequest(
                                    URL.END_POINT.group,
                                    URL.REQUEST_TYPE.postRequest,
                                    createGroupParameters,
                                  );
                                
                                setIsLoaderVisible(false);
                                if (response.code == 200) {
                                  setIsSuccessScreenVisible(true);
                                } else {
                                  Utility._showToast(response.message);
                                }
                              } else {
                                Utility._showToast(
                                  Strings.createFundGroup
                                    .makeSureCountryCodeMustBeFilled,
                                );
                              }
                            } else {
                              setIsGroupMemberShowError(true);
                              Utility._showToast(
                                Strings.fieldValidationErrorMessage
                                  .numberOfMembersNAddedMembersMustBeEqual,
                              );
                            }
                          } else {
                            setIsGroupMemberShowError(true);
                            Utility._showToast(
                              Strings.fieldValidationErrorMessage
                                .numberOfMembersNAddedMembersMustBeEqual,
                            );
                          }
                        } else {
                          setIsNumberOfMemberShowError(true);
                          numberOfMembersInput.current.focus();
                        }
                      } else {
                        setIsDeadLineDateShowError(true);
                      }
                    } else {
                      setIsDueDateShowError(true);
                    }
                  } else {
                    setIsActivePeriodStartDateShowError(true);
                  }
                } else {
                  setIsAmountToBePaidShowError(true);
                }
              } else {
                setIsCurrencyShowError(true);
              }
            } else {
              setIsCyclePeriodShowStartDateError(true);
            }
          } else {
            setIsRecurrenceTypeShowError(true);
          }
        } else {
          setIsNumberOfMemberShowError(true);
          numberOfMembersInput.current.focus();
        }
      } else {
        setIsShowGroupDescriptionError(true);
        groupDescriptionInput.current.focus();
      }
    } else {
      setIsShowGroupTitleError(true);
      groupTitleInput.current.focus();
    }
  };

  //Remove group api calling method
  const removeGroupMethod = async () => {
    setIsLoaderVisible(true);
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.group}${'/'}${props?.route?.params?.group_code}`,
      URL.REQUEST_TYPE.deleteRequest,
    );
    setIsLoaderVisible(false);
    if (response.code == 200) {
      Utility._showToast(response.message);
      props.navigation.navigate('Home');
    } else {
      Utility._showToast(response.message);
    }
  };
  const seletctUnpaidMember = (name, sender_Id) => {
    setTimeout(() => {
      setIsConfirmSendingRequestNConfirmModalVisible(true);
    }, 10);
    setIsUnpaidMemberModalVisible(false);
    setIsCountryCodeModalVisible(false);
    setUnPaidMemberName(name);
    setSenderId(sender_Id);
  };

  //Close qMark info modal method
  const closeQMarkInfoModalMethod = () => {
    setIsGroupTitleInfo(false);
    setIsGroupDescriptionInfo(false);
    setIsCyclePeriodInfo(false);
    setIsActivePeriodInfo(false);
    setIsAmountToBePaid(false);
    setContiSequence(false);
  };

  //Show remove group modal
  const showActivateModal = () => {
    setIsRemvoe(false);
    setIsActivate(true);
    setIsRemoveInvitedUser(false);
    setIsSuccessModalVisible(true);
  };
  //Show remove group modal
  const showRemoveGroupModal = () => {
    setIsRemvoe(true);
    setIsActivate(false);
    setIsRemoveInvitedUser(false);
    setIsSuccessModalVisible(true);
  };

  //Select group method
  const selectDayMethod = (flag, c_id, selecDay, index) => {
    setIsCurrencyShowError(false);
    setIsCountryCodeModalVisible(false);
    if (isCountryCode) {
      setCountryFlag(flag);
      setCountryId(c_id);
      setTimeout(() => {
        setIsAddMemberModalVisible(true);
      }, 10);
    } else {
      setCurrency(selecDay);
    }
  };

  //Existing Group Users Method
  const existingGroupUsersMethod = () => {
    if (memberData.length != 0 && memberData?.length >= 1) {
      setIsGroupMemberShowError(false);
    }
    setIsExistingGroupUsers(true);
    setIsFromPhoneContacts(false);
    setIsAddMemberModalVisible(true);
  };

  //Check Wheter country code is enter while selecting member via phone contacts
  const isCountryCodeEnterEveryOne = () => {
    for (let member of memberData) {
      if (member.country_id == undefined || member?.country_id == '') {
        return false;
      }
    }
  };

  //Existing Group Users Method
  const phoneContactMethod = () => {
    if (memberData.length != 0 && memberData?.length >= 1) {
      setIsGroupMemberShowError(false);
    }
    setIsAddMemberModalVisible(true);
    setIsExistingGroupUsers(false);
    setIsFromPhoneContacts(true);
  };

  //Existing Group Users Method
  const memberNumberMethod = () => {
    if (memberData.length != 0 && memberData?.length >= 1) {
      setIsGroupMemberShowError(false);
    }
    setIsAddMemberModalVisible(true);
    setIsExistingGroupUsers(false);
    setIsFromPhoneContacts(false);
  };

  //Add method
  const addMethod = (c_Id, mobile, firstName, lastName, country_Flag) => {
    if (memberData.length < parseInt(numberOfMember)) {
      if (
        memberData.filter(mobileNo => {
          return mobileNo.mobile === mobile;
        }).length === 0 &&
        memberData.length <= 19
      ) {
        setIsAddMemberModalVisible(false);
        setIsAlreadyAddedMobileNoShowError(false);
        memmberObj['country_id'] = c_Id;
        memmberObj['mobile'] = mobile;
        memmberObj['first_name'] = firstName;
        memmberObj['last_name'] = lastName;
        memmberObj['flag'] = country_Flag;
        memberData.push({...memmberObj});
      } else {
        if (memberData.length <= 19) {
          setIsAlreadyAddedMobileNoShowError(true);
        } else {
          setIsAddMemberModalVisible(false);
        }
      }
    } else {
      setIsAlreadyAddedMobileNoShowError(false);
      Utility._showToast(
        Strings.fieldValidationErrorMessage.youCannotAddMoreMembers,
      );
    }
  };

  const setCountryMethod = (flag, c_id, mobile) => {
    for (let member_Data of memberData) {
      if (member_Data?.mobile == mobile) {
        member_Data.country_id = c_id;
        member_Data.flag = flag;
      }
    }
  };

  //Remove member method
  const removeMemberMethod = mobile => {
    setMemberData(
      memberData.filter(data => {
        return data.mobile !== mobile;
      }),
    );
    setIsRemvoe(false);
    setIsSuccessModalVisible(false);
    setIsRemoveInvitedUser(false);
  };

  const addExistingUserMethod = data => {
    console.log(data);
    let contactData = data[0]?.mobile;
    let allData = false;
    memberData.map(item => {
      if (item.mobile == contactData) {
        allData = true;
      }
    });
    if (allData) {
      console.log('Hello');
    } else {
      console.log('false');
      setMemberData([...memberData, ...data]);
    }

    setIsAddMemberModalVisible(false);
  };

  //Cancel method
  const openCountryModalInAddMemberCompoMethod = () => {
    setIsCurrency(false);
    setIsCountryCode(true);
    setIsAddMemberModalVisible(false);
    setTimeout(() => {
      setIsCountryCodeModalVisible(true);
    }, 10);
  };

  //Cancel method
  const cancelMethod = () => {
    setIsAddMemberModalVisible(false);
  };

  //Currency drowp down Method
  const currencyDropDownMethod = () => {
    setIsCountryCodeModalVisible(true);
    setIsCountryCode(false);
    setIsCurrency(true);
    setIsDueDay(false);
    setIsDeadLineDay(false);
  };

  //Due day drowp down Method
  const dueDayDropDownMethod = () => {
    setIsCountryCodeModalVisible(true);
    setIsDueDay(true);
    setIsCountryCode(false);
    setIsCurrency(false);
    setIsDeadLineDay(false);
  };

  //DeadLine day drowp down Method
  const deadLindDayDropDownMethod = () => {
    setIsCountryCodeModalVisible(true);
    setIsDeadLineDay(true);
    setIsCountryCode(false);
    setIsCurrency(false);
    setIsDueDay(false);
  };

  //Cycle period start date Method
  const cyclePeriodStartDateMethod = () => {
    if (cycleStartDate != '') {
      setIsCyclePeriodShowStartDateError(false);
    }
    setIsDatePickerVisible(true);
    setIsCyclePeriodStartDate(true);
    setIsCyclePeriodFinishDate(false);
    setIsActivePeriodStartDate(false);
    setIsActivePeriodFinishDate(false);
    setIsDueDate(false);
    setIsDeadLineDay(false);
  };

  const setAmountMethod = amount => {
    setAmountToBePaid(amount);
    if (amount != '' && amount.length > 0) {
      setIsAmountToBePaidShowError(false);
    } else {
      setIsAmountToBePaidShowError(true);
    }
  };

  //Active period start date Method
  const activePeriodStartDateMethod = () => {
    if (numberOfMember != '' && numberOfMember > 1 && numberOfMember <= 20) {
      setIsNumberOfMemberShowError(false);
      if (recurenceType != '') {
        setIsRecurrenceTypeShowError(false);
        if (cycleStartDate != '') {
          setIsCyclePeriodShowStartDateError(false);
          setIsCyclePeriodShowFinishDateError(false);
          setIsDatePickerVisible(true);
          setIsCyclePeriodStartDate(false);
          setIsCyclePeriodFinishDate(false);
          setIsActivePeriodStartDate(true);
          setIsActivePeriodFinishDate(false);
          setIsDueDate(false);
          setIsDeadLineDay(false);
        } else {
          setIsCyclePeriodShowStartDateError(true);
        }
      } else {
        setIsRecurrenceTypeShowError(true);
      }
    } else {
      setIsNumberOfMemberShowError(true);
      numberOfMembersInput.current.focus();
    }
  };

  //Due date Method
  const dueDateMethod = () => {
    if (dueDate != '') {
      setIsDueDateShowError(false);
    }
    setIsDatePickerVisible(true);
    setIsCyclePeriodStartDate(false);
    setIsCyclePeriodFinishDate(false);
    setIsActivePeriodStartDate(false);
    setIsActivePeriodFinishDate(false);
    setIsDueDate(true);
    setIsDeadLineDay(false);
  };

  //DeadLine date Method
  const deadLineDateMethod = () => {
    if (deadLineDate != '') {
      setIsDeadLineDateShowError(false);
    }
    setIsDatePickerVisible(true);
    setIsCyclePeriodStartDate(false);
    setIsCyclePeriodFinishDate(false);
    setIsActivePeriodStartDate(false);
    setIsActivePeriodFinishDate(false);
    setIsDueDate(false);
    setIsDeadLineDay(true);
  };

  const setCoordinatorProfile = async () => {
    const userProfileData = await Utility._retrieveData(
      Constants.storage_keys.USER_PROFILE,
    );
    const firstName = userProfileData?.first_name;
    const lastName = userProfileData?.last_name;
    const country_Flag = userProfileData?.flag;
    setCoordinatorCId(userProfileData?.country_id);
    memmberObj['country_id'] = userProfileData?.country_id;
    memmberObj['mobile'] = userProfileData?.mobile;
    memmberObj['first_name'] = firstName;
    memmberObj['last_name'] = lastName;
    memmberObj['flag'] = country_Flag;
    memberData.push({...memmberObj});
  };

  const getUserDataFromLocal = async () => {
    const userProfileData = await Utility._retrieveData(
      Constants.storage_keys.USER_PROFILE,
    );
    setCurrentUserId(userProfileData?.userId);
    setCurrentUserMobile(userProfileData?.mobile);
  };

  // expiry time and commision rate

  const getTimeAndCommission = async () => {
    const response = await NetworkManager.fetchRequest(
      `${URL.END_POINT.invitation_commission}`,
      URL.REQUEST_TYPE.getRequest,
    );

    if (response.code === 200) {
      setInvComData(response.data);
    }
  };

  function onPressCommissionBox() {
    setCommission(!Commission);
    if (Commission === false) {
      setCommissionInput('');
    }
  }

  //React useEffect Method
  useEffect(() => {
    if (memberData.length == 0) {
      setCoordinatorProfile();
    }
    setMemberData([...members,...memberData])
  }, []);

  //React useEffect Method
  useEffect(() => {
    getUserDataFromLocal();
    getTimeAndCommission();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            onPressLeftIcon={Assets.settings.whiteBackArrow}
            onPressLeft={goBackMethod}
            headerTitle={Strings.home.reuseGroup.reuseGroup}
          />
        </View>
        <View style={styles.keyboardAwareScroll}>
          <KeyboardAwareScrollView
            style={styles.keyboardAwareScroll}
            bounces={true}
            showsVerticalScrollIndicator={false}>
            <>
              {isSuccessScreenVisible ? (
                <SuccessScreenComponent
                  successTitle={Strings.createFundGroup.thankYou}
                  successDescription={`${Strings.createFundGroup.your} ${groupTitle} ${Strings.createFundGroup.groupHasBeenCreatedSuccessfully}`}
                  groupMembersDescription={
                    Strings.createFundGroup.yourRequestIsSentToAll
                  }
                  buttonIcon={Assets.createFundGroup.fundGroupButton}
                  onPressMyProfile={() => props.navigation.navigate('Home')}
                  // isForFundRasingRequests={isForFundRasingRequests}
                />
              ) : (
                <>
                  <ImageBackground
                    source={Assets.splash.bgFooter}
                    style={styles.imageBackground}
                  />

                  <View style={styles.groupDescriptionContainer}>
                    <View style={styles.groupTitleContainer}>
                      <Text style={styles.groupTitle}>
                        {Strings.createFundGroup.groupTitle}
                      </Text>

                      <TouchableOpacity
                        style={styles.onPressQmark}
                        onPress={() => setIsGroupTitleInfo(true)}>
                        <Image
                          source={
                            isGroupTitleInfo
                              ? Assets.createFundGroup.qMarkColored
                              : Assets.createFundGroup.qMark
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.fieldContainer}>
                      <CustomTextInput
                        isTopplaceHolder={false}
                        placeholder={Strings.createFundGroup.enterGroupTitle}
                        hideButton={false}
                        editable={true}
                        maxLength={100}
                        validationErrorMessageShow={isShowGroupTitleError}
                        validationErrorMessage={
                          Strings.fieldValidationErrorMessage
                            .groupTitleShouldNotBeEmpty
                        }
                        onChangeText={groupTitle => {
                          setGroupTitle(groupTitle);
                          if (groupTitle != '') {
                            setIsShowGroupTitleError(false);
                          } else {
                            setIsShowGroupTitleError(true);
                          }
                        }}
                        value={groupTitle}
                        passRef={groupTitleInput}
                      />
                    </View>

                    <View
                      style={[styles.groupTitleContainer, {marginTop: -30}]}>
                      <Text style={styles.groupTitle}>
                        {Strings.createFundGroup.groupDescription}
                      </Text>

                      <TouchableOpacity
                        onPress={() => setIsGroupDescriptionInfo(true)}
                        style={styles.onPressQmark}>
                        <Image
                          source={
                            isGroupDescriptionInfo
                              ? Assets.createFundGroup.qMarkColored
                              : Assets.createFundGroup.qMark
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TextInput
                        ref={groupDescriptionInput}
                        placeholder={Strings.fieldPlaceHolder.groupDetails}
                        style={styles.messageTextInput}
                        textAlignVertical={'top'}
                        placeholderTextColor="#8D8D8D"
                        maxLength={400}
                        multiline={true}
                        returnKeyType={'done'}
                        onChangeText={groupDescription => {
                          setGroupDescription(groupDescription);
                          if (
                            groupDescription !== '' &&
                            groupDescription.length >= 20
                          ) {
                            setIsShowGroupDescriptionError(false);
                          } else {
                            setIsShowGroupDescriptionError(true);
                          }
                        }}
                        value={groupDescription}
                      />
                    </View>
                    {isShowGroupDescriptionError && (
                      <View style={[styles.groupDescriptionErrorContainer]}>
                        <Text style={styles.validationErroMessageTxt}>
                          {groupDescription === ''
                            ? Strings.fieldValidationErrorMessage
                                .groupDescriptionShouldNotBeEmpty
                            : Strings.fieldValidationErrorMessage
                                .groupsDescriptionBetween}
                        </Text>
                      </View>
                    )}
                  </View>
                  {
                    <View
                      style={[
                        styles.fieldContainer,
                        {paddingHorizontal: 20, paddingTop: 8},
                      ]}>
                      <CustomTextInput
                        topPlaceholder={Strings.createFundGroup.numberOfMembers}
                        placeholder={
                          Strings.fieldPlaceHolder.enterNumberOfMembers
                        }
                        hideButton={false}
                        keyboardType={'number-pad'}
                        maxLength={2}
                        validationErrorMessageShow={isNumberOfMemberShowError}
                        validationErrorMessage={
                          numberOfMember === ''
                            ? Strings.fieldValidationErrorMessage
                                .membersShoulNotBeEmpty
                            : Strings.fieldValidationErrorMessage
                                .membersShouldBeGreaterThanTwo
                        }
                        onChangeText={numberOfMember => {
                          setNumberOfMember(numberOfMember.trim());
                          if (
                            numberOfMember !== '' &&
                            numberOfMember > 1 &&
                            numberOfMember <= 20
                          ) {
                            setIsNumberOfMemberShowError(false);
                            if (numberOfMember < 6) {
                              setInterest(false);
                            }
                          } else {
                            setIsNumberOfMemberShowError(true);
                          }
                        }}
                        value={numberOfMember.replace(/[^0-9]/g, '')}
                        passRef={numberOfMembersInput}
                      />
                    </View>
                  }

                  <View style={styles.paymentTypeComponent}>
                    <View style={styles.groupTitleContainer}>
                      <Text style={styles.groupTitle}>
                        {Strings.createFundGroup.paymentType}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setContiSequence(true)}
                        style={styles.onPressQmark}>
                        <Image
                          source={
                            ContiSequence
                              ? Assets.createFundGroup.qMarkColored
                              : Assets.createFundGroup.qMark
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    {/*CheckBox component*/}
                    <ScrollView
                      horizontal={true}
                      scrollEnabled={false}
                      showsHorizontalScrollIndicator={false}>
                      {Strings.createFundGroup.checkBoxData.map(
                        (item, index) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: GlobalStyle.size.width / 15,
                              }}
                              key={index}>
                              <View
                                style={{
                                  paddingHorizontal:
                                    GlobalStyle.size.width / 42,
                                }}>
                                <TouchableOpacity
                                  onPress={() => checkBoxMethod(item.title)}>
                                  <Image
                                    source={
                                      recurenceType == item.title
                                        ? Assets.signup.circleFilled
                                        : Assets.signup.circleWithoutFilled
                                    }
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  paddingLeft: GlobalStyle.size.width / 40,
                                }}>
                                <Text>{item.title}</Text>
                              </View>
                            </View>
                          );
                        },
                      )}
                    </ScrollView>
                    {isRecurrenceTypeShowError && (
                      <View style={{paddingTop: 5}}>
                        <Text style={styles.validationErroMessageTxt}>
                          {
                            Strings.fieldValidationErrorMessage
                              .pleaseSelectReccurenceType
                          }
                        </Text>
                      </View>
                    )}
                  </View>

                  {/*Cycle period component*/}
                  <View style={styles.CyclePeriodComponentContainer}>
                    <CyclePeriodComponent
                      showCycleStartDateError={isCyclePeriodShowStartDateError}
                      showCycleFinishDateError={
                        isCyclePeriodShowFinishDateError
                      }
                      showCurrencyError={isCurrencyShowError}
                      showAmountToBePaidError={isAmountToBePaidShowError}
                      showActivePeriodStartDateError={
                        isActivePeriodStartDateShowError
                      }
                      showActivePeriodFinishDateError={
                        isActivePeriodFinishDateShowError
                      }
                      getAmountToBePaid={setAmountMethod}
                      passAmountToBePaid={amountToBePaid}
                      passCyclePeriodStartDate={Utility._appDateFormat(
                        cycleStartDate,
                      )}
                      passCyclePeriodFinishDate={activeFinishDateCalculated}
                      passActivePeriodStartDate={Utility._appDateFormat(
                        activeStartDate,
                      )}
                      passactivePeriodFinishtDate={activeFinishDateCalculated}
                      isCyclePeriodValid={isValidCyclePeriod}
                      isActivePeriodSValid={
                        activeStartDate == '' ? false : isValidActivePeriod
                      }
                      onPressCurrency={currencyDropDownMethod}
                      onPressCyclePeriodStartDate={cyclePeriodStartDateMethod}
                      onPressActivePeriodStartDate={activePeriodStartDateMethod}
                      // passDisableCheck={!(groupStatus == 'Inactive')}
                      passCurrency={Currency}
                      isFromCreateGroup={true}
                      isCyclePeriodInfo={isCyclePeriodInfo}
                      isActivePeriodInfo={isActivePeriodInfo}
                      onPressCyclePeriodQMarkInfo={() =>
                        setIsCyclePeriodInfo(true)
                      }
                      onPressActivePeriodQMarkInfo={() =>
                        setIsActivePeriodInfo(true)
                      }
                      onPressAmountToBePaidQMarkInfo={() =>
                        setIsAmountToBePaid(true)
                      }
                      // groupStatus={groupStatus}
                      activeDaysLeft={activeDaysLeft}
                      isAmountToBePaid={isAmountToBePaid}  
                    />
                  </View>

                  {/*Payment type component*/}

                  <View style={styles.PaymentTypeComponentContainer}>
                    <PaymentTypeComponent
                      showDueDayError={isDueDayShowError}
                      showDeadLineDayError={isDeadLineDayShowError}
                      showDueDateError={isDueDateShowError}
                      showDeadLineDateError={isDeadLineDateShowError}
                      onPressDueDay={dueDayDropDownMethod}
                      onPressDeadLineDay={deadLindDayDropDownMethod}
                      onPressDueDate={dueDateMethod}
                      onPressDeadLineDate={deadLineDateMethod}
                      passSelectedDueDay={Utility._convertedDayFromDate(
                        dueDate,
                      )}
                      passSelectedDeadLineDay={Utility._convertedDayFromDate(
                        deadLineDate,
                      )}
                      passDueDate={Utility._appDateFormat(dueDate)}
                      isDueDateValid={dueDate == '' ? false : isDueDateValid}
                      passDeadLineDate={Utility._appDateFormat(deadLineDate)}
                      isDeadLineDateValid={
                        deadLineDate == '' ? false : !isValidDeadLineDate
                      }
                      // passDisableCheck={groupStatus == 'Inactive'}
                      isCheckBox={isCheckBox}
                      // disableAction={
                      //   groupStatus == 'Inactive' && isCoordinated_by_me
                      //     ? false
                      //     : true
                      // }
                      isFromCreateGroup={true}
                      passRecurrenceType={recurenceType}
                      // groupStatus={groupStatus}
                      activeDaysLeft={activeDaysLeft}
                    />
                  </View>

                  {/* commision and time  */}

                  <View
                    style={[
                      styles.CyclePeriodComponentContainer,
                      {marginTop: GlobalStyle.size.width / 15},
                    ]}>
                    {/* commision and interest management */}
                    <CommissionInterest
                      commission={invComData?.commission_arr}
                      setInterest={() => setInterest(!Interest)}
                      Interest={Interest}
                      disableInterset={numberOfMember < 6}
                      reference={commissionRef}
                      onchangeCommission={item => {
                        let decimalCount = item.split('.')[1];
                        if (!(decimalCount?.length > 2)) {
                          setCommissionInput(item.trim());
                        }
                      }}
                      commissionValue={CommissionInput}
                      commissions={Commission}
                      commissionHandler={onPressCommissionBox}
                      isFromCreateGroup={true}
                      // disabled={
                      //   groupStatus == 'Inactive' && isCoordinated_by_me
                      //     ? false
                      //     : true
                      // }
                    />

                    {/* Time selector for create Group */}

                    <View style={styles.RVSPTime}>
                      <View style={styles.groupTitleContainer}>
                        <Text style={styles.commissionText}>
                          {Strings.fieldPlaceHolder.selectTime}
                        </Text>
                      </View>

                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={invComData.invite_arr}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select time' : expiryTime}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        disable={false}
                        onChange={item => {
                          setExpiryTime(item.value);
                          setIsFocus(false);
                        }}
                      />
                    </View>
                  </View>

                  {/*Add group member and beneficiary name component*/}

                  <View style={styles.AddGroupMemberComponentContainer}>
                    <AddGroupMemberComponent
                      onPressAddExistingFrom={existingGroupUsersMethod}
                      onPressAddFromContacts={phoneContactMethod}
                      onPressEnterMember={memberNumberMethod}
                      onChangeCountryCode={setCountryMethod}
                      removeMember={removeMemberMethod}
                      passMemberData={memberData}
                      isFromCreateGroup={true}
                      passCurrentUserMobile={currentUserMobile}
                      passCurrentUserID = {currentUserId}
                      isFromReuseGroup = {true}
                      {...props}
                    />
                  </View>

                  {/*Submit and cancel buttons components*/}

                  <View style={styles.submitNConcelButtonContainer}>
                    <AppButton
                      onPress={() =>createNEditGroupMethod()}
                      icon={Assets.forgotPassword.submitButton}
                    />
                    <View style={styles.cancelContainer}>
                      <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={styles.onPressCancel}
                        activeOpacity={0.6}>
                        <Text style={styles.cancelTxt}>
                          {Strings.otp.cancel}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>                    
                </>
              )}
            </>
            {isCountryCodeModalVisible && (
              <CountryCodeModal
                countryModalTitle={
                  isCountryCode
                    ? Strings.signup.selcetCountryCode
                    : isCurrency
                    ? Strings.fieldPlaceHolder.selectCurrency
                    : isUnpaidMemberModalVisible
                    ? Strings.fieldPlaceHolder.selectBeneficiaryName
                    : Strings.createFundGroup.selectDay
                }
                modalVisible={isCountryCodeModalVisible}
                onpressCross={() => setIsCountryCodeModalVisible(false)}
                countryCodeData={
                  isCountryCode
                    ? Strings.signup.countryId.countryCodeData
                    : isUnpaidMemberModalVisible
                    ? currentSequenceUnpaidMembersData
                    : isCurrency
                    ? Strings.signup.countryId.CurrencyData
                    : Strings.createFundGroup.daysData
                }
                onPressSelectCountryCode={selectDayMethod}
                onPressSelectUnpaidGroupMember={seletctUnpaidMember}
                isUnpaidMemberModalVisible={isUnpaidMemberModalVisible}
                passIsCurrency={isCurrency}
                passIndexForRestrictDay={indexForRestrictDay}
                passIsForDaySelection={isForDaySelection}
              />
            )}
            {isAddMemberModalVisible && (
              <AddMemberModal
                addMemberModallVisible={isAddMemberModalVisible}
                passIsExistingGroupUsers={isExistingGroupUsers}
                passIsFromPhoneContacts={isFromPhoneContacts}
                passIsAlreadyAddedMobileNoShowError={
                  isAlreadyAddedMobileNoShowError
                }
                passCountryCode={countryId}
                passCountryFlag={countryFlag}
                onPressAdd={addMethod}
                onPressCancel={cancelMethod}
                onPressCountryCode={openCountryModalInAddMemberCompoMethod}
                getExistingUsersData={addExistingUserMethod}
                passCoordinatorCId={coordinatorCId}
                passCurrentUserId={currentUserId}
              />
            )}
            {isSuccessModalVisible && (
              <SuccessModal
                modalVisible={isSuccessModalVisible}
                modelSuccessIcon={
                  isRemove || isActivate || isRemoveInvitedUser
                    ? ''
                    : Assets.succesModel.successIcon
                }
                successModelTitle={
                  isRemove || isRemoveInvitedUser
                    ? Strings.home.groupDetails.areYouSure
                    : isActivate
                    ? Strings.home.groupDetails.groupActivatedTitle
                    : Strings.home.groupDetails.groupEdited
                }
                succesModelDesciption={
                  isRemove || isRemoveInvitedUser
                    ? isRemove
                      ? Strings.home.groupDetails.wantToDeleteGroup
                      : Strings.home.groupDetails.wantToDeleteMember
                    : isActivate
                    ? Strings.home.groupDetails.groupActivatedDescription
                    : Strings.home.groupDetails
                        .yourGroupHasBeenEditedSuccessfully
                }
                modelButtonIcon={
                  isRemove || isRemoveInvitedUser
                    ? ''
                    : isActivate
                    ? Assets.groupDetails.activateButtton
                    : Assets.changePassword.doneButton
                }
                borderColor={Colors.pentaColor}
                customButtonTitleColor={Colors.pentaColor}
                customButtonTitle={Strings.home.groupDetails.remove}
                onPressCancel={() => {
                  setIsSuccessModalVisible(false),
                    setIsActivate(false),
                    setIsRemvoe(false),
                    setIsRemoveInvitedUser(false);
                }}
                passIsActivate={isActivate}
                showCancel={isRemove || isRemoveInvitedUser || isActivate}
                onPressModelButton={() => {
                  setIsSuccessModalVisible(false);
                  if (isRemove) {
                    removeGroupMethod();
                  } else if (isActivate) {
                    activateGroupMethod();
                  } else if (isRemoveInvitedUser) {
                    removeMemberMethod(invitedUserMobile);
                  } else {
                    props.navigation.navigate('Home');
                  }
                }}
              />
            )}

            {(isGroupTitleInfo ||
              isGroupDescriptionInfo ||
              isCyclePeriodInfo ||
              isActivePeriodInfo ||
              isAmountToBePaid ||
              ContiSequence) && (
              <QMarkInfoModal
                modalVisible={
                  isGroupTitleInfo ||
                  isGroupDescriptionInfo ||
                  isCyclePeriodInfo ||
                  isActivePeriodInfo ||
                  isAmountToBePaid ||
                  ContiSequence
                }
                qMarkInfo={
                  isGroupTitleInfo
                    ? Strings.createFundGroup.groupTitleQMarkInfo
                    : isGroupDescriptionInfo
                    ? Strings.createFundGroup.groupDescriptionQMarkInfo
                    : isCyclePeriodInfo
                    ? Strings.createFundGroup.cyclePeriodQMarkInfo
                    : isAmountToBePaid
                    ? Strings.createFundGroup.amountToBePaidQMarkInfo
                    : ContiSequence
                    ? Strings.createFundGroup.ContiSequenceQmark
                    : Strings.createFundGroup.activePeriodQMarkInfo
                }
                modalPosition={
                  isGroupTitleInfo
                    ? GlobalStyle.size.height / 6
                    : isGroupDescriptionInfo
                    ? GlobalStyle.size.height / 3.3
                    : isCyclePeriodInfo
                    ? GlobalStyle.size.height / 1.68
                    : isAmountToBePaid
                    ? GlobalStyle.size.height / 1.74
                    : ContiSequence
                    ? GlobalStyle.size.height / 2.4
                    : GlobalStyle.size.height / 1.4
                }
                onPressClose={closeQMarkInfoModalMethod}
              />
            )}
          </KeyboardAwareScrollView>

          {isDatePickerVisible && (
            <View>
              {Platform.OS == 'ios' && (
                <View style={styles.calenderCancelDoneButtonContainer}>
                  <TouchableOpacity onPress={datePickerCancel}>
                    <Text style={styles.cancelNDoneTitle}>
                      {Strings.calender.cancel}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={datePickerDone}>
                    <Text style={styles.cancelNDoneTitle}>
                      {Strings.calender.done}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <DateTimePicker
                timeZoneOffsetInSeconds={0}
                value={new Date(date)}
                mode={'date'}
                display={'spinner'}
                textColor={Colors.secondaryColor}
                minimumDate={new Date()}
                onChange={onChange}
                style={{backgroundColor: Colors.octaColor}}
              />
            </View>
          )}
        </View>
        {isLoaderVisible && <Loader />}
      </View>
    </>
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
  CyclePeriodComponentContainer: {
    paddingHorizontal: GlobalStyle.size.width / 18,
    paddingVertical: 0,
  },
  PaymentTypeComponentContainer: {
    backgroundColor: Colors.nonaColor,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  AddGroupMemberComponentContainer: {
    backgroundColor: Colors.nonaColor,
    paddingHorizontal: 20,
    marginVertical: 18,
  },
  submitNConcelButtonContainer: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 10,
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
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Bold,
    color: Colors.secondaryColor,
  },
  topComponentContainer: {
    height: GlobalStyle.size.height / 2.5,
    paddingHorizontal: 20,
    paddingTop: GlobalStyle.size.height / 55,
  },
  onPressQmark: {
    paddingHorizontal: 2,
  },
  fieldContainer: {
    height: GlobalStyle.size.height / 7.8,
  },
  messageTitle: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Bold,
  },
  messageTextInput: {
    paddingTop: 20,
    justifyContent: 'flex-start',
    color: Colors.secondaryColor,
    fontSize: 16,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryColor,
    minHeight: GlobalStyle.size.height / 15,
  },
  maxLengthTitleContainer: {
    paddingTop: 6,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  maxLengthTitle: {
    fontSize: 12,
    fontFamily: Fonts.SFCompactDisplay.Regular,
    color: Colors.tertiary,
  },
  imageBackground: {
    position: 'absolute',
    width: '100%',
    height: '43%',
  },
  groupDescriptionContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  groupDescriptionErrorContainer: {
    paddingTop: 0,
  },
  validationErroMessageTxt: {
    fontSize: 14,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.pentaColor,
  },
  beneficiaryNameComponentContainer: {
    paddingHorizontal: 20,
    paddingVertical: GlobalStyle.size.height / 25,
  },
  onPressResend: {
    borderRadius: 30,
    borderWidth: 1.5,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primaryColor,
    width: GlobalStyle.size.width / 1.09,
    marginTop: GlobalStyle.size.height / 55,
  },
  onPressResendTxt: {
    fontSize: 18,
    fontFamily: Fonts.SFCompactDisplay.Bold,
    color: Colors.primaryColor,
  },
  beneficiaryTopDescriptionContainer: {
    paddingBottom: GlobalStyle.size.height / 35,
    paddingHorizontal: 20,
  },
  beneficiaryBottomDescriptionContainer: {
    alignItems: 'center',
    paddingBottom: GlobalStyle.size.height / 45,
  },
  lineView: {
    width: GlobalStyle.size.width / 2,
    backgroundColor: Colors.decaColor,
    height: 1.5,
    marginVertical: GlobalStyle.size.height / 30,
  },
  beneficiaryBottomDescription: {
    fontSize: 12,
    fontFamily: Fonts.SFCompactDisplay.Light,
    color: Colors.textColor.secondary,
    textAlign: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calenderCancelDoneButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.octaColor,
    paddingHorizontal: GlobalStyle.size.width / 40,
    paddingVertical: GlobalStyle.size.height / 180,
  },
  cancelNDoneTitle: {
    fontSize: 18,
    fontFamily: Fonts.SFCompactDisplay.Medium,
    color: Colors.chatBg.senderColor,
  },
  paymentTypeComponent: {
    paddingHorizontal: 20,
    paddingTop: GlobalStyle.size.height / 80,
    paddingBottom: GlobalStyle.size.height / 50,
  },
  RVSPTime: {
    marginTop: GlobalStyle.size.height / 35,
    paddingHorizontal: 3,
  },
  commissionText: {
    fontSize: 14,
    color: Colors.secondaryColor,
    fontFamily: Fonts.SFCompactDisplay.Bold,
  },
  dropdown: {
    height: 50,
    borderBottomWidth: 0.7,
    paddingHorizontal: 8,
    width: '100%',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default CreateAFundGroupNDetailsNFundRaisingRequestScreen;
