import type { Access, Where } from 'payload'

export const isOwner: Access = ({ req: { user } }) => {
  // Allow if user owns the resource
  if (!user) {
    return false
  }

  // Return a query constraint - explicitly type as Where to satisfy TypeScript
  const query: Where = {
    or: [
      {
        'client.id': {
          equals: user.id,
        },
      },
      {
        'assistant.id': {
          equals: user.id,
        },
      },
      {
        user: {
          equals: user.id,
        },
      },
    ],
  }

  return query
}
