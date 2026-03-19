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
  // ── ESTABLISHED ──────────────────────────────────────────────────────────
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
    knownFor: "Donald Glover, Chris Evans, Ryan Reynolds, Barry Keoghan, Dwayne Johnson",
    summary: "The clearest direct match. Urbinati's Instagram is a masterclass in awards-season dark tailoring — post after post in black, charcoal, and deep navy. Brand palette runs Dunhill, Ferragamo, Caruso Menswear, YSL, McQueen — European luxury with a confident LA edge. She captions warmly and personally, tagging every collaborator.",
    bestFor: "Elevated monochrome, easy suiting, rich casualwear, and a modern entrepreneur silhouette that does not read costume-y.",
    examples: [
      { celebrity: "Donald Glover", note: "Relaxed dark tailoring and retro-luxury menswear.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Donald%20Glover%20TIFF%202015.jpg", href: "https://www.instagram.com/ilariaurbinati/" },
      { celebrity: "Barry Keoghan", note: "Award-season polish with personality.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Barry%20Keoghan%20Cannes%202023.jpg", href: "https://www.instagram.com/ilariaurbinati/" },
    ],
  },
  {
    name: "Warren Alfie Baker",
    fit: "Very strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "The Wall Group",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/warrenalfiebaker/" },
      { label: "THR Power Stylists 2025", href: "https://www.hollywoodreporter.com/lists/hollywoods-25-most-powerful-stylists/" },
    ],
    knownFor: "Andrew Garfield, Glen Powell, Leo DiCaprio (Esquire), Regé-Jean Page, Ben Affleck, Domhnall Gleeson, Patrick Dempsey",
    summary: "Baker's sweet spot is the classic suit with a sharper, younger twist. Editorial coverage describes his work as refined but offbeat: monochrome tailoring, unexpected neckwear, retro track jackets, and modern red-carpet experimentation that still reads clean. Named to THR's Hollywood's 25 Most Powerful Stylists 2025.",
    bestFor: "A crisper, more directional version of Bartlett's current look, especially for events, shoots, and stage appearances.",
    examples: [
      { celebrity: "Andrew Garfield", note: "Soft-shouldered suiting and polished knit-led dressing.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Andrew%20Garfield%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/warrenalfiebaker/" },
      { celebrity: "Glen Powell", note: "Classic leading-man tailoring with a younger edge.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Glen%20Powell%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/warrenalfiebaker/" },
    ],
  },
  {
    name: "Felicity Kay",
    fit: "Strong fit",
    fitTone: "strong",
    based: "London, England, UK",
    region: "UK",
    representation: "Falcon Artists (@withfalcon)",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/felicitykay/" },
      { label: "Falcon Artists", href: "https://www.instagram.com/withfalcon/" },
    ],
    knownFor: "Paul Mescal (Oscars, BAFTAs — Celine, Prada, Gucci, Cartier), Riz Ahmed, Ncuti Gatwa, Kit Connor, Fionn O'Shea",
    summary: "London-based, Falcon Artists. British-cool understated luxury — European labels (Celine, Prada, Gucci, YSL) with a very clean, masculine-but-contemporary sensibility. Anti-corporate, quietly iconic. No logos, no noise. The Paul Mescal template: looks effortlessly refined without trying.",
    bestFor: "UK press, editorial shoots, fashion shoots, British smart-casual — Bartlett's UK media calendar aligns perfectly.",
    examples: [
      { celebrity: "Paul Mescal", note: "Custom Celine and Cartier — relaxed formalwear with contemporary energy.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Paul%20Mescal%20at%20the%20Deauville%20American%20Film%20Festival%20in%202022.jpg", href: "https://www.instagram.com/felicitykay/" },
      { celebrity: "Ncuti Gatwa", note: "Playful tailoring with crisp proportions.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ncuti%20Gatwa%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/felicitykay/" },
    ],
  },
  {
    name: "Jeanne Yang",
    fit: "Strong fit",
    fitTone: "strong",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "Jeanne Yang Studio / independent",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/jeanneyangstyle/" },
    ],
    knownFor: "Keanu Reeves, Jason Momoa, Christian Bale, Simu Liu, Regé-Jean Page, Anthony Mackie",
    summary: "Yang excels at luxurious understatement. The clothes feel grown, masculine, and premium, with enough restraint to preserve the client's own identity. Her work leans tailored, confident, and grown-up — not overly corporate.",
    bestFor: "Quiet luxury, masculine confidence, and mature gravitas without drifting into fashion-performative territory.",
    examples: [
      { celebrity: "Keanu Reeves", note: "Minimal, masculine, anti-flash styling.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Keanu%20Reeves%20(8598631514).jpg", href: "https://www.instagram.com/jeanneyangstyle/" },
      { celebrity: "Regé-Jean Page", note: "Tailoring with movie-star sleekness.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reg%C3%A9-Jean%20Page%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/jeanneyangstyle/" },
    ],
  },
  {
    name: "Jason Bolden",
    fit: "Good fit",
    fitTone: "good",
    based: "Los Angeles, California, US",
    region: "US",
    representation: "JSN Studio",
    contact: [
      { label: "stef@jsn.studio", href: "mailto:stef@jsn.studio" },
      { label: "hello@jsn.studio", href: "mailto:hello@jsn.studio" },
      { label: "Instagram", href: "https://www.instagram.com/jasonbolden/" },
    ],
    knownFor: "Michael B. Jordan (2026 Oscars — custom Louis Vuitton + David Yurman), Lakeith Stanfield (Gucci & Dior), Channing Tatum, Ryan Coogler, Tyriq Withers",
    summary: "527K followers, Creative Director and co-founder of JSN Studio, owner of Paris boutique @damnimissparis. His March 2026 Oscars run was elite: MBJ accepting his Oscar in custom LV, the Coogler family in custom LV and Cartier. Brands: custom LV, Gucci, Dior, Versace, Prada, Tom Ford, Thom Browne, Fear of God.",
    bestFor: "Hollywood prestige events, Oscar-level custom looks, high-profile press tours — occasion dressing at the highest level.",
    examples: [
      { celebrity: "Michael B. Jordan", note: "2026 Oscars — custom Louis Vuitton + David Yurman. Best dressed of the night.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Michael%20B.%20Jordan%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/jasonbolden/" },
      { celebrity: "Lakeith Stanfield", note: "Gucci and Dior — culturally-aware luxury in the premium lane.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lakeith%20Stanfield%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/jasonbolden/" },
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
    ],
    knownFor: "Jon Batiste, Jeremy Pope, Maluma",
    summary: "Mozie brings stronger fashion energy, richer texture, and more image construction. THR quotes him on cruelty-free fur and conscious fashion — an image-conscious, statement-aware approach. Best if Bartlett wants to push into richer texture, color, and sharper editorial presence.",
    bestFor: "Stepping beyond safe monochrome into luxury fashion storytelling while staying menswear-first.",
    examples: [
      { celebrity: "Jon Batiste", note: "Expressive formalwear and cultural polish.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jon%20Batiste%20at%20the%202023%20National%20Book%20Awards.jpg", href: "https://www.instagram.com/ugomozie/" },
      { celebrity: "Jeremy Pope", note: "Fashion-forward tailoring and red-carpet risk.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeremy%20Pope%20by%20Gage%20Skidmore.jpg", href: "https://www.instagram.com/ugomozie/" },
    ],
  },
  {
    name: "Damian Collins",
    fit: "Good fit",
    fitTone: "good",
    based: "Los Angeles / New York / Europe",
    region: "US",
    representation: "Forward Artists (Agent: Kristyn)",
    contact: [
      { label: "damian@dcacworld.com", href: "mailto:damian@dcacworld.com" },
      { label: "damiancollins.work", href: "https://damiancollins.work" },
      { label: "Instagram", href: "https://www.instagram.com/damiancollins/" },
    ],
    knownFor: "Jalen Green + Druski (GQ Men of the Year 2023), Google Pixel campaign",
    summary: "Small Instagram presence (~2.4K followers) but real credentials: GQ MOTY 2023 styling, Forward Artists placement, and Heron Preston commenting on his work. Streetwear-meets-editorial aesthetic in the sports/entertainment cultural orbit. Chrome Hearts, GQ-level production quality. Also runs @ecstasykitchen (juice brand).",
    bestFor: "GQ editorial moments, NBA/sports-entertainment crossover luxury, emerging name to track.",
    examples: [
      { celebrity: "Jalen Green", note: "GQ Men of the Year 2023 — streetwear-meets-editorial luxury.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jalen_Green_2022.jpg", href: "https://www.instagram.com/damiancollins/" },
      { celebrity: "Druski", note: "GQ MOTY 2023 — culturally fluent styling in the comedy/entertainment space.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Druski_(cropped).jpg", href: "https://www.instagram.com/damiancollins/" },
    ],
  },
  {
    name: "Harry Lambert",
    fit: "Wildcard fit",
    fitTone: "wildcard",
    based: "London, England, UK",
    region: "UK",
    representation: "Bryant Artists",
    contact: [
      { label: "Bryant Artists portfolio", href: "https://www.bryantartists.com/styling/harry-lambert/portfolio" },
      { label: "Instagram", href: "https://www.instagram.com/harry__lambert/" },
    ],
    knownFor: "Harry Styles (long-term), Bad Bunny (Vogue covers), high-profile fashion collaborations",
    summary: "628K followers. London-based. The most fashion-forward name on the list — genre-defying menswear that still feels intentional and editorial. Known for bold silhouettes, statement pieces, and fashion-week-level artistry. Not Bartlett's everyday brief but a serious option for a bigger editorial swing.",
    bestFor: "Magazine shoots, fashion campaigns, pushing creative boundaries — best if Bartlett wants to experiment rather than refine.",
    examples: [
      { celebrity: "Harry Styles", note: "Genre-defying, fashion-forward styling across multiple Vogue covers.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Harry_Styles_2015.jpg", href: "https://www.instagram.com/harry__lambert/" },
      { celebrity: "Bad Bunny", note: "Vogue cover styling — bold, intentional, globally iconic.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bad_Bunny_in_2022.jpg", href: "https://www.instagram.com/harry__lambert/" },
    ],
  },
  {
    name: "Taylor McNeill",
    fit: "Wildcard fit",
    fitTone: "wildcard",
    based: "New York, USA",
    region: "US",
    representation: "The Wall Group",
    contact: [
      { label: "alexandria@thewallgroup.com", href: "mailto:alexandria@thewallgroup.com" },
      { label: "studio@taylormcneill.com", href: "mailto:studio@taylormcneill.com" },
      { label: "Instagram", href: "https://www.instagram.com/taylor__mcneill/" },
    ],
    knownFor: "Timothée Chalamet (custom Givenchy BAFTAs, custom Versace Berlinale), Kendrick Lamar (Super Bowl halftime), Daniel Craig, Robert Pattinson, Lorde",
    summary: "NYC premium streetwear meets high fashion. Chrome Hearts, Givenchy, Versace, Balmain — worn with irreverence. Cultural credibility is the currency. Named in Vogue's 2025 Best Dressed Stylists. The 'Kendrick would approve' energy. Not corporate at all.",
    bestFor: "Bartlett as cultural figure — looks for music/art/media circles. Slightly more statement-driven than others, but extremely credible.",
    examples: [
      { celebrity: "Timothée Chalamet", note: "Custom Versace and Givenchy — press-tour looks that dominate the conversation.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Timoth%C3%A9e_Chalamet_2019_(cropped).jpg", href: "https://www.instagram.com/taylor__mcneill/" },
      { celebrity: "Kendrick Lamar", note: "Super Bowl halftime styling — culturally defining menswear at the highest level.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kendrick_Lamar_2023_LAFC.jpg", href: "https://www.instagram.com/taylor__mcneill/" },
    ],
  },

  // ── EMERGING ─────────────────────────────────────────────────────────────
  {
    name: "Rose Forde",
    fit: "Very strong fit (emerging)",
    fitTone: "strong",
    based: "London, England, UK",
    region: "UK",
    representation: "The Wall Group (implied)",
    contact: [
      { label: "Instagram", href: "https://www.instagram.com/rosefordestudio/" },
    ],
    knownFor: "Cillian Murphy (long-term — Oppenheimer press tour, SAG, BAFTA, Peaky Blinders 2026), Joe Alwyn (custom Valentino Oscars), Pierce Brosnan (GQ MoY in Prada), Sam Riley (Dries Van Noten)",
    summary: "18.7K followers. London-based. Dark European minimalism — custom archive-referencing tailoring across Armani, Prada, Zegna, Calvin Klein, and Saint Laurent. Cinematic, serious, precisely masculine. Nothing gratuitous, nothing off-brief. The Cillian Murphy relationship is years-long and is the clearest proof of concept for what Bartlett says he wants.",
    bestFor: "The Cillian Murphy playbook — dark, precise, minimal, culturally serious. The anti-influencer look. Most aligned aesthetic with Bartlett's stated direction.",
    examples: [
      { celebrity: "Cillian Murphy", note: "Oppenheimer press tour and 2026 awards season — dark tailoring that reads cinematic, not corporate.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cillian_Murphy_Cannes_2023.jpg", href: "https://www.instagram.com/rosefordestudio/" },
      { celebrity: "Joe Alwyn", note: "Custom Valentino for the Oscars — quiet prestige tailoring.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Joe_Alwyn_Cannes_2022.jpg", href: "https://www.instagram.com/rosefordestudio/" },
    ],
  },
  {
    name: "Ben Schofield",
    fit: "Very strong fit (emerging)",
    fitTone: "strong",
    based: "London, England, UK",
    region: "UK",
    representation: "Bene Studio",
    contact: [
      { label: "Bene Studio", href: "https://www.instagram.com/bene___studio/" },
      { label: "Instagram", href: "https://www.instagram.com/benkschofield/" },
    ],
    knownFor: "Harris Dickinson (Prada Ambassador, Balenciaga Global Brand Ambassador), Callum Turner (Louis Vuitton), Archie Madekwe (Ferragamo)",
    summary: "29.8K followers. London-based, Bene Studio. Dark editorial European menswear — heavy Prada, Balenciaga, Louis Vuitton with a quiet luxury and cinematic editorial edge. Everything is intentional, nothing is showy. Featured in the Whering 100 list of stylists to watch.",
    bestFor: "The cultural insider template: looking like someone who understands fashion rather than someone dressed for fashion. Harris Dickinson's Balenciaga/Prada work mirrors Bartlett's dark premium brief.",
    examples: [
      { celebrity: "Harris Dickinson", note: "Balenciaga and Prada — dark editorial menswear at the brand ambassador level.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Harris_Dickinson_Cannes_2023.jpg", href: "https://www.instagram.com/benkschofield/" },
      { celebrity: "Callum Turner", note: "Louis Vuitton — luxury menswear with editorial precision.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Callum_Turner_WonderCon_2016.jpg", href: "https://www.instagram.com/benkschofield/" },
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
  { label: "THR Hollywood's 25 Most Powerful Stylists 2025", href: "https://www.hollywoodreporter.com/lists/hollywoods-25-most-powerful-stylists/" },
  { label: "Falcon Artists / Felicity Kay", href: "https://www.instagram.com/withfalcon/" },
  { label: "JSN Studio — Jason Bolden", href: "https://www.jsnstudio.com/" },
  { label: "Bryant Artists — Harry Lambert portfolio", href: "https://www.bryantartists.com/styling/harry-lambert/portfolio" },
  { label: "Rose Forde Studio — Instagram research (March 2026)", href: "https://www.instagram.com/rosefordestudio/" },
  { label: "Ben Schofield / Whering 100 2024", href: "https://whering.co.uk/thoughts/whering-100-2024" },
  { label: "WWD — stylists behind awards season leading men", href: "https://wwd.com/eye/people/mens-fashion-stylists-2024-awards-season-1236109146/" },
  { label: "Harper's Bazaar Malaysia — celebrity menswear stylists to follow", href: "https://harpersbazaar.my/bazaar-man/celebrity-menswear-stylists-to-follow-now/" },
  { label: "British GQ — At home with Steven Bartlett", href: "https://www.gq-magazine.co.uk/article/steven-bartlett-home-essentials-interview" },
  { label: "Batch LDN — Steven Bartlett wears Batch suits", href: "https://batchldn.com/blogs/news/steven-bartlett-wears-batch-suits" },
]

const topThreeNames = ["Ilaria Urbinati", "Warren Alfie Baker", "Felicity Kay"]
const topThree = topThreeNames.map((name) => stylists.find((s) => s.name === name)!).filter(Boolean)
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
                    Urbinati first, Baker second, Felicity Kay third (UK-based) — most practical for Bartlett's media calendar.
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
              <li><strong className="text-white">2. Warren Alfie Baker</strong> — strongest if Steven wants younger, sharper tailoring without losing ease. Named THR Power Stylists 2025.</li>
              <li><strong className="text-white">3. Felicity Kay</strong> — UK-based (Falcon Artists), most practical for Bartlett's UK media calendar. The Paul Mescal template.</li>
              <li><strong className="text-white">4. Rose Forde</strong> — emerging London stylist; the Cillian Murphy playbook. Most aligned aesthetic with Bartlett's stated dark/minimal direction.</li>
              <li><strong className="text-white">5. Jason Bolden</strong> — best if the brief needs Hollywood prestige events, Oscar-level custom looks, and stronger public-image architecture.</li>
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
