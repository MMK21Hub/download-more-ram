// The debounce function receives our function as a parameter
export function debounce<T extends unknown[]>(fn: (...params: T) => unknown) {
  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame: number

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params: T) => {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame)
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      // Call our function and pass any params we received
      fn(...params)
    })
  }
}

// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
export function storeScroll() {
  document.documentElement.dataset.scroll = window.scrollY.toString()
}

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener("scroll", debounce(storeScroll), { passive: true })

// Update scroll position for first time
storeScroll()
