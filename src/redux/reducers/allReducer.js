import { accountReducers } from "./accountReducer";
import { authReducer } from "./authRootReducer";
import cacheReducers from './caching';
import { commercialReducer } from "./commercialReducer";
import commonReducers from './common';

import layout from './layout';
import navbar from './navbar';
export default ( {
    ...accountReducers,
    ...authReducer,
    ...commercialReducer,
    commonReducers,
    cacheReducers,
    layout,
    navbar
} );