import { useEffect, useRef } from "preact/hooks";
import type Props from "./utils/index.types";
import ActionBtns from "./Subcomponents/ActionBtns";
import VerifiedStatus from "./Subcomponents/VerifiedStatus";

function RoomPageEntryPermissionModal({ data, onClose: closeModal }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.[data ? "showModal" : "close"]();
  }, [data]);

  return (
    <dialog
      ref={dialogRef}
      onClick={closeModal}
      class="text-center backdrop:bg-black backdrop:opacity-30"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        class="text-base sm:text-xl font-light"
      >
        <h2 class="text-xl font-mono sm:text-3xl font-bold mb-2 sm:mb-3 capitalize">
          New member alert
        </h2>
        <div class="mb-1">Do you want to let</div>
        <div class="text-xl sm:text-2xl font-mono font-semibold">
          {data?.userData.username}
        </div>
        <VerifiedStatus isVerified={data?.userData.verified} />
        <div class="mb-2">in your room?</div>
        <ActionBtns processEntry={data?.processEntry} onClose={closeModal} />
      </form>
    </dialog>
  );
}

export default RoomPageEntryPermissionModal;
