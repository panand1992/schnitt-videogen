import { createSelector } from 'reselect';
const selectApp = (state) => state;

export const getAuthErrorMsg = () => createSelector(selectApp, (appState) => appState.get('authErrorMsg'));

export const getAuthLoading = () => createSelector(selectApp, (appState) => appState.get('authLoading'));

export const getIsAuthenticated = () => createSelector(selectApp, (appState) => appState.get('isAuthenticated'));
