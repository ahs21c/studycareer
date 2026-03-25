import { createClient } from './client'

export type Company = {
  slug: string
  employer_name: string
  employer_state: string
  sector: string
  naics_code: string
  lca_fy2024: number
  lca_fy2025: number
  lca_total_2yr: number
  lca_trend: string
  avg_salary_fy2024: number | null
  avg_salary_fy2025: number | null
  median_salary_fy2025: number | null
  p75_salary_fy2025: number | null
  prevailing_wage_avg: number | null
  top_worksite_state: string
  top3_worksite_states: string
  top3_job_titles: string
  h1b_ratio: number | null
  has_perm: boolean
  perm_total_4yr: number
  perm_certified: number
  perm_avg_wage: number | null
  perm_fy2021: number
  perm_fy2022: number
  perm_fy2023: number
  perm_fy2024: number
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
    .order('lca_total_2yr', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function searchCompanies(query: string, limit = 8) {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('slug, employer_name, lca_total_2yr, has_perm')
    .ilike('employer_name', `%${query}%`)
    .order('lca_total_2yr', { ascending: false })
    .limit(limit)
  return (data ?? []) as { slug: string; employer_name: string; lca_total_2yr: number; has_perm: boolean }[]
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