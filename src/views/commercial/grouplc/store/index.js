import { combineReducers, configureStore } from "@reduxjs/toolkit";
import groupLcReducer from "./reducer";

const reducers = combineReducers( {
    groupLcReducer
} );

export const store = configureStore( {
    reducer: reducers
} );
