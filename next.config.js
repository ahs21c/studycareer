/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/rankings/top-100',
        destination: '/rankings',
        permanent: true,
      },
      {
        source: '/rankings/sector',
        destination: '/rankings',
        permanent: true,
      },
      {
        source: '/sector',
        destination: '/rankings',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig