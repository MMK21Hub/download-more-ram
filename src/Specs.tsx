import { For, html, $, Observable } from "voby"
import "./styles/Specs.css"

class Numeric {
  magnitude
  unit?

  toString() {
    if (this.unit) {
      return `${this.magnitude} ${this.unit}`
    }

    return `${this.magnitude}`
  }

  constructor(magnitude: number, unit?: string) {
    this.magnitude = magnitude
    this.unit = unit
  }
}

interface HostSpecOptions {
  shortName: string
  id: string
  icon: string
  getValue: () => Numeric
  isAvailable?: () => boolean
}

/** Represents a hardware attribute of the host device, e.g. processor clock speed or RAM capacity */
class HostSpec {
  shortName
  isAvailable?
  getValue
  icon
  id

  constructor(options: HostSpecOptions) {
    this.shortName = options.shortName
    this.isAvailable = options.isAvailable
    this.getValue = options.getValue
    this.icon = options.icon
    this.id = options.id
  }
}

function Specs(): JSX.Element {
  const specs: Observable<HostSpec[]> = $([
    new HostSpec({
      shortName: "CPU cores",
      id: "cpu-cores",
      icon: "splitscreen",
      getValue() {
        return new Numeric(navigator.hardwareConcurrency)
      },
    }),
  ])

  return html` <div class="specs-row">
    <${For} values=${specs}>
    ${(spec: HostSpec) =>
      html`<div class="spec-card" id=${spec.id}>
        <h3>${spec.shortName}</h3>
        <md-icon>${spec.icon}</md-icon>
        <div class="value">${spec.getValue().toString()}</div>
      </div>`}
    </${For}>
  </div> `
}

export default Specs