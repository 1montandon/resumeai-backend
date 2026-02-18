import HttpError from "../../error/error.ts";
import prisma from "../../lib/prisma.ts";
import type { UpdateUser, User } from "../../types/user.ts";

export async function updateUser(
  userID: string,
  userData: UpdateUser,
): Promise<User> {
  const userInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: userData,
  });
  if (!userInfo) {
    throw new HttpError(404, "User not found");
  }
  return userInfo;
}
