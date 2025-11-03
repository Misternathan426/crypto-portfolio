import { NextResponse } from 'next/server';
import Portfolio from '../../../../models/Portfolio';
import { connectDB } from '../../../../lib/mongodb';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const newRecord = await Portfolio.create(body);

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const portfolio = await Portfolio.find().sort({ createdAt: -1 });

        return NextResponse.json(portfolio, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await Portfolio.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Portfolio item deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};