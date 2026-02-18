import HttpError from "../../error/error.ts";
import prisma from "../../lib/prisma.ts";
import type { User } from "../../types/user.ts";

export async function getMeUser(userID: string): Promise<User> {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });
  if (!userInfo) {
    throw new HttpError(404, "User not found");
  }
  return userInfo;
}
