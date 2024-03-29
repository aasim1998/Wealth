/**
 * @description:This is Assets file
 * @author:Vibhishan
 * @created_on:18/05/2021
 * @param:
 * @return:
 * @modified_by:Vibhishan
 * @modified_on:12/07/2021
 */

export const AppInfo = {
  stageBaseUrlAPI: 'https://wealth-concert-stage.newmediaguru.co',
  devBaseUrlAPI: 'https://wealth-concert-dev.newmediaguru.co',
  apiVersion: 'v1',
  serviceTimeOut: 2000,
};

export default {
  baseURL: AppInfo.stageBaseUrlAPI + '/' + 'api/',

  REQUEST_TYPE: {
    getRequest: 'GET',
    postRequest: 'POST',
    deleteRequest: 'DELETE',
    putRequest: 'PUT',
    multipart: 'mutipart',
  },
  END_POINT: {
    register: 'register',
    login: 'login',
    logout: 'logout',
    verify_email: 'verify_email',
    send_otp: 'send_otp',
    forgot_password: 'forgot_password',
    reset_password: 'reset_password',
    profile: 'profile',
    update_profile: 'update_profile',
    change_mobile: 'change_mobile',
    update_mobile: 'update_mobile',
    change_email: 'change_email',
    update_email: 'update_email',
    send_otp_mobile: 'send_otp_mobile',
    verify_mobile: 'verify_mobile',
    verify_password: 'verify_password',
    change_password: 'change_password',
    contact_us: 'contact_us',
    enquiry_title: 'enquiry-title',
    staticpageAbout: 'staticpages/about',
    staticpagesPrivacyPolicy: 'staticpages/privacy-policy',
    staticpagesTermsOfUse: 'staticpages/terms-of-use',
    group: 'group',
    user_groups: 'user-groups',
    get_Associate_members: 'get-associate-members',
    accept_reject_group: 'accept-reject-group',
    activate_group: 'activate-group',
    ask_pay_confirmation: 'ask-pay-confirmation',
    remove_group_user: 'remove-group-user',
    payment_request: 'payment-request',
    confirm_payment: 'confirm-payment',
    fundRaiserGroup: 'fund-raiser-group',
    send_fcm: 'send-fcm',
    push_notification: 'push_notification',
    notifications: 'notifications',
    app_update: 'app-update',
    set_notification: 'set_notification',
    unraed_count: 'unraed_count',
    wallet_amount: 'my-wallet',
    all_transaction: 'my-transactions',
    delete_account: 'delete_account',
    invitation_commission: 'invitation-time-commission',
    Withdraw: 'wallet_to_paypal_payout',
    initiate_Payment: 'add-amount-wallet',
    payment_summary: 'calculate-group-create-amount',
    initiate_add_Wallet: 'initiate-add-wallet',
    currency: 'currency',
    benificary_payment: 'calculate-group-individual-payment',
    processGroupIndividualPayment: 'process-group-contribution-payment',
    reuseGroup: 'reuse-group'
  },
};
