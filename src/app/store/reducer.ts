import { createReducer, on } from '@ngrx/store';
import {
    updateSettingsInfo,
    //countUpdateInfo
} from './actions';
import {
    initialState,
    // countState,
    // initialCountState,
} from './state';

export const settingReducer = createReducer(
    initialState,
    on(updateSettingsInfo, (state, { settingInfo }) => {
        console.log('Previous state:', state);
        console.log('Action payload:', settingInfo);
        return {
            ...state,
            settingInfo: {
                ...state.settingInfo,
                count: settingInfo.count,
            },
        };
    })
);

// export const counterReducer = createReducer(
//     initialCountState,
//     on(countUpdateInfo, (state) => {
//         return { ...state, count: state.count + 1 };
//     })
// );
