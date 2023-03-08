type Props = {
  stream: MediaStream | undefined;
  class?: HTMLVideoElement["className"];
  muted?: boolean;
};

function VideoWithStream({ stream, class: className, muted = false }: Props) {
  return (
    <video
      autoPlay
      // @ts-ignore
      srcObject={stream}
      className={className}
      muted={muted}
    ></video>
  );
}

export default VideoWithStream;
