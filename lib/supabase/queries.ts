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
  perm_fy2025: number
  perm_total_5yr: number
}
 
const STATE_MAP: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
  'seattle': 'WA', 'san francisco': 'CA', 'los angeles': 'CA', 'new york city': 'NY',
  'nyc': 'NY', 'sf': 'CA', 'la': 'CA', 'chicago': 'IL', 'boston': 'MA',
  'austin': 'TX', 'dallas': 'TX', 'houston': 'TX', 'denver': 'CO',
  'atlanta': 'GA', 'miami': 'FL', 'phoenix': 'AZ', 'portland': 'OR',
  'san diego': 'CA', 'san jose': 'CA', 'minneapolis': 'MN', 'detroit': 'MI',
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
  const q = query.toLowerCase().trim()
  const stateCode = STATE_MAP[q]
 
  if (stateCode) {
    const { data } = await supabase
      .from('company_profiles')
      .select('slug, employer_name, lca_total_2yr, has_perm, employer_state')
      .eq('employer_state', stateCode)
      .order('lca_total_2yr', { ascending: false })
      .limit(limit)
    return (data ?? []) as { slug: string; employer_name: string; lca_total_2yr: number; has_perm: boolean; employer_state: string }[]
  }
 
  const { data } = await supabase
    .from('company_profiles')
    .select('slug, employer_name, lca_total_2yr, has_perm, employer_state')
    .ilike('employer_name', `%${query}%`)
    .order('lca_total_2yr', { ascending: false })
    .limit(limit)
  return (data ?? []) as { slug: string; employer_name: string; lca_total_2yr: number; has_perm: boolean; employer_state: string }[]
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
 
export async function getSchoolPipeline(university: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_pipelines')
    .select('*')
    .ilike('university_std', `%${university}%`)
    .order('perm_count', { ascending: false })
    .limit(20)
  return data ?? []
}
 
// ============================================================
// SCHOOL FUNCTIONS — school_details 테이블 사용 (slug 직접 조회)
// ============================================================
 
export async function getTopSchools() {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_details')
    .select('school_name, slug, perm_count, avg_wage')
    .order('perm_count', { ascending: false })
    .limit(50)
  
  if (!data) return []
 
  // 기존 호출부 호환: university_std, avg_annual_wage 형태로 매핑
  return data.map(row => ({
    university_std: row.school_name,
    perm_count: row.perm_count,
    avg_annual_wage: row.avg_wage,
    slug: row.slug,
  }))
}
 
export async function searchSchools(query: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_details')
    .select('school_name, slug, perm_count, avg_wage')
    .ilike('school_name', `%${query}%`)
    .order('perm_count', { ascending: false })
    .limit(20)
 
  if (!data) return []
 
  return data.map(row => ({
    university_std: row.school_name,
    perm_total: row.perm_count,
    avg_wage: row.avg_wage,
    slug: row.slug,
  }))
}
 
export async function getSchoolDetail(slug: string) {
  if (!slug) return null

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  const supabase = createSupabaseClient(
    'https://lngwlhggdtwcvwaggidv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZ3dsaGdnZHR3Y3Z3YWdnaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDQxODIsImV4cCI6MjA4OTkyMDE4Mn0.RK1oYTB2N9vg37wa6RcD_GBPse0b92b9tvngEexDvx8'
  )

  const { data } = await supabase
    .from('school_details')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) return null

  return {
    school_name: data.school_name,
    perm_count: data.perm_count,
    avg_wage: data.avg_wage,
    top_employers: data.top_employers ?? [],
    top_majors_cat: data.top_majors_cat ?? [],
    top_majors_detail: data.top_majors_detail ?? [],
    top_education: data.top_education ?? [],
  }
}
 
// ============================================================
 
export async function getCapExempt(search = '', stateFilter = '', typeFilter = '') {
  const supabase = createClient()
  let query = supabase
    .from('cap_exempt')
    .select('*')
    .order('h1b_total_3yr', { ascending: false })
    .limit(100)
 
  if (search) query = query.ilike('employer_name', `%${search}%`)
  if (stateFilter) query = query.eq('primary_state', stateFilter)
  if (typeFilter) query = query.eq('institution_type', typeFilter)
 
  const { data } = await query
  return data ?? []
}
 
export async function getSectors() {
  const supabase = createClient()
  const { data } = await supabase
    .from('sector_rankings')
    .select('sector, lca_total_2yr, avg_salary_fy2025')
    .order('lca_total_2yr', { ascending: false })
 
  if (!data) return []
 
  const sectorMap: Record<string, { total: number; salarySum: number; salaryCount: number }> = {}
  for (const row of data) {
    if (!sectorMap[row.sector]) sectorMap[row.sector] = { total: 0, salarySum: 0, salaryCount: 0 }
    sectorMap[row.sector].total += row.lca_total_2yr
    if (row.avg_salary_fy2025) {
      sectorMap[row.sector].salarySum += row.avg_salary_fy2025
      sectorMap[row.sector].salaryCount++
    }
  }
 
  return Object.entries(sectorMap)
    .map(([sector, v]) => ({
      sector,
      lca_total: v.total,
      avg_salary: v.salaryCount > 0 ? Math.round(v.salarySum / v.salaryCount) : null,
    }))
    .sort((a, b) => b.lca_total - a.lca_total)
}
 
export async function getSectorCompanies(sector: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('sector_rankings')
    .select('*')
    .eq('sector', sector)
    .order('lca_total_2yr', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function getTopSchoolsByCompany(employerName: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_pipelines')
    .select('university_std, perm_count, avg_annual_wage, top_major')
    .eq('employer_std', employerName.toUpperCase())
    .order('perm_count', { ascending: false })
    .limit(5)
  return data ?? []
}