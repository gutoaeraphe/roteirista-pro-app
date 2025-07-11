import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // Check on mount (client-side)
    checkIsMobile();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Add listener for changes
    mql.addEventListener("change", checkIsMobile)

    return () => mql.removeEventListener("change", checkIsMobile)
  }, [])

  return isMobile
}
