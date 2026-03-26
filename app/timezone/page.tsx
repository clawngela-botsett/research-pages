'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ALL_SEARCHABLE_CITIES } from './cityData'

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

/** Natural-language timezone aliases → canonical abbreviation in TZ_MAP */
const TZ_ALIASES: [RegExp, string][] = [
  [/\b(?:LA|Los\s+Angeles|Pacific)(?:\s+time)?\b/i, 'PST'],
  [/\b(?:NY|New\s+York|Eastern)(?:\s+time)?\b/i, 'EST'],
  [/\b(?:Chicago|Central)(?:\s+time)?\b/i, 'CST'],
  [/\b(?:Denver|Mountain)(?:\s+time)?\b/i, 'MST'],
  [/\b(?:London|UK|British)(?:\s+time)?\b/i, 'GMT'],
  [/\b(?:Paris|French|European)(?:\s+time)?\b/i, 'CET'],
  [/\b(?:Dubai|UAE|Gulf)(?:\s+time)?\b/i, 'GST'],
  [/\b(?:Cape\s+Town|Johannesburg|South\s+Africa)(?:\s+time)?\b/i, 'SAST'],
  [/\b(?:Sydney|Australian\s+Eastern)(?:\s+time)?\b/i, 'AEST'],
  [/\b(?:Tokyo|Japan)(?:\s+time)?\b/i, 'JST'],
  [/\b(?:Singapore)(?:\s+time)?\b/i, 'SGT'],
  [/\b(?:Mumbai|Delhi|India)(?:\s+time)?\b/i, 'IST'],
]

interface TZOption {
  label: string
  flag: string
  iana: string
  search?: string  // extra keywords: state, country, aliases
}

const DEFAULT_CITIES: TZOption[] = [
  { label: 'Los Angeles', flag: '🇺🇸', iana: 'America/Los_Angeles' },
  { label: 'New York', flag: '🇺🇸', iana: 'America/New_York' },
  { label: 'London', flag: '🇬🇧', iana: 'Europe/London' },
  { label: 'Cape Town', flag: '🇿🇦', iana: 'Africa/Johannesburg' },
  { label: 'Dubai', flag: '🇦🇪', iana: 'Asia/Dubai' },
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
  isSingleTime?: boolean
}

/** Parse "3:30", "3", "1230", "930" → { h, m } */
function parseHM(s: string): { h: number; m: number } | null {
  s = s.trim()
  // colon format: "3:30"
  const colonParts = s.split(':')
  if (colonParts.length === 2) {
    return { h: parseInt(colonParts[0], 10), m: parseInt(colonParts[1], 10) }
  }
  const n = parseInt(s, 10)
  if (isNaN(n)) return null
  // 3-4 digit no-colon: "1230" → 12:30, "930" → 9:30
  if (s.length >= 3) {
    const m = n % 100
    const h = Math.floor(n / 100)
    return { h, m }
  }
  // plain hour: "3", "12"
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
  // DD/MM (European format — day first, month second)
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})$/)
  if (slashMatch) {
    const now = new Date()
    const dayVal = parseInt(slashMatch[1], 10)
    const monthVal = parseInt(slashMatch[2], 10)
    let year = now.getFullYear()
    // If the date is already in the past this year, push to next year
    if (new Date(year, monthVal - 1, dayVal) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      year += 1
    }
    return { year, month: monthVal, day: dayVal }
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
  const m = raw.match(/^(\d{1,4}(?::\d{2})?)\s*(am|pm|a|p)?\s*[-–]\s*(\d{1,4}(?::\d{2})?)\s*(am|pm|a|p)?$/i)
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

  // Normalise ordinal suffixes first
  const normLine = line.replace(/\b(\d{1,2})(?:st|nd|rd|th)\b/gi, '$1')

  // Detect source timezone — try standard abbreviations first, then natural-language aliases
  const tzMatch = normLine.match(/\b(CST|CDT|EST|EDT|PST|PDT|MST|MDT|GMT|UTC|BST|CET|CEST|IST|GST|SAST|AEST|JST|SGT)\b/i)
  let tzAbbr: string | null = tzMatch ? tzMatch[1].toUpperCase() : null
  if (!tzAbbr) {
    for (const [pattern, abbr] of TZ_ALIASES) {
      if (pattern.test(normLine)) { tzAbbr = abbr; break }
    }
  }
  const sourceTz = tzAbbr ? TZ_MAP[tzAbbr] : null
  if (!sourceTz || !tzAbbr) return []

  // Extract date: DD/MM first, then Day Month (European default), then Month Day fallback
  const dateMatch = normLine.match(/\b(\d{1,2}\/\d{1,2})\b/) ||
    normLine.match(/\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*)\b/i) ||
    normLine.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2})\b/i)
  if (!dateMatch) return []
  const dateInfo = parseDate(dateMatch[1])
  if (!dateInfo) return []

  // Build a label: extract weekday if present
  const wdMatch = line.match(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i)
  const wd = wdMatch ? wdMatch[1].slice(0, 3) : ''
  const dateLabel = `${wd ? wd + ' ' : ''}${dateInfo.month}/${dateInfo.day}`

  // Extract all time ranges from the line
  // Strip the timezone abbreviation and date info first to avoid false matches
  const stripped = normLine
    .replace(/\b(CST|CDT|EST|EDT|PST|PDT|MST|MDT|GMT|UTC|BST|CET|CEST|IST|GST|SAST|AEST|JST|SGT)\b/gi, '')
    .replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi, '')
    .replace(/\b\d{1,2}\/\d{1,2}\b/g, '')
    // Strip dates — Day Month first (European), then Month Day
    .replace(/\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\b/gi, '')
    .replace(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}\b/gi, '')
    // Strip natural-language timezone phrases
    .replace(/\b(?:LA|Los\s+Angeles|Pacific|NY|New\s+York|Eastern|Chicago|Central|Denver|Mountain|London|UK|British|Paris|French|European|Dubai|UAE|Gulf|Cape\s+Town|Johannesburg|South\s+Africa|Sydney|Australian\s+Eastern|Tokyo|Japan|Singapore|Mumbai|Delhi|India)\s+time\b/gi, '')
    // Strip filler words
    .replace(/\b(?:at|on|the|from)\b/gi, ' ')
    .replace(/@/g, ' ')

  // Split by comma to handle multiple slots per line
  const parts = stripped.split(',')
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    // Find time range pattern, or fall back to single time
    const trMatch = trimmed.match(/(\d{1,4}(?::\d{2})?\s*(?:am|pm|a|p)?\s*[-–]\s*\d{1,4}(?::\d{2})?\s*(?:am|pm|a|p)?)/i)
    const singleMatch = !trMatch && trimmed.match(/\b(\d{1,4}(?::\d{2})?\s*(?:am|pm|a|p))\b/i)
    if (!trMatch && !singleMatch) continue
    let parsed: [number, number, number, number] | null = null
    if (trMatch) {
      parsed = parseTimeRange(trMatch[1])
    } else if (singleMatch) {
      // Single time — no range, just a point in time
      const hm = parseHM(singleMatch[1].replace(/\s*[ap]m?$/i, '').trim())
      if (hm) {
        const suffix = (singleMatch[1].match(/[ap]m?$/i) || [''])[0].toLowerCase()
        let h = hm.h
        if (suffix === 'pm' || suffix === 'p') h = h !== 12 ? h + 12 : 12
        else if (suffix === 'am' || suffix === 'a') h = h === 12 ? 0 : h
        parsed = [h, hm.m, h, hm.m]
      }
    }
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
      isSingleTime: !!singleMatch,
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

/** Map of IANA timezone → [standardAbbr, daylightAbbr, stdOffsetMinutes] */
const TZ_ABBR_MAP: Record<string, [string, string, number]> = {
  'America/Los_Angeles': ['PST', 'PDT', -480],
  'America/New_York':    ['EST', 'EDT', -300],
  'America/Chicago':     ['CST', 'CDT', -360],
  'America/Denver':      ['MST', 'MDT', -420],
  'UTC':                 ['UTC', 'UTC', 0],
  'Europe/London':       ['GMT', 'BST', 0],
  'Europe/Paris':        ['CET', 'CEST', 60],
  'Asia/Kolkata':        ['IST', 'IST', 330],
  'Asia/Dubai':          ['GST', 'GST', 240],
  'Africa/Johannesburg': ['SAST', 'SAST', 120],
  'Australia/Sydney':    ['AEST', 'AEDT', 600],
  'Asia/Tokyo':          ['JST', 'JST', 540],
  'Asia/Singapore':      ['SGT', 'SGT', 480],
  'America/Sao_Paulo':   ['BRT', 'BRST', -180],
}

// Searchable abbreviation strings per IANA zone — used in city search
const TZ_SEARCH_ABBRS: Record<string, string> = {
  'America/Los_Angeles':              'pst pdt pt pacific',
  'America/Vancouver':                'pst pdt pt pacific',
  'America/Tijuana':                  'pst pdt pt pacific',
  'America/Phoenix':                  'mst mt arizona',
  'America/Denver':                   'mst mdt mt mountain',
  'America/Edmonton':                 'mst mdt mt mountain',
  'America/Boise':                    'mst mdt mt mountain',
  'America/Chicago':                  'cst cdt ct central',
  'America/Mexico_City':              'cst cdt ct central',
  'America/Monterrey':                'cst cdt ct central',
  'America/Winnipeg':                 'cst cdt ct central',
  'America/Regina':                   'cst ct central',
  'America/New_York':                 'est edt et eastern',
  'America/Toronto':                  'est edt et eastern',
  'America/Detroit':                  'est edt et eastern',
  'America/Indiana/Indianapolis':     'est edt et eastern',
  'America/Kentucky/Louisville':      'est edt et eastern',
  'America/Halifax':                  'ast adt atlantic',
  'America/Moncton':                  'ast adt atlantic',
  'America/St_Johns':                 'nst ndt newfoundland',
  'Pacific/Honolulu':                 'hst hawaii',
  'America/Anchorage':                'akst akdt alaska',
  'America/Juneau':                   'akst akdt alaska',
  'Europe/London':                    'gmt bst utc+0 utc+1',
  'Europe/Dublin':                    'gmt ist utc+0',
  'Europe/Paris':                     'cet cest utc+1 utc+2',
  'Europe/Berlin':                    'cet cest utc+1 utc+2',
  'Europe/Amsterdam':                 'cet cest utc+1 utc+2',
  'Europe/Brussels':                  'cet cest utc+1 utc+2',
  'Europe/Rome':                      'cet cest utc+1 utc+2',
  'Europe/Madrid':                    'cet cest utc+1 utc+2',
  'Europe/Vienna':                    'cet cest utc+1 utc+2',
  'Europe/Zurich':                    'cet cest utc+1 utc+2',
  'Europe/Luxembourg':                'cet cest utc+1 utc+2',
  'Europe/Monaco':                    'cet cest utc+1 utc+2',
  'Europe/Stockholm':                 'cet cest utc+1 utc+2',
  'Europe/Oslo':                      'cet cest utc+1 utc+2',
  'Europe/Copenhagen':                'cet cest utc+1 utc+2',
  'Europe/Helsinki':                  'eet eest utc+2 utc+3',
  'Europe/Athens':                    'eet eest utc+2 utc+3',
  'Europe/Bucharest':                 'eet eest utc+2 utc+3',
  'Europe/Sofia':                     'eet eest utc+2 utc+3',
  'Europe/Kyiv':                      'eet eest utc+2 utc+3',
  'Europe/Tallinn':                   'eet eest utc+2 utc+3',
  'Europe/Riga':                      'eet eest utc+2 utc+3',
  'Europe/Vilnius':                   'eet eest utc+2 utc+3',
  'Europe/Chisinau':                  'eet eest utc+2 utc+3',
  'Europe/Warsaw':                    'cet cest utc+1 utc+2',
  'Europe/Prague':                    'cet cest utc+1 utc+2',
  'Europe/Bratislava':                'cet cest utc+1 utc+2',
  'Europe/Budapest':                  'cet cest utc+1 utc+2',
  'Europe/Ljubljana':                 'cet cest utc+1 utc+2',
  'Europe/Zagreb':                    'cet cest utc+1 utc+2',
  'Europe/Sarajevo':                  'cet cest utc+1 utc+2',
  'Europe/Belgrade':                  'cet cest utc+1 utc+2',
  'Europe/Skopje':                    'cet cest utc+1 utc+2',
  'Europe/Tirane':                    'cet cest utc+1 utc+2',
  'Europe/Podgorica':                 'cet cest utc+1 utc+2',
  'Europe/Lisbon':                    'wet west gmt utc+0 utc+1',
  'Atlantic/Reykjavik':               'gmt utc utc+0',
  'Europe/Minsk':                     'fmt utc+3',
  'Europe/Moscow':                    'msk utc+3',
  'Europe/Istanbul':                  'trt utc+3',
  'Asia/Nicosia':                     'eet eest utc+2 utc+3',
  'Europe/Malta':                     'cet cest utc+1 utc+2',
  'Asia/Tbilisi':                     'get utc+4',
  'Asia/Yerevan':                     'amt utc+4',
  'Asia/Baku':                        'azt utc+4',
  'Asia/Dubai':                       'gst utc+4',
  'Asia/Muscat':                      'gst utc+4',
  'Asia/Qatar':                       'ast utc+3',
  'Asia/Riyadh':                      'ast utc+3',
  'Asia/Kuwait':                      'ast utc+3',
  'Asia/Bahrain':                     'ast utc+3',
  'Asia/Aden':                        'ast utc+3',
  'Asia/Baghdad':                     'ast iat utc+3',
  'Asia/Tehran':                      'irst irdt utc+3.5',
  'Asia/Jerusalem':                   'ist idt utc+2 utc+3',
  'Asia/Amman':                       'eet eest utc+2 utc+3',
  'Asia/Beirut':                      'eet eest utc+2 utc+3',
  'Asia/Damascus':                    'eet eest utc+2 utc+3',
  'Asia/Nicosia':                     'eet eest utc+2 utc+3',
  'Asia/Gaza':                        'eet eest utc+2 utc+3',
  'Asia/Kolkata':                     'ist utc+5.5',
  'Asia/Colombo':                     'slst utc+5.5',
  'Asia/Karachi':                     'pkt utc+5',
  'Asia/Tashkent':                    'uzst utc+5',
  'Asia/Yekaterinburg':               'yekt utc+5',
  'Asia/Kabul':                       'aft utc+4.5',
  'Asia/Dhaka':                       'bst utc+6',
  'Asia/Bishkek':                     'kgst utc+6',
  'Asia/Almaty':                      'almt utc+6',
  'Asia/Thimphu':                     'btt utc+6',
  'Asia/Kathmandu':                   'npt utc+5.75',
  'Asia/Novosibirsk':                 'novt utc+7',
  'Asia/Krasnoyarsk':                 'krat utc+7',
  'Asia/Bangkok':                     'ict utc+7',
  'Asia/Vientiane':                   'ict utc+7',
  'Asia/Phnom_Penh':                  'ict utc+7',
  'Asia/Ho_Chi_Minh':                 'ict utc+7',
  'Asia/Yangon':                      'mmt utc+6.5',
  'Asia/Jakarta':                     'wib utc+7',
  'Asia/Makassar':                    'wita utc+8',
  'Asia/Dili':                        'tlt utc+9',
  'Asia/Kuala_Lumpur':                'myt utc+8',
  'Asia/Kuching':                     'myt utc+8',
  'Asia/Singapore':                   'sgt utc+8',
  'Asia/Brunei':                      'bnt utc+8',
  'Asia/Manila':                      'pht utc+8',
  'Asia/Hong_Kong':                   'hkt utc+8',
  'Asia/Macau':                       'cst utc+8',
  'Asia/Shanghai':                    'cst utc+8',
  'Asia/Taipei':                      'cst utc+8',
  'Asia/Irkutsk':                     'irkt utc+8',
  'Asia/Ulaanbaatar':                 'ulat utc+8',
  'Asia/Seoul':                       'kst utc+9',
  'Asia/Pyongyang':                   'kst utc+9',
  'Asia/Tokyo':                       'jst utc+9',
  'Asia/Vladivostok':                 'vlat utc+10',
  'Australia/Perth':                  'awst utc+8',
  'Australia/Darwin':                 'acst utc+9.5',
  'Australia/Adelaide':               'acst acdt utc+9.5 utc+10.5',
  'Australia/Brisbane':               'aest utc+10',
  'Australia/Sydney':                 'aest aedt utc+10 utc+11',
  'Australia/Melbourne':              'aest aedt utc+10 utc+11',
  'Australia/Hobart':                 'aest aedt utc+10 utc+11',
  'Pacific/Auckland':                 'nzst nzdt utc+12 utc+13',
  'Pacific/Fiji':                     'fjt utc+12',
  'Pacific/Honolulu':                 'hst utc-10',
  'Africa/Cairo':                     'eet utc+2',
  'Africa/Johannesburg':              'sast utc+2',
  'Africa/Nairobi':                   'eat utc+3',
  'Africa/Lagos':                     'wat utc+1',
  'Africa/Accra':                     'gmt utc+0',
  'Africa/Abidjan':                   'gmt utc+0',
  'Africa/Casablanca':                'wet utc+1',
  'Africa/Algiers':                   'cet utc+1',
  'Africa/Tunis':                     'cet utc+1',
  'Africa/Khartoum':                  'cat utc+3',
  'Africa/Juba':                      'cat utc+3',
  'Africa/Addis_Ababa':               'eat utc+3',
  'Africa/Dar_es_Salaam':             'eat utc+3',
  'Africa/Kampala':                   'eat utc+3',
  'Africa/Kigali':                    'cat utc+2',
  'Africa/Harare':                    'cat utc+2',
  'Africa/Lusaka':                    'cat utc+2',
  'Africa/Maputo':                    'cat utc+2',
  'Africa/Windhoek':                  'wat utc+2',
  'Africa/Luanda':                    'wat utc+1',
  'America/Sao_Paulo':                'brt brst utc-3',
  'America/Fortaleza':                'brt utc-3',
  'America/Bahia':                    'brt utc-3',
  'America/Recife':                   'brt utc-3',
  'America/Manaus':                   'amt utc-4',
  'America/Bogota':                   'cot utc-5',
  'America/Lima':                     'pet utc-5',
  'America/La_Paz':                   'bot utc-4',
  'America/Asuncion':                 'pyt pyst utc-4',
  'America/Santiago':                 'clt clst utc-4 utc-3',
  'America/Argentina/Buenos_Aires':   'art utc-3',
  'America/Montevideo':               'uyt utc-3',
  'America/Caracas':                  'vet utc-4',
  'America/Guayaquil':                'ect utc-5',
  'America/Panama':                   'est utc-5',
  'America/Costa_Rica':               'cst utc-6',
  'America/Guatemala':                'cst utc-6',
  'America/Managua':                  'cst utc-6',
  'America/Tegucigalpa':              'cst utc-6',
  'America/Havana':                   'cst cdt utc-5',
  'America/Port-au-Prince':           'est edt utc-5',
  'America/Nassau':                   'est edt utc-5',
  'America/Jamaica':                  'est utc-5',
  'America/Puerto_Rico':              'ast utc-4',
  'America/Barbados':                 'ast utc-4',
  'America/Port_of_Spain':            'ast utc-4',
  'America/Curacao':                  'ast utc-4',
  'America/Guyana':                   'gyt utc-4',
  'America/Paramaribo':               'srt utc-3',
}

function getTzAbbr(date: Date, tz: string): string {
  const known = TZ_ABBR_MAP[tz]
  if (known) {
    const [stdAbbr, dstAbbr, stdOffsetMin] = known
    // Check current offset to determine if DST is active
    const currentOffset = getUTCOffset(tz, date)
    return currentOffset === stdOffsetMin ? stdAbbr : dstAbbr
  }
  // Fallback to Intl
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
      const label = slot.isSingleTime
        ? `${cleanWd} · ${startStr} ${tzAbbr}`.trimEnd()
        : `${cleanWd} · ${startStr}–${endStr} ${tzAbbr}`.trimEnd()

      return {
        tz: tz.iana,
        label,
        nextDay,
        isSource: tz.iana === slot.sourceTz,
      }
    })

    const startTime = formatTime12(slot.startH, slot.startM)
    const endTime = formatTime12(slot.endH, slot.endM)
    const fullSlotLabel = slot.isSingleTime
      ? `${slot.label} · ${startTime} ${slot.sourceTzAbbr}`
      : `${slot.label} · ${startTime}–${endTime} ${slot.sourceTzAbbr}`

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
  const abbr = getTzAbbr(now, tz)
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
  const [citySearch, setCitySearch] = useState('')
  const [showConvertDropdown, setShowConvertDropdown] = useState(false)
  const [convertSearch, setConvertSearch] = useState('')
  const [results, setResults] = useState<ConvertedSlot[] | null>(null)
  const [parsedSlots, setParsedSlots] = useState<TimeSlot[] | null>(null)
  const [parseError, setParseError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedRow, setCopiedRow] = useState<number | null>(null)
  const [now, setNow] = useState(new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)
  const convertDropdownRef = useRef<HTMLDivElement>(null)

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
    if (!addedExtras.find(c => c.iana === city.iana && c.label === city.label)) {
      setAddedExtras(prev => [...prev, city])
    }
    if (!selectedCities.find(c => c.iana === city.iana && c.label === city.label)) {
      setSelectedCities(prev => [...prev, city])
    }
    setShowDropdown(false)
    setCitySearch('')
  }

  function removeFromClock(city: TZOption) {
    setSelectedCities(prev => {
      if (prev.length <= 1) return prev
      return prev.filter(c => !(c.iana === city.iana && c.label === city.label))
    })
  }

  function handleConvert() {
    setParseError('')
    setResults(null)
    setParsedSlots(null)
    const slots = parseInput(input)
    if (slots.length === 0) {
      setParseError('No time slots found. Make sure your text includes a date (e.g. 28/3 or 28 March), a time (e.g. 3pm or 3:30-4p), and a timezone (e.g. CST, GMT, or "LA Time").')
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

  function cityMatches(c: TZOption, q: string): boolean {
    const lq = q.toLowerCase()
    const tzSearch = TZ_SEARCH_ABBRS[c.iana] ?? ''
    return (
      c.label.toLowerCase().includes(lq) ||
      (c.search ? c.search.toLowerCase().includes(lq) : false) ||
      tzSearch.includes(lq)
    )
  }

  const searchResults = ALL_SEARCHABLE_CITIES.filter(c => {
    const alreadyShown = allCities.find(a => a.iana === c.iana && a.label === c.label)
    if (alreadyShown) return false
    if (!citySearch.trim()) return true
    return cityMatches(c, citySearch)
  }).slice(0, 8)

  const convertSearchResults = ALL_SEARCHABLE_CITIES.filter(c => {
    const alreadyShown = allCities.find(a => a.iana === c.iana && a.label === c.label)
    if (alreadyShown) return false
    if (!convertSearch.trim()) return true
    return cityMatches(c, convertSearch)
  }).slice(0, 8)

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
      <div className="max-w-3xl mx-auto px-4 py-5">

        {/* Back link */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-sm mb-4 transition-colors"
          style={{ color: 'rgba(240,117,88,0.7)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f07558')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,117,88,0.7)')}
        >
          ← To Do List
        </Link>

        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-white mb-4 text-center">
          Timezone Converter
        </h1>

        {/* World clock */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(240,117,88,0.7)' }}>
            Current Time
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedCities.map((city, idx) => {
              void now
              const { time, date, abbr } = getCurrentTime(city.iana)
              const utcOffset = getTzAbbr(now, city.iana)
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
                <div key={city.iana + city.label} style={{ background: `#061c26`, border: `1px solid ${accent.border}`, borderRadius: '10px' }} className="relative px-3 py-2 min-w-[110px]">
                  {selectedCities.length > 1 && (
                    <button
                      onClick={() => removeFromClock(city)}
                      className="absolute top-1 right-1 text-white/20 hover:text-white/60 transition-colors leading-none"
                      style={{ fontSize: '10px', lineHeight: 1 }}
                      title="Remove"
                    >✕</button>
                  )}
                  <p style={{ color: accent.text }} className="text-[10px] uppercase tracking-wide mb-0.5">{city.flag} {city.label}</p>
                  <p className="text-white text-base font-semibold tabular-nums leading-none mb-0.5">{time}</p>
                  <p className="text-white/30 text-[10px]">{date}</p>
                  <p style={{ color: accent.text }} className="text-[10px]">{getUTCOffsetString(city.iana)}</p>
                </div>
              )
            })}
            {/* Add city search button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => { setShowDropdown(v => !v); setCitySearch('') }}
                className="bg-[#061c26] border border-[#f07558]/15 rounded-lg px-3 py-2 min-w-[48px] flex items-center justify-center text-[#f07558]/50 hover:text-[#f07558] hover:border-[#f07558]/30 transition-colors text-lg"
                title="Add city"
              >＋</button>
              {showDropdown && (
                <div
                  className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-xl"
                  style={{ background: '#0a2535', border: '1px solid rgba(240,117,88,0.2)', minWidth: '200px' }}
                >
                  <div className="px-3 pt-3 pb-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search city…"
                      value={citySearch}
                      onChange={e => setCitySearch(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: '#061c26', border: '1px solid rgba(240,117,88,0.3)', color: 'white' }}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <p className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No cities found</p>
                    ) : searchResults.map(city => (
                      <button
                        key={city.iana + city.label}
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Paste box */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: '#061c26', border: '1px solid rgba(240,117,88,0.2)' }}
        >
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(240,117,88,0.7)' }}>
            Availability
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste availability here..."
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
          <p className="mt-2 text-xs font-mono leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
            31/3 @ 3:30-4p CST &nbsp;·&nbsp; 1st April 5pm Chicago &nbsp;·&nbsp; 30 march at 6pm LA &nbsp;·&nbsp; Mon 31/3 12-1230pm London &nbsp;·&nbsp; April 1st 9am-10am Dubai
          </p>
        </div>

        {/* Target timezones */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: '#061c26', border: '1px solid rgba(240,117,88,0.2)' }}
        >
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(240,117,88,0.7)' }}>
            Convert To
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {allCities.map(city => {
              const active = !!selectedCities.find(c => c.iana === city.iana && c.label === city.label)
              return (
                <button
                  key={city.iana + city.label}
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

            {/* Add city to Convert To */}
            <div className="relative" ref={convertDropdownRef}>
              <button
                onClick={() => { setShowConvertDropdown(v => !v); setConvertSearch('') }}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                + Add city
              </button>
              {showConvertDropdown && (
                <div
                  className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-xl"
                  style={{ background: '#0a2535', border: '1px solid rgba(240,117,88,0.2)', minWidth: '200px' }}
                >
                  <div className="px-3 pt-3 pb-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search city…"
                      value={convertSearch}
                      onChange={e => setConvertSearch(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: '#061c26', border: '1px solid rgba(240,117,88,0.3)', color: 'white' }}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {convertSearchResults.length === 0 ? (
                      <p className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No cities found</p>
                    ) : convertSearchResults.map(city => (
                      <button
                        key={city.iana + city.label}
                        onClick={() => { addExtraCity(city); setShowConvertDropdown(false); setConvertSearch('') }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,117,88,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {city.flag} {city.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity mb-4 block mx-auto"
          style={{ background: '#f07558' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Convert
        </button>

        {/* Error */}
        {parseError && (
          <div
            className="rounded-xl px-4 py-3 text-sm mb-4"
            style={{ background: 'rgba(240,117,88,0.1)', border: '1px solid rgba(240,117,88,0.3)', color: '#f07558' }}
          >
            {parseError}
          </div>
        )}

      </div>{/* end max-w-3xl */}

      {/* Results — wider container so table doesn't scroll horizontally on desktop */}
      {results && results.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(240,117,88,0.2)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#061c26', borderBottom: '1px solid rgba(240,117,88,0.15)' }}>
                      <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap" style={{ color: 'rgba(240,117,88,0.7)', minWidth: '180px' }}>
                        Slot
                      </th>
                      {selectedCities.map(city => (
                        <th
                          key={city.iana}
                          className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap"
                          style={{ color: 'rgba(240,117,88,0.7)' }}
                        >
                          {city.flag} {city.label} ({getUTCOffsetString(city.iana)})
                        </th>
                      ))}
                      <th className="px-2 py-2.5" />
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
                        <td className="px-3 py-2.5 font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)', minWidth: '180px' }}>
                          {row.fullSlotLabel}
                        </td>
                        {row.cells.map((cell, j) => (
                          <td
                            key={j}
                            className="px-3 py-2.5 whitespace-nowrap"
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
                        <td className="px-2 py-2.5">
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
        </div>
      )}

    </div>
  )
}
