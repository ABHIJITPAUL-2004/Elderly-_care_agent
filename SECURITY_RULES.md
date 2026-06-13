# Yorisoi AI Security Rules

Never expose GROQ_API_KEY to the client.

All AI calls must occur inside server-side API routes.

Never call Groq directly from React components.

Never store secrets in:

- localStorage
- sessionStorage
- client-side code

Use environment variables only.

Validate all request payloads using Zod.

Never trust user input.

Assume all API requests are malicious until validated.

Avoid dangerouslySetInnerHTML.

Avoid eval.

Avoid executing generated code.

Use TypeScript strict typing.

Log errors but never expose stack traces to users.

Return safe error messages.

Prefer Server Components when possible.

Only mark components as "use client" when necessary.
