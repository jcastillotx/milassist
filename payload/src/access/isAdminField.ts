import type { FieldAccess } from 'payload'

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  // Field access must return boolean
  return user?.role === 'admin'
}
