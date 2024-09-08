import { createAction, props } from '@ngrx/store';

export const updateSettingsInfo = createAction(
    '[Settings] Update Settings Info', // Action type
    props<{ settingInfo: { count: number } }>() // Payload to pass new settingsInfo
);

// export const countUpdateInfo = createAction(
//     'Count Update Settings Info', // Action type
//     props<{ count: number }>() // Payload to pass new settingsInfo
// );
