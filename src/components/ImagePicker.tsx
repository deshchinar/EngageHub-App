import React, { useState } from 'react';
import { Modal, StyleSheet, View, Button, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


interface ImageZoomViewerProps {
  isVisible: boolean;
  onClose: () => void;
  images: { url: string }[];
}

const ImageZoomViewer: React.FC<ImageZoomViewerProps> = ({ isVisible, onClose, images }) => {

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={{ position: 'absolute', width: wp('95%'), display: 'flex', alignItems: 'flex-end', top: hp('3%'), zIndex: 1000 }}>
          <Image
            source={require('../assets/images/cross-white.png')}
            style={{ height: 45, width: 45 }}
          />
        </TouchableOpacity>
        <ImageViewer
          style={{ width: wp('100%'), height: hp('60%') }}
          imageUrls={images}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageZoomViewer;
