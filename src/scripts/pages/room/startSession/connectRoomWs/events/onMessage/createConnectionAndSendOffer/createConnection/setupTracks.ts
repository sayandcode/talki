import streamContainerManager from "scripts/pages/room/pageManip/streamContainer";

function setupConnectionTracks(pc: RTCPeerConnection) {
  const { localStream } = streamContainerManager;
  if (!localStream)
    throw new Error("Need a local stream to be created before creating offers");
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
}

export default setupConnectionTracks;
