import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Steven Bartlett Style Memo",
  description:
    "Research memo and stylist shortlist for Steven Bartlett-adjacent menswear, prioritizing US-based stylists.",
}

type Stylist = {
  name: string
  fit: string
  fitTone: "strong" | "good" | "wildcard"
  based: string
  region: "US" | "UK"
  knownFor: string
  summary: string
  bestFor: string
  links: { label: string; href: string }[]
}

const stylists: Stylist[] = [
  {
    name: "Ilaria Urbinati",
    fit: "Very strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    knownFor:
      "Donald Glover, Chris Evans, Ryan Reynolds, James Marsden, Barry Keoghan, Dwayne Johnson",
    summary:
      "Probably the clearest match if the goal is refined menswear with personality. Her lane is polished but never stiff: chunky knits, barn jackets, elegant tailoring, and relaxed European cool instead of corporate boardroom energy.",
    bestFor:
      "The cleanest version of Steven’s current aesthetic: elevated, masculine, modern, and comfortable on stage.",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/ilariaurbinati/" },
      { label: "Agency profile", href: "https://thewallgroup.com/artist/ilaria-urbinati/" },
    ],
  },
  {
    name: "Warren Alfie Baker",
    fit: "Very strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    knownFor:
      "Andrew Garfield, Glen Powell, Matt Bomer, Andrew Scott, Ben Affleck, Patrick Dempsey",
    summary:
      "Baker’s sweet spot is the classic suit with a sharper, younger twist. The work often lands in monochrome tailoring, smart experimentation, and refined red-carpet dressing that still reads clean rather than fussy.",
    bestFor:
      "A slightly younger, sharper version of Bartlett’s look without losing ease or masculinity.",
    links: [{ label: "Instagram", href: "https://www.instagram.com/warrenalfiebaker/" }],
  },
  {
    name: "Jeanne Yang",
    fit: "Strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    knownFor:
      "Keanu Reeves, Jason Momoa, Christian Bale, Simu Liu, Regé-Jean Page, Anthony Mackie",
    summary:
      "Yang tends to work in a luxe, masculine lane that respects the wearer’s own persona. The result is tailored, confident, and grown-up, but not overly corporate.",
    bestFor:
      "Luxury understatement and mature confidence if Steven wants his wardrobe to feel richer, not louder.",
    links: [{ label: "Instagram", href: "https://www.instagram.com/jeanneyangstyle/" }],
  },
  {
    name: "Ugo Mozie",
    fit: "Good fit",
    fitTone: "good",
    based: "Los Angeles, California, US",
    region: "US",
    knownFor: "Jon Batiste, Jeremy Pope, Maluma",
    summary:
      "Mozie brings more fashion edge, but still within a luxury menswear frame. He is strongest when the brief wants sharper image-making, richer texture, and a more editorial presence.",
    bestFor:
      "Pushing Steven past monochrome basics into a more directional, high-fashion lane.",
    links: [{ label: "Instagram", href: "https://www.instagram.com/ugomozie/" }],
  },
  {
    name: "Wayman + Micah",
    fit: "Good fit",
    fitTone: "good",
    based: "Los Angeles, California, US",
    region: "US",
    knownFor:
      "Colman Domingo, Danny Ramirez, Danielle Deadwyler, Jodie Turner-Smith",
    summary:
      "They are behind many of Colman Domingo’s standout looks. They can deliver immaculate tailoring, but they also bring bold color, accessories, and more eccentric silhouettes when the moment calls for it.",
    bestFor:
      "A more directional version of polished menswear, especially if Steven wants memorable event dressing.",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/waymanandmicah/" },
      { label: "Website", href: "https://www.waymanandmicah.com/" },
    ],
  },
  {
    name: "Taylor McNeill",
    fit: "Wildcard fit",
    fitTone: "wildcard",
    based: "Los Angeles, California, US",
    region: "US",
    knownFor: "Timothée Chalamet, Kendrick Lamar, Daniel Craig",
    summary:
      "McNeill is more of a wildcard because the styling can go concept-led, but that range is useful. The work can pivot from oversized knitwear and relaxed tailoring to bigger press-tour statements.",
    bestFor:
      "An editorial swing if Steven wants to experiment rather than simply refine.",
    links: [{ label: "Instagram", href: "https://www.instagram.com/taylormcneill/" }],
  },
  {
    name: "Felicity Kay",
    fit: "Good fit",
    fitTone: "good",
    based: "London, England, UK",
    region: "UK",
    knownFor: "Ncuti Gatwa, Paul Mescal, Kit Connor",
    summary:
      "Her work often feels like relaxed drama: classic tailoring with personality and currency. She is a strong option if the brief is sleek, modern, and a touch more fashion-aware.",
    bestFor:
      "Keeping Steven sleek while dialing up event dressing and editorial polish.",
    links: [{ label: "Instagram", href: "https://www.instagram.com/felicitykay/" }],
  },
]

const sortedStylists = [...stylists].sort((a, b) => {
  if (a.region === b.region) return 0
  return a.region === "US" ? -1 : 1
})

const fitStyles = {
  strong: "bg-emerald-100 text-emerald-900 border-emerald-200",
  good: "bg-sky-100 text-sky-900 border-sky-200",
  wildcard: "bg-amber-100 text-amber-900 border-amber-200",
}

export default function StevenBartlettStylistsPage() {
  const usCount = sortedStylists.filter((stylist) => stylist.region === "US").length

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,39,53,0.95)_0%,_#0b0d10_45%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-[28px] border border-slate-800/90 bg-slate-950/75 shadow-2xl shadow-black/20">
          <div className="border-b border-slate-800/80 bg-gradient-to-r from-sky-400/10 via-transparent to-emerald-300/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200 sm:px-8">
            Research memo / stylist shortlist
          </div>
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.4fr_0.8fr] lg:gap-10 lg:py-10">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Steven Bartlett’s style, decoded
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                A polished browser-friendly version of the original memo, now integrated into the app and reordered to put
                US-based stylists first. The through-line is still the same: dark palettes, soft tailoring, premium
                casualwear, and suiting that feels contemporary rather than corporate.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5">Monochrome smart casual</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5">Soft tailoring</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5">Modern entrepreneur energy</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Prioritization</p>
                <p className="mt-2 text-3xl font-semibold text-white">US first</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{usCount} US-based stylists are surfaced before UK-based options.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Best shorthand</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Luxury basics over obvious power dressing, with relaxed tailoring instead of banker tailoring.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Fast recommendation</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Ilaria Urbinati, Warren Alfie Baker, then Jeanne Yang.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <h2 className="text-2xl font-semibold text-white">Steven Bartlett style characteristics</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Core look</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li><strong className="text-slate-100">Dark, repeatable uniform:</strong> mostly black or near-black foundations that scale easily across work, talks, and travel.</li>
                  <li><strong className="text-slate-100">Stage-ready but not fussy:</strong> premium streetwear and smart-casual basics rather than formal business costume.</li>
                  <li><strong className="text-slate-100">Anti-corporate suit mindset:</strong> authenticity matters more than looking like a generic CEO template.</li>
                  <li><strong className="text-slate-100">Softened tailoring:</strong> chore-jacket influence, brushed fabrics, easy structure, and suits that move.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Best shorthand</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>Minimal palette: black, charcoal, navy, petrol.</li>
                  <li>Clean sneakers, boots, knitwear, overshirts, soft jackets.</li>
                  <li>Elegant tailoring without the boardroom stiffness.</li>
                  <li>Polished, comfortable, and not costume-y.</li>
                </ul>
                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
                  <strong className="text-white">Overall read:</strong> Steven Bartlett sits closer to <em>elevated monochrome smart casual</em> than classic boardroom menswear. The best stylist matches are people who can sharpen the silhouette without making him look trapped in a suit.
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Shortlist at a glance</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Sorted with US-based stylists first, then UK-based options. Each card keeps the original rationale but adds location for easier outreach triage.
                </p>
              </div>
              <Link
                href="#sources"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500 hover:text-white"
              >
                Jump to sources
              </Link>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {sortedStylists.map((stylist) => (
                <article key={stylist.name} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        <span>{stylist.region}</span>
                        <span className="text-slate-600">•</span>
                        <span>{stylist.based}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-white">{stylist.name}</h3>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${fitStyles[stylist.fitTone]}`}>
                      {stylist.fit}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    <strong className="text-slate-100">Known for:</strong> {stylist.knownFor}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{stylist.summary}</p>
                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                    <strong className="text-white">Best for:</strong> {stylist.bestFor}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {stylist.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-700 px-3 py-1.5 text-sky-300 hover:border-sky-400/60 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <h2 className="text-2xl font-semibold text-white">Fast recommendation</h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li><strong className="text-white">1. Ilaria Urbinati</strong> — best direct match for elevated, relaxed, menswear-first polish.</li>
              <li><strong className="text-white">2. Warren Alfie Baker</strong> — best if Steven wants slightly younger, sharper tailoring without losing ease.</li>
              <li><strong className="text-white">3. Jeanne Yang</strong> — best for luxury understatement and mature confidence.</li>
            </ol>
          </article>

          <article id="sources" className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <h2 className="text-2xl font-semibold text-white">Research sources</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              <li><a className="text-sky-300 hover:text-white" href="https://www.gq-magazine.co.uk/article/steven-bartlett-home-essentials-interview" target="_blank" rel="noreferrer">British GQ — At home with Steven Bartlett</a></li>
              <li><a className="text-sky-300 hover:text-white" href="https://batchldn.com/blogs/news/steven-bartlett-wears-batch-suits" target="_blank" rel="noreferrer">Batch LDN — Steven Bartlett Wears Batch Suits</a></li>
              <li><a className="text-sky-300 hover:text-white" href="https://www.mirror.co.uk/lifestyle/travel/steven-bartlett-issues-brutal-verdict-35416772" target="_blank" rel="noreferrer">Mirror — Steven Bartlett issues brutal verdict on people who wear suits to interviews</a></li>
              <li><a className="text-sky-300 hover:text-white" href="https://wwd.com/eye/people/mens-fashion-stylists-2024-awards-season-1236109146/" target="_blank" rel="noreferrer">WWD — The Fashion Stylists Behind 2024’s Awards Season Leading Men</a></li>
              <li><a className="text-sky-300 hover:text-white" href="https://www.hollywoodreporter.com/lifestyle/shopping/best-mens-fall-fashion-trends-celebrity-stylists-2023-1235599097/" target="_blank" rel="noreferrer">The Hollywood Reporter — Hollywood’s Top Stylists Are Leaning Into These Men’s Fashion Trends for Fall</a></li>
              <li><a className="text-sky-300 hover:text-white" href="https://harpersbazaar.my/bazaar-man/celebrity-menswear-stylists-to-follow-now/" target="_blank" rel="noreferrer">Harper’s Bazaar Malaysia — 6 Celebrity Menswear Stylists to Follow for Outfit Inspiration</a></li>
              <li><a className="text-sky-300 hover:text-white" href="https://thewallgroup.com/artist/ilaria-urbinati/" target="_blank" rel="noreferrer">The Wall Group — Ilaria Urbinati</a></li>
            </ul>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Note: the style assessments are synthesized from the original memo and source list above. Base locations were added for browsing convenience and outreach prioritization.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
