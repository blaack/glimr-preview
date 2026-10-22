(() => {
  const style = document.createElement("style")
  style.textContent = `
    .profile-screen {
      background: #17181a;
    }
    .profile-screen .tabbar {
      background: transparent !important;
      border-radius: 0 !important;
      z-index: 4;
    }
    .profile-screen .bottom-panel-shape {
      position: absolute;
      display: block;
      pointer-events: none;
      overflow: visible;
      z-index: 3;
    }
    .profile-screen .bottom-panel-shape path {
      fill: #232527;
    }
    .profile-screen .reaction-row {
      gap: 42px;
    }
    .profile-screen .reaction-row .super-btn {
      position: relative;
      top: -4px;
      background: none;
      overflow: hidden;
    }
    .profile-screen .reaction-row .super-btn::before {
      content: "";
      position: absolute;
      inset: -5px -3px -26px -28px;
      background: url("./assets/f92b3.png") center / cover no-repeat;
      pointer-events: none;
    }
    .profile-screen .reaction-row .super-btn img {
      position: relative;
      z-index: 1;
    }
  `
  document.head.appendChild(style)

  let frame = 0
  let resizeObserver

  function updatePanel() {
    frame = 0
    const screen = document.querySelector(".profile-screen")
    const nav = screen?.querySelector(".tabbar")
    const button = screen?.querySelector(".super-btn")
    if (!screen || !nav || !button) return

    let svg = screen.querySelector(".bottom-panel-shape")
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.classList.add("bottom-panel-shape")
      svg.setAttribute("aria-hidden", "true")
      svg.setAttribute("preserveAspectRatio", "none")
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      svg.appendChild(path)
      screen.insertBefore(svg, nav)
    }

    const screenRect = screen.getBoundingClientRect()
    const navRect = nav.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    const width = navRect.width
    const height = navRect.height
    const centerX = buttonRect.left + buttonRect.width / 2 - navRect.left
    const centerY = buttonRect.top + buttonRect.height / 2 - navRect.top
    const radius = buttonRect.width / 2 + 8
    const corner = 20
    const chordHalfWidth = Math.sqrt(Math.max(0, radius * radius - centerY * centerY))
    const left = centerX - chordHalfWidth
    const right = centerX + chordHalfWidth

    svg.style.left = `${navRect.left - screenRect.left}px`
    svg.style.top = `${navRect.top - screenRect.top}px`
    svg.style.width = `${width}px`
    svg.style.height = `${height}px`
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    svg.querySelector("path").setAttribute(
      "d",
      [
        `M ${corner} 0`,
        `H ${left}`,
        `A ${radius} ${radius} 0 0 0 ${right} 0`,
        `H ${width - corner}`,
        `Q ${width} 0 ${width} ${corner}`,
        `V ${height}`,
        "H 0",
        `V ${corner}`,
        `Q 0 0 ${corner} 0`,
        "Z",
      ].join(" "),
    )

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver.observe(nav)
      resizeObserver.observe(button)
      resizeObserver.observe(screen)
    }
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updatePanel)
  }

  const mutationObserver = new MutationObserver(scheduleUpdate)
  mutationObserver.observe(document.documentElement, { childList: true, subtree: true })
  resizeObserver = new ResizeObserver(scheduleUpdate)
  window.addEventListener("resize", scheduleUpdate)
  scheduleUpdate()
})()
