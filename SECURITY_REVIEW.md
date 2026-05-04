# Security Review Findings

## 1) Stored/Reflected XSS via unsanitized `innerHTML` (Critical)
- `thinkingMessage.querySelector('.message-text').innerHTML = data.response;` inserts model output directly into the DOM as HTML.
- `formatContent()` also transforms untrusted content into HTML without escaping first.
- Impact: any malicious model response (or upstream prompt-injection content) can execute JavaScript in the user's browser.

## 2) Information leakage in API error responses (Medium)
- Server returns internal exception details to clients via `details: error.message` in both route-level and global handlers.
- This may expose backend URLs, upstream response details, and implementation behavior useful for attackers.

## 3) Overly permissive CORS policy (Medium)
- API sets `Access-Control-Allow-Origin: *` for all requests.
- If this service is ever exposed beyond localhost or includes auth/session context later, this enables untrusted origins to read API responses cross-origin.

## 4) License/compliance mismatch affecting GPL-3.0 distribution claims (High compliance risk)
- Project metadata declares GPL-3.0-only.
- README simultaneously states MIT licensing.
- This contradiction creates legal ambiguity for downstream users and redistributors; it must be resolved before open-sourcing.
