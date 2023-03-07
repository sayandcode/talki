import { useState } from "preact/hooks";
import myImg from "./link.svg";

type Props = {
  roomUrl: string;
};

const btnColor = {
  unclicked: "bg-talki-green-400 hover:bg-talki-green-600",
  clicked:
    "bg-talki-green-100 hover:bg-talki-green-200 text-talki-green-800 font-bold border-2 border-talki-green-500",
} as const;

function RoomPageInviteFriendsModalUrlCopy({ roomUrl }: Props) {
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  const handleClick = async () => {
    setIsBtnClicked(true);
    await copyTextToClipBoard(roomUrl);
    setTimeout(() => setIsBtnClicked(false), 2000);
  };
  return (
    <div class="flex flex-col items-stretch sm:flex-row mb-4">
      <div class="bg-gray-50 border-2 border-gray-300 p-2 text-sm after:content-[attr(data-url)] break-all flex items-center">
        {roomUrl}
      </div>
      <button
        class={`${
          btnColor[isBtnClicked ? "clicked" : "unclicked"]
        } flex items-center justify-center`}
        onClick={handleClick}
      >
        <img src={myImg} class="h-10 w-10" />
        <span class="pr-4">{isBtnClicked ? "Copied!" : "Copy Link"}</span>
      </button>
    </div>
  );
}

async function copyTextToClipBoard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default RoomPageInviteFriendsModalUrlCopy;
