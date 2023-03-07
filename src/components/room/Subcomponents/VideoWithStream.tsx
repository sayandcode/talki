type Props = {
  stream: MediaStream | undefined;
  class?: HTMLVideoElement["className"];
};

function VideoWithStream({ stream, class: className }: Props) {
  return (
    <video
      autoPlay
      // @ts-ignore
      srcObject={stream}
      className={className}
    ></video>
  );
}

export default VideoWithStream;
