import { useMemo, useState } from "preact/hooks";
import type { RoomMemberId } from "utils/types/Room";

type StreamsList = Record<
  RoomMemberId,
  { memberId: RoomMemberId; mediaStream: MediaStream }
>;

function useRemoteStreamsManager() {
  const [streamsMap, setStreamsMap] = useState<StreamsList>({});

  function addStream(mediaStream: MediaStream, memberId: RoomMemberId) {
    if (memberId in streamsMap)
      throw new Error("Given Member was already added");
    setStreamsMap((oldMap) => ({
      ...oldMap,
      [memberId]: { memberId, mediaStream },
    }));
  }

  function removeStream(memberId: RoomMemberId) {
    setStreamsMap((oldMap) => {
      if (!(memberId in oldMap))
        throw new Error("The given member doesn't exist");
      // eslint-disable-next-line no-param-reassign
      delete oldMap[memberId];
      return { ...oldMap };
    });
  }

  const streamsArr = useMemo(() => Object.values(streamsMap), [streamsMap]);
  return { streamsArr, addStream, removeStream };
}

export default useRemoteStreamsManager;
