import { NextResponse } from 'next/server';
import Portfolio from '../../../../models/Portfolio';
import { connectDB } from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';


export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession();
        const body = await req.json();
        
        // If user is authenticated, associate portfolio with their user ID
        // If not authenticated, use a guest identifier (you can modify this logic)
        const userId = session?.user?.email || 'guest';
        
        const { symbol, amount, price } = body;
        
        if (!symbol || !amount || !price) {
            return NextResponse.json({ 
                error: 'Missing required fields: symbol, amount, price' 
            }, { status: 400 });
        }

        const newRecord = await Portfolio.create({
            userId,
            symbol: symbol.toUpperCase(),
            amount: parseFloat(amount),
            price: parseFloat(price),
        });

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        console.error('Portfolio POST error:', error);
        return NextResponse.json({ error: 'Failed to add portfolio item' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession();
        
        // If user is authenticated, get their portfolio
        // If not authenticated, get guest portfolio
        const userId = session?.user?.email || 'guest';
        
        const portfolio = await Portfolio.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(portfolio, { status: 200 });
    } catch (error) {
        console.error('Portfolio GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Get the user ID
        const userId = session?.user?.email || 'guest';

        // Find and delete the portfolio item, but only if it belongs to the current user
        const deletedItem = await Portfolio.findOneAndDelete({ 
            _id: id, 
            userId: userId 
        });

        if (!deletedItem) {
            return NextResponse.json({ 
                error: 'Portfolio item not found or access denied' 
            }, { status: 404 });
        }

        return NextResponse.json({ message: 'Portfolio item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Portfolio DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
    }
};