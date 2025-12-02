import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Habit } from "@/models/Habit";

const DEMO_USER_ID = "demo-user";

type Params = { params: { id: string } };

// PUT /api/habits/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: DEMO_USER_ID },
      body,
      { new: true }
    );

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habit, { status: 200 });
  } catch (error) {
    console.error("PUT /api/habits/:id error:", error);
    return NextResponse.json({ message: "Failed to update habit" }, { status: 500 });
  }
}

// DELETE /api/habits/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;

    const habit = await Habit.findOneAndDelete({ _id: id, userId: DEMO_USER_ID });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Habit deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/habits/:id error:", error);
    return NextResponse.json({ message: "Failed to delete habit" }, { status: 500 });
  }
}
