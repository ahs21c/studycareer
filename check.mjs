import pkg from 'xlsx'
const { readFile, utils } = pkg

const BASE = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\클로드용보관파일\\'

const wb = readFile(BASE + 'LCA_Disclosure_Data_FY2026_Q1.xlsx', { dense: true })
const ws = wb.Sheets[wb.SheetNames[0]]
const raw = utils.sheet_to_json(ws, { defval: '', header: 1 })
console.log('전체 컬럼:')
raw[0].forEach((col, i) => console.log(`  ${i}: ${col}`))