export function fillDefaults(defaults: any, given: any) {
  if (!given) return defaults
  for (const key in defaults) {
    if (!(key in given) || given[key] === undefined) {
      given[key] = defaults[key]
    } else if (given[key] === Object(given[key])) {
      given[key] = fillDefaults(defaults[key], given[key])
    }
  }
  return given
}

export function objectDeepValues<E>(object: any) {
  return getValues(object) as E[]

  function getValues<T extends object>(obj: T) {
    function isObject(val: unknown): val is object {
      return typeof val === "object" && !Array.isArray(val) && val !== null
    }

    function getValues(obj = {}): any[] {
      return Object.entries(obj).reduce((product: any[], [_, value]) => {
        return isObject(value)
          ? product.concat(getValues(value))
          : product.concat(value)
      }, [])
    }

    return getValues(obj) as T[Exclude<keyof T, object>][]
  }
}
