import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, ScrollView, Image, Pressable, Modal, Alert, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchImageLibrary, launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
// import { UIActivityIndicator } from 'react-native-indicators';
import { PERMISSIONS } from 'react-native-permissions';
import ImageViewer from 'react-native-image-zoom-viewer';
import NetInfo from '@react-native-community/netinfo';
import ToastManager, { Toast } from 'toastify-react-native'

import EnhancedDropdownComponent from '../../components/EnhancedDropdownComponent'; // Adjust the path as needed
import useWindowDimensions from '../../components/useWindowDimensions';
import { getFolder, processVideo } from '../../config/url';
import { getFileListById, getFolderList, getFolderListById, postProcessImage, postProcessVideo } from '../../store/features/analysis/analysisSlice';
import { AppDispatch } from '../../store/store';
import RadioGroup from '../../components/rn-radio-group';
import { checkOrRequestPermissionForCamera, checkOrRequestPermissionForGallery, getEmotionLevelAndEmoji } from '../../components/CommanComponents';
import { RootState } from '../../store/store';
import ImageZoomViewer from '../../components/ImagePicker';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNavigation } from '@react-navigation/native';

// interface ImageData {
//   fileName: string;
//   type: string;
//   uri: string;
// }

interface IImageInfo {
  url: string;
  // other properties
}

// Define the type of the objects in the array
interface EmotionObject {
  Emotion: string;
  "Engagement Level": number;
  eLevel?: number;
  emoji?: string;
}


const HomeScreen = () => {

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation()

  const { isLoading } = useSelector((state: RootState) => state.analysis);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [division, setDivision] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState('');
  const [finalFileId, setFinalFileId] = useState('');
  const [selectedRadioBtn, setSelectedRadioBtn] = useState('Video');
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const [schoolFolderData, setSchoolFolderData] = useState([]);
  const [gradeFolderData, setGradeFolderData] = useState([]);
  const [divisionFolderData, setDivisionFolderData] = useState([]);
  const [dateFolderData, setDateFolderData] = useState([]);
  const [fileFolderData, setFileFolderData] = useState([]);

  // const [imageResult, setImageResult] = useState<string | null>('');
  const [imageEmotionArrayError, setImageEmotionArrayError] = useState<boolean>(false);
  const [imageEmotionArray, setImageEmotionArray] = useState<EmotionObject[] | null>(null);


  const [videoResult, setVideoResult] = useState('');
  const [videoResultError, setVideoResultError] = useState<boolean>(false);

  const [imageData, setImageData] = useState<any>(null); // Adjust type based on actual usage
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const [disableBtn, setDisableBtn] = useState(true);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const viewRef = useRef(null);

  useEffect(() => {
    onMountCall()
  }, []);

  useEffect(() => {
    if (school && grade && division && date && file) {
      setDisableBtn(false)
    }
    if (videoResult !== "") {
      setDisableBtn(true)
    }
    console.log('Called', disableBtn)
  }, [school, grade, division, date, file, videoResult]);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state?.isConnected ?? false;
      const isInternetReachable = state?.isInternetReachable ?? false;
      setIsConnected(isConnected && isInternetReachable);
    });

    return () => unsubscribe();
  }, []);


  const emptyForm = () => {
    setSchool('');
    setGrade('');
    setDivision('');
    setDate('');
    setFile('');
    // setImageResult('');
    // setImageResultEmotion('')
    setImageEmotionArray(null)
    setImageUri(null);
    setVideoResult('')
    setDisableBtn(true);
    setVideoResultError(false)
  }

  // custom function to convert date format
  const convertDate = (dateString: any) => {
    // Extract the parts of the date string
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);

    // Format the date as DD/MM/YYYY
    return `${day}/${month}/${year}`;
  };


  const updateHeight = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setCurrentHeight(height);
  };


  const onMountCall = async () => {
    let result = await dispatch(getFolderList(null));
    setSchoolFolderData(result?.payload?.folders);
    setVideoResult('');
  }

  const onSelectSchool = async (id: any) => {
    setVideoResult('')
    setVideoResultError(false)
    try {
      let result = await dispatch(getFolderListById(id));
      if (result?.payload?.folders?.length > 0) {
        setGradeFolderData(result?.payload?.folders);
      } else {
        Toast.error(`Grade not found.`, 'top')
      }
    } catch (e) {
      console.log('ERROR!!!!!!!!', e)
    }

  }
  const onSelectGrade = async (id: any) => {
    // let result = await dispatch(getFolderListById(id));
    // setDivisionFolderData(result?.payload?.folders);

    try {
      let result = await dispatch(getFolderListById(id));
      if (result?.payload?.folders?.length > 0) {
        setDivisionFolderData(result?.payload?.folders);
      } else {
        Toast.error(`Division not found.`, 'top')
      }
    } catch (e) {
      console.log('ERROR!!!!!!!!', e)
    }
  }
  const onSelectDivision = async (id: any) => {
    try {
      let result = await dispatch(getFolderListById(id));
      if (result?.payload?.folders?.length > 0) {
        let data = result?.payload?.folders ?? [];
        const transformedData = data.map((item: any) => ({
          ...item,
          title: convertDate(item.title)
        }));
        setDateFolderData(transformedData);
      } else {
        Toast.error(`Date not found.`, 'top')
      }
    } catch (e) {
      console.log('ERROR!!!!!!!!', e)
    }
  }
  const onSelectDate = async (id: any) => {
    try {
      let result = await dispatch(getFileListById(id));
      if (result?.payload?.folders?.length > 0) {
        let data = result?.payload?.files ?? [];
        const videoFiles = data.filter((file: any) => file.mimeType.startsWith('video/'));
        setFileFolderData(videoFiles);
      } else {
        Toast.error(`File not found.`, 'top')
      }
    } catch (e) {
      console.log('ERROR!!!!!!!!', e)
    }
  }

  const onSelectFile = async (id: any) => {
    setFinalFileId(id)
  }
  const convertToDownloadLinks = (driveUrls: string[]): string[] => {
    const fileIdPattern = /\/d\/(.*?)\/view/;
    return driveUrls.map((driveUrl) => {
      const match = driveUrl.match(fileIdPattern);
      if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.usercontent.google.com/download?id=${fileId}`;
      } else {
        throw new Error("Invalid Google Drive URL");
      }
    });
  };

  const onSubmitVideoProcess = async () => {
    // navigation.navigate('History', {
    //   image: []
    // })
    setVideoResultError(false)
    if (isConnected) {
      if (school && grade && division && date && file && videoResult == '') {
        setVideoResult('')
        try {
          let result = await dispatch(postProcessVideo({ file_id: finalFileId }));
          console.log('RESPONSE ########', result);
          if (result?.payload?.global_plot?.length > 0 || result?.payload?.plot_drive_link?.length > 0) {
            const mergedArray = [...(result?.payload?.global_plot || []), ...(result?.payload?.plot_drive_link || [])];

            const convertedImage = convertToDownloadLinks(mergedArray);
            navigation.navigate('History', {
              image: convertedImage
            })
          } else {
            setVideoResultError(true)
          }
        } catch (e) {
          console.log('VIDEO ERROR #########', e)
        }

      } else { }
    } else { }
  }
  const onSubmitImageProcess = async () => {
    if (isConnected) {
      const formData = new FormData();
      if (imageData) {
        formData.append('image', {
          name: imageData?.fileName,
          type: imageData?.type,
          uri: imageData?.uri,
        });

        let result = await dispatch(postProcessImage(formData));
        if (result.payload) {
          let updatedArr = result?.payload.map((item: any) => {
            const { eLevel, emoji } = getEmotionLevelAndEmoji(item.Emotion);
            return { ...item, eLevel, emoji };
          });
          setImageEmotionArray(updatedArr);
        } else {
          setImageEmotionArrayError(true)
        }
      }
    }
  }
  const onUploadBtnClick = () => {
    setImageEmotionArray(null);
    setImageEmotionArrayError(false);
    setImageUri(null);
    setModalVisible(true)
    setVideoResultError(false)
  }

  const handleImagePicker = async () => {
    // setImageResult('');
    let permission = await checkOrRequestPermissionForGallery(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    if (permission) {
      launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response: any) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else if (response.assets && response.assets.length > 0) {
          setImageData(response?.assets[0]);
          setImageUri(response.assets[0].uri || null);
        }
      });
    } else {
      console.log('No Permission provided')
    }
  };

  const handleCameraPicker = async () => {
    // setImageResult('');
    const permission = await checkOrRequestPermissionForCamera(PERMISSIONS.ANDROID.CAMERA);

    if (permission) {
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 1,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else {
          console.log('Image captured successfully:', response);
          setImageData(response?.assets?.[0] || null);
          setImageUri(response.assets?.[0]?.uri || null);
        }
      });
    } else {
      console.log('No permission provided');
    }
  };
  console.log('IS BTN ', disableBtn)
  return (
    <View ref={viewRef} style={{ ...styles.container, height: currentHeight > height ? height : '100%' }} onLayout={updateHeight}>
      <LoadingOverlay visible={isLoading} />
      <ToastManager position='top' showProgressBar={false} />
      <ScrollView style={{ ...styles.scrollView }} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        {/* <Text style={{textAlign: 'left'}}>Select File Format</Text> */}
        <Image
          style={{ width: wp('25%'), height: hp("12%") }}
          resizeMode="contain"
          source={require('../../assets/images/Student-Engagement.png')}
        />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


          {/* <UIActivityIndicator color='red' /> */}

          <RadioGroup style={{ display: 'flex', flexDirection: 'row', width: wp('60vw'), justifyContent: 'space-between' }} options={['Video', 'Image']} activeButton={selectedRadioBtn} onChange={(value: any) => {
            setSelectedRadioBtn(value);
            emptyForm()
            console.log('checked', value)
          }}
          />
        </View>
        {
          selectedRadioBtn === 'Video' ?
            <>
              <EnhancedDropdownComponent
                labelText="School"
                Placeholder="Select School"
                value={school}
                onValueChange={(value: any, id: any) => {
                  setGradeFolderData([]);
                  setDivisionFolderData([]);
                  setDateFolderData([]);
                  setFileFolderData([]);

                  setSchool(value);
                  onSelectSchool(id);
                  setGrade('');
                  setDivision('');
                  setDate('');
                  setFile('');
                  setVideoResult('');
                  setDisableBtn(true)
                }}
                data={schoolFolderData}
              />
              <EnhancedDropdownComponent
                labelText="Grade"
                Placeholder="Select Grade"
                value={grade}
                onValueChange={(value: any, id: any) => {
                  console.log('######', value);
                  setDivisionFolderData([]);
                  setDateFolderData([]);
                  setFileFolderData([]);
                  setGrade(value);
                  onSelectGrade(id);
                  setDivision('');
                  setDate('');
                  setFile('');
                  setVideoResult('');
                  setDisableBtn(true)
                }}
                data={gradeFolderData}
              />
              <EnhancedDropdownComponent
                labelText="Division"
                Placeholder="Select Division"
                value={division}
                onValueChange={(value: any, id: any) => {
                  console.log('######', value);
                  setDateFolderData([]);
                  setFileFolderData([]);

                  setDivision(value);
                  onSelectDivision(id);
                  setDate('');
                  setFile('');
                  setVideoResult('');
                  setDisableBtn(true)
                }}
                data={divisionFolderData}

              />
              <EnhancedDropdownComponent
                labelText="Date"
                Placeholder="Select Date"
                value={date}
                onValueChange={(value: any, id: any) => {
                  console.log('######', value)
                  setFileFolderData([]);

                  setDate(value);
                  onSelectDate(id);
                  setFile('');
                  setVideoResult('')
                  setDisableBtn(true)
                }}
                data={dateFolderData}
              />
              <EnhancedDropdownComponent
                labelText="File"
                Placeholder="Select File"
                value={file}
                onValueChange={(value: any, id: any) => {
                  console.log('######', value)
                  setFile(value);
                  onSelectFile(id);
                  setVideoResult('')
                  setDisableBtn(false)
                }}
                data={fileFolderData}
              />
              {/* For Video */}
              {
                !disableBtn ?
                  <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                      onPress={() => onSubmitVideoProcess()}
                      style={styles.btn}
                    >
                      <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                      // onPress={() => onSubmitVideoProcess()}
                      style={styles.btnDisabled}
                      disabled={true}
                    >
                      <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
              }
              {videoResultError ? <Text style={{ marginTop: 15, color: 'red', fontSize: 18, textAlign: 'left' }}>No Result Found.</Text> : null}

              {!isConnected ? <Text style={{ fontSize: 12, color: 'red', paddingTop: 5 }}>Internet not available, please check your internet connection!</Text> : null}

              {
                videoResult ?
                  <View style={styles.container}>
                    <Text style={{ width: wp('80%') }}>Result: </Text>
                    {/* <View style={styles.resultContainer}>
                      <TouchableOpacity onPress={() => setIsViewerVisible(true)}>
                        <Image src={videoResult} style={{ width: wp('75%'), height: hp('30%') }} resizeMode="contain" />
                      </TouchableOpacity>
                    </View> */}
                    <View style={styles.resultContainer}>
                      <TouchableOpacity onPress={() => setIsViewerVisible(true)}>
                        <View>
                          {isLoadingImage && (
                            <ActivityIndicator
                              size="large"
                              color="#0000ff"
                              style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] }}
                            />
                          )}
                          <Image
                            src={videoResult}
                            style={{ width: wp('75%'), height: hp('30%') }}
                            resizeMode="contain"
                            onLoadStart={() => setIsLoadingImage(true)}
                            onLoadEnd={() => setIsLoadingImage(true)}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <ImageZoomViewer
                      isVisible={isViewerVisible}
                      onClose={() => setIsViewerVisible(false)}
                      images={[{ url: videoResult }]}
                    />
                  </View>
                  :
                  null
              }
            </>
            :
            <>
              <View style={{ marginTop: 30 }}>
                <Button title="Upload Image" onPress={onUploadBtnClick} />
              </View>
              {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
              {imageUri && imageEmotionArray ?
                // For Image
                <View style={{ marginTop: 30 }}>
                  <TouchableOpacity
                    style={styles.btnDisabled}
                    disabled={true}
                  >
                    <Text style={styles.btnText}>Submit</Text>
                  </TouchableOpacity>
                </View>
                : imageUri && !imageEmotionArray ?
                  <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                      onPress={() => onSubmitImageProcess()}
                      style={styles.btn}
                    >
                      <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                  </View> : null}
              {
                Array.isArray(imageEmotionArray) && imageEmotionArray.length > 0 ?
                  imageEmotionArray.map((item, index) => {
                    return (
                      <View key={index} style={{ marginTop: hp(3) }}>
                        <Text style={{ color: 'black', fontSize: 18, textAlign: 'left' }}>The emotion displayed in the image is {item.emoji} {item.Emotion}.</Text>
                        <Text style={{ color: 'black', fontSize: 18, textAlign: 'left' }}>The engagement level of this student is {item.eLevel} out of 5.</Text>
                      </View>
                    )
                  })
                  :
                  imageEmotionArrayError ? <Text style={{ marginTop: 15, color: 'red', fontSize: 18, textAlign: 'left' }}>No Result Found.</Text> : null
              }
              {!isConnected ? <Text style={{ fontSize: 12, color: 'red', paddingTop: 5 }}>Internet not available, please check your internet connection!</Text> : null}
            </>
        }

      </ScrollView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>

            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', width: wp('65%'), display: 'flex', alignItems: 'flex-end', top: 10 }}>
                <Image
                  source={require('../../assets/images/cross.png')}
                  style={{ height: 25, width: 25 }}
                  onError={(error) => console.log(error.nativeEvent.error)}
                />
              </TouchableOpacity>
              {/* <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              > */}
              {/* </Pressable> */}
              <Text style={styles.modalText}>Select Image From</Text>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    handleImagePicker();
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Gallery</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    handleCameraPicker();
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Camera</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    paddingTop: hp(2),
    // justifyContent: 'center'
  },
  scrollView: {
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  btn: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: wp('85%'),
  },
  btnDisabled: {
    backgroundColor: 'grey',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: wp('85%'),
  },
  btnText: {
    color: '#fff',
    fontSize: 16
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
  image: {
    marginTop: 20,
    width: wp('80%'),
    height: 200,
    resizeMode: 'contain',
  },

  // Modal CSS
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 20
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  // 
  resultContainer: {
    width: wp('80%'),
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  }
});
