'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Timezone data ─────────────────────────────────────────────────────────────

const TZ_MAP: Record<string, string> = {
  CST: 'America/Chicago',
  CDT: 'America/Chicago',
  EST: 'America/New_York',
  EDT: 'America/New_York',
  PST: 'America/Los_Angeles',
  PDT: 'America/Los_Angeles',
  MST: 'America/Denver',
  MDT: 'America/Denver',
  GMT: 'UTC',
  UTC: 'UTC',
  BST: 'Europe/London',
  CET: 'Europe/Paris',
  CEST: 'Europe/Paris',
  IST: 'Asia/Kolkata',
  GST: 'Asia/Dubai',
  SAST: 'Africa/Johannesburg',
  AEST: 'Australia/Sydney',
  JST: 'Asia/Tokyo',
  SGT: 'Asia/Singapore',
}

interface TZOption {
  label: string
  flag: string
  iana: string
}

const DEFAULT_CITIES: TZOption[] = [
  { label: 'Los Angeles', flag: '🇺🇸', iana: 'America/Los_Angeles' },
  { label: 'New York', flag: '🇺🇸', iana: 'America/New_York' },
  { label: 'London', flag: '🇬🇧', iana: 'Europe/London' },
  { label: 'Cape Town', flag: '🇿🇦', iana: 'Africa/Johannesburg' },
  { label: 'Dubai', flag: '🇦🇪', iana: 'Asia/Dubai' },
]

const EXTRA_CITIES: TZOption[] = [
  { label: 'Sydney', flag: '🇦🇺', iana: 'Australia/Sydney' },
  { label: 'Tokyo', flag: '🇯🇵', iana: 'Asia/Tokyo' },
  { label: 'Paris', flag: '🇫🇷', iana: 'Europe/Paris' },
  { label: 'Singapore', flag: '🇸🇬', iana: 'Asia/Singapore' },
  { label: 'São Paulo', flag: '🇧🇷', iana: 'America/Sao_Paulo' },
]

// ── UTC offset helpers ────────────────────────────────────────────────────────

function getUTCOffsetMinutes(tz: string): number {
  const now = new Date()
  const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit' })
  const tzStr = now.toLocaleString('en-US', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit' })
  const utcParts = utcStr.split(':').map(Number)
  const tzParts = tzStr.split(':').map(Number)
  let diff = (tzParts[0] * 60 + tzParts[1]) - (utcParts[0] * 60 + utcParts[1])
  // Handle day boundary wrap-around
  if (diff > 720) diff -= 1440
  if (diff < -720) diff += 1440
  return diff
}

function getUTCOffsetString(tz: string): string {
  const hours = Math.round(getUTCOffsetMinutes(tz) / 60)
  return hours >= 0 ? `UTC+${hours}` : `UTC${hours}`
}

// ── Time conversion helpers ───────────────────────────────────────────────────

function getUTCOffset(tz: string, date: Date): number {
  const fmt = (timeZone: string) =>
    date.toLocaleString('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  const utcStr = fmt('UTC')
  const tzStr = fmt(tz)
  return (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 60000
}

function toUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  sourceTz: string
): Date {
  const str = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
  const tempDate = new Date(`${str}Z`)
  const offset = getUTCOffset(sourceTz, tempDate)
  return new Date(tempDate.getTime() - offset * 60000)
}

function formatInTZ(date: Date, tz: string): { label: string; dayNum: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  // Get day-of-month to detect +1d
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    day: 'numeric',
  })
  return {
    label: formatter.format(date),
    dayNum: parseInt(dayFormatter.format(date), 10),
  }
}

// ── Parsing helpers ───────────────────────────────────────────────────────────

interface TimeSlot {
  label: string        // "Tue 3/31"
  year: number
  month: number
  day: number
  startH: number
  startM: number
  endH: number
  endM: number
  sourceTz: string
  sourceTzAbbr: string
}

/** Parse "3:30" or "3" → { h, m } */
function parseHM(s: string): { h: number; m: number } | null {
  s = s.trim()
  const parts = s.split(':')
  if (parts.length === 2) {
    return { h: parseInt(parts[0], 10), m: parseInt(parts[1], 10) }
  }
  const n = parseInt(s, 10)
  if (isNaN(n)) return null
  return { h: n, m: 0 }
}

const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, september: 9, oct: 10, october: 10,
  nov: 11, november: 11, dec: 12, december: 12,
}

function parseDate(raw: string): { year: number; month: number; day: number } | null {
  const s = raw.trim()
  // m/d or mm/dd
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})$/)
  if (slashMatch) {
    const now = new Date()
    const month = parseInt(slashMatch[1], 10)
    const day = parseInt(slashMatch[2], 10)
    let year = now.getFullYear()
    // If the date is already in the past this year, push to next year
    if (new Date(year, month - 1, day) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      year += 1
    }
    return { year, month, day }
  }
  // "March 31" or "31 March"
  const wordMatch = s.match(/([a-z]+)\s+(\d{1,2})|(\d{1,2})\s+([a-z]+)/i)
  if (wordMatch) {
    const monthStr = (wordMatch[1] || wordMatch[4]).toLowerCase()
    const dayNum = parseInt(wordMatch[2] || wordMatch[3], 10)
    const month = MONTH_NAMES[monthStr]
    if (!month) return null
    const now = new Date()
    let year = now.getFullYear()
    if (new Date(year, month - 1, dayNum) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      year += 1
    }
    return { year, month, day: dayNum }
  }
  return null
}

/**
 * Parse a single time range like "3:30-4p", "12-12:30p", "9am-10am", "2:00pm-3:00pm"
 * Returns [startH, startM, endH, endM] in 24h or null
 */
function parseTimeRange(raw: string): [number, number, number, number] | null {
  raw = raw.trim()
  // Pattern: (time)(am|pm|a|p)?-(time)(am|pm|a|p)?
  const m = raw.match(/^(\d{1,2}(?::\d{2})?)\s*(am|pm|a|p)?\s*[-–]\s*(\d{1,2}(?::\d{2})?)\s*(am|pm|a|p)?$/i)
  if (!m) return null

  const startRaw = m[1]
  const startSuffix = (m[2] || '').toLowerCase()
  const endRaw = m[3]
  const endSuffix = (m[4] || '').toLowerCase()

  const start = parseHM(startRaw)
  const end = parseHM(endRaw)
  if (!start || !end) return null

  // Determine AM/PM
  const endIsPM = endSuffix === 'p' || endSuffix === 'pm'
  const endIsAM = endSuffix === 'a' || endSuffix === 'am'
  const startIsPM = startSuffix === 'p' || startSuffix === 'pm'
  const startIsAM = startSuffix === 'a' || startSuffix === 'am'

  let startH = start.h
  let endH = end.h

  if (startIsAM) {
    startH = startH === 12 ? 0 : startH
  } else if (startIsPM) {
    startH = startH !== 12 ? startH + 12 : 12
  }

  if (endIsAM) {
    endH = endH === 12 ? 0 : endH
  } else if (endIsPM) {
    endH = endH !== 12 ? endH + 12 : 12
  }

  // If end has pm/am and start doesn't, infer start
  if (!startIsPM && !startIsAM) {
    if (endIsPM) {
      // Apply PM to start if start hour < 12
      if (start.h < 12) startH = start.h + 12
    } else if (endIsAM) {
      startH = start.h === 12 ? 0 : start.h
    }
  }

  return [startH, start.m, endH, end.m]
}

function parseLine(line: string): TimeSlot[] {
  const slots: TimeSlot[] = []

  // Detect source timezone abbreviation
  const tzMatch = line.match(/\b(CST|CDT|EST|EDT|PST|PDT|MST|MDT|GMT|UTC|BST|CET|CEST|IST|GST|SAST|AEST|JST|SGT)\b/i)
  const tzAbbr = tzMatch ? tzMatch[1].toUpperCase() : null
  const sourceTz = tzAbbr ? TZ_MAP[tzAbbr] : null
  if (!sourceTz || !tzAbbr) return []

  // Extract date: look for m/d pattern or "Month Day"
  const dateMatch = line.match(/\b(\d{1,2}\/\d{1,2})\b/) ||
    line.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2})\b/i)
  if (!dateMatch) return []
  const dateInfo = parseDate(dateMatch[1])
  if (!dateInfo) return []

  // Build a label: extract weekday if present
  const wdMatch = line.match(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i)
  const wd = wdMatch ? wdMatch[1].slice(0, 3) : ''
  const dateLabel = `${wd ? wd + ' ' : ''}${dateInfo.month}/${dateInfo.day}`

  // Extract all time ranges from the line
  // Strip the timezone abbreviation and date info first to avoid false matches
  const stripped = line
    .replace(/\b(CST|CDT|EST|EDT|PST|PDT|MST|MDT|GMT|UTC|BST|CET|CEST|IST|GST|SAST|AEST|JST|SGT)\b/gi, '')
    .replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi, '')
    .replace(/\b\d{1,2}\/\d{1,2}\b/, '')
    .replace(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}\b/gi, '')
    .replace(/@/g, ' ')

  // Split by comma to handle multiple slots per line
  const parts = stripped.split(',')
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    // Find time range pattern
    const trMatch = trimmed.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|a|p)?\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a|p)?)/i)
    if (!trMatch) continue
    const parsed = parseTimeRange(trMatch[1])
    if (!parsed) continue
    const [sH, sM, eH, eM] = parsed
    slots.push({
      label: dateLabel,
      year: dateInfo.year,
      month: dateInfo.month,
      day: dateInfo.day,
      startH: sH,
      startM: sM,
      endH: eH,
      endM: eM,
      sourceTz,
      sourceTzAbbr: tzAbbr,
    })
  }

  return slots
}

function parseInput(text: string): TimeSlot[] {
  const lines = text.split('\n')
  const results: TimeSlot[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed) {
      results.push(...parseLine(trimmed))
    }
  }
  return results
}

// ── Timezone abbreviation helper ─────────────────────────────────────────────

function getTzAbbr(date: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  }).formatToParts(date)
  return parts.find(p => p.type === 'timeZoneName')?.value || ''
}

// ── Result types ──────────────────────────────────────────────────────────────

interface ConvertedSlot {
  slotLabel: string
  fullSlotLabel: string   // e.g. "Tue 3/31 · 3:30–4pm CST"
  cells: { tz: string; label: string; nextDay: boolean; isSource: boolean }[]
}

function formatTime12(h: number, m: number): string {
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  const mm = m === 0 ? '' : `:${String(m).padStart(2, '0')}`
  return `${h12}${mm}${ampm}`
}

function convertSlots(slots: TimeSlot[], targetZones: TZOption[]): ConvertedSlot[] {
  return slots.map(slot => {
    const startUTC = toUTC(slot.year, slot.month, slot.day, slot.startH, slot.startM, slot.sourceTz)
    const endUTC = toUTC(slot.year, slot.month, slot.day, slot.endH, slot.endM, slot.sourceTz)

    // Source day-of-month
    const srcDayFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: slot.sourceTz,
      day: 'numeric',
    })
    const srcDay = parseInt(srcDayFmt.format(startUTC), 10)

    const cells = targetZones.map(tz => {
      const startFormatted = formatInTZ(startUTC, tz.iana)
      const endFormatted = formatInTZ(endUTC, tz.iana)

      // Extract just the time parts
      const startTimeFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.iana,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      const endTimeFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.iana,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      const startStr = startTimeFmt.format(startUTC).replace(':00', '').toLowerCase()
      const endStr = endTimeFmt.format(endUTC).replace(':00', '').toLowerCase()

      // Get weekday + date in target tz
      const wdFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.iana,
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
      })
      const wdStr = wdFmt.format(startUTC) // e.g. "Tue, 3/31"
      // Clean up: "Tue, 3/31" → "Tue 3/31"
      const cleanWd = wdStr.replace(',', '')

      const tgtDay = startFormatted.dayNum
      const nextDay = tgtDay !== srcDay

      const tzAbbr = getTzAbbr(startUTC, tz.iana)
      const label = `${cleanWd} · ${startStr}–${endStr} ${tzAbbr}`.trimEnd()

      return {
        tz: tz.iana,
        label,
        nextDay,
        isSource: tz.iana === slot.sourceTz,
      }
    })

    const startTime = formatTime12(slot.startH, slot.startM)
    const endTime = formatTime12(slot.endH, slot.endM)
    const fullSlotLabel = `${slot.label} · ${startTime}–${endTime} ${slot.sourceTzAbbr}`

    return { slotLabel: slot.label, fullSlotLabel, cells }
  })
}

// ── Copy text builder ─────────────────────────────────────────────────────────

function buildCopyText(
  slots: TimeSlot[],
  results: ConvertedSlot[],
  selectedCities: TZOption[]
): string {
  const lines: string[] = []
  slots.forEach((_, i) => {
    const result = results[i]
    lines.push(result.fullSlotLabel)
    for (let j = 0; j < selectedCities.length; j++) {
      const city = selectedCities[j]
      const cell = result.cells[j]
      const utcOffset = getUTCOffsetString(city.iana)
      lines.push(`  ${city.flag} ${city.label} (${utcOffset}): ${cell.label}`)
    }
    lines.push('')
  })
  return lines.join('\n').trimEnd()
}

function buildRowCopyText(
  result: ConvertedSlot,
  selectedCities: TZOption[]
): string {
  const lines: string[] = [result.fullSlotLabel]
  for (let j = 0; j < selectedCities.length; j++) {
    const city = selectedCities[j]
    const cell = result.cells[j]
    const utcOffset = getUTCOffsetString(city.iana)
    lines.push(`  ${city.flag} ${city.label} (${utcOffset}): ${cell.label}`)
  }
  return lines.join('\n')
}

// ── Offset summary builder ────────────────────────────────────────────────────

function buildOffsetSummary(
  sourceTzAbbr: string,
  sourceTzIana: string,
  selectedCities: TZOption[]
): string {
  const sourceOffsetMin = getUTCOffsetMinutes(sourceTzIana)
  const parts: string[] = []
  for (const city of selectedCities) {
    if (city.iana === sourceTzIana) continue
    const targetOffsetMin = getUTCOffsetMinutes(city.iana)
    const diffHours = Math.round((targetOffsetMin - sourceOffsetMin) / 60)
    if (diffHours === 0) continue
    const absHours = Math.abs(diffHours)
    const hourWord = absHours === 1 ? 'hour' : 'hours'
    if (diffHours > 0) {
      parts.push(`${absHours} ${hourWord} behind ${city.label}`)
    } else {
      parts.push(`${absHours} ${hourWord} ahead of ${city.label}`)
    }
  }
  if (parts.length === 0) return ''
  return `${sourceTzAbbr} is ${parts.join(' · ')}`
}

// ── World clock helper ────────────────────────────────────────────────────────

function getCurrentTime(tz: string): { time: string; date: string; abbr: string } {
  const now = new Date()
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now)
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(now)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  }).formatToParts(now)
  const abbr = parts.find(p => p.type === 'timeZoneName')?.value || ''
  return { time, date, abbr }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimezonePage() {
  const [input, setInput] = useState('')
  const [selectedCities, setSelectedCities] = useState<TZOption[]>([
    DEFAULT_CITIES[0], // Los Angeles
    DEFAULT_CITIES[1], // New York
    DEFAULT_CITIES[2], // London
    DEFAULT_CITIES[3], // Cape Town
    DEFAULT_CITIES[4], // Dubai
  ])
  const [addedExtras, setAddedExtras] = useState<TZOption[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [results, setResults] = useState<ConvertedSlot[] | null>(null)
  const [parsedSlots, setParsedSlots] = useState<TimeSlot[] | null>(null)
  const [parseError, setParseError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedRow, setCopiedRow] = useState<number | null>(null)
  const [now, setNow] = useState(new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Snap to next minute boundary so all clocks tick together
  useEffect(() => {
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds()
    const timeout = setTimeout(() => {
      setNow(new Date())
      const interval = setInterval(() => setNow(new Date()), 60_000)
      return () => clearInterval(interval)
    }, msUntilNextMinute)
    return () => clearTimeout(timeout)
  }, [])

  const allCities = [...DEFAULT_CITIES, ...addedExtras]

  function toggleCity(city: TZOption) {
    setSelectedCities(prev => {
      const exists = prev.find(c => c.iana === city.iana)
      if (exists) {
        if (prev.length <= 1) return prev // keep at least one
        return prev.filter(c => c.iana !== city.iana)
      }
      return [...prev, city]
    })
  }

  function addExtraCity(city: TZOption) {
    if (!addedExtras.find(c => c.iana === city.iana)) {
      setAddedExtras(prev => [...prev, city])
    }
    if (!selectedCities.find(c => c.iana === city.iana)) {
      setSelectedCities(prev => [...prev, city])
    }
    setShowDropdown(false)
  }

  function handleConvert() {
    setParseError('')
    setResults(null)
    setParsedSlots(null)
    const slots = parseInput(input)
    if (slots.length === 0) {
      setParseError('No time slots found. Make sure your text includes a date (e.g. 3/31), a time range (e.g. 3:30-4p), and a timezone (e.g. CST).')
      return
    }
    const converted = convertSlots(slots, selectedCities)
    setResults(converted)
    setParsedSlots(slots)
  }

  function handleCopy() {
    if (!results || !parsedSlots) return
    const text = buildCopyText(parsedSlots, results, selectedCities)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleCopyRow(rowIndex: number) {
    if (!results) return
    const text = buildRowCopyText(results[rowIndex], selectedCities)
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRow(rowIndex)
      setTimeout(() => setCopiedRow(null), 1500)
    })
  }

  const availableExtras = EXTRA_CITIES.filter(
    c => !addedExtras.find(e => e.iana === c.iana)
  )

  // Derive source timezone info from first parsed slot
  const sourceTzAbbr = parsedSlots?.[0]?.sourceTzAbbr ?? ''
  const sourceTzIana = parsedSlots?.[0]?.sourceTz ?? ''
  const offsetSummary = sourceTzAbbr && sourceTzIana
    ? buildOffsetSummary(sourceTzAbbr, sourceTzIana, selectedCities)
    : ''

  return (
    <div
      className="min-h-screen"
      style={{ background: '#020e14', color: 'white' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back link */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-sm mb-6 transition-colors"
          style={{ color: 'rgba(240,117,88,0.7)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f07558')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,117,88,0.7)')}
        >
          ← To Do List
        </Link>

        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-white mb-8">
          Timezone Converter
        </h1>

        {/* World clock */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,117,88,0.7)' }}>
            Current Time
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCities.map((city, idx) => {
              void now
              const { time, date, abbr } = getCurrentTime(city.iana)
              const utcOffset = getUTCOffsetString(city.iana)
              // Rotating Midnight Sun accent colours
              const accents = [
                { border: 'rgba(240,117,88,0.3)',  text: '#f07558',  bg: 'rgba(240,117,88,0.06)'  }, // coral
                { border: 'rgba(34,211,238,0.3)',   text: '#22d3ee',  bg: 'rgba(34,211,238,0.06)'  }, // cyan
                { border: 'rgba(99,102,241,0.3)',   text: '#818cf8',  bg: 'rgba(99,102,241,0.06)'  }, // indigo
                { border: 'rgba(16,185,129,0.3)',   text: '#34d399',  bg: 'rgba(16,185,129,0.06)'  }, // emerald
                { border: 'rgba(251,191,36,0.3)',   text: '#fbbf24',  bg: 'rgba(251,191,36,0.06)'  }, // amber
                { border: 'rgba(244,114,182,0.3)',  text: '#f472b6',  bg: 'rgba(244,114,182,0.06)' }, // pink
              ]
              const accent = accents[idx % accents.length]
              return (
                <div key={city.iana} style={{ background: `#061c26`, border: `1px solid ${accent.border}`, borderRadius: '10px' }} className="px-3 py-2 min-w-[110px]">
                  <p style={{ color: accent.text, opacity: 0.85 }} className="text-[10px] uppercase tracking-wide mb-0.5">{city.flag} {city.label}</p>
                  <p className="text-white text-base font-semibold tabular-nums leading-none mb-0.5">{time}</p>
                  <p className="text-white/30 text-[10px]">{date}</p>
                  <p style={{ color: accent.text, opacity: 0.7 }} className="text-[10px]">{abbr} ({utcOffset})</p>
                </div>
              )
            })}
            {/* Add city button */}
            <button
              onClick={() => {
                const allCities = [...DEFAULT_CITIES, ...EXTRA_CITIES]
                const next = allCities.find(c => !selectedCities.find(s => s.iana === c.iana))
                if (next) setSelectedCities(prev => [...prev, next])
              }}
              className="bg-[#061c26] border border-[#f07558]/15 rounded-lg px-3 py-2 min-w-[48px] flex items-center justify-center text-[#f07558]/50 hover:text-[#f07558] hover:border-[#f07558]/30 transition-colors text-lg"
              title="Add city"
            >＋</button>
          </div>
        </div>

        {/* Paste box */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: '#061c26', border: '1px solid rgba(240,117,88,0.2)' }}
        >
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,117,88,0.7)' }}>
            Availability Text
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste availability text here..."
            rows={5}
            className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{
              minHeight: '120px',
              background: '#061c26',
              border: '1px solid rgba(240,117,88,0.2)',
              color: 'white',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(240,117,88,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(240,117,88,0.2)')}
          />
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            e.g. &quot;Tue 3/31 @ 3:30-4p CST, Wed 4/1 @ 12-12:30p CST&quot;
          </p>
        </div>

        {/* Target timezones */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: '#061c26', border: '1px solid rgba(240,117,88,0.2)' }}
        >
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,117,88,0.7)' }}>
            Convert To
          </label>
          <div className="flex flex-wrap gap-2">
            {allCities.map(city => {
              const active = !!selectedCities.find(c => c.iana === city.iana)
              return (
                <button
                  key={city.iana}
                  onClick={() => toggleCity(city)}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: active ? 'rgba(240,117,88,0.15)' : 'rgba(255,255,255,0.05)',
                    border: active ? '1px solid rgba(240,117,88,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: active ? '#f07558' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {city.flag} {city.label}
                </button>
              )
            })}

            {/* Add city dropdown */}
            <div className="relative" ref={dropdownRef}>
              {availableExtras.length > 0 && (
                <button
                  onClick={() => setShowDropdown(v => !v)}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  + Add city
                </button>
              )}
              {showDropdown && (
                <div
                  className="absolute left-0 top-full mt-1 z-10 rounded-xl overflow-hidden shadow-xl"
                  style={{ background: '#0a2535', border: '1px solid rgba(240,117,88,0.2)', minWidth: '160px' }}
                >
                  {availableExtras.map(city => (
                    <button
                      key={city.iana}
                      onClick={() => addExtraCity(city)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,117,88,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {city.flag} {city.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity mb-6"
          style={{ background: '#f07558' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Convert
        </button>

        {/* Error */}
        {parseError && (
          <div
            className="rounded-xl px-4 py-3 text-sm mb-6"
            style={{ background: 'rgba(240,117,88,0.1)', border: '1px solid rgba(240,117,88,0.3)', color: '#f07558' }}
          >
            {parseError}
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(240,117,88,0.2)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#061c26', borderBottom: '1px solid rgba(240,117,88,0.15)' }}>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest whitespace-nowrap" style={{ color: 'rgba(240,117,88,0.7)', minWidth: '220px' }}>
                        Slot
                      </th>
                      {selectedCities.map(city => (
                        <th
                          key={city.iana}
                          className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest whitespace-nowrap"
                          style={{ color: 'rgba(240,117,88,0.7)' }}
                        >
                          {city.flag} {city.label} ({getUTCOffsetString(city.iana)})
                        </th>
                      ))}
                      <th className="px-2 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          background: i % 2 === 0 ? '#061c26' : 'rgba(6,28,38,0.5)',
                          borderBottom: '1px solid rgba(240,117,88,0.08)',
                        }}
                      >
                        <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', minWidth: '220px' }}>
                          {row.fullSlotLabel}
                        </td>
                        {row.cells.map((cell, j) => (
                          <td
                            key={j}
                            className="px-4 py-3 whitespace-nowrap"
                            style={{
                              color: cell.isSource ? '#f07558' : 'rgba(255,255,255,0.85)',
                              background: cell.isSource ? 'rgba(240,117,88,0.06)' : undefined,
                            }}
                          >
                            {cell.label}
                            {cell.nextDay && (
                              <span
                                className="ml-1 text-xs rounded px-1"
                                style={{ background: 'rgba(240,117,88,0.2)', color: '#f07558' }}
                              >
                                +1d
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="px-2 py-3">
                          <button
                            onClick={() => handleCopyRow(i)}
                            title="Copy this row"
                            className="text-white/20 hover:text-[#f07558] transition-colors p-1"
                          >
                            {copiedRow === i ? '✅' : '📋'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Copy button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCopy}
                className="bg-[#061c26] border border-[#f07558]/20 text-[#f07558] hover:bg-[#0a2535] rounded-xl px-4 py-2 text-sm transition-all"
              >
                {copied ? '✅ Copied!' : '📋 Copy all'}
              </button>
            </div>

            {/* Offset summary */}
            {offsetSummary && (
              <p className="text-white/40 text-xs text-center mt-3 px-4">
                {offsetSummary}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
