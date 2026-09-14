// Small dependency-free CSV read/write helpers shared by every page's
// Export/Import CSV actions.

export interface CSVColumn<T> {
  key: string
  header: string
  value: (row: T) => string
}

function toCSVCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function toCSV<T>(rows: T[], columns: CSVColumn<T>[]): string {
  const header = columns.map((c) => toCSVCell(c.header)).join(',')
  const lines = rows.map((row) => columns.map((c) => toCSVCell(c.value(row))).join(','))
  return [header, ...lines].join('\r\n')
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Minimal RFC4180-style parser: handles quoted fields, embedded commas/
// newlines, and escaped `""` quotes — enough for the flat, simple exports
// this app produces (and for hand-edited re-imports of them).
export function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
    } else {
      field += c
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

/** Parses CSV text with a header row into an array of {header: value} records. */
export function parseCSVWithHeader(text: string): Record<string, string>[] {
  const rows = parseCSV(text.replace(/^﻿/, '').trim())
  if (rows.length === 0) return []
  const header = rows[0].map((h) => h.trim())
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

/** Opens a file picker for a single .csv file and resolves its text content. */
export function pickCSVFile(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,text/csv'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => resolve(null)
      reader.readAsText(file)
    }
    input.click()
  })
}
