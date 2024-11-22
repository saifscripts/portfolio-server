import {
    IDuplicateError,
    IErrorMessage,
    IErrorResponse,
} from '../interfaces/errors';

const handleDuplicateError = (err: IDuplicateError): IErrorResponse => {
    // Extract first key and value from err.keyValue (Explanation below)
    const [[key, value]] = Object.entries(err.keyValue);

    const errorMessages: IErrorMessage[] = [
        {
            path: key,
            message: `${value} already exists!`,
        },
    ];

    return {
        statusCode: 400,
        message: `Duplicate Entry! | ${key} already exists!`,
        errorMessages,
    };
};

export default handleDuplicateError;

/* 

Extract first key and value from err.keyValue

ERROR EXAMPLE:  
                err : {
                    keyValue: {
                        email: "john.doe@..",
                        // might contains other key values
                    }
                }

CODE:
    Step - 1: Convert to an array of key value pairs
        Object.entries(err.keyValue) // [['email', 'john.doe@..'], ...other keyValues]

    Step - 2: Destructure first key value only
        const [[key, value]] = Object.entries(err.keyValue); // key = 'email', value = 'john.doe@..'

*/
