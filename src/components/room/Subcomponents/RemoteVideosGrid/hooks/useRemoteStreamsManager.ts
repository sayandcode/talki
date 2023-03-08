import { useMemo, useState } from "preact/hooks";
import type { RoomMemberId, RoomUserData } from "utils/types/Room";

type StreamsList = Record<
  RoomMemberId,
  {
    memberId: RoomMemberId;
    mediaStream: MediaStream;
    memberData?: RoomUserData;
  }
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

  function addMemberData(memberId: RoomMemberId, memberData: RoomUserData) {
    setStreamsMap((oldMap) => {
      const requiredStream = oldMap[memberId];
      if (!requiredStream) throw new Error("The given member doesn't exist");

      return { ...oldMap, [memberId]: { ...requiredStream, memberData } };
    });
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
  return { streamsArr, addStream, addMemberData, removeStream };
}

export default useRemoteStreamsManager;
