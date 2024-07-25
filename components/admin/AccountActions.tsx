"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { approveUser, rejectUser } from "@/lib/admin/actions/user";

interface Props {
  userId: string;
}

export default function AccountActions({ userId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveUser(userId);
      toast(
        result.success
          ? {
              title: "User approved",
              description: "The user can now borrow books.",
            }
          : {
              title: "Error",
              description: result.message,
              variant: "destructive",
            },
      );
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectUser(userId);
      toast(
        result.success
          ? { title: "User rejected" }
          : {
              title: "Error",
              description: result.message,
              variant: "destructive",
            },
      );
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleApprove}
        disabled={isPending}
        className="confirm-trigger confirm-approve"
      >
        Approve
      </Button>
      <Button
        onClick={handleReject}
        disabled={isPending}
        className="confirm-trigger confirm-reject"
      >
        Reject
      </Button>
    </div>
  );
}
