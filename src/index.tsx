/* @refresh reload */
import { render, $, useEffect } from "voby"

import "./styles/global.css"
import App from "./App"
import { config } from "./config"

useEffect(() => {
  const shouldLoad = config.general.sentry.enabled()
  if (!shouldLoad) return
  import("./sentry").then(({ enableSentry }) => enableSentry())
})

render(<App />, document.getElementById("app"))

export const globalStateTitle = $("Ready")

useEffect(() => {
  document.title = `${globalStateTitle()} — Download More RAM`
})
