import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import Orientation from 'react-native-orientation-locker';

import ImageZoomViewer from '../../components/ImagePicker';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';


const HistoryScreen = ({ route }) => {
  const { image } = route.params;

  console.log('image ##################', image)

  const [currentDimensions, setCurrentDimensions] = useState(Dimensions.get('window'));
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerImage, setViewerImage] = useState('');


  useEffect(() => {
    // Lock the screen to landscape mode
    Orientation.lockToLandscape();

    // Update dimensions when the orientation changes
    const updateDimensions = () => {
      setCurrentDimensions(Dimensions.get('window'));
    };

    // Listen to orientation changes
    const subscription = Dimensions.addEventListener('change', updateDimensions);

    // Cleanup function to remove the listener and unlock orientations
    return () => {
      Orientation.unlockAllOrientations();
      subscription?.remove(); // Use optional chaining to safely remove the listener
    };
  }, []);

  const { height, width } = currentDimensions;

  return (
    <>
      {/* <View style={{...styles.container, flexDirection: 'row', display: 'flex', width: heightPercentageToDP('10%'), height: widthPercentageToDP('300%'), justifyContent: 'space-between', alignItems: 'center', backgroundColor:'red'}}>
        <Image
          source={require('../../assets/images/left-arrow.png')}
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
        <Image
          source={require('../../assets/images/right-arrow.png')}
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
      </View> */}
      <View style={{ ...styles.container, height, width }}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ alignItems: 'center' }}
          showsHorizontalScrollIndicator={false} // Optional: hides the scrollbar
        >
          {Array.isArray(image) && image.length > 0 ? image.map((item, index) => {
            return (
              <View key={index} style={{ ...styles.container, width }}>
                <View style={{ ...styles.resultContainer, width: width - 100 }}>
                  <TouchableOpacity onPress={() => {
                    setViewerImage(item)
                    setIsViewerVisible(true)
                  }}>
                    <View>
                      {isLoadingImage && (
                        <ActivityIndicator
                          size="large"
                          color="#0000ff"
                          style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] }}
                        />
                      )}
                      <Image
                        source={{ uri: item }}
                        style={{ width: width - 200, height: heightPercentageToDP('24%') }}
                        resizeMode="cover"
                        onLoadStart={() => setIsLoadingImage(true)}
                        onLoadEnd={() => setIsLoadingImage(false)}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <ImageZoomViewer
                  isVisible={isViewerVisible}
                  onClose={() => setIsViewerVisible(false)}
                  images={[{ url: viewerImage }]}
                />
              </View>
            )
          }) : null}
        </ScrollView>
      </View>
    </>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  resultContainer: {
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#fff',
  },
});
