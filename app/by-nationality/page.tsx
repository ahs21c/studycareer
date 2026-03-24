import type { Metadata } from 'next'
import NationalityClient from './NationalityClient'

export const metadata: Metadata = {
  title: 'H1B & Green Card by Nationality',
  description: 'Find US companies that sponsor H1B and green cards — filtered by your nationality. See visa routes, wait times, and top employers.',
}

export default function ByNationalityPage() {
  return <NationalityClient />
}