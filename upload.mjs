import { createClient } from '@supabase/supabase-js'
import { createReadStream, readFileSync } from 'fs'
import { parse } from 'csv-parse'
import pkg from 'xlsx'
const { readFile, utils } = pkg

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'
const BASE = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\클로드용보관파일\\'
const MAPPING_PATH = BASE + 'company_name_mapping_v4.csv'

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

function normalizeEmployer(name) {
  if (!name) return null
  let n = name.trim().toUpperCase()
  n = n.replace(/\s{2,}/g, ' ')
  n = n.replace(/\bCORPORATION\b/g, 'CORP')
  n = n.replace(/\bINCORPORATED\b/g, 'INC')
  n = n.replace(/\bLIMITED\b/g, 'LTD')
  n = n.replace(/[,\.]+\s*(INC|LLC|LLP|CORP|LTD)$/g, ' $1')
  return n.trim()
}

async function loadMapping() {
  const rows = await readCSV(MAPPING_PATH)
  const map = {}
  for (const row of rows) {
    const raw = (row.RAW_NAME || '').trim().toUpperCase()
    const parent = (row.PARENT_GROUP || '').trim().toUpperCase()
    if (raw && parent && parent !== 'UNKNOWN') {
      map[raw] = parent
      const norm = normalizeEmployer(raw)
      if (norm) map[norm] = parent
    }
  }
  return map
}

function resolveGroup(name, mapping) {
  const norm = normalizeEmployer(name)
  if (!norm) return null
  return mapping[norm] || mapping[name?.trim().toUpperCase()] || norm
}

async function upload() {
  const mapping = await loadMapping()
  console.log(`매핑 로드: ${Object.keys(mapping).length}개`)

  // LCA 읽기
  console.log('Reading LCA_Company_Metrics.csv...')
  const lcaRows = await readCSV(BASE + 'LCA_Company_Metrics.csv')
  console.log(`LCA records: ${lcaRows.length}`)

  // PERM v4 읽기 (FY2021-2025)
  console.log('Reading company_perm_v4.csv...')
  const permRows = await readCSV(BASE + 'company_perm_v4.csv')
  console.log(`PERM records: ${permRows.length}`)

  // PERM 맵 생성
  const permMap = {}
  for (const row of permRows) {
    permMap[row.EMPLOYER_GROUP] = {
      perm_fy2021: parseInt(row.PERM_FY2021) || 0,
      perm_fy2022: parseInt(row.PERM_FY2022) || 0,
      perm_fy2023: parseInt(row.PERM_FY2023) || 0,
      perm_fy2024: parseInt(row.PERM_FY2024) || 0,
      perm_fy2025: parseInt(row.PERM_FY2025) || 0,
      perm_total_5yr: parseInt(row.PERM_TOTAL_5YR) || 0,
      perm_certified: parseInt(row.PERM_CERTIFIED) || 0,
      perm_avg_wage: parseFloat(row.PERM_AVG_WAGE) || null,
    }
  }

  // LCA + PERM 합치기
  const records = lcaRows.map(row => {
    const name = (row.EMPLOYER_NAME || '').trim()
    const group = resolveGroup(name, mapping)
    const perm = group ? (permMap[group] || null) : null

    const salFY2025 = parseFloat(row.AVG_SALARY_FY2025) || null
    const salFY2024 = parseFloat(row.AVG_SALARY_FY2024) || null
    const finalSalary = salFY2025 || salFY2024 || null

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
      avg_salary_fy2024: salFY2024,
      avg_salary_fy2025: finalSalary,
      median_salary_fy2025: parseFloat(row.MEDIAN_SALARY_FY2025) || null,
      p75_salary_fy2025: parseFloat(row.P75_SALARY_FY2025) || null,
      prevailing_wage_avg: parseFloat(row.PREVAILING_WAGE_AVG) || null,
      top_worksite_state: row.TOP_WORKSITE_STATE || '',
      top3_worksite_states: row.TOP3_WORKSITE_STATES || '',
      top3_job_titles: row.TOP3_JOB_TITLES_SOC || '',
      h1b_ratio: parseFloat(row.H1B_RATIO) || null,
      has_perm: perm !== null && perm.perm_total_5yr > 0,
      perm_total_4yr: perm?.perm_fy2021 + perm?.perm_fy2022 + perm?.perm_fy2023 + perm?.perm_fy2024 || 0,
      perm_fy2025: perm?.perm_fy2025 || 0,
      perm_total_5yr: perm?.perm_total_5yr || 0,
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

  // slug 중복 제거
  const slugMap = {}
  for (const r of records) {
    if (!slugMap[r.slug] || r.lca_total_2yr > slugMap[r.slug].lca_total_2yr) {
      slugMap[r.slug] = r
    }
  }
  const deduped = Object.values(slugMap)
  console.log(`After dedup: ${deduped.length}`)

  // Supabase 업로드
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