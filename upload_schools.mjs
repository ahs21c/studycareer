import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZRCENoenmcQI1XM2uyiNIg_MRFBHxwd'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const data = JSON.parse(readFileSync('./school_details.json', 'utf-8'))

console.log(`총 ${data.length}개 업로드 시작...`)

const BATCH = 100
let success = 0

for (let i = 0; i < data.length; i += BATCH) {
  const batch = data.slice(i, i + BATCH)
  const { error } = await supabase
    .from('school_details')
    .upsert(batch, { onConflict: 'slug' })

  if (error) {
    console.error(`배치 ${i}-${i + BATCH} 에러:`, error.message)
  } else {
    success += batch.length
    console.log(`${success}/${data.length} 완료`)
  }
}

console.log('업로드 완료!')
