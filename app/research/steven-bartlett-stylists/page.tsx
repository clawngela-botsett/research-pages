import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Steven Bartlett Stylists Directory",
  description:
    "Expanded US/UK menswear stylist directory for Steven Bartlett-adjacent research, with public representation, contact links, and celebrity client examples.",
}

type ExampleLook = {
  celebrity: string
  note: string
  image: string
  href: string
}

type ContactLink = {
  label: string
  href: string
}

type Stylist = {
  name: string
  fit: string
  fitTone: "strong" | "good" | "wildcard"
  based: string
  region: "US" | "UK"
  representation?: string
  contact: ContactLink[]
  knownFor: string
  summary: string
  bestFor: string
  examples: ExampleLook[]
}

const stylists: Stylist[] = [
  {
    name: "Ilaria Urbinati",
    fit: "Very strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "The Wall Group",
    contact: [
      { label: "Agency profile", href: "https://thewallgroup.com/artist/ilaria-urbinati/" },
      { label: "Instagram", href: "https://www.instagram.com/ilariaurbinati/" },
    ],
    knownFor:
      "Donald Glover, Ryan Reynolds, Rami Malek, Chris Evans, Barry Keoghan, Dwayne Johnson",
    summary:
      "Still the clearest direct match. Urbinati consistently lands men in tailoring and knitwear that feel expensive, relaxed, and culturally current instead of banker-stiff.",
    bestFor:
      "Elevated monochrome, easy suiting, rich casualwear, and a modern entrepreneur silhouette that does not read costume-y.",
    examples: [
      {
        celebrity: "Donald Glover",
        note: "Relaxed tailoring and retro-luxury menswear.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Donald%20Glover%20TIFF%202015.jpg",
        href: "https://thewallgroup.com/artist/ilaria-urbinati/",
      },
      {
        celebrity: "Ryan Reynolds",
        note: "Clean red-carpet suiting with approachable polish.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ryan%20Reynolds%20by%20Gage%20Skidmore.jpg",
        href: "https://thewallgroup.com/artist/ilaria-urbinati/",
      },
    ],
  },
  {
    name: "Warren Alfie Baker",
    fit: "Very strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "Public-facing professional presence via Instagram/editorial features; no agency page confidently confirmed in this pass.",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/warrenalfiebaker/" },
      { label: "THR feature", href: "https://www.hollywoodreporter.com/lifestyle/shopping/best-mens-fall-fashion-trends-celebrity-stylists-2023-1235599097/" },
    ],
    knownFor:
      "Andrew Garfield, Glen Powell, Matt Bomer, Andrew Scott, Ben Affleck, Patrick Dempsey",
    summary:
      "Baker is strong when the brief is sharper tailoring without losing warmth. His work reads clean, expensive, and younger than classic Hollywood formalwear.",
    bestFor:
      "A crisper, more directional version of Bartlett’s current look, especially for events, shoots, and stage appearances.",
    examples: [
      {
        celebrity: "Andrew Garfield",
        note: "Soft-shouldered suiting and polished knit-led dressing.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Andrew%20Garfield%20by%20Gage%20Skidmore.jpg",
        href: "https://www.hollywoodreporter.com/lifestyle/shopping/best-mens-fall-fashion-trends-celebrity-stylists-2023-1235599097/",
      },
      {
        celebrity: "Glen Powell",
        note: "Classic leading-man tailoring with a younger edge.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Glen%20Powell%20by%20Gage%20Skidmore.jpg",
        href: "https://wwd.com/eye/people/mens-fashion-stylists-2024-awards-season-1236109146/",
      },
    ],
  },
  {
    name: "Jeanne Yang",
    fit: "Strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "Jeanne Yang Studio / independent public profile",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/jeanneyangstyle/" },
      { label: "Website", href: "https://www.jeanneyangstyle.com/" },
    ],
    knownFor:
      "Keanu Reeves, Jason Momoa, Christian Bale, Simu Liu, Regé-Jean Page, Anthony Mackie",
    summary:
      "Yang excels at luxurious understatement. The clothes feel grown, masculine, and premium, with enough restraint to preserve the client’s own identity.",
    bestFor:
      "If Steven wants richer fabric, better shape, and more gravitas without becoming too fashion-performative.",
    examples: [
      {
        celebrity: "Keanu Reeves",
        note: "Minimal, masculine, anti-flash styling.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Keanu%20Reeves%20(8598631514).jpg",
        href: "https://www.jeanneyangstyle.com/",
      },
      {
        celebrity: "Regé-Jean Page",
        note: "Tailoring with movie-star sleekness.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reg%C3%A9-Jean%20Page%20by%20Gage%20Skidmore.jpg",
        href: "https://www.jeanneyangstyle.com/",
      },
    ],
  },
  {
    name: "Jason Bolden",
    fit: "Strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "JSN Studio",
    contact: [
      { label: "JSN Studio", href: "https://www.jsnstudio.com/" },
      { label: "Instagram", href: "https://www.instagram.com/jasonbolden/" },
    ],
    knownFor:
      "Michael B. Jordan, Trevor Noah, Justin Timberlake, John Legend, Henry Golding",
    summary:
      "Bolden can go glossy-Hollywood when needed, but his menswear work is often disciplined and powerful rather than overly fussy. He is useful if the brief needs authority plus visibility.",
    bestFor:
      "A more public-facing, media-trained wardrobe system: sharper tailoring, strong outerwear, and confident event dressing.",
    examples: [
      {
        celebrity: "Michael B. Jordan",
        note: "High-gloss press and premiere tailoring.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Michael%20B.%20Jordan%20by%20Gage%20Skidmore.jpg",
        href: "https://www.jsnstudio.com/",
      },
      {
        celebrity: "Trevor Noah",
        note: "Refined talk-show-ready suiting.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Trevor%20Noah%20by%20Gage%20Skidmore.jpg",
        href: "https://www.jsnstudio.com/",
      },
    ],
  },
  {
    name: "Wayman + Micah",
    fit: "Good fit",
    fitTone: "good",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "Wayman and Micah studio",
    contact: [
      { label: "Website", href: "https://www.waymanandmicah.com/" },
      { label: "Instagram", href: "https://www.instagram.com/waymanandmicah/" },
    ],
    knownFor:
      "Colman Domingo, Danny Ramirez, Da'Vinchi, Jharrel Jerome",
    summary:
      "Their work has more swing and theater than Bartlett usually wears day to day, but the tailoring standards are excellent and the image-making is memorable.",
    bestFor:
      "If Steven wants awards-season-level event dressing or a bigger fashion point of view for covers, shoots, and launches.",
    examples: [
      {
        celebrity: "Colman Domingo",
        note: "Statement tailoring and standout eveningwear.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Colman%20Domingo%20by%20Gage%20Skidmore.jpg",
        href: "https://www.waymanandmicah.com/",
      },
      {
        celebrity: "Danny Ramirez",
        note: "Young-Hollywood styling with shape and color control.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Danny%20Ramirez%20by%20Gage%20Skidmore.jpg",
        href: "https://www.waymanandmicah.com/",
      },
    ],
  },
  {
    name: "Ugo Mozie",
    fit: "Good fit",
    fitTone: "good",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "Public-facing studio / editorial profile",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/ugomozie/" },
      { label: "Editorial profile", href: "https://harpersbazaar.my/bazaar-man/celebrity-menswear-stylists-to-follow-now/" },
    ],
    knownFor: "Jon Batiste, Jeremy Pope, Maluma",
    summary:
      "Mozie brings stronger fashion energy, richer texture, and more image construction. He makes sense if Steven wants to move from premium basics into a more editorial lane.",
    bestFor:
      "Stepping beyond safe monochrome into luxury fashion storytelling while staying menswear-first.",
    examples: [
      {
        celebrity: "Jon Batiste",
        note: "Expressive formalwear and cultural polish.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jon%20Batiste%20at%20the%202023%20National%20Book%20Awards.jpg",
        href: "https://harpersbazaar.my/bazaar-man/celebrity-menswear-stylists-to-follow-now/",
      },
      {
        celebrity: "Jeremy Pope",
        note: "Fashion-forward tailoring and red-carpet risk.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeremy%20Pope%20by%20Gage%20Skidmore.jpg",
        href: "https://harpersbazaar.my/bazaar-man/celebrity-menswear-stylists-to-follow-now/",
      },
    ],
  },
  {
    name: "Felicity Kay",
    fit: "Good fit",
    fitTone: "good",
    based: "London, England, UK",
    region: "UK",
    representation: "Independent public profile",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/felicitykay/" },
      { label: "Portfolio", href: "https://www.felicitykay.com/" },
    ],
    knownFor: "Ncuti Gatwa, Paul Mescal, Kit Connor, Joe Alwyn",
    summary:
      "Kay has a particularly useful blend of British tailoring literacy and modern pop-cultural relevance. Her work feels sleek, energetic, and just fashion-aware enough.",
    bestFor:
      "A London-fluent option for sharper public appearances that still feel natural rather than overworked.",
    examples: [
      {
        celebrity: "Ncuti Gatwa",
        note: "Playful tailoring with crisp proportions.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ncuti%20Gatwa%20by%20Gage%20Skidmore.jpg",
        href: "https://www.instagram.com/felicitykay/",
      },
      {
        celebrity: "Paul Mescal",
        note: "Relaxed formalwear and contemporary black-tie energy.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Paul%20Mescal%20at%20the%20Deauville%20American%20Film%20Festival%20in%202022.jpg",
        href: "https://www.instagram.com/felicitykay/",
      },
    ],
  },
  {
    name: "Damian Collins",
    fit: "Good fit",
    fitTone: "good",
    based: "London, England, UK",
    region: "UK",
    representation: "Independent editorial stylist public profile",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/damianfoxe/" },
      { label: "Portfolio", href: "https://www.damiancollinsfashionstylist.com/" },
    ],
    knownFor: "David Gandy, Oliver Cheshire, Richard Biedul, menswear editorial and commercial styling",
    summary:
      "Collins is useful as a UK menswear specialist with a more classic-commercial eye. The work is less celebrity-theatrical and more rooted in confident, masculine image building.",
    bestFor:
      "British menswear polish, campaign dressing, and a grounded luxury presentation that can work for founder portraits and brand shoots.",
    examples: [
      {
        celebrity: "David Gandy",
        note: "Classic masculine tailoring and campaign-ready polish.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/David%20Gandy%20LFW%20Sept%202015.jpg",
        href: "https://www.damiancollinsfashionstylist.com/",
      },
      {
        celebrity: "Oliver Cheshire",
        note: "Commercial menswear styling with clean structure.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Oliver%20Cheshire%20LFW%20Sept%202015.jpg",
        href: "https://www.damiancollinsfashionstylist.com/",
      },
    ],
  },
  {
    name: "Harry Lambert",
    fit: "Wildcard fit",
    fitTone: "wildcard",
    based: "London, England, UK",
    region: "UK",
    representation: "CLM",
    contact: [
      { label: "CLM profile", href: "https://www.clm-agency.com/fashion/harry-lambert" },
      { label: "Instagram", href: "https://www.instagram.com/harry_lambert/" },
    ],
    knownFor: "Harry Styles, Josh O'Connor, Eddie Redmayne",
    summary:
      "Lambert is more fashion-forward than the obvious Bartlett brief, but worth including because he is one of the clearest UK references for relaxed masculinity pushed into editorial territory.",
    bestFor:
      "Only if Steven wants a bigger statement: more silhouette play, more cultural edge, more editorial heat.",
    examples: [
      {
        celebrity: "Josh O'Connor",
        note: "Textural tailoring and fashion-leaning menswear.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Josh%20O%27Connor%20Cannes%202023.jpg",
        href: "https://www.clm-agency.com/fashion/harry-lambert",
      },
      {
        celebrity: "Eddie Redmayne",
        note: "More experimental formalwear references.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Eddie%20Redmayne%202019%20by%20Glenn%20Francis.jpg",
        href: "https://www.clm-agency.com/fashion/harry-lambert",
      },
    ],
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

const sources = [
  { label: "The Wall Group — Ilaria Urbinati", href: "https://thewallgroup.com/artist/ilaria-urbinati/" },
  { label: "Jeanne Yang — official site", href: "https://www.jeanneyangstyle.com/" },
  { label: "JSN Studio — Jason Bolden", href: "https://www.jsnstudio.com/" },
  { label: "Wayman and Micah — official site", href: "https://www.waymanandmicah.com/" },
  { label: "Felicity Kay — portfolio", href: "https://www.felicitykay.com/" },
  { label: "Damian Collins — portfolio", href: "https://www.damiancollinsfashionstylist.com/" },
  { label: "CLM — Harry Lambert", href: "https://www.clm-agency.com/fashion/harry-lambert" },
  { label: "WWD — stylists behind awards season leading men", href: "https://wwd.com/eye/people/mens-fashion-stylists-2024-awards-season-1236109146/" },
  { label: "The Hollywood Reporter — men’s trend stylists feature", href: "https://www.hollywoodreporter.com/lifestyle/shopping/best-mens-fall-fashion-trends-celebrity-stylists-2023-1235599097/" },
  { label: "Harper’s Bazaar Malaysia — celebrity menswear stylists to follow", href: "https://harpersbazaar.my/bazaar-man/celebrity-menswear-stylists-to-follow-now/" },
  { label: "British GQ — At home with Steven Bartlett", href: "https://www.gq-magazine.co.uk/article/steven-bartlett-home-essentials-interview" },
  { label: "Batch LDN — Steven Bartlett wears Batch suits", href: "https://batchldn.com/blogs/news/steven-bartlett-wears-batch-suits" },
]

export default function StevenBartlettStylistsPage() {
  const usCount = sortedStylists.filter((stylist) => stylist.region === "US").length
  const ukCount = sortedStylists.filter((stylist) => stylist.region === "UK").length

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,39,53,0.95)_0%,_#0b0d10_45%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-[28px] border border-slate-800/90 bg-slate-950/75 shadow-2xl shadow-black/20">
          <div className="border-b border-slate-800/80 bg-gradient-to-r from-sky-400/10 via-transparent to-emerald-300/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200 sm:px-8">
            Research memo / stylist directory
          </div>
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.35fr_0.85fr] lg:gap-10 lg:py-10">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Steven Bartlett stylist market map
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                An expanded, app-native shortlist built for real outreach: more names, both US and UK coverage,
                public-facing representation only, and quick visual examples of male clients each stylist has dressed.
                The north star is unchanged: premium, relaxed menswear that looks intentional on camera without becoming
                boardroom cosplay.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5">US + UK shortlist</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5">Public contact pathways only</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5">Celebrity examples built in</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Coverage</p>
                <p className="mt-2 text-3xl font-semibold text-white">{sortedStylists.length}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{usCount} US-based and {ukCount} UK-based options, with US listed first.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Best shorthand</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Luxury basics over hard-power dressing; soft tailoring, rich texture, dark palette, and founder polish.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top three</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Ilaria Urbinati, Warren Alfie Baker, Jeanne Yang — with Jason Bolden as the stronger media-gloss alternative.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <h2 className="text-2xl font-semibold text-white">Steven Bartlett fit criteria</h2>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">What works</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li><strong className="text-slate-100">Dark repeatable foundation:</strong> black, charcoal, deep navy, petrol, chocolate.</li>
                  <li><strong className="text-slate-100">Relaxed authority:</strong> tailoring that signals success without reading generic-finance.</li>
                  <li><strong className="text-slate-100">Texture over noise:</strong> suede, brushed wool, premium knitwear, softened structure.</li>
                  <li><strong className="text-slate-100">Camera fluency:</strong> clean lines for podcasts, stage, founder portraits, and press tours.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">What to avoid</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>Overly corporate blue-suit uniformity.</li>
                  <li>Trend-chasing that overwhelms the wearer.</li>
                  <li>Too much stylist fingerprint and not enough client identity.</li>
                  <li>Red-carpet flash that does not translate to everyday founder dressing.</li>
                </ul>
                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
                  <strong className="text-white">Quick read:</strong> Steven sits closest to <em>elevated monochrome smart casual</em> with strategic tailoring. The best match is somebody who can sharpen proportion and fabric story without trapping him in a formal-business costume.
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Tyriq Withers check</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Included because Juan specifically asked for it.
                </p>
              </div>
              <Link
                href="#sources"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500 hover:text-white"
              >
                Jump to sources
              </Link>
            </div>
            <div className="mt-5 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Publicly knowable status</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                I did not find a reliably attributable, public-facing stylist credit for Tyriq Withers in the sources reviewed for this page. Rather than inventing one, the safer call is to note that his dedicated stylist is <strong>not clearly public/confirmed in this research pass</strong>. If Juan wants, this can be extended later with a deeper trade-press or image-credit pass.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Shortlist directory</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Sorted US first, then UK. Every card includes base city, public representation where findable, professional contact pathways, and visual celebrity references.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {sortedStylists.map((stylist) => (
              <article key={stylist.name} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
                <div className="border-b border-slate-800/90 p-5">
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
                    <p><strong className="text-white">Best for:</strong> {stylist.bestFor}</p>
                    <p className="mt-2"><strong className="text-white">Representation:</strong> {stylist.representation ?? "No public representation link confirmed."}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {stylist.contact.map((link) => (
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
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  {stylist.examples.map((example) => (
                    <a
                      key={`${stylist.name}-${example.celebrity}`}
                      href={example.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80"
                    >
                      <div
                        className="h-40 w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.72)), url(${example.image})`,
                        }}
                      />
                      <div className="p-4">
                        <p className="text-sm font-semibold text-white">{example.celebrity}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{example.note}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <h2 className="text-2xl font-semibold text-white">Fast recommendation</h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li><strong className="text-white">1. Ilaria Urbinati</strong> — best direct match for elevated, relaxed menswear-first polish.</li>
              <li><strong className="text-white">2. Warren Alfie Baker</strong> — strongest if Steven wants younger, sharper tailoring without losing ease.</li>
              <li><strong className="text-white">3. Jeanne Yang</strong> — best for quiet luxury and mature confidence.</li>
              <li><strong className="text-white">4. Jason Bolden</strong> — best if the brief needs more media gloss, premiere dressing, and stronger public-image architecture.</li>
            </ol>
          </article>

          <article id="sources" className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/15 sm:p-7">
            <h2 className="text-2xl font-semibold text-white">Research sources</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              {sources.map((source) => (
                <li key={source.href}>
                  <a className="text-sky-300 hover:text-white" href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Notes: representation/contact entries are limited to public professional pathways only. Where a clean agency page was not confidently confirmable during this pass, the page says so instead of guessing.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
