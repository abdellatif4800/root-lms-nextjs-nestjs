import { Suspense } from 'react'
import { PricingPage } from '@repo/ui'

export default function page() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PricingPage />
    </Suspense>
  )
}

