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
      id: "effective-type",
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
    new HostSpec<string>({
      shortName: "Connection type",
      id: "connection-type",
      getIcon() {
        const effectiveType = navigator.connection?.type
        if (effectiveType === "wimax") return "mdi:waveform"
        if (effectiveType === "wifi") return "mdi:wifi"
        if (effectiveType === "bluetooth") return "mdi:bluetooth"
        if (effectiveType === "cellular") return "mdi:signal"
        if (effectiveType === "ethernet") return "mdi:ethernet"
        if (effectiveType === "none" && !navigator.onLine)
          return "mdi:lan-disconnect"
        return "mdi:lan-connect"
      },
      getValue() {
        const effectiveType = navigator.connection?.type
        if (!effectiveType || effectiveType === "unknown") return null
        if (effectiveType === "none" && navigator.onLine) {
          // Browser hasn't properly implemented the effectiveType
          // Firefox acts like this as of June 2023
          return null
        }
        if (effectiveType === "wimax") return "Microwave broadband"
        if (effectiveType === "wifi") return "Wi-Fi"
        if (effectiveType === "bluetooth") return "Bluetooth"
        if (effectiveType === "cellular") return "Mobile data"
        if (effectiveType === "ethernet") return "Ethernet"
        if (effectiveType === "mixed") return "Multiple"
        if (effectiveType === "none") return "Offline"
        if (effectiveType === "other") return "Other"
        return effectiveType
      },
    }),
    new HostSpec<Numeric>({
      shortName: "Download speed",
      id: "download-speed",
      getIcon() {
        return "mdi:download-network-outline"
      },
      getValue() {
        const downlinkSpeed = navigator.connection?.downlink
        return downlinkSpeed ? new Numeric(downlinkSpeed, "MB/s") : null
      },
    }),
  ])

  return html` <div class="specs-row">
    <${For} values=${specs}>
    ${(spec: HostSpec) =>
      html`
        <div class="spec-card" id=${spec.id}>
          <h3>${spec.shortName}</h3>
          <iconify-icon icon=${spec.getIcon()}></iconify-icon>
          <div class="value">${spec.getValue()?.toString() || "N/A"}</div>
        </div>
      `}
    </${For}>
  </div> `
}

export default Specs
