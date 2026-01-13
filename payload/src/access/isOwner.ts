ologoimport type { Access } from 'payload'

export const isOwner: Access = ({ req: { user } }) => {
  // Allow if user owns the resource
  if (!user) {
    return false
  }

  // Return a query constraint
  return {
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
}
