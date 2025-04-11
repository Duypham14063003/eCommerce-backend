const StatusCode = {
  CONFLICT: 409,
  FORBIDDEN: 403,
};

const ReasonStatusCode = {
  CONFLICT: "Bad request error",
  FORBIDDEN: "Bad Request error",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ConflicRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  ConflicRequestError,
  BadRequestError,
};
