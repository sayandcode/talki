/* eslint-disable no-underscore-dangle */
import getElById from "utils/functions/getElById";

class LocalStreamManager {
  static readonly VID_EL_ID = "local-stream-vid-el";

  private static get localStreamVideoEl() {
    return getElById<HTMLVideoElement>(this.VID_EL_ID);
  }

  private static _stream: MediaStream | undefined;

  static set stream(stream: MediaStream | undefined) {
    this._stream = stream;
    if (!stream) return;

    this.localStreamVideoEl.srcObject = stream;
  }

  static get stream() {
    return this._stream;
  }
}

export default LocalStreamManager;
