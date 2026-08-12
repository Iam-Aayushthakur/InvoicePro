// Structured audit & request logging middleware
export async function logRequest(request: Request): Promise<void> {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
}
