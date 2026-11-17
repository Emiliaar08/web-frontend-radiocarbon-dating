import { fileURLToPath } from 'node:url'
import { generateApi } from 'swagger-typescript-api'

const backend = process.env.REMAINS_API_TARGET || 'http://127.0.0.1:8000'
const response = await fetch(new URL('/api/openapi.json', backend))
if (!response.ok) {
  throw new Error('Не удалось получить OpenAPI: HTTP ' + response.status)
}

const spec = await response.json()
spec.paths = Object.fromEntries(
  Object.entries(spec.paths).filter(([path]) => path === '/api/remains' || path.startsWith('/api/remains/')),
)
for (const operations of Object.values(spec.paths)) {
  for (const operation of Object.values(operations)) {
    operation.operationId = operation.operationId.split('_api_remains')[0]
  }
}

if (!Object.keys(spec.paths).length) {
  throw new Error('В OpenAPI отсутствуют маршруты останков')
}

function referencedSchemas(value) {
  return Array.from(JSON.stringify(value).matchAll(/#\/components\/schemas\/([^"]+)/g), (match) => match[1])
}

const schemas = spec.components.schemas
const usedSchemas = {}
const pendingSchemas = referencedSchemas(spec.paths)
for (const name of pendingSchemas) {
  if (Object.hasOwn(usedSchemas, name)) continue
  usedSchemas[name] = schemas[name]
  pendingSchemas.push(...referencedSchemas(schemas[name]))
}
spec.components.schemas = usedSchemas

await generateApi({
  spec,
  output: fileURLToPath(new URL('../src/api', import.meta.url)),
  fileName: 'RemainsApi.ts',
  httpClientType: 'axios',
  generateResponses: true,
})
