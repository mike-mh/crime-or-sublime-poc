import { Action, combineReducers } from "redux";
import { COS_BEGIN_SESSION, COS_END_SESSION, SessionAction } from "./session.actions";

// TO-DO: Include username with sessions from sever
interface ISessionState {
    email?: string;
    isActive: boolean;
    username?: string;
}

const initialSessionState: ISessionState = {
    email: null,
    isActive: true,
    username: null,
};

function sessionStatus(state: ISessionState = initialSessionState, action: SessionAction) {
    switch (action.type) {
        case COS_BEGIN_SESSION:
            return true;
        case COS_END_SESSION:
            return false;
        default:
            return false;
    }
}

export const sessionReducer = combineReducers({
    sessionStatus,
});
