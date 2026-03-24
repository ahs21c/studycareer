import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'
const CSV_PATH = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\Company_Visa_Risk_Score_v2.csv'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

async function upload() {
  const records = []

  await new Promise((resolve, reject) => {
    createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', (row) => {
        records.push({
          slug: toSlug(row.EMPLOYER_NAME),
          employer_name: row.EMPLOYER_NAME,
          visa_risk_score: parseInt(row.VISA_RISK_SCORE) || 0,
          risk_grade: row.RISK_GRADE || '',
          h1b_fy2022: parseInt(row.H1B_FY2022) || 0,
          h1b_fy2023: parseInt(row.H1B_FY2023) || 0,
          h1b_fy2024: parseInt(row.H1B_FY2024) || 0,
          h1b_total_3yr: parseInt(row.H1B_TOTAL_3YR) || 0,
          h1b_trend: row.H1B_TREND || 'STABLE',
          h1b_certified_3yr: parseInt(row.H1B_CERTIFIED_3YR) || 0,
          h1b_denied_3yr: parseInt(row.H1B_DENIED_3YR) || 0,
          h1b_avg_salary: parseFloat(row.H1B_AVG_SALARY) || null,
          perm_fy2021: parseInt(row.PERM_FY2021) || 0,
          perm_fy2022: parseInt(row.PERM_FY2022) || 0,
          perm_fy2023: parseInt(row.PERM_FY2023) || 0,
          perm_total_3yr: parseInt(row.PERM_TOTAL_3YR) || 0,
          perm_certified_3yr: parseInt(row.PERM_CERTIFIED_3YR) || 0,
          has_h1b: row.HAS_H1B === 'Y',
          has_perm: row.HAS_PERM === 'Y',
          sponsor_type: row.SPONSOR_TYPE || '',
        })
      })
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`Total records: ${records.length}`)

  const BATCH = 500
  let uploaded = 0

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH)
    const { error } = await supabase
      .from('company_profiles')
      .upsert(batch, { onConflict: 'slug' })

    if (error) {
      console.error(`Error at batch ${i}:`, error.message)
    } else {
      uploaded += batch.length
      console.log(`Uploaded: ${uploaded} / ${records.length}`)
    }
  }

  console.log('Done!')
}

upload().catch(console.error)