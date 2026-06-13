# Performance Rules

Prefer Server Components.

Use Client Components only for:

- Charts
- Interactive dashboards
- User actions

Avoid unnecessary state.

Use React Query or server fetching patterns if needed.

Keep API responses small.

Cache static patient data.

Avoid excessive agent calls.

Health Agent, Safety Agent, and Care Agent should execute in parallel when possible.

Manager Agent executes after receiving all results.

Minimize rerenders.

Lazy load charts and analytics sections.

Optimize for demo responsiveness.
