import { SET_AUTH_ERROR_MSG, USER_LOGIN, USER_LOGOUT } from "../constants/app";

export const updateAuthErrorMsg = (data) => ({
    type: SET_AUTH_ERROR_MSG,
    data
});

export const userLogin = (data) => ({
    type: USER_LOGIN,
    data
});

export const userLogout = (data) => ({
    type: USER_LOGOUT,
    data
});