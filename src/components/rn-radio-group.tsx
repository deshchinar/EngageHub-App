import React from 'react'
import { StyleSheet, ScrollView, View, TouchableOpacity, ViewStyle, ScrollViewProps, Text, TextStyle } from 'react-native'

export interface RadioGroupProps {
  options: Array<string>,
  activeButton: string,
  onChange: Function,
  containerOptions?: ScrollViewProps,
  buttonStyle?: ViewStyle,
  labelStyle?: TextStyle,
  radioSize?: number,
  style?: ViewStyle
}
export interface RadioButtonProps {
  label: string,
  onChange: Function,
  buttonStyle?: ViewStyle,
  activeButton: string,
  labelStyle?: TextStyle,
  radioSize?: number
}

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  return (
    <View
      style={props.style}
      {...props.containerOptions}>
      {props.options.map((data) => {
        return (
          <RadioButton
            label={data}
            activeButton={props.activeButton}
            buttonStyle={props.buttonStyle}
            onChange={props.onChange}
            radioSize={props.radioSize}
          />
        )
      })}
    </View>
  )
}

const RadioButton: React.FC<RadioButtonProps> = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => props.onChange(props.label)}
      style={[props.buttonStyle, styles.buttonStyle]}>
      <View style={[styles.radio, props.radioSize? {width:props.radioSize,height:props.radioSize,borderRadius:props.radioSize} : null]}>
        {props.activeButton === props.label ? (
          <View style={[styles.fill, props.radioSize? {width:props.radioSize/1.6,height:props.radioSize/1.6,borderRadius:props.radioSize} : null]}></View>
        ) : null}
      </View>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    backgroundColor: 'black',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
})

export default RadioGroup