import React, { useState, FC, useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { widthPercentageToDP } from 'react-native-responsive-screen';

interface DataItem {
  label: string;
  title: string;
  id: number
}

const data: DataItem[] = [];

interface WithDropdownProps {
  data?: DataItem[];
  labelText: string;
  Placeholder: string;
  onValueChange?: (value: string | null, id: number | null) => void;
  value: string
}

// interface DropdownComponentProps {
//   title: string;
// }

const withDropdown = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithDropdown: FC<P & WithDropdownProps> = (props) => {
    // const [value, setValue] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState(false);
    const [errorText, setErrorText] = useState('')

    const handleFocus = () => setIsFocus(true);
    const handleBlur = () => setIsFocus(false);

    const handleChange = (item: DataItem) => {
      // setValue(item.title);
      setIsFocus(false);
      if (props.onValueChange) {
        props.onValueChange(item.title, item.id);
      }
    };

    const renderLabel = (labelText: string) => {
        return (
          <Text style={[styles.label, isFocus && { color: '#000' }]}>
            {labelText}
          </Text>
        );
    };

    console.log('*********', props.data)

    return (
      <View style={styles.container}>
       <Text>{renderLabel(props.labelText)}</Text> 
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }, props?.data?.length === 0 && styles.disabledDropdown ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={props.data || data}
          search
          maxHeight={300}
          labelField="title"
          valueField="title"
          placeholder={!isFocus ? props?.Placeholder : '...'}
          searchPlaceholder="Search..."
          value={props.value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disable={props?.data?.length === 0}
        />
        <Text>{errorText} </Text>
      </View>
    );
  };

  return ComponentWithDropdown;
};

const DropdownComponent = (props: any) => {
  return (
    <View>
      {/* <Text>{props.title}</Text> */}
      {props.children}
    </View>
  );
};

const EnhancedDropdownComponent = withDropdown(DropdownComponent);

export default EnhancedDropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 4,
  } as ViewStyle,
  disabledDropdown: {
    borderColor: 'grey',
    borderWidth: 0.4,

  } as ViewStyle,
  dropdown: {
    height: 50,
    borderColor: '#000',
    borderWidth: 0.8,
    borderRadius: 8,
    paddingHorizontal: 4,
    width: widthPercentageToDP('85%')
  } as ViewStyle,
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
  } as TextStyle,
  placeholderStyle: {
    fontSize: 16,
  } as TextStyle,
  selectedTextStyle: {
    fontSize: 16,
  } as TextStyle,
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  } as TextStyle,
});
