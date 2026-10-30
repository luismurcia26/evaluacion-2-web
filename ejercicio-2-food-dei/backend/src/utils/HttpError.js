// Error con código HTTP (400, 404, etc.) para que el servidor responda correctamente
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
