import { useEffect, useState } from "preact/hooks";
import VideoWithStream from "./VideoWithStream";

function RoomPageSelfVideo({ stream }: { stream: MediaStream | undefined }) {
  return (
    <div class="fixed sm:static bottom-2 sm:bottom-[unset] right-2 sm:right-[unset] sm:top-2 sm:left-[unset] h-16 sm:h-24 w-16 sm:w-32 hover:scale-[200%] origin-bottom-right sm:origin-top-left transition-transform duration-[400ms] ease-in-out">
      <VideoWithStream
        stream={stream}
        class="w-full h-full object-cover"
      ></VideoWithStream>
    </div>
  );
}

function useLocalStreamManager() {
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    void (async () => {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
    })();
  }, []);

  return { stream };
}

export default RoomPageSelfVideo;
export { useLocalStreamManager };
