import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getHeaders } from '../../../config/utils'
import { Get, Post } from '../../../config/api'
import { Config } from '../../../config/config'
import { getFilesById, getFolder, getSubFolder, processImage, processVideo } from '../../../config/url'

export interface AnalysisSlice {
  videoResultForm: any,
  videoResult: any,
  imageResultForm: any,
  imageResult: any,
  isLoading: boolean
}

const initialState: AnalysisSlice = {
  videoResultForm: {},
  videoResult: {},
  imageResultForm: {},
  imageResult: {},
  isLoading: false
}

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    formVideoData: (state, action: PayloadAction<number>) => {
      state.videoResultForm = action.payload
    },
    videoResultData: (state, action: PayloadAction<number>) => {
      state.videoResult = action.payload
    },
    formImageData: (state, action: PayloadAction<number>) => {
      state.imageResultForm = action.payload
    },
    imageResultData: (state, action: PayloadAction<number>) => {
      state.imageResult = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { formVideoData, videoResultData, formImageData, imageResultData, setIsLoading } = analysisSlice.actions

export default analysisSlice.reducer;

export const getFolderList = createAsyncThunk("folderList", async (data: any, { dispatch, rejectWithValue }) => { 
    dispatch(setIsLoading(true));
    let headers = getHeaders();
    try {
      const getFolderListResp: any = await Get(getFolder, { headers: headers });
      dispatch(setIsLoading(false));

      return getFolderListResp;
    } catch (error: any) {
      dispatch(setIsLoading(false));
      return rejectWithValue(error.message);
    }
  }
);


export const getFolderListById = createAsyncThunk("folderListById", async (data: any, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  let headers = getHeaders();
  try {
    const getFolderListByIdResp: any = await Get(getSubFolder(data), { headers: headers })
    dispatch(setIsLoading(false));
    return getFolderListByIdResp;
  } catch (error: any) {
    dispatch(setIsLoading(false));
    return rejectWithValue(error.message);
  }
});

export const getFileListById = createAsyncThunk("folderListById", async (data: any, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  let headers = getHeaders();
  try {
    const getFileListByIdResp: any = await Get(getFilesById(data), { headers: headers })
    dispatch(setIsLoading(false));
    return getFileListByIdResp;
  } catch (error: any) {
    dispatch(setIsLoading(false));
    return rejectWithValue(error.message);
  }
});

export const postProcessVideo = createAsyncThunk("postProcessVideo", async (data: any, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  let headers = getHeaders();
  try {
    console.log('VIDEO DATA', data)
    const getVideoProcessResp: any = await Post(processVideo(), data, { headers: headers })
    dispatch(setIsLoading(false));
    console.log('###########################')
    console.log('Final Video Result', getVideoProcessResp);
    console.log('###########################')

    return getVideoProcessResp;
  } catch (error: any) {
    dispatch(setIsLoading(false));

    return rejectWithValue(error.message);
  }
});


export const postProcessImage = createAsyncThunk("processImage", async (data: any, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  let headers = getHeaders({ image: true });
  try {
    const getImageProcessResp: any = await Post(processImage(), data, { headers: headers })
    dispatch(setIsLoading(false));
    console.log('###########################')
    console.log('Final Image Result', getImageProcessResp);
    console.log('###########################')

    return getImageProcessResp;
  } catch (error: any) {
    dispatch(setIsLoading(false));
    return rejectWithValue(error.message);
  }
});


