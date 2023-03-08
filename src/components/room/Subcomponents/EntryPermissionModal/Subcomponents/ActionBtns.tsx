import type ModalProps from "../utils/index.types";

type Props = {
  processEntry: NonNullable<ModalProps["data"]>["processEntry"] | undefined;
  onClose: ModalProps["onClose"];
};

function EntryPermissionModalActionBtns({
  processEntry,
  onClose: closeModal,
}: Props) {
  if (!processEntry) return null;

  const denyEntry = async () => {
    await processEntry(false);
    closeModal();
  };

  const allowEntry = async () => {
    await processEntry(true);
    closeModal();
  };

  return (
    <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 sm:gap-x-2 justify-center">
      <button
        type="button"
        class="border-2 rounded-md border-black text-lg px-3 py-1 font-medium font-mono transition-colors hover:bg-gray-300 focus-visible:bg-gray-300 active:bg-gray-500"
        onClick={denyEntry}
      >
        Deny
      </button>
      <button
        type="button"
        class="border-2 rounded-md border-black transition-colors bg-talki-green-800 hover:bg-talki-green-600 focus-visible:bg-talki-green-600 active:bg-talki-green-300 hover:border-gray-600 focus-visible:border-gray-600 text-white font-medium font-mono text-lg px-3 py-1"
        onClick={allowEntry}
      >
        Allow
      </button>
    </div>
  );
}

export default EntryPermissionModalActionBtns;
