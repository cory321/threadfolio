export {}

// Define roles
export type Roles = 'admin' | 'moderator' | 'user'

// Define user states
export type UserStates = 'paying' | 'payment_problem' | 'trial' | 'trial_expired' | 'cancelled'

// Define user payment details
interface UserPaymentDetails {
  lastPaymentDate?: string
  nextBillingDate?: string
  trialStartDate?: string
  trialEndDate?: string
  cancellationDate?: string
  problemDescription?: string
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
      paymentStatus?: {
        state: UserStates
        details?: UserPaymentDetails
      }
    }
  }
}
