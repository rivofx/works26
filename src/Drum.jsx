import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import projects from './projects'

const N = projects.length
const STEP = 360 / N

export default function Drum() {
  const nav = useNavigate()
  const [active, setActive] = useState(0)
  const [intro, setIntro] = useState(true)
  const cards = useRef([])
  const s = useRef({ pos: -2.4, target: 0, y: null, moved: 0, active: 0 })

  useEffect(() => {
    const st = s.current
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) st.pos = 0
    let raf, idle
    const settle = () => { st.target = Math.round(st.target) }
    const push = (d) => { st.target += d; clearTimeout(idle); idle = setTimeout(settle, 140); setIntro(false) }
    const onWheel = (e) => { e.preventDefault(); push((e.deltaY + e.deltaX) / 420) }
    const onDown = (e) => { st.y = e.clientY; st.moved = 0 }
    const onMove = (e) => {
      if (st.y === null) return
      const dy = e.clientY - st.y; st.y = e.clientY; st.moved += Math.abs(dy)
      if (st.moved > 6) push(-dy / 240)
    }
    const onUp = () => { st.y = null; settle() }
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { st.target = Math.round(st.target) + 1; setIntro(false) }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { st.target = Math.round(st.target) - 1; setIntro(false) }
      if (e.key === 'Enter') nav('/p/' + projects[st.active].slug)
    }
    const t = setTimeout(() => setIntro(false), 2600)
    const tick = () => {
      st.pos += (st.target - st.pos) * 0.09
      const R = Math.min(innerHeight * 0.55, 430)
      document.documentElement.style.setProperty('--R', R + 'px')
      cards.current.forEach((el, i) => {
        if (!el) return
        let d = (((i - st.pos) % N) + N + N / 2) % N - N / 2
        const a = d * STEP
        el.style.transform = `rotateX(${-a}deg) translateZ(${R}px)`
        el.style.opacity = Math.max(0.12, Math.cos((a * Math.PI) / 180)) ** 1.5
      })
      const idx = ((Math.round(st.pos) % N) + N) % N
      if (idx !== st.active) { st.active = idx; setActive(idx) }
      raf = requestAnimationFrame(tick)
    }
    tick()
    addEventListener('wheel', onWheel, { passive: false })
    addEventListener('pointerdown', onDown); addEventListener('pointermove', onMove)
    addEventListener('pointerup', onUp); addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf); clearTimeout(idle); clearTimeout(t)
      removeEventListener('wheel', onWheel); removeEventListener('pointerdown', onDown)
      removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp)
      removeEventListener('keydown', onKey)
    }
  }, [nav])

  const goTo = (i) => {
    const st = s.current
    st.target += ((i - st.target) % N + N + N / 2) % N - N / 2
    st.target = Math.round(st.target); setIntro(false)
  }

  return (
    <div className="home">
      <div className="logo">RIVOFXDEV</div>
      <h2 className={'center-title' + (intro ? '' : ' gone')}>WORKS '26</h2>
      <div className="stage">
        <div className="drum">
          {projects.map((p, i) => (
            <button key={p.slug} ref={(el) => (cards.current[i] = el)} className="card"
              aria-label={`Open ${p.title}`}
              onClick={() => { if (s.current.moved <= 6) nav('/p/' + p.slug) }}>
              {p.cover && <img src={p.cover} alt="" draggable="false" />}
              <span className="cap">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
      <h2 className={'label' + (intro ? ' gone' : '')} key={active}>{projects[active].title}</h2>
      <nav className="index" aria-label="Projects">
        {projects.map((p, i) => (
          <button key={p.slug} className={i === active ? 'on' : ''} onClick={() => goTo(i)}>{p.title}</button>
        ))}
      </nav>
      <div className="hint">Scroll or drag to cycle · click to open</div>
    </div>
  )
}
