function getConnectionIceEventHandler() {
  return () => {
    console.log("Handle Ice candidate event");
  };
}

export default getConnectionIceEventHandler;
