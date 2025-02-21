import { takeLatest, all, put } from 'redux-saga/effects';

import axios from "../utils/axios";
import { FETCH_PREVIOUS_UPLOADS, FETCH_VIDEO_DETAILS, GENERATE_VIDEO_FROM_PROMPT, SET_AUTH_ERROR_MSG, SET_AUTH_LOADING, SET_IS_AUTHENTICATED, SET_USER_UPLOADS, SET_VIDEO_DETAILS, USER_LOGIN, USER_LOGOUT } from '../constants/app';

const fetchUserUploads = function* () {
    yield put({ type: SET_USER_UPLOADS, data: [] });

    try {
        const response = yield axios.get("/video-gen/all");

        yield put({ type: SET_USER_UPLOADS, data: response.data });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

const fetchVideoDetails = function* (action) {
    yield put({ type: SET_VIDEO_DETAILS, data: {} });

    const { videoId } = action.data;

    try {
        const response = yield axios.get(`/video-gen/${videoId}`);

        yield put({ type: SET_VIDEO_DETAILS, data: response.data });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

const generateVideoFromPrompt = function* (action) {
    const { navigate, videoPromptData } = action.data;

    try {
        yield axios.post(`/video-gen`, videoPromptData);

        // yield put({ type: SET_USER_UPLOADS, data: [response.data.videoUrl] });
        navigate(`/upload/all`);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

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
    yield all([yield takeLatest(FETCH_PREVIOUS_UPLOADS, fetchUserUploads)]);
    yield all([yield takeLatest(FETCH_VIDEO_DETAILS, fetchVideoDetails)]);
    yield all([yield takeLatest(GENERATE_VIDEO_FROM_PROMPT, generateVideoFromPrompt)]);
    yield all([yield takeLatest(USER_LOGIN, userLogin)]);
    yield all([yield takeLatest(USER_LOGOUT, userLogout)]);
}
