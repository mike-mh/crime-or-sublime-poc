import { Action } from "redux";

export const COS_END_SESSION = "END_SESSION";
export const COS_BEGIN_SESSION = "BEGIN_SESSION";

export interface IEndSessionAction extends Action {
    email?: string;
    type: string;
}

export interface IBeginSessionAction extends Action {
    email?: string;
    username?: string;
    type: string;
}

export type SessionAction = (IEndSessionAction | IBeginSessionAction);

export function endSession(): IEndSessionAction {
    return { type: COS_END_SESSION };
}

export function beginSession(email: string): IBeginSessionAction {
    return {
        email,
        type: COS_BEGIN_SESSION,
    };
}
