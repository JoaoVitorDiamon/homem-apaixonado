import { useState, useEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Scroll Reveal
// ─────────────────────────────────────────────────────────────────────────────

function useReveal() {
  return useCallback(() => {
    const els = document.querySelectorAll('.sr, .sr-scale')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const d = Number((e.target as HTMLElement).dataset.delay ?? 0)
            setTimeout(() => e.target.classList.add('on'), d)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ─────────────────────────────────────────────────────────────────────────────
// Countdown
// ─────────────────────────────────────────────────────────────────────────────

const TARGET = new Date('2026-09-20T00:00:00')

function useCountdown() {
  const calc = () => {
    const d = TARGET.getTime() - Date.now()
    if (d <= 0) return { dd: '00', hh: '00', mm: '00', ss: '00' }
    return {
      dd: String(Math.floor(d / 86400000)).padStart(2, '0'),
      hh: String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0'),
      mm: String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'),
      ss: String(Math.floor((d % 60000) / 1000)).padStart(2, '0'),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared components
// ─────────────────────────────────────────────────────────────────────────────

function Blob({ top, left, size = 600, delay = '0s', opacity = 0.05 }: {
  top?: string; left?: string; size?: number; delay?: string; opacity?: number
}) {
  return (
    <div
      className="blob"
      style={{
        width: size, height: size,
        top: top ?? '50%', left: left ?? '50%',
        transform: (!top && !left) ? 'translate(-50%,-50%)' : undefined,
        background: '#c9946c',
        opacity,
        animationDelay: delay,
      }}
    />
  )
}

function Div({ h = 72 }: { h?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <div className="div-line" style={{ height: h }} />
    </div>
  )
}

function Sec({ label, num }: { label: string; num?: string }) {
  return (
    <span className="ch-label">
      {num ? `${num} — ` : ''}{label}
    </span>
  )
}

function Img({ src, h, alt = '' }: { src: string; h: number; alt?: string }) {
  return (
    <div className="img-wrap" style={{ borderRadius: 2 }}>
      <img src={src} alt={alt} style={{ height: h }} loading="lazy" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TELA 01 — Abertura
// ─────────────────────────────────────────────────────────────────────────────

function Tela01({ onEnter }: { onEnter: () => void }) {
  const onNext = onEnter
  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <Blob top="-15%" left="-20%" size={500} opacity={0.05} />
      <Blob top="60%" left="70%" size={400} delay="5s" opacity={0.04} />

      <div style={{ maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <p
          className="h1 serif"
          style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontStyle: 'italic', color: '#7a7470', marginBottom: 28 }}
        >
          Antes de qualquer coisa…
        </p>

        <h1
          className="h2 serif"
          style={{
            fontSize: 'clamp(26px, 7vw, 42px)',
            fontWeight: 400,
            lineHeight: 1.25,
            color: '#f0ebe3',
            marginBottom: 28,
          }}
        >
          eu sei que você tá pensando muito no dia 20.
        </h1>

        <p
          className="h3"
          style={{
            fontFamily: 'Inter',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            fontWeight: 300,
            color: '#7a7470',
            marginBottom: 56,
            lineHeight: 1.6,
          }}
        >
          Então eu fiz uma coisa.
        </p>

        <button className="h4 btn-ghost" onClick={onNext} style={{ marginBottom: 32 }}>
          entra aqui <span aria-hidden>→</span>
        </button>

        <div className="h5" style={{ marginTop: 8 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#3a3530', fontWeight: 300 }}>
            coloca o som se quiser :)
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(to top, #0d0c0b, transparent)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TELA 02 — Uma Pausa
// ─────────────────────────────────────────────────────────────────────────────

function Tela02({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 2100),
      setTimeout(() => setStep(4), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const show = (n: number) => ({
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
  })

  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 28px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Blob size={700} opacity={0.04} delay="2s" />

      <div style={{ maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <div style={show(1)}>
          <h2
            className="serif"
            style={{
              fontSize: 'clamp(28px, 8vw, 48px)',
              fontWeight: 400,
              color: '#f0ebe3',
              lineHeight: 1.25,
              marginBottom: 20,
            }}
          >
            Por alguns minutos,<br />a prova não existe.
          </h2>
        </div>

        <div style={{ ...show(2), marginBottom: 40 }}>
          <p
            className="serif"
            style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontStyle: 'italic', color: '#c9946c' }}
          >
            Sério.
          </p>
        </div>

        <div style={show(3)}>
          {[
            'Você não precisa estudar aqui.',
            'Não precisa pensar em resultado.',
            'Não precisa tentar lembrar o que faltou estudar.',
            '',
            'Só fica aqui comigo um pouquinho.',
          ].map((line, i) =>
            line === '' ? (
              <div key={i} style={{ height: 20 }} />
            ) : (
              <p
                key={i}
                style={{
                  fontFamily: 'Inter',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: 300,
                  color: i === 4 ? '#cdc8c0' : '#6a6460',
                  lineHeight: 1.7,
                }}
              >
                {line}
              </p>
            )
          )}
        </div>

        <div style={{ ...show(4), marginTop: 56 }}>
          <button className="btn-ghost" onClick={onNext}>
            tá, e o que você fez? <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 01 — A Nossa História
// ─────────────────────────────────────────────────────────────────────────────

const MEMORIES = [
  {
    url: './src/assets/dia-1.jpeg',
    caption: 'Você provavelmente não lembra desse dia. Eu lembro.',
    type: 'tall',
    align: 'left',
  },
  {
    url: './src/assets/dia-2.jpeg',
    caption: 'Esse foi um dia que tudo mudou.',
    type: 'tall',
    align: 'right',
  },
  {
    url: './src/assets/dia-3.jpeg',
    caption: 'Não aconteceu nada de extraordinário aqui. Mas foi importante pois eu tinha você.',
    type: 'polaroid',
    align: 'right',
  },
  {
    url: './src/assets/dia-4.jpeg',
    caption: 'Passar a tarde com voce foi a melhor coisa que eu fiz nesse ano.',
    type: 'tall',
    align: 'left',
  },
  {
    url: './src/assets/dia-5.jpeg',
    caption: 'Esse dia foi um dos melhores que eu passei com você.',
    type: 'wide',
    align: 'center',
  },
  {
    url: './src/assets/dia-6.jpeg',
    caption: 'Ela é feita de um monte de momentos que, certamente, nunca serão esquecidos.',
    type: 'polaroid',
    align: 'left',
  },
]

function Cap01() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 640, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 80 }}>
        <Sec num="01" label="a nossa história" />
        <h2
          className="serif"
          style={{ fontSize: 'clamp(22px, 6vw, 34px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.35 }}
        >
          Antes de você pensar no dia 20, lembra de quantos outros dias já existiram.
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
        {MEMORIES.map((m, i) => {
          const isRight = m.align === 'right'
          const isCenter = m.align === 'center'

          if (m.type === 'polaroid') {
            return (
              <div
                key={i}
                className="sr"
                data-delay={`${i * 80}`}
                style={{
                  width: 'min(240px, 70%)',
                  marginLeft: isRight ? 'auto' : isCenter ? 'auto' : '10%',
                  marginRight: isRight ? '10%' : isCenter ? 'auto' : undefined,
                }}
              >
                <div className="polaroid">
                  <img
                    src={m.url}
                    alt={m.caption}
                    style={{ height: 220 }}
                    loading="lazy"
                  />
                  <p className="pol-caption">{m.caption}</p>
                </div>
              </div>
            )
          }

          return (
            <div
              key={i}
              className="sr"
              data-delay={`${i * 80}`}
              style={{
                width: m.type === 'wide' ? '100%' : 'clamp(200px, 62%, 340px)',
                marginLeft: isRight ? 'auto' : isCenter ? 'auto' : undefined,
                marginRight: isCenter ? 'auto' : undefined,
              }}
            >
              <div className="sr-scale img-wrap" data-delay={`${i * 80 + 40}`} style={{ borderRadius: 2 }}>
                <img
                  src={m.url}
                  alt={m.caption}
                  style={{ height: m.type === 'tall' ? 440 : 280, width: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <p
                className="serif"
                style={{
                  marginTop: 12, fontSize: 14, fontStyle: 'italic',
                  color: '#6a6460', lineHeight: 1.5,
                  textAlign: isRight ? 'right' : isCenter ? 'center' : 'left',
                }}
              >
                {m.caption}
              </p>
            </div>
          )
        })}
      </div>

      {/* closing text */}
      {[
        'Mas quando eu olho tudo junto…',
        'eu não trocaria nenhum deles.',
      ].map((t, i) => (
        <p
          key={i}
          className={`sr serif`}
          data-delay={`${i * 200}`}
          style={{
            fontSize: 'clamp(22px, 6vw, 32px)',
            fontWeight: 400,
            color: i === 1 ? '#f0ebe3' : '#7a7470',
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: i === 0 ? 72 : 16,
            lineHeight: 1.35,
          }}
        >
          {t}
        </p>
      ))}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 02 — Coisas que eu gosto em você
// ─────────────────────────────────────────────────────────────────────────────

const LIKES = [
  { front: 'Seu jeito quando você fica empolgada contando alguma coisa.', back: 'Você gesticula muito. É lindo.' },
  { front: 'Quando você fala de uma coisa que gosta e esquece completamente do tempo.', back: 'Eu nunca interrompo esses momentos.' },
  { front: 'As suas manias nervosas.', back: 'Sou nem doido de falar algo.' },
  { front: 'Quando você está sorrindo.', back: 'Eu me sinto como se o tempo parasse.' },
  { front: 'Seu jeito de transformar meu dia com apenas um "bom dia".', back: 'Nunca fui tão feliz por ter você.' },
  { front: 'Quando você fala "não estou nervosa" estando claramente nervosa.', back: '(como quase sempre) minha oncinha' },
]

function LikeCard({ item }: { item: typeof LIKES[0] }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className="memory-card"
      onClick={() => setFlipped(!flipped)}
      style={{ minHeight: 110 }}
    >
      <p
        className="serif"
        style={{
          fontSize: 16, fontWeight: 400,
          color: flipped ? '#c9946c' : '#cdc8c0',
          lineHeight: 1.5,
          fontStyle: flipped ? 'italic' : 'normal',
          transition: 'color 0.3s ease',
        }}
      >
        {flipped ? item.back : item.front}
      </p>
      {!flipped && <span className="card-hint">toca aqui</span>}
    </div>
  )
}

function Cap02() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 600, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 64 }}>
        <Sec num="02" label="coisas que eu gosto em você" />
        <h2
          className="serif"
          style={{ fontSize: 'clamp(20px, 5.5vw, 30px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.35 }}
        >
          Coisas que eu gosto em você e provavelmente nunca falo o suficiente.
        </h2>
        <p style={{ marginTop: 12, fontFamily: 'Inter', fontSize: 12, color: '#5a5450', fontWeight: 300 }}>
          clica em cada uma
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LIKES.map((item, i) => (
          <div key={i} className="sr" data-delay={`${i * 60}`}>
            <LikeCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 03 — Intervalo (quiz)
// ─────────────────────────────────────────────────────────────────────────────

const QUIZ = [
  { q: 'quem demora mais pra decidir alguma coisa?', a: 'você. com toda certeza.' },
  { q: 'quem fala mais?', a: 'eu KKKK. mais eu te escutaria a minha vida inteira.' },
  { q: 'quem é mais dramático?', a: '...prefiro não responder.' },
  { q: 'quem e mais fedido?', a: 'você. mas eu te amo.' },
  { q: 'quem começou a gostar primeiro?', a: 'vou deixar você pensar nisso. (voce sabe quem foi)' },
  { q: 'quem está mais animado com o futuro?', a: 'eu. pq vc nao tem ideia do privilégio que eu tenho de ter você.' },
]

function QuizItem({ item }: { item: typeof QUIZ[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <button
        className={`quiz-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {item.q}
        <span className="arrow" aria-hidden>›</span>
      </button>
      <div className={`quiz-answer ${open ? 'open' : ''}`}>
        <div
          style={{
            padding: '14px 20px 20px',
            borderLeft: '1px solid #c9946c',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <p className="serif" style={{ fontSize: 15, fontStyle: 'italic', color: '#c9946c' }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

function Cap03() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 580, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 64 }}>
        <Sec num="03" label="intervalo" />
        <h2
          className="serif"
          style={{ fontSize: 'clamp(22px, 6vw, 34px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.3 }}
        >
          Pausa para assuntos extremamente importantes.
        </h2>
      </div>

      <div className="sr" data-delay="100" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {QUIZ.map((item, i) => <QuizItem key={i} item={item} />)}
      </div>

      <div
        className="sr"
        data-delay="200"
        style={{ textAlign: 'center', marginTop: 56 }}
      >
        <p className="serif" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontStyle: 'italic', color: '#7a7470' }}>
          Pronto. Agora podemos voltar a falar sério.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 04 — Você
// ─────────────────────────────────────────────────────────────────────────────

const ANXIETY_LINES = [
  { text: 'E eu sei que falar "não fica nervosa" não faz o nervosismo desaparecer.', serif: false, color: '#6a6460', delay: 100 },
  { text: 'Então eu não vou falar isso.', serif: false, color: '#5a5450', delay: 200 },
  { text: 'Você pode ficar nervosa.', serif: true, color: '#cdc8c0', delay: 320, size: 'clamp(18px, 5vw, 24px)' },
  { text: 'Pode sentir frio na barriga.', serif: true, color: '#cdc8c0', delay: 440, size: 'clamp(18px, 5vw, 24px)' },
  { text: 'Pode chegar lá e achar que esqueceu metade do que estudou.', serif: false, color: '#6a6460', delay: 560 },
  { text: 'Pode sair de uma questão achando que fez tudo errado.', serif: false, color: '#6a6460', delay: 640 },
  { text: 'Isso não significa que você não está preparada.', serif: true, color: '#c9946c', delay: 800, size: 'clamp(20px, 5.5vw, 28px)' },
  { text: 'Significa só que isso é importante para você.', serif: false, color: '#7a7470', delay: 920 },
]

function Cap04() {
  return (
    <section
      style={{
        padding: '120px 24px',
        maxWidth: 520,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Blob size={700} opacity={0.04} delay="3s" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="sr" data-delay="0" style={{ marginBottom: 56 }}>
          <Sec num="04" label="você" />
          <h2
            className="serif"
            style={{ fontSize: 'clamp(32px, 9vw, 52px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.2 }}
          >
            Agora falando de você.
          </h2>
        </div>

        <div
          className="sr"
          data-delay="60"
          style={{ marginBottom: 32 }}
        >
          <p
            className="serif"
            style={{ fontSize: 'clamp(20px, 5.5vw, 28px)', fontStyle: 'italic', color: '#d4cec6' }}
          >
            "Eu sei que você está ansiosa."
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ANXIETY_LINES.map((l, i) => (
            <div key={i} className="sr" data-delay={String(l.delay)}>
              <p
                className={l.serif ? 'serif' : ''}
                style={{
                  fontFamily: l.serif ? undefined : 'Inter',
                  fontSize: l.size ?? 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: l.serif ? 400 : 300,
                  color: l.color,
                  lineHeight: 1.65,
                }}
              >
                {l.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 05 — Tudo além da prova
// ─────────────────────────────────────────────────────────────────────────────

const BEYOND_IMGS = [
  { url: './src/assets/atacama.webp', label: 'lugares' },
  { url: './src/assets/paris.jpg', label: 'comida' },
  { url: './src/assets/allianz.jpg', label: 'um dia qualquer' },
  { url: './src/assets/tvd.jpg', label: 'manhãs' },
]

const BEYOND_LINES = [
  { text: 'Existem dias normais.', c: '#6a6460' },
  { text: 'Dias engraçados.', c: '#6a6460' },
  { text: 'Dias em que nada acontece.', c: '#6a6460' },
  { text: 'Dias em que a gente vai sair sem ter planejado.', c: '#7a7470' },
  { text: 'Dias em que você vai rir de alguma coisa completamente idiota.', c: '#7a7470' },
  { text: 'Dias que ainda nem aconteceram.', c: '#cdc8c0' },
  { text: 'E eu quero estar em todos eles com você.', c: '#c9946c' },
]

function Cap05() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 620, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 64 }}>
        <Sec num="05" label="tudo além da prova" />
      </div>

      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 16 }}>
        <p className="serif" style={{ fontSize: 'clamp(28px, 8vw, 46px)', color: '#f0ebe3', fontWeight: 400 }}>
          O dia 20 é importante.
        </p>
      </div>
      <div className="sr" data-delay="200" style={{ textAlign: 'center', marginBottom: 72 }}>
        <p
          className="serif"
          style={{ fontSize: 'clamp(22px, 6vw, 36px)', color: '#c9946c', fontStyle: 'italic', fontWeight: 400 }}
        >
          Mas ele é só um dia.
        </p>
      </div>

      {/* photo grid */}
      <div className="sr sr-scale" data-delay="100" style={{ marginBottom: 72 }}>
        <div className="future-grid">
          {BEYOND_IMGS.map((img, i) => (
            <div key={i} className="f-item" style={{ height: i === 0 ? 320 : 200 }}>
              <img src={img.url} alt={img.label} style={{ height: i === 0 ? 320 : 200 }} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="sr" data-delay="0" style={{ marginBottom: 32 }}>
        <p className="serif" style={{ fontSize: 'clamp(18px, 5vw, 24px)', color: '#cdc8c0', fontStyle: 'italic', textAlign: 'center' }}>
          "Existe tanta coisa esperando você depois desse dia."
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {BEYOND_LINES.map((l, i) => (
          <div key={i} className="sr" data-delay={`${i * 80}`}>
            <p
              className={i >= 5 ? 'serif' : ''}
              style={{
                fontFamily: i < 5 ? 'Inter' : undefined,
                fontSize: i >= 5 ? 'clamp(18px, 5vw, 24px)' : 15,
                fontWeight: i < 5 ? 300 : 400,
                fontStyle: i === 6 ? 'italic' : 'normal',
                color: l.c,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {l.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 06 — Orgulho
// ─────────────────────────────────────────────────────────────────────────────

function Cap06() {
  return (
    <section
      style={{
        padding: '120px 24px',
        maxWidth: 520,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Blob size={800} opacity={0.05} delay="1s" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="sr" data-delay="0" style={{ marginBottom: 20 }}>
          <Sec num="06" label="antes de qualquer resultado" />
        </div>

        {[
          { t: 'Eu já tenho orgulho de você.', big: true, c: '#f0ebe3', delay: 0 },
          { t: 'Antes da prova.', big: false, c: '#c9946c', delay: 150 },
          { t: 'Antes da nota.', big: false, c: '#c9946c', delay: 260 },
          { t: 'Antes do resultado.', big: false, c: '#c9946c', delay: 370 },
        ].map((l, i) => (
          <div key={i} className="sr" data-delay={String(l.delay)} style={{ marginBottom: i === 0 ? 36 : 12 }}>
            <p
              className="serif"
              style={{
                fontSize: l.big ? 'clamp(34px, 10vw, 58px)' : 'clamp(20px, 5.5vw, 28px)',
                fontWeight: 400,
                color: l.c,
                fontStyle: l.big ? 'normal' : 'italic',
              }}
            >
              {l.t}
            </p>
          </div>
        ))}

        <div className="sr" data-delay="0" style={{ marginTop: 56 }}>
          <div
            style={{
              borderTop: '1px solid #252220',
              paddingTop: 40,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              textAlign: 'left',
            }}
          >
            {[
              'Porque eu vi você chegar até aqui.',
              'Vi o esforço.',
              'Vi os dias em que você estava cansada.',
              'Vi quando você achou que não estava conseguindo.',
              'E mesmo assim você continuou.',
            ].map((t, i) => (
              <div key={i} className="sr" data-delay={`${i * 80}`}>
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: 300,
                    color: '#6a6460',
                    lineHeight: 1.7,
                  }}
                >
                  {t}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="sr" data-delay="0" style={{ marginTop: 48 }}>
          <p
            className="serif"
            style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontStyle: 'italic', color: '#8a8479', lineHeight: 1.6 }}
          >
            "Então não deixa algumas horas dentro de uma sala fazer você esquecer tudo que existiu antes delas."
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 07 — Se der medo
// ─────────────────────────────────────────────────────────────────────────────

const FEARS = [
  {
    btn: 'se eu esquecer tudo',
    msg: 'Respira.\n\nVocê não precisa resolver a prova inteira na sua cabeça de uma vez.\n\nSó a próxima questão.\nDepois a próxima.\nE depois mais uma.',
  },
  {
    btn: 'se eu achar que fui mal',
    msg: 'Ainda faltam questões.\n\nUma de cada vez. Você está lá por uma razão.\n\nNão decide o resultado antes da hora.',
  },
  {
    btn: 'se eu travar',
    msg: 'Para.\n\nFecha os olhos um segundo.\n\nRespira fundo.\n\nComeça de novo.\n\nVocê já fez isso antes.',
  },
  {
    btn: 'se eu começar a chorar',
    msg: 'Tudo bem.\n\nVocê pode chorar.\n\nSó não esquece de continuar depois.',
  },
  {
    btn: 'se eu quiser desistir',
    msg: 'Eu sei que você não vai sabe pq você é forte demais.\n\nMas se chegar perto, lembra que eu tô do lado de fora esperando.\n\n',
  },
]

function FearButton({ item }: { item: typeof FEARS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <button className={`fear-btn ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}>
        {item.btn}
      </button>
      {open && (
        <div
          style={{
            borderLeft: '1px solid #c9946c',
            padding: '20px 20px 20px 24px',
            animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          {item.msg.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 300,
                color: '#8a8479',
                lineHeight: 1.75,
                marginBottom: i < item.msg.split('\n\n').length - 1 ? 12 : 0,
              }}
            >
              {para.split('\n').map((line, j) => (
                <span key={j}>{line}{j < para.split('\n').length - 1 && <br />}</span>
              ))}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function Cap07() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 580, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 64 }}>
        <Sec num="07" label="se der medo" />
        <h2
          className="serif"
          style={{ fontSize: 'clamp(24px, 6.5vw, 38px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.3 }}
        >
          Se bater o nervosismo…
        </h2>
        <p style={{ marginTop: 12, fontFamily: 'Inter', fontSize: 12, color: '#5a5450', fontWeight: 300 }}>
          clica no que você estiver sentindo
        </p>
      </div>

      <div className="sr" data-delay="100" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FEARS.map((item, i) => <FearButton key={i} item={item} />)}
      </div>

      <div className="sr" data-delay="200" style={{ textAlign: 'center', marginTop: 56 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#4a4440', fontWeight: 300 }}>
          Você não está sozinha.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 08 — A carta
// ─────────────────────────────────────────────────────────────────────────────

const LETTER_PARAS = [
  'Eu estava pensando em como te falar algumas coisas que ficam difíceis de colocar em palavras na hora certa. Então escrevi.',
  'Você é a pessoa mais importante que eu já conheci. Voce nao tem ideia do quanto vc melhora a vida de todos que te conhecem.',
  'Essa prova é importante. Eu sei. E você estudou pra ela com uma dedicação que eu acompanhei de perto. Mas você não é a sua nota. Você não é o resultado de um dia.',
  'Você é toda a história que existiu antes desse dia e tudo que vai existir depois.',
  'Independente de qualquer coisa que aconteça no dia 20, eu vou estar aqui. Não da boca pra fora. Mas sim do seu lado: te esperando. Você vai me contar como foi, e a vida vai continuar — bonita (e atrapalhada), do nosso jeito.',
  'Eu tenho orgulho de tudo que você é, não do que você faz ou consegue fazer. Voce é uma pessoa incrivel. Eu vejo Jesus em você.',
  'E eu te amo. Bastante. Mais do que qualquer texto consegue explicar.',
]

function Cap08() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 600, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 56 }}>
        <Sec num="08" label="uma carta que não cabia na carta" />
        <h2
          className="serif"
          style={{ fontSize: 'clamp(20px, 5.5vw, 30px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.35 }}
        >
          Eu ainda tinha algumas coisas pra te falar.
        </h2>
      </div>

      <div className="sr sr-scale" data-delay="100">
        <div className="letter-wrap">
          <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#8a7c6c', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32 }}>
            para você
          </p>
          {LETTER_PARAS.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: i === 3 || i === 5 ? 'DM Serif Display, serif' : 'Inter',
                fontSize: i === 3 || i === 5 ? 'clamp(16px, 4.5vw, 20px)' : 15,
                fontWeight: i === 3 || i === 5 ? 400 : 300,
                fontStyle: i === 3 || i === 5 ? 'italic' : 'normal',
                color: i === 3 ? '#7a5c3c' : i === 5 ? '#8a5c3c' : '#3a3028',
                lineHeight: 1.85,
                marginBottom: i < LETTER_PARAS.length - 1 ? 24 : 0,
              }}
            >
              {p}
            </p>
          ))}
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#8a7c6c', marginTop: 36, letterSpacing: '0.1em' }}>
            — eu
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 09 — A coisa muito séria
// ─────────────────────────────────────────────────────────────────────────────

const CHECKLIST = [
  { q: 'comeu?', s: 'Vai comer.', emoji: '🍽️' },
  { q: 'dormiu?', s: 'Vai dormir.', emoji: '😴' },
  { q: 'parou de estudar por 5 minutos?', s: 'Faz uma pausa.', emoji: '⏸️' },
  { q: 'respirou?', s: 'Agora sim.', emoji: '🌬️' },
]

function Cap09() {
  const [step, setStep] = useState<'start' | 'reveal' | 'check'>('start')
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  return (
    <section style={{ padding: '96px 24px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
      <div className="sr" data-delay="0" style={{ marginBottom: 20 }}>
        <Sec num="09" label="assunto muito sério" />
      </div>

      <div className="sr" data-delay="0" style={{ marginBottom: 48 }}>
        <h2
          className="serif"
          style={{ fontSize: 'clamp(22px, 6vw, 34px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.3 }}
        >
          Eu preciso te falar uma coisa muito importante.
        </h2>
      </div>

      {step === 'start' && (
        <div className="sr" data-delay="200">
          <button className="btn-border" onClick={() => setStep('reveal')}>
            fala
          </button>
        </div>
      )}

      {step === 'reveal' && (
        <div style={{ animation: 'fadeIn 0.6s ease forwards' }}>
          <p
            className="serif"
            style={{ fontSize: 'clamp(22px, 6vw, 32px)', color: '#f0ebe3', marginBottom: 16 }}
          >
            Você já foi cortar sua unha do dedidnho sebosa?
          </p>
          <p
            className="serif"
            style={{ fontSize: 'clamp(24px, 7vw, 38px)', color: '#c9946c', fontStyle: 'italic', marginBottom: 32 }}
          >
            kkkkkkkk
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15, color: '#6a6460', marginBottom: 40, fontWeight: 300 }}>
            Vai.
          </p>
          <button className="btn-border" onClick={() => setStep('check')}>
            já fui
          </button>
        </div>
      )}

      {step === 'check' && (
        <div style={{ animation: 'fadeIn 0.6s ease forwards' }}>
          <p
            className="serif"
            style={{ fontSize: 'clamp(20px, 5.5vw, 28px)', color: '#c9946c', fontStyle: 'italic', marginBottom: 48 }}
          >
            Claro que vc nao foi.<br />Vai cortar sua unha.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginBottom: 40 }}>
            {CHECKLIST.map((item, i) => (
              <button
                key={i}
                onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: 'none',
                  border: `1px solid ${checked[i] ? '#c9946c' : '#252220'}`,
                  borderRadius: 2,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16 }}>{checked[i] ? '✓' : item.emoji}</span>
                <span
                  style={{
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: 300,
                    color: checked[i] ? '#c9946c' : '#7a7470',
                    textDecoration: checked[i] ? 'line-through' : 'none',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {checked[i] ? item.s : item.q}
                </span>
              </button>
            ))}
          </div>

          {Object.keys(checked).length === 4 && Object.values(checked).every(Boolean) && (
            <p
              className="serif"
              style={{ fontSize: 18, fontStyle: 'italic', color: '#c9946c', animation: 'fadeIn 0.6s ease forwards' }}
            >
              Agora sim. 🙂
            </p>
          )}
        </div>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 11 — O dia 20
// ─────────────────────────────────────────────────────────────────────────────

function Cap11() {
  const t = useCountdown()

  return (
    <section
      style={{
        padding: '120px 24px',
        maxWidth: 520,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Blob size={700} opacity={0.05} delay="0s" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="sr" data-delay="0" style={{ marginBottom: 48 }}>
          <Sec num="11" label="o dia 20" />
          <h2
            className="serif"
            style={{ fontSize: 'clamp(24px, 7vw, 40px)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.3 }}
          >
            Quando chegar o dia 20…
          </h2>
        </div>

        <div
          className="sr"
          data-delay="100"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 'clamp(16px, 5vw, 36px)',
            maxWidth: 440,
            margin: '0 auto 48px',
          }}
        >
          {[
            { v: t.dd, l: 'dias' },
            { v: t.hh, l: 'horas' },
            { v: t.mm, l: 'min' },
            { v: t.ss, l: 'seg' },
          ].map(({ v, l }) => (
            <div key={l} className="cd-unit">
              <span className="cd-num" style={{ fontSize: 'clamp(30px, 9vw, 48px)' }} key={v}>{v}</span>
              <span className="cd-label">{l}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { t: 'Até lá, vai existir ansiedade.', accent: false },
            { t: 'Tudo bem.', accent: true, italic: true },
            { t: 'Ela passa.', accent: false, small: true },
            { t: 'Vai existir frio na barriga.', accent: false },
            { t: 'Tudo bem.', accent: true, italic: true },
            { t: 'Você respira.', accent: false, small: true },
            { t: 'E quando chegar a hora…', accent: false },
            { t: 'você faz uma questão de cada vez.', accent: true, big: true },
          ].map((l, i) => (
            <div key={i} className="sr" data-delay={`${i * 80}`}>
              <p
                className={l.italic || l.big ? 'serif' : ''}
                style={{
                  fontFamily: !l.italic && !l.big ? 'Inter' : undefined,
                  fontSize: l.big ? 'clamp(20px, 5.5vw, 28px)' : l.small ? 13 : 15,
                  fontWeight: l.big ? 400 : 300,
                  fontStyle: l.italic ? 'italic' : 'normal',
                  color: l.accent ? '#c9946c' : '#6a6460',
                  lineHeight: 1.6,
                }}
              >
                {l.t}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAP 12 — Depois
// ─────────────────────────────────────────────────────────────────────────────

const FUTURE_IMGS = [
  { url: './src/assets/atacama.webp', label: 'o que vem depois' },
  { url: './src/assets/paris.jpg', label: 'lugares' },
  { url: './src/assets/allianz.jpg', label: 'momentos' },
]

function Cap12() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 600, margin: '0 auto' }}>
      <div className="sr" data-delay="0" style={{ textAlign: 'center', marginBottom: 64 }}>
        <Sec num="12" label="depois" />
        <h2
          className="serif"
          style={{ fontSize: 'clamp(32px, 10vw, 56px)', fontWeight: 400, color: '#f0ebe3' }}
        >
          E depois?
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          'Depois você sai.',
          'Respira.',
          'Come alguma coisa.',
          'Me conta como foi.',
          'E a gente segue.',
          'Porque a vida continua.',
          'E ainda tem muita coisa pra gente viver.',
        ].map((t, i) => (
          <div key={i} className="sr" data-delay={`${i * 70}`}>
            <p
              className={i === 6 ? 'serif' : ''}
              style={{
                fontFamily: i === 6 ? undefined : 'Inter',
                fontSize: i === 6 ? 'clamp(20px, 5.5vw, 28px)' : i < 2 ? 16 : 14,
                fontWeight: i === 6 ? 400 : 300,
                fontStyle: i === 6 ? 'italic' : 'normal',
                color: i === 6 ? '#c9946c' : i < 2 ? '#cdc8c0' : '#6a6460',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {t}
            </p>
          </div>
        ))}
      </div>

      {/* future photos */}
      <div className="sr sr-scale" data-delay="200" style={{ marginTop: 64 }}>
        <div className="future-grid">
          {FUTURE_IMGS.map((img, i) => (
            <div key={i} className="f-item" style={{ height: i === 0 ? 300 : 180 }}>
              <img src={img.url} alt={img.label} style={{ height: i === 0 ? 300 : 180 }} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Final — A última surpresa
// ─────────────────────────────────────────────────────────────────────────────

function Final({ onRestart }: { onRestart: () => void }) {
  const [step, setStep] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStep(1)
          setTimeout(() => setStep(2), 1200)
          setTimeout(() => setStep(3), 2200)
          setTimeout(() => setStep(4), 3400)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fade = (n: number) => ({
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)',
  })

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Blob size={700} opacity={0.06} delay="0s" />

      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(to bottom, #0d0c0b, transparent)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
        {/* "era isso" */}
        <div style={{ ...fade(1), marginBottom: 20 }}>
          <p className="serif" style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontStyle: 'italic', color: '#7a7470' }}>
            Bom…
          </p>
        </div>
        <div style={{ ...fade(1), marginBottom: 64 }}>
          <p className="serif" style={{ fontSize: 'clamp(22px, 6vw, 34px)', fontWeight: 400, color: '#cdc8c0' }}>
            Era isso.
          </p>
        </div>
        <div style={{ ...fade(1), marginBottom: 80 }}>
          <p style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 300, color: '#6a6460', lineHeight: 1.7 }}>
            Espero que seu dia tenha ficado um pouquinho mais leve.
          </p>
        </div>

        {/* surprise */}
        <div style={{ ...fade(2), marginBottom: 12 }}>
          <p className="serif" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontStyle: 'italic', color: '#7a7470' }}>
            Ah.
          </p>
        </div>
        <div style={{ ...fade(2), marginBottom: 56 }}>
          <p className="serif" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontStyle: 'italic', color: '#7a7470' }}>
            Quase esqueci.
          </p>
        </div>

        {/* last photo */}
        <div style={{ ...fade(3), marginBottom: 40 }}>
          <div
            className="img-wrap"
            style={{
              borderRadius: 2,
              maxWidth: 340,
              margin: '0 auto',
            }}
          >
            <img
              src="./src/assets/dia-6.jpeg"
              alt="nós"
              style={{ height: 380 }}
              loading="lazy"
            />
          </div>
        </div>

        {/* final words */}
        <div style={{ ...fade(4), display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
          <p
            className="serif"
            style={{ fontSize: 'clamp(28px, 8vw, 44px)', fontWeight: 400, color: '#f0ebe3' }}
          >
            Eu te amo.
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 300, color: '#6a6460', lineHeight: 1.7 }}>
            Muito mais do que qualquer site conseguiria explicar.
          </p>
          <div style={{ height: 24 }} />
          <p
            className="serif"
            style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontStyle: 'italic', color: '#c9946c' }}
          >
            Boa sorte amanhã, meu amor.
          </p>
        </div>

        {/* restart */}
        <div style={fade(4)}>
          <button className="btn-ghost" onClick={onRestart}>
            voltar ao começo <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'hero' | 'pause' | 'main'

export default function App() {
  const [phase, setPhase] = useState<Phase>('hero')
  const pauseRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const activateReveal = useReveal()

  const goToPause = () => {
    setPhase('pause')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pauseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }

  const goToMain = () => {
    setPhase('main')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(activateReveal, 400)
      })
    })
  }

  const restart = () => {
    setPhase('hero')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // re-run reveal on scroll during main phase
  useEffect(() => {
    if (phase !== 'main') return
    const cleanup = activateReveal()
    const onScroll = () => activateReveal()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cleanup?.() }
  }, [phase, activateReveal])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div style={{ background: '#0d0c0b', minHeight: '100svh' }}>

        <Tela01 onEnter={goToPause} />

        {(phase === 'pause' || phase === 'main') && (
          <div ref={pauseRef}>
            <Tela02 onNext={goToMain} />
          </div>
        )}

        {phase === 'main' && (
          <div ref={mainRef}>
            <Div h={64} />
            <Cap01 />
            <Div h={80} />
            <Cap02 />
            <Div h={80} />
            <Cap03 />
            <Div h={80} />
            <Cap04 />
            <Div h={80} />
            <Cap05 />
            <Div h={80} />
            <Cap06 />
            <Div h={80} />
            <Cap07 />
            <Div h={80} />
            <Cap08 />
            <Div h={80} />
            <Cap09 />
            <Div h={80} />
            <Cap11 />
            <Div h={80} />
            <Cap12 />
            <Div h={64} />
            <Final onRestart={restart} />
          </div>
        )}
      </div>
    </>
  )
}
