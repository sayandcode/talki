const STREAM_CONTAINERS_CONTAINER_ID = "stream-containers-container";

function addStreamContainer(stream: MediaStream) {
  const el = document.createElement("video");
  el.height = 100;
  el.width = 100;
  el.autoplay = true;
  el.srcObject = stream;

  const streamContainersContainer = document.getElementById(
    STREAM_CONTAINERS_CONTAINER_ID
  );
  if (!streamContainersContainer)
    throw new Error("Stream containers container not found on page");
  streamContainersContainer.appendChild(el);
}

export default addStreamContainer;
export { STREAM_CONTAINERS_CONTAINER_ID };
