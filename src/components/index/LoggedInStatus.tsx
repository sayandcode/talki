import { useEffect, useState } from "preact/hooks";
import authLogoutEndpoint from "utils/endpoints/auth/logout";
import backendFetch from "utils/functions/backendFetch";
import { fetchIsLoggedIn } from "utils/functions/redirects";

function LoggedInStatus() {
  const [username, setUsername] = useState("");
  const [isStatusUnknown, setIsStatusUnknown] = useState(false);

  if (isStatusUnknown)
    return (
      <div class="fixed top-4 right-4 font-mono flex w-8 h-8">
        <img
          src="/talki/loadingSpinner.gif"
          aria-label="Loading login status"
        />
      </div>
    );

  useEffect(() => {
    void (async () => {
      setIsStatusUnknown(true);
      const loginResult = await fetchIsLoggedIn();
      if (loginResult.isLoggedIn) setUsername(loginResult.userData.username);
      setIsStatusUnknown(false);
    })();
  }, []);

  async function logout() {
    setIsStatusUnknown(true);
    const { url, method } = authLogoutEndpoint;
    await backendFetch(url, { method });
    setUsername("");
    setIsStatusUnknown(false);
  }

  return (
    <div class="fixed top-4 right-4 font-mono">
      {username ? (
        <div class="flex flex-row gap-2 items-center">
          <div class="text-right">
            Hi <span class="font-extrabold">{username}</span>
          </div>
          <button
            onClick={logout}
            class="bg-talki-black hover:bg-gray-300 focus-visible:bg-gray-300 hover:outline hover:outline-2 hover:outline-gray-500 px-3 py-2 text-white font-mono font-bold hover:text-black"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="/talki/login"
          class="block bg-talki-black hover:bg-gray-300 focus-visible:bg-gray-300 hover:outline hover:outline-2 hover:outline-gray-500 px-3 py-2 text-white font-mono font-bold hover:text-black"
        >
          Login
        </a>
      )}
    </div>
  );
}

export default LoggedInStatus;
