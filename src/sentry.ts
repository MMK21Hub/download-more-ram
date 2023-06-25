import { init as initSentry, BrowserTracing, Replay } from "@sentry/browser"

export function enableSentry() {
  initSentry({
    dsn: "https://23662a37849748cebdaa1c54201e5372@o539976.ingest.sentry.io/4505415320731648",
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: [window.location.hostname],
      }),
      new Replay(),
    ],
    // Percentage of transactions to record for performance monitoring
    tracesSampleRate: 1.0,
    // Percentage of transactions to record for error tracking
    replaysSessionSampleRate: 0.1,
    // Percentage of transactions to record for error tracking if an error has occurred
    replaysOnErrorSampleRate: 1.0,
  })
}
