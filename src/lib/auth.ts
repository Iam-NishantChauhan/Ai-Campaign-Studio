    import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentUser() {
  // Read cookies
  const cookieStore = await cookies();

  // Get token
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify token
    const payload = verifyToken(token);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}