import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Sheet1Row, ModelSummary, RuleItem, Sheet2Row, AppleSeriesType } from '../types'
import { DEFAULT_RULES, buildFormulaJson } from './calculator'

function safeNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback
  const num = Number(val)
  return isNaN(num) ? fallback : num
}

/**
 * 智能判定机型系列与代数
 */
export function classifyAppleModel(modelName: string): { seriesType: AppleSeriesType; generation: number | null } {
  const name = modelName.trim()
  const genMatch = name.match(/iPhone\s*(\d+)/i)
  const generation = genMatch ? parseInt(genMatch[1], 10) : null

  let seriesType: AppleSeriesType = 'Other'
  if (/Pro\s*Max/i.test(name)) {
    seriesType = 'Pro Max'
  } else if (/Pro/i.test(name)) {
    seriesType = 'Pro'
  } else if (/Plus/i.test(name)) {
    seriesType = 'Plus'
  } else if (/mini/i.test(name)) {
    seriesType = 'mini'
  } else if (/1[67]e/i.test(name) || /\bSE\b/i.test(name)) {
    seriesType = 'e'
  } else if (/iPhone\s*\d+/i.test(name)) {
    seriesType = 'Base'
  }

  return { seriesType, generation }
}

/**
 * 解析上传的 Excel 工作簿
 */
export async function parseUploadWorkbook(file: File): Promise<{
  sheet1Rows: Sheet1Row[]
  models: ModelSummary[]
  rules: RuleItem[]
  rawWorkbook: XLSX.WorkBook
}> {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })

  const sheet1Name = workbook.SheetNames.find(n => n.toLowerCase().includes('sheet1')) || workbook.SheetNames[0]
  const ws1 = workbook.Sheets[sheet1Name]
  const rows1: any[][] = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: null })

  if (rows1.length < 2) {
    throw new Error('Sheet1 中没有有效的数据行！')
  }

  const headerRow = rows1[0].map(h => (h ? String(h).trim() : ''))
  
  const findCol = (keywords: string[], defaultIdx: number): number => {
    const idx = headerRow.findIndex(h => keywords.some(k => h.includes(k)))
    return idx >= 0 ? idx : defaultIdx
  }

  const colBaseId = findCol(['baseId', '型号ID'], 2)
  const colWalletId = findCol(['联营钱包ID', 'walletId'], 4)
  const colBrand = findCol(['手机品牌', '品牌'], 8)
  const colModel = findCol(['手机型号', '型号'], 9)
  const colPriceUp = findCol(['价格上浮值', 'priceUp'], 14)
  const colMaxPrice = findCol(['最高价格', 'maxPrice'], 20)
  const colAgentName = findCol(['代理商名称'], 6)
  const colCompanyName = findCol(['公司名称'], 7)

  const sheet1Rows: Sheet1Row[] = []
  // 强制使用数字类型作为 key，确保绝对去重
  const modelMap = new Map<number, {
    brand: string
    model: string
    priceUp: number
    maxPriceRef: number
    agentSet: Set<number>
  }>()

  for (let i = 1; i < rows1.length; i++) {
    const r = rows1[i]
    if (!r || r.length === 0) continue

    const baseIdRaw = r[colBaseId]
    const walletIdRaw = r[colWalletId]

    if (baseIdRaw === null || baseIdRaw === undefined || String(baseIdRaw).trim() === '') continue
    if (walletIdRaw === null || walletIdRaw === undefined || String(walletIdRaw).trim() === '') continue

    const baseId = parseInt(String(baseIdRaw).trim(), 10)
    if (isNaN(baseId)) continue

    const walletId = parseInt(String(walletIdRaw).trim(), 10)
    if (isNaN(walletId)) continue

    const priceUp = safeNumber(r[colPriceUp], 0)
    const maxPrice = safeNumber(r[colMaxPrice], 0)
    const model = r[colModel] ? String(r[colModel]).trim() : `机型-${baseId}`
    const brand = r[colBrand] ? String(r[colBrand]).trim() : 'IPHONE'
    const agentName = r[colAgentName] ? String(r[colAgentName]).trim() : ''
    const companyName = r[colCompanyName] ? String(r[colCompanyName]).trim() : ''

    const item: Sheet1Row = {
      baseId,
      walletId,
      brand,
      model,
      priceUp,
      maxPrice,
      agentName,
      companyName,
      rawRow: r
    }
    sheet1Rows.push(item)

    if (!modelMap.has(baseId)) {
      modelMap.set(baseId, {
        brand,
        model,
        priceUp,
        maxPriceRef: maxPrice,
        agentSet: new Set([walletId])
      })
    } else {
      const existing = modelMap.get(baseId)!
      existing.agentSet.add(walletId)
      if (maxPrice > existing.maxPriceRef) {
        existing.maxPriceRef = maxPrice
      }
      // 保持机型名称最完整
      if (model && model.length > existing.model.length) {
        existing.model = model
      }
    }
  }

  // 整理成机型列表，并按代际降序、定位（Pro Max -> Pro -> Plus -> Base -> mini/e）优雅排序
  const models: ModelSummary[] = Array.from(modelMap.entries()).map(([baseId, info]) => {
    const { seriesType, generation } = classifyAppleModel(info.model)
    return {
      baseId,
      brand: info.brand,
      model: info.model,
      originalPriceUp: info.priceUp,
      currentPriceUp: info.priceUp,
      maxPriceRef: info.maxPriceRef,
      agentCount: info.agentSet.size,
      isModified: false,
      seriesType,
      generation
    }
  }).sort((a, b) => {
    const genA = a.generation ?? 0
    const genB = b.generation ?? 0
    if (genB !== genA) return genB - genA
    return b.maxPriceRef - a.maxPriceRef
  })

  // 读取 Sheet3 阶梯规则
  let rules: RuleItem[] = [...DEFAULT_RULES]
  const sheet3Name = workbook.SheetNames.find(n => n.toLowerCase().includes('sheet3'))
  if (sheet3Name && workbook.Sheets[sheet3Name]) {
    try {
      const ws3 = workbook.Sheets[sheet3Name]
      const rows3: any[][] = XLSX.utils.sheet_to_json(ws3, { header: 1, defval: null })
      let headerIdx = -1
      for (let i = 0; i < rows3.length; i++) {
        if (rows3[i] && String(rows3[i][0] || '').trim().toLowerCase() === 'min') {
          headerIdx = i
          break
        }
      }

      if (headerIdx >= 0) {
        const parsedRules: RuleItem[] = []
        for (let i = headerIdx + 1; i < rows3.length; i++) {
          const r = rows3[i]
          if (!r || r[0] === null || r[0] === undefined || String(r[0]).trim() === '') break
          parsedRules.push({
            min: safeNumber(r[0]),
            max: safeNumber(r[1]),
            desc: String(r[2] || ''),
            upperLimit: r[3] !== null && r[3] !== undefined && String(r[3]).toLowerCase() !== 'null' ? safeNumber(r[3]) : null
          })
        }
        if (parsedRules.length > 0) {
          rules = parsedRules
        }
      }
    } catch (e) {
      console.warn('解析 Sheet3 失败，使用默认规则：', e)
    }
  }

  return {
    sheet1Rows,
    models,
    rules,
    rawWorkbook: workbook
  }
}

export function generateSheet2Data(
  sheet1Rows: Sheet1Row[],
  modelPriceMap: Map<number, number>,
  rules: RuleItem[]
): Sheet2Row[] {
  const seen = new Set<string>()
  const sheet2Rows: Sheet2Row[] = []

  for (const item of sheet1Rows) {
    const key = `${item.baseId}_${item.walletId}`
    if (seen.has(key)) continue
    seen.add(key)

    const finalPriceUp = modelPriceMap.has(item.baseId) ? modelPriceMap.get(item.baseId)! : item.priceUp
    const formulaJson = buildFormulaJson(finalPriceUp, item.maxPrice, rules)

    sheet2Rows.push({
      baseId: item.baseId,
      romId: null,
      machineId: null,
      walletId: item.walletId,
      priceUp: finalPriceUp,
      priceCap: null,
      merchantCategoryId: null,
      formulaJson,
      modelName: item.model,
      brandName: item.brand,
      agentName: item.agentName,
      maxPrice: item.maxPrice
    })
  }

  return sheet2Rows
}

export function exportExcelWorkbook(
  sheet1Rows: Sheet1Row[],
  sheet2Rows: Sheet2Row[],
  rules: RuleItem[],
  modelPriceMap: Map<number, number>
) {
  const wb = XLSX.utils.book_new()

  // Sheet1
  const sheet1Header = [
    'id', '机器分组', 'baseId', 'brandId', '联营钱包ID', '代理商ID', '代理商名称',
    '公司名称', '手机品牌', '手机型号', '手机型号是否有效', '型号内存', '机器名称',
    '机器分组id', '价格上浮值', '价格上浮封顶', '计算公式', '配置是否有效', '创建时间', '更新时间', '最高价格'
  ]
  const sheet1Data: any[][] = [sheet1Header]
  for (const row of sheet1Rows) {
    const activePriceUp = modelPriceMap.has(row.baseId) ? modelPriceMap.get(row.baseId)! : row.priceUp
    sheet1Data.push([
      row.id || '',
      row.groupName || '',
      row.baseId,
      row.brandId || 1,
      row.walletId,
      row.agentId || '',
      row.agentName || '',
      row.companyName || '',
      row.brand || 'IPHONE',
      row.model,
      row.modelValid || '有效',
      row.rom || '',
      row.machineName || '',
      row.groupId || '',
      activePriceUp,
      row.priceCap || '',
      row.formula || '',
      row.configValid || '有效',
      row.createTime || '',
      row.updateTime || '',
      row.maxPrice
    ])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet1Data), 'Sheet1')

  // Sheet2
  const sheet2Header = [
    'baseId（型号ID）',
    'romId（内存ID）',
    'machineId（机器ID）',
    'walletId（商家钱包账户ID）',
    '价格上浮值（固定比例）',
    '价格上浮封顶（封顶值）',
    '商家分类id',
    '计算公式'
  ]
  const sheet2Data: any[][] = [sheet2Header]
  for (const r of sheet2Rows) {
    sheet2Data.push([
      r.baseId,
      r.romId || '',
      r.machineId || '',
      r.walletId,
      r.priceUp,
      r.priceCap || '',
      r.merchantCategoryId || '',
      r.formulaJson
    ])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet2Data), 'Sheet2')

  // Sheet3
  const sheet3Data: any[][] = [['min', 'max', 'ratio', 'upperLimit']]
  for (const rule of rules) {
    sheet3Data.push([
      rule.min,
      rule.max,
      rule.desc,
      rule.upperLimit === null ? 'null' : rule.upperLimit
    ])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet3Data), 'Sheet3')

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const now = new Date()
  const timeStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `机型分销上浮-结果${timeStr}.xlsx`)
}

export function getSampleDataset(): {
  sheet1Rows: Sheet1Row[]
  models: ModelSummary[]
  rules: RuleItem[]
} {
  const sampleModels = [
    { baseId: 18472, model: 'iPhone 17e', brand: 'IPHONE', priceUp: 12.1, maxPrice: 3573 },
    { baseId: 18228, model: 'iPhone 17 Pro Max', brand: 'IPHONE', priceUp: 8.1, maxPrice: 9370 },
    { baseId: 18227, model: 'iPhone 17 Pro', brand: 'IPHONE', priceUp: 8.1, maxPrice: 7052 },
    { baseId: 18226, model: 'iPhone Air', brand: 'IPHONE', priceUp: 10.1, maxPrice: 4539 },
    { baseId: 18225, model: 'iPhone 17', brand: 'IPHONE', priceUp: 13.1, maxPrice: 4729 },
    { baseId: 17817, model: 'iPhone 16e', brand: 'IPHONE', priceUp: 14.1, maxPrice: 2711 },
    { baseId: 17569, model: 'iPhone 16 Pro Max', brand: 'IPHONE', priceUp: 8.1, maxPrice: 5801 },
    { baseId: 17568, model: 'iPhone 16 Pro', brand: 'IPHONE', priceUp: 8.1, maxPrice: 5160 },
    { baseId: 17567, model: 'iPhone 16 Plus', brand: 'IPHONE', priceUp: 10.1, maxPrice: 3619 },
    { baseId: 17566, model: 'iPhone 16', brand: 'IPHONE', priceUp: 9.1, maxPrice: 3543 },
    { baseId: 12282, model: 'iPhone 15 Pro Max', brand: 'IPHONE', priceUp: 12.1, maxPrice: 4121 },
    { baseId: 12281, model: 'iPhone 15 Pro', brand: 'IPHONE', priceUp: 12.1, maxPrice: 3749 },
    { baseId: 12280, model: 'iPhone 15 Plus', brand: 'IPHONE', priceUp: 14.1, maxPrice: 2585 },
    { baseId: 12279, model: 'iPhone 15', brand: 'IPHONE', priceUp: 14.1, maxPrice: 2471 },
    { baseId: 9660, model: 'iPhone 14 Plus', brand: 'IPHONE', priceUp: 20.1, maxPrice: 1697 },
    { baseId: 9659, model: 'iPhone 14 Pro Max', brand: 'IPHONE', priceUp: 15.1, maxPrice: 3220 },
    { baseId: 9658, model: 'iPhone 14 Pro', brand: 'IPHONE', priceUp: 15.1, maxPrice: 2903 },
    { baseId: 9657, model: 'iPhone 14', brand: 'IPHONE', priceUp: 20.1, maxPrice: 1615 },
    { baseId: 9234, model: 'iPhone 13 Pro Max', brand: 'IPHONE', priceUp: 19.1, maxPrice: 2383 },
    { baseId: 9233, model: 'iPhone 13 Pro', brand: 'IPHONE', priceUp: 19.1, maxPrice: 2187 },
    { baseId: 9232, model: 'iPhone 13', brand: 'IPHONE', priceUp: 25.1, maxPrice: 1143 },
    { baseId: 9231, model: 'iPhone 13 mini', brand: 'IPHONE', priceUp: 26.1, maxPrice: 1138 },
    { baseId: 8986, model: 'iPhone 12 Pro Max', brand: 'IPHONE', priceUp: 22.1, maxPrice: 1597 },
    { baseId: 8983, model: 'iPhone 12', brand: 'IPHONE', priceUp: 26.1, maxPrice: 814 },
    { baseId: 8733, model: 'iPhone 11 Pro Max', brand: 'IPHONE', priceUp: 27.1, maxPrice: 1027 },
    { baseId: 8731, model: 'iPhone 11', brand: 'IPHONE', priceUp: 30.1, maxPrice: 755 },
    { baseId: 8555, model: 'iPhone XS Max', brand: 'IPHONE', priceUp: 30.1, maxPrice: 874 },
    { baseId: 8554, model: 'iPhone XR', brand: 'IPHONE', priceUp: 30.1, maxPrice: 546 },
    { baseId: 7701, model: 'iPhone X', brand: 'IPHONE', priceUp: 30.1, maxPrice: 421 }
  ]

  const agents = [
    { walletId: 5554, agentName: '广东懂机汇（苹果）' },
    { walletId: 5541, agentName: '浙江昇泰（苹果）' },
    { walletId: 2924, agentName: '湖南睿金（苹果）' },
    { walletId: 2346, agentName: '广东茜悦（苹果）' },
    { walletId: 1034, agentName: '山西小机（苹果）' },
    { walletId: 1033, agentName: '重庆万物（苹果）' },
    { walletId: 1032, agentName: '湖南吞机兽（苹果）' },
    { walletId: 1000, agentName: '四川鲸落（苹果）' }
  ]

  const sheet1Rows: Sheet1Row[] = []
  const models: ModelSummary[] = sampleModels.map(m => {
    const { seriesType, generation } = classifyAppleModel(m.model)
    return {
      baseId: m.baseId,
      brand: m.brand,
      model: m.model,
      originalPriceUp: m.priceUp,
      currentPriceUp: m.priceUp,
      maxPriceRef: m.maxPrice,
      agentCount: agents.length,
      isModified: false,
      seriesType,
      generation
    }
  })

  for (const m of sampleModels) {
    for (const ag of agents) {
      sheet1Rows.push({
        baseId: m.baseId,
        walletId: ag.walletId,
        agentName: ag.agentName,
        companyName: ag.agentName,
        brand: m.brand,
        model: m.model,
        priceUp: m.priceUp,
        maxPrice: m.maxPrice
      })
    }
  }

  return {
    sheet1Rows,
    models,
    rules: [...DEFAULT_RULES]
  }
}
