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
    knownFor: "Colman Domingo, Danny Ramirez, Da'Vinchi, Jharrel Jerome",
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
  strong: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  good: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  wildcard: "border-amber-400/30 bg-amber-400/10 text-amber-100",
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

const topThree = sortedStylists.slice(0, 3)
const heroGallery = topThree.flatMap((stylist) => stylist.examples.slice(0, 1))
const stylePillars = [
  {
    title: "Luxury without costume",
    body: "The sweet spot is successful, intentional, and camera-ready — never banker-uniform, never fashion-stunt dressing.",
  },
  {
    title: "Texture over trend",
    body: "Suede, brushed wool, open-collar knits, and softened tailoring do more work here than loud pattern or novelty.",
  },
  {
    title: "Built for a founder schedule",
    body: "Podcast chairs, stage moments, portrait shoots, and travel all need a repeatable silhouette that still looks premium in motion.",
  },
]

export default function StevenBartlettStylistsPage() {
  const usCount = sortedStylists.filter((stylist) => stylist.region === "US").length
  const ukCount = sortedStylists.filter((stylist) => stylist.region === "UK").length

  return (
    <main className="min-h-screen bg-[#07090c] text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(169,125,67,0.22),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(83,112,255,0.14),_transparent_24%),linear-gradient(180deg,_#0b0d11_0%,_#07090c_60%,_#050608_100%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200/80">
                  Research memo / editorial shortlist
                </p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Steven Bartlett stylist market map
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">
                  An expanded US/UK shortlist built for real outreach: public-facing contact routes, premium menswear fit,
                  and immediate visual references for the kind of image each stylist can build. The north star is still
                  founder polish with softness — expensive, controlled, and camera-literate without drifting into boardroom cosplay.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Coverage</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{sortedStylists.length}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{usCount} US-based + {ukCount} UK-based names.</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Best shorthand</p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">
                    Soft tailoring, luxury basics, dark palettes, and stronger texture before louder trend moves.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Top read</p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">
                    Urbinati first, Baker second, Yang third — with Bolden as the media-gloss alternative.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid min-h-[520px] gap-3 border-t border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-3 sm:grid-cols-2 xl:min-h-full xl:border-l xl:border-t-0">
              {heroGallery.map((example, index) => (
                <a
                  key={`${example.celebrity}-${index}`}
                  href={example.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative overflow-hidden rounded-[28px] border border-white/10 ${index === 0 ? "sm:col-span-2" : ""}`}
                >
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04] ${index === 0 ? "min-h-[280px]" : "min-h-[220px]"}`}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(7,9,12,0.08) 0%, rgba(7,9,12,0.35) 48%, rgba(7,9,12,0.88) 100%), url(${example.image})`,
                    }}
                  />
                  <div className={`relative flex h-full min-h-[220px] flex-col justify-end p-5 ${index === 0 ? "sm:min-h-[280px]" : ""}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-300/80">Client reference</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{example.celebrity}</p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-stone-200">{example.note}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Fit criteria</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">What the wardrobe should feel like</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {stylePillars.map((pillar) => (
                <div key={pillar.title} className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{pillar.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">What works</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-200">
                  <li><strong className="text-white">Dark repeatable foundation:</strong> black, charcoal, deep navy, petrol, chocolate.</li>
                  <li><strong className="text-white">Relaxed authority:</strong> tailoring that signals success without reading generic-finance.</li>
                  <li><strong className="text-white">Texture over noise:</strong> suede, brushed wool, premium knitwear, softened structure.</li>
                  <li><strong className="text-white">Camera fluency:</strong> clean lines for podcasts, stage, founder portraits, and press tours.</li>
                </ul>
              </div>
              <div className="rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100">What to avoid</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-200">
                  <li>Overly corporate blue-suit uniformity.</li>
                  <li>Trend-chasing that overwhelms the wearer.</li>
                  <li>Too much stylist fingerprint and not enough client identity.</li>
                  <li>Red-carpet flash that does not translate to everyday founder dressing.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-gradient-to-r from-white/10 to-white/[0.03] p-5 text-sm leading-6 text-stone-300">
              <strong className="text-white">Quick read:</strong> Steven sits closest to <em>elevated monochrome smart casual</em>
              with strategic tailoring. The best match is someone who can sharpen proportion and fabric story without trapping him in a formal-business costume.
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Fast recommendation</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">Who rises to the top</h2>
              </div>
              <Link href="#sources" className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200 transition hover:border-white/30 hover:text-white">
                Jump to sources
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {topThree.map((stylist, index) => {
                const lead = stylist.examples[0]
                return (
                  <a
                    key={stylist.name}
                    href={stylist.contact[0]?.href ?? lead.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-[28px] border border-white/10 bg-black/25"
                  >
                    <div
                      className="h-64 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(5,6,8,0.1) 0%, rgba(5,6,8,0.25) 45%, rgba(5,6,8,0.9) 100%), url(${lead.image})`,
                      }}
                    />
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">#{index + 1} recommendation</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{stylist.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-300">{stylist.summary}</p>
                      <p className="mt-4 text-sm leading-6 text-stone-400"><span className="text-stone-200">Best for:</span> {stylist.bestFor}</p>
                    </div>
                  </a>
                )
              })}
            </div>

            <article className="mt-6 rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100">Specific request</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Tyriq Withers check</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-200">
                Included because Juan specifically asked for it. I did not find a reliably attributable, public-facing stylist credit for Tyriq Withers in the sources reviewed for this page. Rather than inventing one, the safer call is to note that his dedicated stylist is <strong>not clearly public/confirmed in this research pass</strong>. If needed later, this can be extended with a deeper trade-press or image-credit pass.
              </p>
            </article>
          </article>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Directory</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Editorial shortlist</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400 sm:text-base">
                Sorted US first, then UK. Every card keeps the original research intact — base city, public representation,
                public contact pathways, and visual celebrity references — but the page now reads like a premium fashion memo instead of a plain list.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 2xl:grid-cols-2">
            {sortedStylists.map((stylist) => (
              <article key={stylist.name} className="overflow-hidden rounded-[30px] border border-white/10 bg-black/20 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
                  <div className="grid gap-3 border-b border-white/10 p-3 lg:border-b-0 lg:border-r">
                    {stylist.examples.map((example) => (
                      <a
                        key={`${stylist.name}-${example.celebrity}`}
                        href={example.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative overflow-hidden rounded-[24px] border border-white/10"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(7,9,12,0.08) 0%, rgba(7,9,12,0.35) 52%, rgba(7,9,12,0.92) 100%), url(${example.image})`,
                          }}
                        />
                        <div className="relative flex min-h-[240px] flex-col justify-end p-5">
                          <p className="text-xl font-semibold tracking-[-0.03em] text-white">{example.celebrity}</p>
                          <p className="mt-2 text-sm leading-6 text-stone-200">{example.note}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                          <span>{stylist.region}</span>
                          <span className="text-stone-600">•</span>
                          <span>{stylist.based}</span>
                        </div>
                        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{stylist.name}</h3>
                      </div>
                      <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${fitStyles[stylist.fitTone]}`}>
                        {stylist.fit}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 text-sm leading-6 text-stone-300">
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Known for</p>
                        <p className="mt-2 text-stone-200">{stylist.knownFor}</p>
                      </div>
                      <p>{stylist.summary}</p>
                      <div className="rounded-[22px] border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.03] p-4">
                        <p><strong className="text-white">Best for:</strong> {stylist.bestFor}</p>
                        <p className="mt-3"><strong className="text-white">Representation:</strong> {stylist.representation ?? "No public representation link confirmed."}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                      {stylist.contact.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 px-4 py-2 text-stone-200 transition hover:border-sky-300/60 hover:bg-sky-300/10 hover:text-white"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Recommendation stack</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">Fast decision order</h2>
            <ol className="mt-6 space-y-4 text-sm leading-6 text-stone-300 sm:text-base">
              <li><strong className="text-white">1. Ilaria Urbinati</strong> — best direct match for elevated, relaxed menswear-first polish.</li>
              <li><strong className="text-white">2. Warren Alfie Baker</strong> — strongest if Steven wants younger, sharper tailoring without losing ease.</li>
              <li><strong className="text-white">3. Jeanne Yang</strong> — best for quiet luxury and mature confidence.</li>
              <li><strong className="text-white">4. Jason Bolden</strong> — best if the brief needs more media gloss, premiere dressing, and stronger public-image architecture.</li>
            </ol>
          </article>

          <article id="sources" className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Sources</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">Research sources</h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-300 sm:grid-cols-2">
              {sources.map((source) => (
                <li key={source.href}>
                  <a className="text-sky-300 transition hover:text-white" href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-stone-400">
              Notes: representation/contact entries are limited to public professional pathways only. Where a clean agency page was not confidently confirmable during this pass, the page says so instead of guessing.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
