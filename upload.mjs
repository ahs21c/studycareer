import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'
const JSON_PATH = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\클로드용보관파일\\pipeline_v2.json.json'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function upload() {
  const raw = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
  console.log(`Total records: ${raw.length}`)

  const records = raw.map(r => ({
    employer_std: r.employer_std,
    university_std: r.university_std,
    perm_count: r.perm_count,
    avg_annual_wage: r.avg_annual_wage,
    top_major: r.top_major,
    top_degree: r.top_degree,
    top_state: r.top_state,
    wage_level: r.wage_level,
    yr_2022: r.count_2022,
    yr_2023: r.count_2023,
    yr_2024: r.count_2024,
    trust_score: r.trust_score,
    trend: r.trend,
  }))

  const BATCH = 500
  let uploaded = 0
  let errors = 0

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH)
    const { error } = await supabase
      .from('school_pipelines')
      .insert(batch)
    if (error) {
      errors++
      console.error(`Error at ${i}:`, error.message)
    } else {
      uploaded += batch.length
      if (uploaded % 2000 === 0 || uploaded === records.length)
        console.log(`Uploaded: ${uploaded} / ${records.length}`)
    }
  }

  console.log(`Done! Uploaded: ${uploaded}, Errors: ${errors}`)
}

upload().catch(console.error)