import Hero from '@/components/home/Hero'
import PopularSearches from '@/components/home/PopularSearches'
import CalculatorCards from '@/components/home/CalculatorCards'
import BlogCards from '@/components/home/BlogCards'

export const revalidate = 86400

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularSearches />
      <CalculatorCards />
      <BlogCards />
    </>
  )
}