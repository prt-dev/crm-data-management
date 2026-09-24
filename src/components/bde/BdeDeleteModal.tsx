"use client";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { TrashBinIcon } from "@/icons";
import { BDE } from "@/types/bde";
import React from "react";

interface BdeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  bde: BDE | null;
  isDeleting?: boolean;
}

export default function BdeDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  bde,
  isDeleting = false,
}: BdeDeleteModalProps) {
  if (!bde) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-6 sm:p-8 text-start"
    >
      <div className="flex flex-col items-center text-center">
        {/* Warning Icon Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error-50 text-error-500 dark:bg-error-500/10">
          <TrashBinIcon className="w-7 h-7" />
        </div>

        <h3 className="mt-4 text-theme-xl font-bold text-gray-800 dark:text-white/90">
          Delete BDE Record
        </h3>

        <p className="mt-2 text-theme-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to remove{" "}
          <strong className="text-gray-800 dark:text-white/90 font-semibold">
            {bde.name}
          </strong>{" "}
          ({bde.bdeId})? All assigned pipeline metrics and historical allocations
          will be archived. This action cannot be reversed.
        </p>

        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            size="md"
            className="flex-1 bg-error-500 hover:bg-error-600 dark:bg-error-500 dark:hover:bg-error-600 text-white"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
