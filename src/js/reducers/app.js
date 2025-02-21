import { fromJS } from 'immutable';

import { SET_AUTH_ERROR_MSG, SET_AUTH_LOADING, SET_IS_AUTHENTICATED, SET_USER_UPLOADS, SET_VIDEO_DETAILS } from '../constants/app';

const initialState = fromJS({
    authErrorMsg: '',
    authLoading: false,
    isAuthenticated: localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined',
    userUploads: [],
    videoDetails: {}
});

const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_ERROR_MSG:
            return state
                .set('authErrorMsg', action.data);

        case SET_AUTH_LOADING:
            return state
                .set('authLoading', action.data);

        case SET_USER_UPLOADS:
            return state
                .set('userUploads', fromJS(action.data));

        case SET_VIDEO_DETAILS:
            return state
                .set('videoDetails', fromJS(action.data));

        case SET_IS_AUTHENTICATED:
            return state
                .set('isAuthenticated', action.data);

        default:
            return state;
    }
};

export default AppReducer;