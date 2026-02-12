export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Try to get the asset
    let response = await env.ASSETS.fetch(request);

    // If not found (404), serve index.html for SPA routing
    if (response.status === 404) {
      response = await env.ASSETS.fetch(new URL('/index.html', request.url));
    }

    return response;
  }
};
