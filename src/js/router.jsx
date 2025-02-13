import React, { Suspense, lazy } from 'react';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import appSaga from './sagas/app';
import appReducer from './reducers/app';

const Home = lazy(() => import("./containers/Home"));
const VgDetails = lazy(() => import("./containers/VgDetails"));

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
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/vg-details/:vgId" element={<VgDetails />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </Provider>
)

export default CustomRouter;