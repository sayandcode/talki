import { useEffect, useRef } from "preact/hooks";
import type { RoomId } from "utils/types/Room";
import LinkAttribution from "./Subcomponents/LinkAttribution";
import UrlCopy from "./Subcomponents/UrlCopy";

type Props = {
  roomId: RoomId;
  isOpen: boolean;
  onClose: () => void;
};

function RoomPageInviteFriendsModal({
  isOpen,
  onClose: closeModal,
  roomId,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fnToCall = isOpen ? "showModal" : "close";
    dialogRef.current?.[fnToCall]();
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} class="bg-transparent" onClick={closeModal}>
      <div class="bg-white p-4" onClick={(e) => e.stopPropagation()}>
        <div class="mb-2">
          <button
            aria-label="Close modal"
            class="float-right p-2 hover:bg-gray-100"
            onClick={closeModal}
          >
            <img src="/talki/x-symbol.svg" class="h-4 w-4" />
          </button>
          <h1 class="font-bold">Invite friends to this room</h1>
        </div>
        <UrlCopy roomId={roomId} />
        <LinkAttribution />
      </div>
    </dialog>
  );
}

export default RoomPageInviteFriendsModal;
