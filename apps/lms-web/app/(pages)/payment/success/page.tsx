import { PaymentSuccessPage } from '@repo/ui'
import { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  )
}

