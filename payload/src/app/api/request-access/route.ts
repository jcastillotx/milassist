import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.needs) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, and needs are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // TODO: In a production environment, you would:
    // 1. Store this in a database (e.g., a "AccessRequests" collection in Payload)
    // 2. Send a notification email to admins
    // 3. Send a confirmation email to the user
    // 4. Potentially integrate with a CRM system

    // Log the request for now (in production, use structured logging and mask sensitive data)
    if (process.env.NODE_ENV === 'development') {
      console.log('Access request received:', {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        organization: data.organization,
        serviceBranch: data.serviceBranch,
        timestamp: new Date().toISOString(),
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Access request submitted successfully',
      requestId: `REQ-${Date.now()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
    });
  } catch (error) {
    console.error('Error processing access request:', error);
    return NextResponse.json(
      { error: 'Failed to process access request' },
      { status: 500 }
    );
  }
}
