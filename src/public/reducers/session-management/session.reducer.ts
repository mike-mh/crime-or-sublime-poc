import { combineReducers, Action } from "redux";
import { COS_BEGIN_SESSION, COS_END_SESSION, SessionAction } from "./session.actions";

// TO-DO: Include username with sessions from sever
interface ISessionState {
    email?: string;
    isActive: boolean;
    username?: string;
}

const initialSessionState: ISessionState = {
    email: null,
    isActive: false,
    username: null,
}

function sessionStatus(state: ISessionState = initialSessionState, action: SessionAction) {
    switch (action.type) {
        case COS_BEGIN_SESSION:
            return action.email;
        case COS_END_SESSION:
            return initialSessionState.email;
        default:
            return state;
    }
}

export const sessionReducer = combineReducers({
    sessionStatus,
});
