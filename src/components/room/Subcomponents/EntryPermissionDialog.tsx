import {
  ENTRY_DIALOG_USERNAME_ID,
  ENTRY_DIALOG_ID,
  ENTRY_DIALOG_VERIFIED_ID,
  ENTRY_DIALOG_NOT_VERIFIED_ID,
  ENTRY_DIALOG_ALLOW_BTN_ID,
  ENTRY_DIALOG_DENY_BTN_ID,
  ENTRY_DIALOG_BTN_CONTAINER_ID,
} from "scripts/components/room/EntryPermissionDialog";

function RoomPageEntryPermissionDialog() {
  return (
    <dialog
      id={ENTRY_DIALOG_ID}
      class="text-center backdrop:bg-black backdrop:opacity-30"
    >
      <form>
        <h2 class="text-xl font-bold mb-2">New member alert</h2>
        <div class="text-2xl" id={ENTRY_DIALOG_USERNAME_ID}>
          <div class="">Do you want to let</div>
          Sayand Sathish Kumar
        </div>
        <div class="font-mono font-bold text-sm text-right">
          <div id={ENTRY_DIALOG_VERIFIED_ID} class="text-green-500">
            Verified User ✓
          </div>
          <div id={ENTRY_DIALOG_NOT_VERIFIED_ID} class="text-red-500">
            Not Verified User ✗
          </div>
        </div>
        <div class="mb-2">in your room?</div>
        <div
          class="flex gap-x-2 justify-center"
          id={ENTRY_DIALOG_BTN_CONTAINER_ID}
        >
          <button
            type="button"
            class="border-2 rounded-md border-black text-lg px-3 py-1 font-medium font-mono transition-colors hover:bg-gray-300 focus-visible:bg-gray-300 active:bg-gray-500"
            id={ENTRY_DIALOG_DENY_BTN_ID}
          >
            Deny
          </button>
          <button
            type="button"
            class="border-2 rounded-md border-black transition-colors bg-talki-green-800 hover:bg-talki-green-600 focus-visible:bg-talki-green-600 active:bg-talki-green-300 hover:border-gray-600 focus-visible:border-gray-600 text-white font-medium font-mono text-lg px-3 py-1"
            id={ENTRY_DIALOG_ALLOW_BTN_ID}
          >
            Allow
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default RoomPageEntryPermissionDialog;
