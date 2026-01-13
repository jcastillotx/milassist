import type { Access, Where } from 'payload'

export const isOwner: Access = ({ req: { user } }) => {
  // Allow if user owns the resource
  if (!user) {
    return false
  }

  // Return a query constraint
  const query: Where = {
    or: [
      {
        client: {
          equals: user.id,
        },
      } as Where,
      {
        assistant: {
          equals: user.id,
        },
      } as Where,
      {
        user: {
          equals: user.id,
        },
      } as Where,
    ],
  }
  
  return query
}
