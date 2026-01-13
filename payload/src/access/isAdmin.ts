import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  // Allow if user is admin
  if (user?.role === 'admin') {
    return true
  }

  return false
}
