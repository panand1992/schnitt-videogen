import { createSelector } from 'reselect';
const selectApp = (state) => state;

export const getAuthErrorMsg = () => createSelector(selectApp, (appState) => appState.get('authErrorMsg'));

export const getAuthLoading = () => createSelector(selectApp, (appState) => appState.get('authLoading'));

export const getIsAuthenticated = () => createSelector(selectApp, (appState) => appState.get('isAuthenticated'));

export const getPreviousUploads = () => createSelector(selectApp, (appState) => appState.get('userUploads').toJS());

export const getVideoDetails = () => createSelector(selectApp, (appState) => appState.get('videoDetails').toJS());
