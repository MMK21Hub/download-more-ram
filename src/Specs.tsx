import { For, html, $, Observable } from "voby"
import { Icon } from "./Icon"
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
  getIcon: (value: Numeric | null) => string
  getValue: () => Numeric | null | undefined
  isAvailable?: () => boolean
}

/** Represents a hardware attribute of the host device, e.g. processor clock speed or RAM capacity */
class HostSpec {
  shortName
  isAvailable
  getValue: () => Numeric | null | undefined
  getIcon
  id

  constructor(options: HostSpecOptions) {
    this.shortName = options.shortName
    this.getValue = options.getValue
    this.isAvailable = options.isAvailable || !!this.getValue()
    this.getIcon = () => options.getIcon(this.getValue() || null)
    this.id = options.id
  }
}

function Specs(): JSX.Element {
  const specs: Observable<HostSpec[]> = $([
    new HostSpec({
      shortName: "CPU cores",
      id: "cpu-cores",
      getIcon(value) {
        if (!value) return "mdi:chip"
        const count = value.magnitude
        if (count <= 10) return `mdi:numeric-${count}-box-multiple-outline`
        return "mdi:numeric-9-plus-box-multiple"
      },
      getValue() {
        return new Numeric(navigator.hardwareConcurrency)
      },
    }),
    new HostSpec({
      shortName: "Ping",
      id: "ping",
      getIcon: () => "mdi:router-network",
      getValue() {
        const ping = navigator.connection?.rtt
        return ping ? new Numeric(ping, "ms") : null
      },
    }),
  ])

  return html` <div class="specs-row">
    <${For} values=${specs}>
    ${(spec: HostSpec) =>
      html`<div class="spec-card" id=${spec.id}>
        <h3>${spec.shortName}</h3>
        <iconify-icon icon=${spec.getIcon()}></iconify-icon>
        <div class="value">${spec.getValue()?.toString() || "N/A"}</div>
      </div>`}
    </${For}>
  </div> `
}

export default Specs
