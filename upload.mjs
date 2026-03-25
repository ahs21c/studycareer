import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import pkg from 'xlsx'
const { readFile, utils } = pkg

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'
const BASE = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\클로드용보관파일\\'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function toSlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

async function readCSV(path) {
  const records = []
  await new Promise((resolve, reject) => {
    createReadStream(path)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', row => records.push(row))
      .on('end', resolve)
      .on('error', reject)
  })
  return records
}

function readXLSX(path) {
  const wb = readFile(path, { dense: true })
  const ws = wb.Sheets[wb.SheetNames[0]]
  return utils.sheet_to_json(ws, { defval: '' })
}

function aggregatePERM(rows) {
  const map = {}
  for (const row of rows) {
    if (row.CASE_STATUS !== 'Certified') continue
    let name = (row.EMPLOYER_NAME || '').trim().toUpperCase()
  // 이름 정규화
    name = name.replace(/\s{2,}/g, ' ')           // 공백 2개 이상 → 1개
    name = name.replace(/\bCORPORATION\b/g, 'CORP')
    name = name.replace(/\bLIMITED\b/g, 'LTD')
    name = name.replace(/\bINCORPORATED\b/g, 'INC')
    name = name.replace(/\s*&\s*/g, ' ')
    if (!name) continue
    const wage = parseFloat(row.WAGE_OFFER_FROM) || 0
    if (!map[name]) map[name] = { count: 0, wageSum: 0, certified: 0 }
    map[name].count++
    map[name].certified++
    if (wage > 0) map[name].wageSum += wage
  }
  return map
}

async function upload() {
  console.log('Reading LCA_Company_Metrics.csv...')
  const lcaRows = await readCSV(BASE + 'LCA_Company_Metrics.csv')
  console.log(`LCA records: ${lcaRows.length}`)

  const permFiles = [
    { path: BASE + 'PERM_Disclosure_Data_FY2021.xlsx', fy: 2021 },
    { path: BASE + 'PERM_Disclosure_2022_Q4.xlsx',     fy: 2022 },
    { path: BASE + 'PERM_Disclosure_2023_Q4.xlsx',     fy: 2023 },
    { path: BASE + 'PERM_Disclosure_2024_Q4.xlsx',     fy: 2024 },
  ]

  const permByYear = {}
  for (const { path, fy } of permFiles) {
    console.log(`Reading PERM FY${fy}...`)
    const rows = readXLSX(path)
    console.log(`  FY${fy}: ${rows.length} rows`)
    permByYear[fy] = aggregatePERM(rows)
  }

  const allEmployers = new Set()
  for (const fy of [2021, 2022, 2023, 2024]) {
    Object.keys(permByYear[fy]).forEach(k => allEmployers.add(k))
  }
  console.log(`Unique PERM employers: ${allEmployers.size}`)

  const permMap = {}
  for (const name of allEmployers) {
    const fy21 = permByYear[2021][name] || { count: 0, wageSum: 0, certified: 0 }
    const fy22 = permByYear[2022][name] || { count: 0, wageSum: 0, certified: 0 }
    const fy23 = permByYear[2023][name] || { count: 0, wageSum: 0, certified: 0 }
    const fy24 = permByYear[2024][name] || { count: 0, wageSum: 0, certified: 0 }
    const total = fy21.count + fy22.count + fy23.count + fy24.count
    const totalWage = fy21.wageSum + fy22.wageSum + fy23.wageSum + fy24.wageSum
    const certified = fy21.certified + fy22.certified + fy23.certified + fy24.certified
    permMap[name] = {
      perm_fy2021: fy21.count,
      perm_fy2022: fy22.count,
      perm_fy2023: fy23.count,
      perm_fy2024: fy24.count,
      perm_total_4yr: total,
      perm_certified: certified,
      perm_avg_wage: total > 0 ? Math.round(totalWage / total) : null,
    }
  }

  const records = lcaRows.map(row => {
    const name = (row.EMPLOYER_NAME || '').trim()
    const nameKey = name.toUpperCase()
  .replace(/\s{2,}/g, ' ')
  .replace(/\bCORPORATION\b/g, 'CORP')
  .replace(/\bLIMITED\b/g, 'LTD')
  .replace(/\bINCORPORATED\b/g, 'INC')
  .replace(/\s*&\s*/g, ' ')
  const perm = permMap[nameKey] || null
    return {
      slug: toSlug(name),
      employer_name: name,
      employer_state: row.EMPLOYER_STATE || '',
      sector: row.SECTOR || '',
      naics_code: row.NAICS_CODE || '',
      lca_fy2024: parseInt(row.LCA_FY2024) || 0,
      lca_fy2025: parseInt(row.LCA_FY2025) || 0,
      lca_total_2yr: parseInt(row.LCA_TOTAL_2YR) || 0,
      lca_trend: row.LCA_TREND || 'STABLE',
      avg_salary_fy2024: parseFloat(row.AVG_SALARY_FY2024) || null,
      avg_salary_fy2025: parseFloat(row.AVG_SALARY_FY2025) || null,
      median_salary_fy2025: parseFloat(row.MEDIAN_SALARY_FY2025) || null,
      p75_salary_fy2025: parseFloat(row.P75_SALARY_FY2025) || null,
      prevailing_wage_avg: parseFloat(row.PREVAILING_WAGE_AVG) || null,
      top_worksite_state: row.TOP_WORKSITE_STATE || '',
      top3_worksite_states: row.TOP3_WORKSITE_STATES || '',
      top3_job_titles: row.TOP3_JOB_TITLES_SOC || '',
      h1b_ratio: parseFloat(row.H1B_RATIO) || null,
      has_perm: perm !== null && perm.perm_total_4yr > 0,
      perm_total_4yr: perm?.perm_total_4yr || 0,
      perm_certified: perm?.perm_certified || 0,
      perm_avg_wage: perm?.perm_avg_wage || null,
      perm_fy2021: perm?.perm_fy2021 || 0,
      perm_fy2022: perm?.perm_fy2022 || 0,
      perm_fy2023: perm?.perm_fy2023 || 0,
      perm_fy2024: perm?.perm_fy2024 || 0,
    }
  })

  console.log(`Total records: ${records.length}`)
  const withPerm = records.filter(r => r.has_perm).length
  console.log(`With PERM data: ${withPerm}`)
  // slug 중복 제거 (같은 slug면 lca_total_2yr 높은 것 유지)
  const slugMap = {}
  for (const r of records) {
    if (!slugMap[r.slug] || r.lca_total_2yr > slugMap[r.slug].lca_total_2yr) {
      slugMap[r.slug] = r
    }
  }
  const deduped = Object.values(slugMap)
  console.log(`After dedup: ${deduped.length} records`)

  const BATCH = 500
  let uploaded = 0
  let errors = 0

  for (let i = 0; i < deduped.length; i += BATCH) {
    const batch = deduped.slice(i, i + BATCH)
    const { error } = await supabase
      .from('company_profiles')
      .upsert(batch, { onConflict: 'slug' })
    if (error) {
      errors++
      console.error(`Error at ${i}:`, error.message)
    } else {
      uploaded += batch.length
      if (uploaded % 10000 === 0 || uploaded === deduped.length)
        console.log(`Uploaded: ${uploaded} / ${deduped.length}`)
    }
  }

  console.log(`Done! Uploaded: ${uploaded}, Errors: ${errors}`)
}

upload().catch(console.error)