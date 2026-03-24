import type { Metadata } from 'next'
import { Suspense } from 'react'
import NationalityClient from './NationalityClient'

export const metadata: Metadata = {
  title: 'H1B & Green Card by Nationality',
  description: 'Find US companies that sponsor H1B and green cards — filtered by your nationality. See visa routes, wait times, and top employers.',
}

export default function ByNationalityPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Loading...</div>}>
      <NationalityClient />
    </Suspense>
  )
}