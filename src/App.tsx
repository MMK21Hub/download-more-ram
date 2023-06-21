import { $, html, useEffect } from "voby"
import banner from "/banner.svg"
import "./styles/App.css"
import "./styles/theme/theme.css"
import "@material/web/button/filled-button.js"
import "@material/web/button/outlined-button"
import "@material/web/fab/fab.js"
import "@material/web/icon/icon.js"
import { globalStateTitle } from "."

function App(): JSX.Element {
  const count = $(0)
  const increment = () => count((value) => value + 1)

  useEffect(() => {
    if (count() > 0) {
      globalStateTitle("Counting")
    }
  })

  return html`
    <div class="App">
      <header class="header">
        <img src="${banner}" class="logo" alt="logo" />
        <p>
          <md-filled-button onClick="${increment}"
            >Count: ${count}</md-filled-button
          >
        </p>
        <p>Edit <code>src/App.tsx</code> and save to reload.</p>
        <md-outlined-button href="https://github.com/vobyjs/voby#readme"
          >Learn Voby</md-outlined-button
        >
      </header>
    </div>
    <md-fab class="fixed-bottom-right" label="Download" variant="primary"
      ><md-icon slot="icon">download</md-icon></md-fab
    >
  `
}

export default App
