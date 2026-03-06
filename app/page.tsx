<<<<<<< HEAD
import fs from 'fs'
import path from 'path'

export default function Home() {
  const filePath = path.join(process.cwd(), 'public', 'matchmor-founding.html')
  const html = fs.readFileSync(filePath, 'utf-8')
  
  return (
    <html dangerouslySetInnerHTML={{ __html: html.replace(/^<!DOCTYPE html><html[^>]*>/, '').replace(/<\/html>$/, '') }} />
  )
=======
export default async function Home() {
  const res = await fetch('http://localhost:3000/api/home', { cache: 'no-store' })
  const html = await res.text()
  return <div dangerouslySetInnerHTML={{ __html: html }} />
>>>>>>> 33d7beb598280ac6df3aace588f3092170c75d48
}
