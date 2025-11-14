import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB database 'mahi_mehendi'
    console.log('Connecting to MongoDB database: mahi_mehendi');
    await connectDB();
    console.log('Connected to MongoDB successfully');

    // Get form data
    const body = await request.json();
    const { name, emailOrPhone, occasion, preferredDate, message } = body;

    // Validate input
    if (!name || !emailOrPhone || !occasion || !preferredDate || !message) {
      return NextResponse.json(
        { error: 'All fields are required: name, email/phone, occasion, preferred date, and message' },
        { status: 400 }
      );
    }

    // Save to database collection 'contacts' in database 'mahi_mehendi'
    console.log('Saving contact form to MongoDB collection: contacts');
    const newContact = new Contact({
      name,
      emailOrPhone,
      occasion,
      preferredDate,
      message,
    });
    await newContact.save();
    console.log('Contact form saved to MongoDB successfully:', newContact._id);

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully! We will get back to you soon.',
        contact: {
          _id: newContact._id,
          name: newContact.name,
          occasion: newContact.occasion,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: GET route to fetch all contacts (for admin use)
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }); // Sort by newest first
    console.log(`Fetched ${contacts.length} contacts from contacts collection`);
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

