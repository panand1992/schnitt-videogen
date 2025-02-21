import { takeLatest, all, put } from 'redux-saga/effects';

import axios from "../utils/axios";
import { SET_AUTH_ERROR_MSG, SET_AUTH_LOADING, SET_IS_AUTHENTICATED, USER_LOGIN, USER_LOGOUT } from '../constants/app';


const userLogin = function* (action) {
    const { data } = action;

    yield put({ type: SET_AUTH_LOADING, data: true });

    try {
        const response = yield axios.post('/auth/login', data);
        yield put({ type: SET_AUTH_LOADING, data: false });
        yield put({ type: SET_IS_AUTHENTICATED, data: true });

        localStorage.setItem('token', response.data.token);

        window.location.href = '/';
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        yield put({ type: SET_AUTH_LOADING, data: false });
        if (error && error.response && error.response.data && error.response.data.message) {
            yield put({ type: SET_AUTH_ERROR_MSG, data: error.response.data.message });
        } else {
            yield put({ type: SET_AUTH_ERROR_MSG, data: 'Error in login' });
        }
        yield put({ type: SET_IS_AUTHENTICATED, data: false });
    }
}

const userLogout = function* (action) {
    const { navigate } = action.data;

    localStorage.removeItem('token');

    yield put({ type: SET_IS_AUTHENTICATED, data: false });

    navigate('/login');
}

export default function* appSaga() {
    yield all([yield takeLatest(USER_LOGIN, userLogin)]);
    yield all([yield takeLatest(USER_LOGOUT, userLogout)]);
}
