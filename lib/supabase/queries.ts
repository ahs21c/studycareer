import { createClient } from './server'

export type SearchResult = {
  slug: string
  employer_name: string
  sector: string
  lca_total_2yr: number
  lca_trend: string
  avg_salary_fy2025: number | null
  has_perm: boolean
}

export async function getCompanyBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function searchCompanies(query: string, limit = 8): Promise<SearchResult[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('search_companies', {
    query,
    result_limit: limit,
    offset_val: 0,
  })
  return data ?? []
}

export async function getSectorCompanies(sector: string, limit = 50) {
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_sector_companies', {
    sector_name: sector,
    result_limit: limit,
    offset_val: 0,
  })
  return data ?? []
}

export async function searchCapExempt(query: string, limit = 20) {
  const supabase = await createClient()
  const { data } = await supabase.rpc('search_cap_exempt', {
    query,
    result_limit: limit,
  })
  return data ?? []
}

export async function getSchoolPipelines(university: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('school_pipelines')
    .select('*')
    .ilike('university_std', `%${university}%`)
    .order('perm_count', { ascending: false })
    .limit(30)
  return data ?? []
}
