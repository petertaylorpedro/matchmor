export default async function Home() {
  const res = await fetch('http://localhost:3000/api/home', { cache: 'no-store' })
  const html = await res.text()
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
