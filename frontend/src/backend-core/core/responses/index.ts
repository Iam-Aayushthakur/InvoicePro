export function successResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, statusCode = 500, code = 'ERROR', details?: unknown) {
  return new Response(JSON.stringify({ success: false, error: { code, message, details } }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}
