/* tslint:disable */

export const CRIME: boolean = false;
export const SUBLIME: boolean = true;

export type CrimeOrSublimeRaitng = boolean;

class CoSError extends Error {
    public code: number;
    constructor(name: string, message: string, code: number) {
        super(message);
        this.message = message;
        this.code = code;
    }
}

enum ErrrorCodes {
    DATABASE_DELETION_ERROR = 1,
    DATABASE_GRAFFITI_DOES_NOT_EXIST,
    DATABASE_GRAFFITI_UPDATE_ERROR,
    DATABASE_RATING_UPDATE_ERROR,
    DATABASE_RETRIEVE_ERROR,
    DATABASE_SAVE_ERROR,
    DATABASE_USER_DOES_NOT_EXIST_ERROR,
    DATABASE_USER_IDENTIFIER_TAKEN_ERROR,
    DATABASE_USER_INVALID_PASSWORD_ERROR,
    DATABASE_USER_RATING_ERROR,
    DATABASE_USER_REGISTRATION_CONFIRMATION_ERROR,
    HTTP_SEND_ERROR,
    PBKDF2_HASH_ERROR,
    RECAPTCHA_RESPONSE_FAILURE,
    SALT_GENERATION_ERROR,
    SESSION_CREATE_FAILURE,
    USER_DOUBLE_RATE_ERROR,
}

export class CoSServerConstants {
    public static readonly DATABASE_DELETION_ERROR = new CoSError(
        "DatabaseDeletionError",
        "An error occured deleting data from the database.",
        ErrrorCodes.DATABASE_DELETION_ERROR);

    public static readonly DATABASE_SAVE_ERROR = new CoSError(
        "DatabaseSaveError",
        "An error occured saving data to database.",
        ErrrorCodes.DATABASE_SAVE_ERROR);

    public static readonly DATABASE_USER_DOES_NOT_EXIST_ERROR = new CoSError(
        "DatabaseUserDoesNotExistError",
        "The user queried does not exist in database.",
        ErrrorCodes.DATABASE_USER_DOES_NOT_EXIST_ERROR);

    public static readonly DATABASE_USER_IDENTIFIER_TAKEN_ERROR = new CoSError(
        "DatabaseUserIdentifierTakenError",
        "Another user has already taken the identifier given.",
        ErrrorCodes.DATABASE_USER_IDENTIFIER_TAKEN_ERROR);

    public static readonly DATABASE_USER_INVALID_PASSWORD_ERROR = new CoSError(
        "DatabaseUserInvalidPasswordError",
        "The given password was incorrect.",
        ErrrorCodes.DATABASE_USER_INVALID_PASSWORD_ERROR);

    public static readonly DATABASE_USER_REGISTRATION_CONFIRMATION_ERROR = new CoSError(
        "DatabaseUserRegistrationConfirmationError",
        "The given password was incorrect.",
        ErrrorCodes.DATABASE_USER_REGISTRATION_CONFIRMATION_ERROR);

    public static readonly SALT_GENERATION_ERROR = new CoSError(
        "SaltGenerationError",
        "An error occured generating a salt.",
        ErrrorCodes.SALT_GENERATION_ERROR);

    public static readonly PBKDF2_HASH_ERROR = new CoSError(
        "PBKDF2HashError",
        "An error occured performing a PBKDF2 hash.",
        ErrrorCodes.PBKDF2_HASH_ERROR);

    public static readonly HTTP_SEND_ERROR = new CoSError(
        "HttpSendError",
        "Unable to complete HTTP request.",
        ErrrorCodes.HTTP_SEND_ERROR);

    public static readonly RECAPTCHA_RESPONSE_FAILURE = new CoSError(
        "RecaptchaResponseError",
        "ReCaptcha source responded with failure.",
        ErrrorCodes.RECAPTCHA_RESPONSE_FAILURE);

    public static readonly SESSION_CREATE_FAILURE_ERROR = new CoSError(
        "SessionCreateFailureError",
        "Failed to create a new session.",
        ErrrorCodes.SESSION_CREATE_FAILURE);

    public static readonly DATABASE_GRAFFITI_DOES_NOT_EXIST = new CoSError(
        "DatabaseGraffitiDoesNotExists",
        "The specified graffiti does not exist.",
        ErrrorCodes.DATABASE_GRAFFITI_DOES_NOT_EXIST);

    public static readonly DATABASE_RETRIEVE_ERROR = new CoSError(
        "DatabaseRetrieveError",
        "An error occured retrieving element from the database.",
        ErrrorCodes.DATABASE_RETRIEVE_ERROR);

    public static readonly USER_DOUBLE_RATE_ERROR = new CoSError(
        "UserDoubleRateError",
        "Tried to assign a rating on a graffiti more than once.",
        ErrrorCodes.USER_DOUBLE_RATE_ERROR);

    public static readonly DATABASE_GRAFFITI_UPDATE_ERROR = new CoSError(
        "DatabaseGraffitiUpdateError",
        "An error occured trying to update graffiti data.",
        ErrrorCodes.DATABASE_GRAFFITI_UPDATE_ERROR);
    
    public static readonly DATABASE_RATING_UPDATE_ERROR = new CoSError(
        "DatabaseRatingUpdateError",
        "An error occured trying to update user rating data.",
        ErrrorCodes.DATABASE_RATING_UPDATE_ERROR);
}
