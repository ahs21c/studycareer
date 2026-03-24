import { createClient } from './client'

export type Company = {
  slug: string
  employer_name: string
  visa_risk_score: number | null
  risk_grade: string | null
  h1b_fy2022: number
  h1b_fy2023: number
  h1b_fy2024: number
  h1b_total_3yr: number
  h1b_trend: string
  h1b_certified_3yr: number
  h1b_denied_3yr: number
  h1b_avg_salary: number | null
  perm_fy2021: number
  perm_fy2022: number
  perm_fy2023: number
  perm_total_3yr: number
  perm_certified_3yr: number
  has_h1b: boolean
  has_perm: boolean
  sponsor_type: string | null
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getTopCompanies(limit = 100): Promise<Company[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('*')
    .order('h1b_total_3yr', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function searchCompanies(query: string, limit = 8) {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('slug, employer_name, h1b_total_3yr, has_perm')
    .ilike('employer_name', `%${query}%`)
    .order('h1b_total_3yr', { ascending: false })
    .limit(limit)
  return (data ?? []) as { slug: string; employer_name: string; h1b_total_3yr: number; has_perm: boolean }[]
}

export async function getH1BByState() {
  const supabase = createClient()
  const { data } = await supabase
    .from('h1b_by_state')
    .select('*')
    .order('approvals', { ascending: false })
  return data ?? []
}

export async function getH1BByIndustry() {
  const supabase = createClient()
  const { data } = await supabase
    .from('h1b_by_industry')
    .select('*')
    .order('approvals', { ascending: false })
  return data ?? []
}