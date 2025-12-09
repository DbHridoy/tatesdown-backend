export const Errors = {
  AlreadyExists: {
    code: 409,
    message: "Document already exist",
  },
  NotFound: {
    code: 404,
    message: "Document not found",
  },
  Unauthorized: {
    code: 401,
    message: "Wrong credentials",
  },
  NoToken: {
    code: 401,
    message: "No token provided",
  },
  Forbidden: {
    code: 405,
    message: "Insufficient permission",
  },
};
