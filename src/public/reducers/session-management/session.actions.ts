import { Action } from "redux";

export const COS_END_SESSION = "END_SESSION";
export const COS_BEGIN_SESSION = "BEGIN_SESSION";

export interface IEndSessionAction extends Action {
    email?: string;
    isActive: false;
    type: string;
}

export interface IBeginSessionAction extends Action {
    email?: string;
    username?: string;
    isActive: true;
    type: string;
}

export type SessionAction = (IEndSessionAction | IBeginSessionAction);

export function endSession(): IEndSessionAction {
    return {
        isActive: false,
        type: COS_END_SESSION,
    };
}

export function beginSession(email: string): IBeginSessionAction {
    return {
        email,
        isActive: true,
        type: COS_BEGIN_SESSION,
    };
}
