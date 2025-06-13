import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface HeadingIssue {
  url: string
  type: 'duplicate_text' | 'wrong_hierarchy' | 'missing_h1'
  message: string
  headings: string[]
}

const URLS_TO_CHECK = [
  'https://www.lelanation.fr/',
  'https://www.lelanation.fr/legal',
  'https://www.lelanation.fr/dictionnaire',
  'https://www.lelanation.fr/builds',
  'https://www.lelanation.fr/statistique'
]

async function extractHeadings(url: string): Promise<string[]> {
  try {
    const { stdout } = await execAsync(`curl -s "${url}" | grep -oP '<h[1-6][^>]*>.*?</h[1-6]>' | sed 's/<[^>]*>//g' | tr -d '\n' | sed 's/  */ /g'`)
    return stdout.split('\n').filter(h => h.trim().length > 0)
  } catch (error) {
    console.warn(`Failed to extract headings from ${url}:`, error)
    return []
  }
}

function analyzeHeadings(url: string, headings: string[]): HeadingIssue[] {
  const issues: HeadingIssue[] = []
  
  const h1Count = headings.filter(h => h.includes('h1')).length
  if (h1Count === 0) {
    issues.push({
      url,
      type: 'missing_h1',
      message: 'No H1 heading found',
      headings
    })
  } else if (h1Count > 1) {
    issues.push({
      url,
      type: 'duplicate_text',
      message: `Multiple H1 tags found (${h1Count})`,
      headings
    })
  }
  
  const headingTexts = headings.map(h => h.replace(/<[^>]*>/g, '').trim().toLowerCase())
  const duplicates = headingTexts.filter((text, index) => 
    text.length > 0 && headingTexts.indexOf(text) !== index
  )
  
  if (duplicates.length > 0) {
    issues.push({
      url,
      type: 'duplicate_text',
      message: `Duplicate heading text found: ${[...new Set(duplicates)].join(', ')}`,
      headings
    })
  }
  
  return issues
}

async function checkAllHeadings() {
  console.log('🔍 Checking headings for SEO issues...\n')
  
  const allIssues: HeadingIssue[] = []
  
  for (const url of URLS_TO_CHECK) {
    console.log(`📄 Checking: ${url}`)
    
    const headings = await extractHeadings(url)
    const issues = analyzeHeadings(url, headings)
    
    if (issues.length === 0) {
      console.log('   ✅ No heading issues found')
    } else {
      console.log(`   ❌ ${issues.length} issue(s) found:`)
      issues.forEach(issue => {
        console.log(`      • ${issue.message}`)
      })
      allIssues.push(...issues)
    }
    console.log('')
  }
  
  console.log('='.repeat(60))
  console.log('📊 HEADINGS VALIDATION SUMMARY')
  console.log('='.repeat(60))
  
  if (allIssues.length === 0) {
    console.log('🎉 All pages have proper heading structure!')
  } else {
    console.log(`⚠️  Found ${allIssues.length} heading issues:`)
    console.log('')
    
    const groupedIssues = allIssues.reduce((acc, issue) => {
      if (!acc[issue.url]) acc[issue.url] = []
      acc[issue.url].push(issue)
      return acc
    }, {} as Record<string, HeadingIssue[]>)
    
    Object.entries(groupedIssues).forEach(([url, urlIssues]) => {
      console.log(`🔗 ${url}:`)
      urlIssues.forEach(issue => {
        console.log(`   • ${issue.message}`)
      })
      console.log('')
    })
    
    console.log('💡 Recommendations:')
    console.log('   • Ensure each page has exactly one H1')
    console.log('   • Make all heading texts unique within a page')
    console.log('   • Follow proper heading hierarchy (H1 → H2 → H3...)')
    console.log('   • Use semantic heading structure for better SEO')
  }
  
  return allIssues.length === 0
}

checkAllHeadings().then(success => {
  process.exit(success ? 0 : 1)
}).catch(error => {
  console.error('💥 Headings validation failed:', error)
  process.exit(1)
}) 