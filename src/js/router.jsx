import React, { Suspense, lazy } from 'react';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import appSaga from './sagas/app';
import appReducer from './reducers/app';
import PrivateRoute from './containers/PrivateRoute';

const Home = lazy(() => import("./containers/Home"));
const LoginPage = lazy(() => import("./containers/LoginPage"));
const PreviousUploads = lazy(() => import("./containers/PreviousUploads"));
const UploadDetails = lazy(() => import("./containers/UploadDetails"));

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
    reducer: appReducer
});

sagaMiddleware.run(appSaga);

const CustomRouter = () => (
    <Provider store={store}>
        <BrowserRouter>
            <Suspense fallback={<div style={{ alignItems: 'center', display: 'flex', height: '100vh', justifyContent: 'center', width: '100vw' }}> Loading...</div>}>
                <Routes>
                    <Route exact path="/" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route exact path="/upload/all" element={
                        <PrivateRoute>
                            <PreviousUploads />
                        </PrivateRoute>
                    } />
                    <Route exact path="/upload/:uploadId" element={
                        <PrivateRoute>
                            <UploadDetails />
                        </PrivateRoute>
                    } />
                    <Route exact path="/login" element={<LoginPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </Provider>
)

export default CustomRouter;