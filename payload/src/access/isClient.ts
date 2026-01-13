import type { Access } from 'payload'

export const isClient: Access = ({ req: { user } }) => {
  // Allow if user is client
  if (user?.role === 'client') {
    return true
  }

  return false
}
