import { getPayload } from 'payload'
import { cache } from 'react'
import config from '@payload-config'

export const getCachedPayload = cache(async () => {
  return getPayload({ config })
})
