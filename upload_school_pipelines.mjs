import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://lngwlhggdtwcvwaggidv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZ3dsaGdnZHR3Y3Z3YWdnaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDQxODIsImV4cCI6MjA4OTkyMDE4Mn0.RK1oYTB2N9vg37wa6RcD_GBPse0b92b9tvngEexDvx8'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function upload() {
  const records = JSON.parse(readFileSync('./school_pipelines_v3.json', 'utf-8'))
  console.log(`Total records: ${records.length}`)

  // Upload in batches (no delete - Supabase SQL Editor에서 TRUNCATE 먼저 실행 필요)
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
      if (uploaded % 10000 === 0 || uploaded === records.length)
        console.log(`Uploaded: ${uploaded} / ${records.length}`)
    }
  }

  console.log(`Done! Uploaded: ${uploaded}, Errors: ${errors}`)
}

upload().catch(console.error)
