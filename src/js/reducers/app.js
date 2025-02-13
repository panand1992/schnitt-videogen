import { fromJS } from 'immutable';

const initialState = fromJS({});

const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default AppReducer;