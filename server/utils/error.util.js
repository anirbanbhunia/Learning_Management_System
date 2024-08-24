//this use for making a class for create custom error 

class AppError extends Error{
    constructor(message,statuscode){
        super(message) // This calls the constructor of the parent Error class, passing the message argument. This ensures that the AppError instance behaves like a regular Error object, with the error message properly set.

        this.statuscode = statuscode
        Error.captureStackTrace(this,this.constructor) //The Error.captureStackTrace(this, this.constructor); method is used in Node.js to create a .stack property on an error object. This property contains a string representing the point in the code where the error was instantiated, including the call stack leading up to the error.

    }
}

export default AppError