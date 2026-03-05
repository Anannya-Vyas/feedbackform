import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { rating, feedback } = body;

        if (!rating) {
            return NextResponse.json({ message: 'Rating is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('feedbackform');

        // Insert the new feedback
        const collection = db.collection('feedbacks');
        const result = await collection.insertOne({
            rating,
            feedback: feedback || '',
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Feedback submitted successfully', id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ message: 'Failed to submit feedback' }, { status: 500 });
    }
}
