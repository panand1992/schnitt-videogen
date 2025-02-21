import { fromJS } from 'immutable';

import { SET_AUTH_ERROR_MSG, SET_AUTH_LOADING, SET_IS_AUTHENTICATED } from '../constants/app';

const initialState = fromJS({
    authErrorMsg: '',
    authLoading: false,
    isAuthenticated: localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined'
});

const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_ERROR_MSG:
            return state
                .set('authErrorMsg', action.data);

        case SET_AUTH_LOADING:
            return state
                .set('authLoading', action.data);

        case SET_IS_AUTHENTICATED:
            return state
                .set('isAuthenticated', action.data);

        default:
            return state;
    }
};

export default AppReducer;