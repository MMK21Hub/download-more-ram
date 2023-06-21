import { $, html } from "voby"
import banner from "/banner.svg"
import "./styles/App.css"
import "@material/web/button/filled-button.js"

function App(): JSX.Element {
  const count = $(0)
  const increment = () => count((value) => value + 1)

  return html`
    <div class="App">
      <header class="header">
        <img src="${banner}" class="logo" alt="logo" />
        <p>
          <button type="button" onClick="${increment}">count: ${count}</button>
        </p>
        <p>Edit <code>src/App.tsx</code> and save to reload.</p>
        <md-filled-button>Learn Voby</md-filled-button>
      </header>
    </div>
  `
}

export default App
