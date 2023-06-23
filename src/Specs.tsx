import { For, html, $, Observable } from "voby"
import "./styles/Specs.css"

class Numeric {
  magnitude
  unit
  approximate

  toString() {
    const parts = [this.magnitude.toString()]
    if (this.unit) parts.push(` ${this.unit}`)
    if (this.approximate) parts.unshift("~")
    return parts.join("")
  }

  constructor(magnitude: number, unit?: string, approximate = false) {
    this.magnitude = magnitude
    this.unit = unit
    this.approximate = approximate
  }
}

interface HostSpecOptions<T extends Numeric | string> {
  shortName: string
  id: string
  getIcon: (value: T | null) => string
  getValue: (this: this) => T | null | undefined
  isAvailable?: () => boolean
}

/** Represents a hardware attribute of the host device, e.g. processor clock speed or RAM capacity */
class HostSpec<T extends Numeric | string = string | Numeric> {
  shortName
  isAvailable
  getValue: () => T | null | undefined
  getIcon
  id

  constructor(options: HostSpecOptions<T>) {
    this.shortName = options.shortName
    this.getValue = options.getValue
    this.isAvailable = options.isAvailable || !!this.getValue()
    this.getIcon = () => options.getIcon(this.getValue() || null)
    this.id = options.id
  }
}

function Specs(): JSX.Element {
  const specs: Observable<(HostSpec<string> | HostSpec<Numeric>)[]> = $([
    new HostSpec<Numeric>({
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
    new HostSpec<Numeric>({
      shortName: "Ping",
      id: "ping",
      getIcon: () => "mdi:router-network",
      getValue() {
        const ping = navigator.connection?.rtt
        return ping ? new Numeric(ping, "ms", true) : null
      },
    }),
    new HostSpec<string>({
      shortName: "Network speed category",
      id: "ping",
      getIcon() {
        const effectiveType = navigator.connection?.effectiveType
        if (effectiveType === "slow-2g") return "mdi:signal-cellular-outline"
        if (effectiveType === "2g") return "mdi:signal-cellular-1"
        if (effectiveType === "3g") return "mdi:signal-cellular-2"
        if (effectiveType === "4g") return "mdi:signal-cellular-3"
        return "mdi:signal"
      },
      getValue() {
        const effectiveType = navigator.connection?.effectiveType
        if (!effectiveType) return null
        if (effectiveType === "slow-2g") return "Very slow"
        if (effectiveType === "2g") return "Like 2G"
        if (effectiveType === "3g") return "Like 3G"
        if (effectiveType === "4g") return "4G or faster"
        return effectiveType
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
