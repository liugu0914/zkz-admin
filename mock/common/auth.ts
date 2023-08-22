/* eslint-disable camelcase */
import { defineMockData, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
const prefix = '/auth'
export default defineMockData([
  {
    url: `${prefix}/oauth2/token`,
    method: Request.post,
    response: () =>
      suc({
        access_token:
          'zLASHDF6FX9xGNJJufJ1diXe6O_Cl8qQTrwA-4cO92FfKyHH7PPoJkje_0T4e7-cZNV52G_ezNU-KPA7dqCMkwPt3_w2KG7NczH3zDQAp6CkkRSuvky4-h1C6XNHCfd8',
        expires_in: 7200000000,
        refresh_token:
          'XfvrksiYpKADIZNKvbVefhNpuNQTPVjejI-K9hEU4kIb-dZluwFEMc_PBdl4OLYFmjnWSsrlX2eiWf5PwgZ5ML_tN30pppNo0snH4rnahHTh9KrTWFJDxQFNEFAjHPpE',
        scope: 'server',
        token_type: 'Bearer'
      })
  },
  {
    url: `${prefix}/logout`,
    method: Request.get,
    response: () => suc(true)
  },
  {
    url: `${prefix}/actuator/check`,
    method: Request.get,
    response: () => suc(true)
  }
])
