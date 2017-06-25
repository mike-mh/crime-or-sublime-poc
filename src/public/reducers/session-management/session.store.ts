import { createStore } from "redux";
import { sessionReducer } from "./session.reducer";

export const store = createStore(sessionReducer);
