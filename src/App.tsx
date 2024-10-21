import React, { Component } from 'react';
import { Provider } from 'react-redux';

// Local Import
import { store } from './store/store';
import AppRoutes from './routes';


const App = () => {
    return (
        <Provider store={store}>
            <AppRoutes />
        </Provider>
    )
}


export default App;
