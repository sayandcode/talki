function RoomPageLeaveRoomBtn() {
  return (
    <div class="fixed sm:static z-[1] bottom-2 sm:bottom-[unset] right-[50%] sm:right-[unset] translate-x-1/2 sm:translate-x-0">
      <a
        href="/talki/"
        class="block font-semibold font-mono opacity-60 sm:opacity-100 hover:opacity-100 bg-red-500 hover:bg-white focus-within:bg-white text-white hover:text-red-500 focus-within:text-red-500 hover:outline focus-within:outline focus-within:outline-red-500 hover:outline-red-500 py-1 px-2"
      >
        Leave room
      </a>
    </div>
  );
}

export default RoomPageLeaveRoomBtn;
