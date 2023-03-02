import LocalStreamManager from "../../pageManip/LocalStreamManager";

type StringifiedIceCandidate = string;

class RoomPeerConnection {
  protected pc: RTCPeerConnection;

  static deserializeIceCandidate(
    stringifiedIceCandidate: StringifiedIceCandidate
  ) {
    const iceObj = JSON.parse(stringifiedIceCandidate);
    return new RTCIceCandidate(iceObj);
  }

  static serializeIceCandidate(
    iceCandidate: RTCIceCandidate
  ): StringifiedIceCandidate {
    return JSON.stringify(iceCandidate);
  }

  private static rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  constructor() {
    this.pc = new RTCPeerConnection(RoomPeerConnection.rtcConfig);
    this.setupConnectionTracks();
  }

  private setupConnectionTracks() {
    const localStream = LocalStreamManager.stream;
    if (!localStream)
      throw new Error(
        "Need a local stream to be created before creating offers"
      );
    localStream
      .getTracks()
      .forEach((track) => this.pc.addTrack(track, localStream));
  }

  async createOffer(): Promise<RTCSessionDescription> {
    const offerSdp = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerSdp);
    // with current web standards, the createOffer returns an RTCSessionDescription, that's why there's a hard type-cast
    return offerSdp as unknown as RTCSessionDescription;
  }

  async createAnswer(offerSdpObj: RTCSessionDescriptionInit) {
    await this.setRemoteDescription(offerSdpObj);
    const answerSdp = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answerSdp);
    return answerSdp;
  }

  async setRemoteDescription(offerSdpObj: RTCSessionDescriptionInit) {
    if (this.pc.remoteDescription)
      throw new Error(
        "Remote description already set for this peer connection"
      );
    await this.pc.setRemoteDescription(offerSdpObj);
  }

  async setIceCandidate(stringifiedIceCandidate: StringifiedIceCandidate) {
    const iceCandidate = RoomPeerConnection.deserializeIceCandidate(
      stringifiedIceCandidate
    );
    await this.pc.addIceCandidate(iceCandidate);
  }
}

export default RoomPeerConnection;
export type { StringifiedIceCandidate };
