export default function AuthError() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Authentication error</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Something went wrong during sign in.</div>
      <a href="/" style={{ fontSize: 13, color: '#185FA5' }}>Go home</a>
    </div>
  )
}