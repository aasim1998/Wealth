import React, {Component, PureComponent} from 'react';
import {View, Text, SafeAreaView, Buffer} from 'react-native';
import {Colors, Assets, Strings, URL, GlobalStyle} from '../../res/index';
import WebView from 'react-native-webview';

export default class PaypalScreen extends PureComponent {
  constructor(props) {
    super(props);
  }
  state={
    payment_id :null,
    status:null

  }
  sendPaymentToBackend = async () => {
    // console.log(typeof this.props.route.params.Amount);
    add_parameter = {
      amount: this.props.route.params.Amount,
      ref_number: this.state.payment_id,
      // req_data: [{abc: 'hello'}],
    };
    try {
      const response = await NetworkManager.fetchRequest(
        URL.END_POINT.initiate_Payment,
        URL.REQUEST_TYPE.postRequest,
        add_parameter,
      );
      console.log('::::::::::::::>>', response);
      if(response.code === 200){
        this.props.navigation.navigate("wallet")
      }
    } catch (error) {
      console.log(error);
    }
  };
   /* webView navigation */

  _onNavigationStateChange = async webViewState => {
 
    if (webViewState.url.includes('https://example.com/cancel')) {
        // console.log(":::::",webViewState.url)
        this.props.navigation.pop()
   }
      if(webViewState.url.includes('https://example.com/return')){
        const newUrl = webViewState.url
          .split('?')[1]
          .split('&')
          .map(item => item.split('='));
        // console.log(':::::', newUrl);
        this.setState({payment_id : newUrl[0][1] })
        const payer_id = await newUrl[2][1];
        // console.log(payer_id);

        var requestOptions22 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.route.params.Data.token}`,
          },
          body: JSON.stringify({
            payer_id: payer_id,
          }),
          redirect: 'follow',
        };

        fetch(this.props.route.params.Data.links.execute, requestOptions22)
          .then(response => response.json())
          .then(res => {
            this.setState({status :res.payer.status})
          })

          .catch(error => {
            console.log('error', error);
          });
        }
    
  };

  render() {
    const {links} = this.props.route.params.Data;
    if(this.state.status === "VERIFIED"){
      this.sendPaymentToBackend()
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <WebView
          style={{height: GlobalStyle.size.height, width: GlobalStyle.size.width}}
          source={{uri: links.approval_url}}
          onNavigationStateChange={this._onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          loading = {false}
        />
      </SafeAreaView>
    );
  }
}

