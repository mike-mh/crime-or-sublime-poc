import { createStore } from "redux";
import { sessionReducer } from "./session.reducer";

const store = createStore(sessionReducer);
