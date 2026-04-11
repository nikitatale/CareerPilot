

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}



const handleCastError = (err) => ({
  statusCode: 400,
  message: `Invalid value "${err.value}" for field "${err.path}"`,
});


const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return {
    statusCode: 400,
    message: `Validation failed: ${messages.join(". ")}`,
  };
};


const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  const value = err.keyValue?.[field] || "";
  return {
    statusCode: 409,
    message: `"${value}" is already taken. Please use a different ${field}.`,
  };
};


const handleJWTError = () => ({
  statusCode: 401,
  message: "Invalid token. Please log in again.",
});


const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: "Your session has expired. Please log in again.",
});


const handleMulterError = (err) => ({
  statusCode: 400,
  message:
    err.code === "LIMIT_FILE_SIZE"
      ? "File is too large. Maximum allowed size is 5MB."
      : `File upload error: ${err.message}`,
});


const handleAxiosError = (err) => {
  const status = err.response?.status;

  if (status === 429) {
    return {
      statusCode: 429,
      message: "Too many requests to an external service. Please try again shortly.",
    };
  }
  if (status === 401 || status === 403) {
    return {
      statusCode: 502,
      message: "External API authentication failed. Check your API keys.",
    };
  }
  return {
    statusCode: 502,
    message: "An external service is unavailable. Please try again later.",
  };
};



const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || "Internal server error";

  
  if (err.name === "CastError") {
    ({ statusCode, message } = handleCastError(err));

  } else if (err.name === "ValidationError") {
    ({ statusCode, message } = handleValidationError(err));

  } else if (err.code === 11000) {
    ({ statusCode, message } = handleDuplicateKeyError(err));

  } else if (err.name === "JsonWebTokenError") {
    ({ statusCode, message } = handleJWTError());

  } else if (err.name === "TokenExpiredError") {
    ({ statusCode, message } = handleJWTExpiredError());

  } else if (err.name === "MulterError") {
    ({ statusCode, message } = handleMulterError(err));

  } else if (err.isAxiosError) {
    ({ statusCode, message } = handleAxiosError(err));
  }


  const isDev  = process.env.NODE_ENV === "development";
  const isServerError = statusCode >= 500;


  if (isServerError || isDev) {
    console.error(
      `\n[ERROR] ${new Date().toISOString()}`,
      `\n  ${req.method} ${req.originalUrl}`,
      `\n  Status  : ${statusCode}`,
      `\n  Message : ${message}`,
      ...(isDev ? [`\n  Stack   : ${err.stack}`] : [])
    );
  }


  return res.status(statusCode).json({
    success: false,
    message,
   
    ...(isDev && isServerError && { stack: err.stack }),
  });
};

export default errorHandler;