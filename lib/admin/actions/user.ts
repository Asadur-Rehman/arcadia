"use server";

import { db, withDbRetry } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const approveUser = async (userId: string) => {
  try {
    await withDbRetry(() =>
      db.update(users).set({ status: "APPROVED" }).where(eq(users.id, userId)),
    );
    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("approveUser error:", error);
    return { success: false, message: "Failed to approve user" };
  }
};

export const rejectUser = async (userId: string) => {
  try {
    await withDbRetry(() =>
      db.update(users).set({ status: "REJECTED" }).where(eq(users.id, userId)),
    );
    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("rejectUser error:", error);
    return { success: false, message: "Failed to reject user" };
  }
};
