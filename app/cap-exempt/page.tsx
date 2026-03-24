import type { Metadata } from 'next'
import { CAP_EXEMPT_SAMPLE } from '@/lib/data/companies'

export const metadata: Metadata = {
  title: 'Cap-Exempt H1B Institutions',
  description: '2,585 universities, nonprofits, and government research orgs that can hire H1B workers outside the annual cap.',
}

export const revalidate = 2592000

export default function CapExemptPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">Cap-exempt institutions</h1>
        <p className="text-sm text-gray-500 mb-3">
          2,585 universities, nonprofits, and government research organizations exempt from the annual H1B cap.
          These employers can file H1B petitions year-round with no lottery.
        </p>
        <div className="p-3.5 bg-[#E6F1FB] rounded-xl text-sm text-[#1e3a5f]">
          <span className="font-medium">What cap-exempt means:</span> These institutions can hire H1B workers at
          any time of year, bypassing the April lottery. Ideal for international students who missed the regular cap.
        </div>
      </div>

      {/* Search hint */}
      <div className="mb-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
        Full search available after Supabase connection. Showing top institutions by H1B volume.
      </div>

      <div className="space-y-2">
        {CAP_EXEMPT_SAMPLE.map((inst, i) => (
          <div
            key={inst.name}
            className="flex items-center gap-3 p-3.5 px-4 border border-gray-200 rounded-xl"
          >
            <span className="text-sm text-gray-400 w-6 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium truncate">{inst.name}</span>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium shrink-0">
                  {inst.type}
                </span>
              </div>
              <div className="text-xs text-gray-500">{inst.state}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-semibold">{inst.h1b_3yr.toLocaleString()}</div>
              <div className="text-[10px] text-gray-400">3yr filings</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
