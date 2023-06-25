import { isObservable, useEffect } from "voby"
import { fillDefaults, objectDeepValues } from "./util"
import { $, Observable } from "voby"

type $<T> = Observable<T>
type ObservableTree = { [key: string]: Observable<any> | ObservableTree }
type JSONSafe =
  | string
  | number
  | boolean
  | null
  | { [property: string]: JSONSafe }
  | JSONSafe[]

export interface Config extends ObservableTree {
  general: {
    sentry: {
      enabled: $<boolean>
    }
  }
}

export const defaultConfig: Config = {
  general: {
    sentry: {
      enabled: $(false),
    },
  },
}

const savedConfig = JSON.parse(
  localStorage.getItem("config") || "{}",
  (_, value) =>
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value).toString() === "[object Object]"
      ? value
      : $(deserializeValue(value))
)

export const config: Config = savedConfig
  ? fillDefaults(defaultConfig, savedConfig)
  : defaultConfig

useEffect(() => {
  // Subscribe to all the observables in the config object
  objectDeepValues<Observable>(config).forEach((value) => value())

  localStorage.setItem(
    "config",
    JSON.stringify(config, (_, value) =>
      isObservable(value) ? serializeValue(value()) : serializeValue(value)
    )
  )
})

function serializeValue(value: unknown): JSONSafe {
  // @ts-ignore JSON.stringify can handle any on-safe values for us anyway
  return value
}

function deserializeValue(value: JSONSafe) {
  return value
}

// @ts-ignore
window.config = config
