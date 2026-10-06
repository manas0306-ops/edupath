import { handleMockApiRequest } from './mockApiHandler';

// Install global fetch interceptor to gracefully handle static deployments (GitHub Pages)
// and seamless offline mock fallback when backend server is not active.
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;

  window.fetch = async (input, init = {}) => {
    let urlStr = '';
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input && input.url) {
      urlStr = input.url;
    }

    const isApiRequest = urlStr.startsWith('/api') || urlStr.includes('/api/');

    if (isApiRequest) {
      try {
        const response = await originalFetch(input, init);
        const contentType = response.headers.get('content-type') || '';

        // If the backend exists and returns a legitimate JSON response, use it
        if (response.ok && contentType.includes('application/json')) {
          return response;
        }

        // If the server returned an HTML error (e.g., GitHub Pages 404 page)
        // or a 404/500, seamlessly route to the client-side Mock API Engine
        console.info(`[EduPath Interceptor] Real API returned status ${response.status} (${contentType}). Activating client-side mock engine for ${urlStr}.`);
        return handleMockApiRequest(urlStr, init);
      } catch (err) {
        // Network error (no server running or offline)
        console.info(`[EduPath Interceptor] Backend offline or unreachable. Activating client-side mock engine for ${urlStr}.`);
        return handleMockApiRequest(urlStr, init);
      }
    }

    return originalFetch(input, init);
  };
}
