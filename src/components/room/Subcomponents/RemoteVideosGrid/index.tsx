import type { RoomMemberId } from "utils/types/Room";
import VideoWithStream from "../VideoWithStream";

type StreamsArr = { memberId: RoomMemberId; mediaStream: MediaStream }[];

function RoomPageRemoteVideosGrid({ streamsArr }: { streamsArr: StreamsArr }) {
  const streamCount = streamsArr.length;
  const { rows, columns } = getRowsAndColumns(streamCount);

  return (
    <div class="w-full h-full bg-black">
      <div
        class="w-full h-full grid grid-rows-[repeat(var(--grid-cols),1fr)] sm:grid-rows-[repeat(var(--grid-rows),1fr)] grid-cols-[repeat(var(--grid-rows),1fr)] sm:grid-cols-[repeat(var(--grid-cols),1fr)]"
        style={{ "--grid-rows": rows, "--grid-cols": columns }}
      >
        {streamsArr.map(({ mediaStream, memberId }) => (
          <div class="w-full h-full relative">
            <VideoWithStream
              key={memberId}
              stream={mediaStream}
              class="absolute w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * @param totalCount The total number of blocks to be split up into rows and columns
 */
function getRowsAndColumns(totalCount: number) {
  const countRoot = Math.sqrt(totalCount);
  const columns = Math.round(countRoot) + (isRoundedBelow(countRoot) ? 1 : 0);
  const rows = Math.round(countRoot);
  return { rows, columns };

  function isRoundedBelow(num: number) {
    return Math.round(num) < num;
  }
}

export default RoomPageRemoteVideosGrid;
