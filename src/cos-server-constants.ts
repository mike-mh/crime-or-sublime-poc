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
    DATABASE_SAVE_ERROR,
    DATABASE_USER_DOES_NOT_EXIST_ERROR,
    DATABASE_USER_IDENTIFIER_TAKEN_ERROR,
    DATABASE_USER_INVALID_PASSWORD_ERROR,
    DATABASE_USER_REGISTRATION_CONFIRMATION_ERROR,
    HTTP_SEND_ERROR,
    PBKDF2_HASH_ERROR,
    RECAPTCHA_RESPONSE_FAILURE,
    SALT_GENERATION_ERROR
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

}
