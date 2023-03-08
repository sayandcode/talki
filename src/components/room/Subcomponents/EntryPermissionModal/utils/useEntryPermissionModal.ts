import { useState } from "preact/hooks";
import type ModalProps from "./index.types";

function useEntryPermissionModal() {
  const [data, setData] = useState<ModalProps["data"]>(null);

  function closeModal() {
    setData(null);
  }

  function openModal({
    userData,
    processEntry,
  }: NonNullable<ModalProps["data"]>) {
    setData({ userData, processEntry });
  }

  return {
    data,
    openModal,
    closeModal,
  };
}

export default useEntryPermissionModal;
