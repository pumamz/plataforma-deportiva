import assert from 'node:assert/strict';

export class ApiClient {
  constructor(baseUrl = process.env.E2E_API_URL || 'http://localhost:3002') { this.baseUrl = baseUrl; this.token = ''; }
  async request(path, options = {}, expectedStatus = 200) {
    const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers: { 'content-type': 'application/json', ...(this.token ? { authorization: `Bearer ${this.token}` } : {}), ...options.headers } });
    const body = response.status === 204 ? '' : await response.text();
    assert.equal(response.status, expectedStatus, `${options.method || 'GET'} ${path}: ${response.status} ${body}`);
    return body ? JSON.parse(body) : null;
  }
  get(path, status) { return this.request(path, {}, status); }
  post(path, body, status = 201) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }, status); }
  put(path, body, status = 200) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }, status); }
  delete(path, status = 204) { return this.request(path, { method: 'DELETE' }, status); }
}
