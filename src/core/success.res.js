const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  CREATED: "Created!",
  OK: "Success",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {}
  ) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata) {
    super(message, metadata);
  }
}

class CREATED extends SuccessResponse {
  constructor(message, metadata) {
    super(message, StatusCode.CREATED, ReasonStatusCode.CREATED, metadata);
  }
}

module.exports = {
  OK,
  CREATED,
};
