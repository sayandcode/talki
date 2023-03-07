type Props = {
  isVerified: boolean | undefined;
};
function EntryPermissionModalVerifiedStatus({ isVerified = false }: Props) {
  return (
    <div class="font-mono font-bold text-sm text-right">
      {isVerified ? (
        <div class="text-green-500">Verified User ✓</div>
      ) : (
        <div class="text-red-500">Not Verified User ✗</div>
      )}
    </div>
  );
}

export default EntryPermissionModalVerifiedStatus;
