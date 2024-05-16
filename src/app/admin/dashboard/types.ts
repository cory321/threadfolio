// types.ts
export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: EmailAddress[]
  primaryEmailAddressId: string | null
  publicMetadata: {
    role: 'admin' | 'moderator' | 'user'
  }
}

export interface EmailAddress {
  id: string
  emailAddress: string
}
