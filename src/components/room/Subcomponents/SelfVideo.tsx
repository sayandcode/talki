import LocalStreamManager from "scripts/pages/room/pageManip/LocalStreamManager";

function RoomPageSelfVideo() {
  return (
    <div class="fixed sm:static bottom-2 sm:bottom-[unset] right-2 sm:right-[unset] sm:top-2 sm:left-[unset] h-16 sm:h-24 w-16 sm:w-32 hover:scale-[200%] origin-bottom-right sm:origin-top-left transition-transform duration-[400ms] ease-in-out">
      <video
        autoPlay
        id={LocalStreamManager.VID_EL_ID}
        class="w-full h-full object-cover"
      ></video>
    </div>
  );
}

export default RoomPageSelfVideo;
