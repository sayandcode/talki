/* eslint-disable no-underscore-dangle */
import type { RoomMemberId } from "utils/types/Room";
import streamContainerManager from "../../pageManip/streamContainer";

type StringifiedIceCandidate = string;

class RoomPeerConnection {
  private _pc: RTCPeerConnection;

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

  constructor(newMemberId: RoomMemberId) {
    this._pc = new RTCPeerConnection();
    this.setupConnectionTracks();
    this.setupTrackListener(newMemberId);
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

  private setupTrackListener(newMemberId: RoomMemberId) {
    this._pc.addEventListener(
      "track",
      RoomPeerConnection.getTrackEventHandler(newMemberId)
    );
  }

  setupIceListener(handler: (e: RTCPeerConnectionIceEvent) => void) {
    this._pc.addEventListener("icecandidate", handler);
  }

  private static getTrackEventHandler(newMemberId: RoomMemberId) {
    return (e: RTCTrackEvent) => {
      const [remoteStream] = e.streams;
      if (!remoteStream) throw new Error("No stream available in track event");
      streamContainerManager.addRemoteStream(remoteStream, newMemberId);
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

  async setIceCandidate(stringifiedIceCandidate: StringifiedIceCandidate) {
    const iceCandidate = RoomPeerConnection.deserializeIceCandidate(
      stringifiedIceCandidate
    );
    await this._pc.addIceCandidate(iceCandidate);
  }
}

export default RoomPeerConnection;
export type { StringifiedIceCandidate };
