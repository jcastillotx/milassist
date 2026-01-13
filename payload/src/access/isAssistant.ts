import type { Access } from 'payload'

export const isAssistant: Access = async ({ req: { user, payload } }) => {
  // Must be an assistant role
  if (!user || user.role !== 'assistant') {
    return false
  }

  // Check if assistant is approved for live access
  try {
    const onboarding = await payload.find({
      collection: 'assistant-onboarding',
      where: {
        assistant: {
          equals: user.id,
        },
        status: {
          equals: 'approved',
        },
      },
    })

    return onboarding.docs.length > 0
  } catch (error) {
    console.error('Error checking assistant approval:', error)
    return false
  }
}
