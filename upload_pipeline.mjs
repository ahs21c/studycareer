import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'
const JSON_PATH = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\클로드용보관파일\\pipeline_clean.json'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function upload() {
  const raw = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
  console.log(`Total records: ${raw.length}`)
  console.log('Sample:', JSON.stringify(raw[0], null, 2))

    const records = raw.map(row => ({
    employer_std: row.employer || '',
    university_std: row.university || '',
    perm_count: parseInt(row.perm_count) || 0,
    avg_annual_wage: parseFloat(row.avg_wage) || null,
    top_major: row.top_major || '',
    top_degree: row.top_degree || '',
    top_state: row.top_state || '',
    wage_level: row.wage_level || '',
    yr_2022: parseFloat(row.count_2022) || 0,
    yr_2023: parseFloat(row.count_2023) || 0,
    yr_2024: parseFloat(row.count_2024) || 0,
    trust_score: parseInt(row.trust_score) || 0,
    trend: row.trend || '',
  }))

  const BATCH = 500
  let uploaded = 0

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH)
    const { error } = await supabase
      .from('school_pipelines')
      .insert(batch)
    if (error) {
      console.error(`Error at ${i}:`, error.message)
    } else {
      uploaded += batch.length
      console.log(`Uploaded: ${uploaded} / ${records.length}`)
    }
  }

  console.log(`Done! Uploaded: ${uploaded}`)
}

upload().catch(console.error)