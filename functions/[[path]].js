export async function onRequest(context) {
  try {
    // Try to serve the requested asset
    return await context.env.ASSETS.fetch(context.request);
  } catch {
    // If asset doesn't exist, serve index.html for SPA routing
    return context.env.ASSETS.fetch(new Request(new URL('/index.html', context.request.url)));
  }
}
