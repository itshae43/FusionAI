// sandbox.ts - E2B Sandbox Test
import { config } from 'dotenv'
import { Sandbox } from '@e2b/code-interpreter'

// Load environment variables from .env.local
config({ path: '.env.local' })

console.log('E2B_API_KEY:', process.env.E2B_API_KEY ? 'Found ✓' : 'Missing ✗')

const sbx = await Sandbox.create() // By default the sandbox is alive for 5 minutes
console.log('✅ Sandbox created:', sbx.sandboxId)

const execution = await sbx.runCode('print("hello world")') // Execute Python inside the sandbox
console.log('✅ Execution output:', execution.logs.stdout.join(''))

const files = await sbx.files.list('/')
console.log('✅ Files found:', files.length, 'items')

await sbx.kill() // Clean up the sandbox
console.log('✅ Sandbox killed successfully')
