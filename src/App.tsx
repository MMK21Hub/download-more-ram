import { $, html, useEffect } from "voby"
import "./styles/App.css"
import "./styles/theme/theme.css"
import "@material/web/button/filled-button.js"
import "@material/web/button/outlined-button"
import "@material/web/fab/fab.js"
import "@material/web/icon/icon.js"
import { globalStateTitle } from "."
import Specs from "./Specs"

function App(): JSX.Element {
  const count = $(0)
  const increment = () => count((value) => value + 1)

  useEffect(() => {
    if (count() > 0) {
      globalStateTitle("Counting")
    }
  })

  return html`
    <header class="bg-header-image-small">
      <div class="bg-header-image">
        <h1>Download More RAM</h1>
        <div class="buttons-row"></div>
      </div>
    </header>
    <div class="content">
      <p>
        <md-filled-button onClick="${increment}"
          >Count: ${count}</md-filled-button
        >
      </p>
      <h2>Specs at a glance</h2>
      <${Specs}></${Specs}>
      <h2>Configure your RAM</h2>
      <p>Coming soon!</p>
    </div>
    <md-fab class="fixed-bottom-right" label="Download" variant="primary"
      ><iconify-icon icon="material-symbols:download" slot="icon"></iconify-icon></md-fab
    >
  `
}

export default App
