import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quotation from '@/lib/models/Quotation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const quotation = await Quotation.findById(params.id);

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quotation, { status: 200 });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();

    const quotation = await Quotation.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quotation, { status: 200 });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update quotation' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const quotation = await Quotation.findByIdAndDelete(params.id);

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Quotation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
}
