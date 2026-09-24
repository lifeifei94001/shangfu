import { RuleItem, FormulaEntry, ModelSummary } from '../types'

export const DEFAULT_RULES: RuleItem[] = [
  { min: 0, max: 0.3, desc: '*3（<1500元），*2（≥1500元）', upperLimit: null },
  { min: 0.3, max: 0.5, desc: '*2（<1500元），*1.5（≥1500元）', upperLimit: null },
  { min: 0.5, max: 0.7, desc: '*1.5（<1500元），*1（≥1500元）', upperLimit: null },
  { min: 0.7, max: 1.0, desc: '*1（<1500元），*1（≥1500元）', upperLimit: null }
]

export function formatNumber(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return ''
  const f = typeof v === 'number' ? v : parseFloat(String(v).trim())
  if (isNaN(f)) return ''
  if (Number.isInteger(f)) return String(f)
  return f.toFixed(6).replace(/\.?0+$/, '')
}

export function calculateRatio(desc: string, priceUp: number, maxPrice: number): number {
  const multMatches = Array.from(desc.matchAll(/\*(\d+(?:\.\d+)?)/g)).map(m => parseFloat(m[1]))
  const thrMatch = desc.match(/<(\d+(?:\.\d+)?)\s*元/)
  const threshold = thrMatch ? parseFloat(thrMatch[1]) : 1500.0

  let mult = 1.0
  if (multMatches.length >= 2) {
    mult = maxPrice < threshold ? multMatches[0] : multMatches[1]
  } else if (multMatches.length === 1) {
    mult = multMatches[0]
  }

  return Math.round(priceUp * mult * 100000) / 100000
}

export function buildFormulaJson(priceUp: number, maxPrice: number, rules: RuleItem[] = DEFAULT_RULES): string {
  const entries: FormulaEntry[] = rules.map(r => {
    const val = calculateRatio(r.desc, priceUp, maxPrice)
    return {
      min: formatNumber(r.min),
      max: formatNumber(r.max),
      ratio: formatNumber(val),
      upperLimit: r.upperLimit
    }
  })
  return JSON.stringify(entries, null, 4)
}

export interface ParsedInstruction {
  rawLine: string
  actionType: 'add' | 'sub' | 'set'
  value: number
  matchedModels: ModelSummary[]
  unmatchedNames: string[]
}

export function getModelMeta(modelName: string) {
  const clean = modelName.replace(/\s+/g, ' ').trim()
  const isProMax = /Pro\s*Max/i.test(clean)
  const isPro = /Pro/i.test(clean) && !isProMax
  const isPlus = /Plus/i.test(clean)
  const isMini = /mini/i.test(clean)
  const isE = /1[67]e/i.test(clean) || /\bSE\b/i.test(clean)
  const isAir = /Air/i.test(clean)
  const isBase = !isPro && !isProMax && !isPlus && !isMini && !isE && !isAir && /iPhone\s*\d+/i.test(clean)

  const genMatch = clean.match(/iPhone\s*(\d+)/i)
  const generation = genMatch ? parseInt(genMatch[1], 10) : null

  return {
    clean,
    generation,
    isBase,
    isPro,
    isProMax,
    isPlus,
    isMini,
    isE,
    isAir
  }
}

export function parseInstructions(
  text: string,
  allModels: ModelSummary[]
): ParsedInstruction[] {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0)

  const results: ParsedInstruction[] = []

  for (const line of lines) {
    if (/^分销上浮调整[：:]?$/i.test(line) || /^调整要求[：:]?$/i.test(line)) {
      continue
    }

    let actionType: 'add' | 'sub' | 'set' = 'add'
    let value = 0

    const addMatch = line.match(/(?:上调|上浮|增加|加|\+)\s*(\d+(?:\.\d+)?)\s*%?/i)
    const subMatch = line.match(/(?:下调|下浮|降|减少|减|\-)\s*(\d+(?:\.\d+)?)\s*%?/i)
    const setMatch = line.match(/(?:调整为|设为|变为|改为|=)\s*(\d+(?:\.\d+)?)\s*%?/i)

    if (setMatch) {
      actionType = 'set'
      value = parseFloat(setMatch[1])
    } else if (subMatch) {
      actionType = 'sub'
      value = parseFloat(subMatch[1])
    } else if (addMatch) {
      actionType = 'add'
      value = parseFloat(addMatch[1])
    } else {
      continue
    }

    const rangeMatch = line.match(/iPhone\s*(\d+)\s*(?:-|至|到)\s*(\d+).*?基础款/i)
    const matchedModels: ModelSummary[] = []
    const unmatchedNames: string[] = []

    if (rangeMatch) {
      const startGen = parseInt(rangeMatch[1], 10)
      const endGen = parseInt(rangeMatch[2], 10)
      const minG = Math.min(startGen, endGen)
      const maxG = Math.max(startGen, endGen)

      allModels.forEach(m => {
        const meta = getModelMeta(m.model)
        if (meta.generation && meta.generation >= minG && meta.generation <= maxG && meta.isBase) {
          if (!matchedModels.some(item => item.baseId === m.baseId)) {
            matchedModels.push(m)
          }
        }
      })
    } else {
      const content = line.replace(/^\d+[\.、，,]\s*/, '')
      const candidateTokens = content
        .split(/[,，、\s\+]+/)
        .map(t => t.trim())
        .filter(t => t.length > 0 && !/(上调|下调|上浮|下浮|增加|减少|调整为|设为|%|\d+元)/.test(t))

      for (const token of candidateTokens) {
        let searchName = token
        if (/^\d{1,2}[eE]?\s*(?:Pro|Max|Plus|mini)?$/i.test(token)) {
          searchName = `iPhone ${token}`
        }

        const tokenClean = searchName.replace(/\s+/g, '').toLowerCase()
        const hits = allModels.filter(m => {
          const mClean = m.model.replace(/\s+/g, '').toLowerCase()
          return mClean === tokenClean || mClean === `iphone${tokenClean}` || tokenClean === mClean.replace('iphone', '')
        })

        if (hits.length > 0) {
          hits.forEach(hit => {
            if (!matchedModels.some(item => item.baseId === hit.baseId)) {
              matchedModels.push(hit)
            }
          })
        } else if (/iphone/i.test(token) || /^\d+[a-z]?/i.test(token)) {
          unmatchedNames.push(token)
        }
      }
    }

    if (matchedModels.length > 0) {
      results.push({
        rawLine: line,
        actionType,
        value,
        matchedModels,
        unmatchedNames
      })
    }
  }

  return results
}
