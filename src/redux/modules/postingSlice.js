import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../shared/axios';

const initialState = {
    postings:[],
    wishListPostings:[],
    filtering:{
        structType:"all",
        isFiltering:false,
        options:{
            isParking:"false",
            isKitchen:"false",
            isWifi:"false",
            isAircon:"false",
            isWasher:"false",
            isTV:"false",
            minPrice:"0",
            maxPrice:"10000000"
        }
    },
    isLast:false
}
export const fetchPostingDataFirst = createAsyncThunk('posting/fetchPostingDataFirst', async (_, { getState, dispatch }) => {
    const category = getState().posting.filtering.structType;
    const username = getState().user.userInfo.username;
    let endpoint;
    if(username) endpoint = '/api/rooms/user';
    if(!username) endpoint = '/api/rooms';
    const res = await instance.get(`${endpoint}?category=${category}&page=0&size=12`);
    const data = res.data;

    return data;
})

export const fetchPostingDataByScroll = createAsyncThunk('posting/fetchPostingDataByScroll', async ({ page }, { getState, dispatch }) => {
    const category = getState().posting.filtering.structType;
    const username = getState().user.userInfo.username;
    let endpoint;
    if(username) endpoint = '/api/rooms/user';
    if(!username) endpoint = '/api/rooms';
    const res = await instance.get(`${endpoint}?category=${category}&page=${page}&size=12`);

    const data = res.data;


    return data;
})

export const fetchFilteringPostingDataFirst = createAsyncThunk('posting/fetchFilteringPostingDataFirst', async (_, { getState, dispatch }) => {
    const category = getState().posting.filtering.structType;
    const username = getState().user.userInfo.username;
    let endpoint;
    if(username) endpoint = '/api/rooms/user';
    if(!username) endpoint = '/api/rooms';
    const { isParking, isKitchen, isWifi, isAircon, isWasher, isTV, minPrice, maxPrice } = getState().posting.filtering.options;
    const res =
    await instance.get(`${endpoint}?category=${category}&parking=${isParking}&kitchen=${isKitchen}&aircon=${isAircon}&wifi=${isWifi}&washer=${isWasher}&tv=${isTV}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=0&size=12`);
    // ??? thunk??? ???????????? ????????????????????? useselector??? filtering ?????? ????????? useEffect ????????? ????????? ?????? ??????????????? ????????? ????????? ??? ????????? ??????
    const data = res.data;

    return data;
})
// ?????? ?????????
export const fetchFilteringPostingDataByScroll = createAsyncThunk('posting/fetchFilteringPostingDataByScroll', async ({ page }, { getState, dispatch }) => {
    // page??? 1?????? ??????
    const username = getState().user.userInfo.username;
    let endpoint;
    if(username) endpoint = '/api/rooms/user';
    if(!username) endpoint = '/api/rooms';
    const category = getState().posting.filtering.structType;
    const { isParking, isKitchen, isWifi, isAircon, isWasher, isTV, minPrice, maxPrice } = getState().posting.filtering.options;
    const res =
    await instance.get(`${endpoint}?category=${category}&parking=${isParking}&kitchen=${isKitchen}&aircon=${isAircon}&wifi=${isWifi}&washer=${isWasher}&tv=${isTV}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=12`);
    const data = res.data;


    return data;
})


const postingSlice = createSlice({
    name:'posting',
    initialState,
    reducers: {
        changeStructType:(state, action)=> {
            state.filtering.structType = action.payload;
        },
        setDefaultPostings:(state) => {
            state.postings = [];
        },
        setDefaultIsLast:(state) => {
            state.isLast = false;
        },
        setTrueIsFiltering:(state) => {
            state.filtering.isFiltering = true;
        },
        setFalseIsFiltering:(state) => {
            state.filtering.isFiltering = false;
        },
        closeFiltering:(state) => {
            // ????????? ?????? ??????
            state.filtering.isFiltering = false;
            const defaultFiltering = {
                structType:state.filtering.structType,
                isFiltering:false,
                options:{
                    isParking:false,
                    isKitchen:false,
                    isWifi:false,
                    isAircon:false,
                    isWasher:false,
                    isTV:false,
                    minPrice:"0",
                    maxPrice:"10000000"
                }
            }
            state.filtering = defaultFiltering;
        },
        openFiltering:(state, action) => {
            // ??????????????? ??????
            // ????????????????????? ?????? ????????? ????????? ???????????? ??????
            state.filtering.options = action.payload;
        },
        setDefaultCategory: (state) => {
            state.filtering.category = "all";
        }
    },
    extraReducers: {
        [fetchPostingDataFirst.fulfilled.type]: (state, action) => {
            state.postings = action.payload.content;
            state.isLast = action.payload.last;
            // state.filtering.isFiltering = false;
        },
        [fetchPostingDataByScroll.fulfilled.type]: (state, action) => {
            state.postings = [...state.postings, ...action.payload.content];
            state.isLast = action.payload.last;
            // state.filtering.isFiltering = false;
        },
        [fetchFilteringPostingDataFirst.fulfilled.type]: (state, action) => {
            state.postings = action.payload.content;
            state.isLast = action.payload.last;
        },
        [fetchFilteringPostingDataByScroll.fulfilled.type]:(state, action) => {
            state.postings = [...state.postings, ...action.payload.content];
            state.isLast = action.payload.last;
            // state.filtering.isFiltering = true;
        }
    }
})

const postingActions = postingSlice.actions;
export { postingActions };

export default postingSlice.reducer;