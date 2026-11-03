// An expected failure with the HTTP status the REST routes should answer with.
// The AI tools return the message to the model instead.
class ServiceError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Routes share one way of turning service errors into responses
const sendError = (res, err, fallback = 'Database error') => {
  if (err instanceof ServiceError) return res.status(err.status).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: fallback });
};

module.exports = { ServiceError, parseId, sendError };
