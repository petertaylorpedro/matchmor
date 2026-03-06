import fs from 'fs'
import path from 'path'

export default function Home() {
  const filePath = path.join(process.cwd(), 'public', 'matchmor-founding.html')
  const html = fs.readFileSync(filePath, 'utf-8')
  
  return (
    <html dangerouslySetInnerHTML={{ __html: html.replace(/^<!DOCTYPE html><html[^>]*>/, '').replace(/<\/html>$/, '') }} />
  )
}
