import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quotation from '@/lib/models/Quotation';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const quotations = await Quotation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(quotations, { status: 200 });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();

    if (data.id) {
      data._id = data.id;
    }

    const quotation = new Quotation(data);
    await quotation.save();

    return NextResponse.json(quotation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create quotation' },
      { status: 400 }
    );
  }
}
