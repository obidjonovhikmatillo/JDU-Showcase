import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    select: { id: true, nameEn: true },
    orderBy: { nameEn: "asc" },
  });

  return NextResponse.json(categories);
}
