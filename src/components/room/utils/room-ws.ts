import makeAskEntryPermissionActionHandler from "./classes/MessageActionHandler/askEntryPermission";
import promptIceCandidateActionHandler from "./classes/MessageActionHandler/promptIceCandidate";
import makePromptSdpActionHandler from "./classes/MessageActionHandler/promptSdp";
import sendIceCandidateActionHandler from "./classes/MessageActionHandler/sendIceCandidate";
import makeSendSdpActionHandler from "./classes/MessageActionHandler/sendSdp";
import RoomWs from "./classes/RoomWs";

type RemoteStreamsManager = Parameters<
  typeof makePromptSdpActionHandler
>[0]["remoteStreamsManager"];

type LocalStream = Parameters<
  typeof makePromptSdpActionHandler
>[0]["localStream"];

type OpenEntryPermissionModal = Parameters<
  typeof makeAskEntryPermissionActionHandler
>[0];

type FnParams = {
  newRoomData: ConstructorParameters<typeof RoomWs>[0];
  remoteStreamsManager: RemoteStreamsManager;
  localStream: LocalStream;
  openEntryPermissionModal: OpenEntryPermissionModal;
};

function setupRoomWs({
  newRoomData,
  remoteStreamsManager,
  localStream,
  openEntryPermissionModal,
}: FnParams) {
  const roomWs = new RoomWs(newRoomData);
  roomWs
    .addMessageActionHandler(
      makeAskEntryPermissionActionHandler(openEntryPermissionModal)
    )
    .addMessageActionHandler(
      makePromptSdpActionHandler({ remoteStreamsManager, localStream })
    )
    .addMessageActionHandler(
      makeSendSdpActionHandler({ remoteStreamsManager, localStream })
    )
    .addMessageActionHandler(sendIceCandidateActionHandler)
    .addMessageActionHandler(promptIceCandidateActionHandler);
  roomWs.connect();
}

export default setupRoomWs;
