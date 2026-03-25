import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'
const JSON_PATH = 'C:\\Users\\ahs21\\OneDrive\\Desktop\\클로드용보관파일\\cap_exempt_data.json'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function upload() {
  const records = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
  console.log(`Total records: ${records.length}`)

  const BATCH = 500
  let uploaded = 0

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH)
    const { error } = await supabase
      .from('cap_exempt')
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