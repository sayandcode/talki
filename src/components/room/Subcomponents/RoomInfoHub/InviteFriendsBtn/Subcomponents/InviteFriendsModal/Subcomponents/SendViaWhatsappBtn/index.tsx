import whatsappImg from "./WhatsAppButtonGreenMedium.png";

function SendViaWhatsappBtn({ roomUrl }: { roomUrl: string }) {
  const inviteMsg = encodeURI(
    `Join me on call for *free* using the Talki website\n\n${roomUrl}`
  );
  return (
    <div>
      <a
        href={`https://api.whatsapp.com/send?text=${inviteMsg}`}
        class="flex sm:hidden h-10 justify-center mb-4"
        target="_blank"
      >
        <img src={whatsappImg} />
      </a>
      <a
        href={`https://web.whatsapp.com/send?text=${inviteMsg}`}
        class="hidden sm:flex  h-10 justify-center mb-4"
        target="_blank"
      >
        <img src={whatsappImg} />
      </a>
    </div>
  );
}
export default SendViaWhatsappBtn;
