/* eslint-disable no-underscore-dangle */
import type { RoomMemberId } from "utils/types/Room";
import streamContainerManager from "../../pageManip/streamContainer";

class RoomPeerConnection {
  private _pc: RTCPeerConnection;

  constructor(newMemberId: RoomMemberId) {
    this._pc = new RTCPeerConnection();
    this.setupConnectionTracks();
    this.setupPeerConnectionEventListeners({ newMemberId });
  }

  private setupConnectionTracks() {
    const { localStream } = streamContainerManager;
    if (!localStream)
      throw new Error(
        "Need a local stream to be created before creating offers"
      );
    localStream
      .getTracks()
      .forEach((track) => this._pc.addTrack(track, localStream));
  }

  private setupPeerConnectionEventListeners({
    newMemberId,
  }: {
    newMemberId: RoomMemberId;
  }) {
    this._pc.addEventListener(
      "track",
      RoomPeerConnection.getTrackEventHandler(newMemberId)
    );
    this._pc.addEventListener(
      "icecandidate",
      RoomPeerConnection.getIceEventHandler()
    );
  }

  private static getTrackEventHandler(newMemberId: RoomMemberId) {
    return (e: RTCTrackEvent) => {
      const [remoteStream] = e.streams;
      if (!remoteStream) throw new Error("No stream available in track event");
      streamContainerManager.addRemoteStream(remoteStream, newMemberId);
    };
  }

  private static getIceEventHandler() {
    return () => {
      console.log("Handle Ice candidate event");
    };
  }

  async createOffer(): Promise<RTCSessionDescription> {
    const offerSdp = await this._pc.createOffer();
    await this._pc.setLocalDescription(offerSdp);
    // with current web standards, the createOffer returns an RTCSessionDescription, that's why there's a ts-ignore
    // @ts-ignore
    return offerSdp;
  }

  async createAnswer(offerSdpObj: RTCSessionDescriptionInit) {
    await this.setRemoteDescription(offerSdpObj);
    const answerSdp = await this._pc.createAnswer();
    return answerSdp;
  }

  async setRemoteDescription(offerSdpObj: RTCSessionDescriptionInit) {
    if (this._pc.remoteDescription)
      throw new Error(
        "Remote description already set for this peer connection"
      );
    await this._pc.setRemoteDescription(offerSdpObj);
  }
}

export default RoomPeerConnection;
