export interface Sheet1Row {
  id?: number | string
  groupName?: string
  baseId: number
  brandId?: number | string
  walletId: number
  agentId?: number | string
  agentName?: string
  companyName?: string
  brand?: string
  model: string
  modelValid?: string
  rom?: string
  machineName?: string
  groupId?: string | number
  priceUp: number
  priceCap?: number | string
  formula?: string
  configValid?: string
  createTime?: string
  updateTime?: string
  maxPrice: number
  rawRow?: any
}

export type AppleSeriesType = 'Pro Max' | 'Pro' | 'Plus' | 'mini' | 'e' | 'Base' | 'Other'

export interface ModelSummary {
  baseId: number
  brand: string
  model: string
  originalPriceUp: number
  currentPriceUp: number
  maxPriceRef: number
  agentCount: number
  isModified: boolean
  seriesType: AppleSeriesType
  generation: number | null
}

export interface RuleItem {
  min: number
  max: number
  desc: string
  upperLimit: number | null
}

export interface FormulaEntry {
  min: string
  max: string
  ratio: string
  upperLimit: number | null
}

export interface Sheet2Row {
  baseId: number
  romId: string | null
  machineId: string | null
  walletId: number
  priceUp: number
  priceCap: string | null
  merchantCategoryId: string | null
  formulaJson: string
  modelName?: string
  brandName?: string
  agentName?: string
  maxPrice?: number
}
