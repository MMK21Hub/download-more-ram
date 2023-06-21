/* @refresh reload */
import { render, $, useEffect } from "voby"

import "./styles/global.css"
import App from "./App"

render(<App />, document.getElementById("app"))

export const globalStateTitle = $("Ready")

useEffect(() => {
  document.title = `${globalStateTitle()} — Download More RAM`
})
