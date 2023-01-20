import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Image
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
import {QMarkInfoModal} from '../../componet/index'

const CheckboxComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Value, setValue] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  const Data = [
    {name: 'John Doe', age: 30, isShow: false},
    {name: 'Lily Bush', age: 20, isShow: true},
    {name: 'William Gate', age: 25, isShow: true},
  ];

  const onPressHandlerMOdal=()=>{
      setIsModalVisible(true)    
  }
  const onCloseModal=()=>{
    setIsModalVisible(false)
  }

  const toggleOpen = () => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  function onPressHandler(index) {
    setValue(Data[index].name);
  }
  return (
    <View style={styles.container}>
      <View style={{paddingLeft: 20, margin: 5, flexDirection: 'row'}}>
       

        <TouchableOpacity onPress={()=>toggleOpen()} activeOpacity={0.6}>
        <Image source={
                    isOpen
                      ? Assets.signup.squareFilled
                      : Assets.signup.squareWithoutFilled
                  }
                  style={{height:22,width:22}}
                  resizeMode='contain'
                />
        </TouchableOpacity>
        <TouchableOpacity style={{paddingLeft: 15, justifyContent: 'center', alignItems:"center" }} 
        onPress={onPressHandlerMOdal}>
        
        <Image 
           source={isModalVisible ? Assets.createFundGroup.qMarkColored:Assets.createFundGroup.qMark}
        />
        
        <QMarkInfoModal 
             modalVisible={isModalVisible} 
             onPressClose={onCloseModal} 
             qMarkInfo={props.markInfoString}
             modalPosition={GlobalStyle.size.height / 3.2}/>
        </TouchableOpacity>
      </View>
      <View style={[styles.list, !isOpen ? styles.hidden : undefined]}>
        <Text>{Value}</Text>
        <View style={styles.dataView}>
          {Data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.mainBox}
              onPress={() => onPressHandler(index)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  dataView:{
    alignItems: 'center'
  },
  hidden: {
    height: 0,
  },
  list: {
    overflow: 'hidden',
  },
  mainBox: {
    width: '80%',
    margin: 10,
    borderWidth: 2,
  },
});
export default CheckboxComponent;
