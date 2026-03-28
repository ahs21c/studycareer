import HeroSection from '@/app/components/HeroSection'
import Link from 'next/link'

const BLOG_POSTS = [
  { title: 'E-7 비자 신청 완벽 가이드 2026', date: '2026.03.15', tag: '비자', views: '2.1k', slug: 'e7-visa-guide-2026' },
  { title: '베트남 출신 한국 취업 성공 사례 10선', date: '2026.03.10', tag: '취업 사례', views: '3.4k', slug: 'vietnam-korea-job-cases' },
  { title: 'TOPIK 6급 없이 대기업 취업한 방법', date: '2026.03.05', tag: '전략', views: '1.8k', slug: 'topik-without-6-grade' },
  { title: 'GKS 장학금 서류 준비 체크리스트', date: '2026.02.28', tag: '장학금', views: '2.7k', slug: 'gks-checklist' },
]

const TOOLS = [
  { href: '/tools/score', emoji: '📊', title: '취업 가능성 점수', desc: '5문항으로 E-7 취업 가능성 진단', color: '#0EA5E9' },
  { href: '/tools/visa-simulator', emoji: '🗺️', title: '비자 경로 시뮬레이터', desc: '내 상황 맞춤 비자 경로 3개 추천', color: '#8B5CF6' },
  { href: '/tools/living-cost', emoji: '💰', title: '지역별 생활비 비교', desc: '연봉별 실제 저축 가능 금액 계산', color: '#10B981' },
]

export default async function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* 3대 핵심 툴 — 중앙 배치 */}
      <div style={{ background: '#F9FAFB', padding: '56px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>무료 진단 툴</h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>2분이면 내 상황에 맞는 경로를 찾을 수 있어요</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{t.emoji}</div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#111827', marginBottom: '8px' }}>{t.title}</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px', lineHeight: 1.6 }}>{t.desc}</div>
                  <div style={{ display: 'inline-block', padding: '8px 20px', background: t.color, color: '#fff', borderRadius: '100px', fontSize: '13px', fontWeight: '700' }}>무료로 시작 →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ borderTop: '1px solid #E5E7EB' }} />

        <div style={{ padding: '48px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>최신 가이드</h2>
            <Link href="/blog" style={{ fontSize: '13px', color: '#FF6B35', textDecoration: 'none', fontWeight: '600' }}>전체 보기 →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {BLOG_POSTS.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <div style={{ marginBottom: '12px' }}>
                    <span className="tag" style={{ background: '#F3F4F6', color: '#6B7280', fontSize: '11px' }}>{post.tag}</span>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827', lineHeight: 1.5, marginBottom: '16px' }}>{post.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{post.date}</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>👁 {post.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '48px' }}>
          <Link href="/stats" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '36px' }}>📊</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>취업 통계 보기</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>학위·전공·업종별 실제 취업 현황</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '18px' }}>→</div>
            </div>
          </Link>
          <Link href="/universities" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '2px solid #0EA5E9', borderRadius: '16px', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '36px' }}>🎓</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>추천 대학 가이드</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>티어별 취업 파이프라인 비교</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#0EA5E9', fontSize: '18px' }}>→</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
