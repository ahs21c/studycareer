import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl font-semibold text-gray-200 mb-4">404</div>
      <h1 className="text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-6">
        We couldn't find that page. The company may have moved or the URL may be incorrect.
      </p>
      <Link href="/" className="text-sm text-[#185FA5] hover:underline">← Back to home</Link>
    </div>
  )
}
