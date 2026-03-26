import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://lngwlhggdtwcvwaggidv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZ3dsaGdnZHR3Y3Z3YWdnaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDQxODIsImV4cCI6MjA4OTkyMDE4Mn0.RK1oYTB2N9vg37wa6RcD_GBPse0b92b9tvngEexDvx8'
  )
}
