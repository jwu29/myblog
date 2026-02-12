export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Try to serve the exact asset first
    let response = await env.ASSETS.fetch(request);

    // If 404 and doesn't look like a file (no extension or is an HTML file), serve index.html
    if (response.status === 404 && !pathname.includes('.')) {
      const indexUrl = new URL('/index.html', url.origin);
      response = await env.ASSETS.fetch(indexUrl);
    }

    return response;
  }
};
