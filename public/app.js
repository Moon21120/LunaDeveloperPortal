const createKeyButton =
  document.getElementById("createKeyButton");

const copyButton =
  document.getElementById("copyButton");

const loading =
  document.getElementById("loading");

const keyArea =
  document.getElementById("keyArea");

const apiKeyElement =
  document.getElementById("apiKey");

const STORAGE_KEY = "luna_api_keys";


// ============================================================
// LOAD SAVED KEYS
// ============================================================

function getSavedKeys() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const keys = JSON.parse(saved);

    return Array.isArray(keys)
      ? keys
      : [];

  } catch {
    return [];
  }
}


// ============================================================
// SAVE KEYS
// ============================================================

function saveKeys(keys) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(keys)
  );
}


// ============================================================
// DISPLAY MOST RECENT KEY
// ============================================================

function displayLatestKey() {
  const keys = getSavedKeys();

  if (keys.length === 0) {
    return;
  }

  const latestKey =
    keys[keys.length - 1];

  apiKeyElement.textContent =
    latestKey;

  keyArea.classList.remove(
    "hidden"
  );

  createKeyButton.textContent =
    "Create Another Key";
}


// ============================================================
// CREATE API KEY
// ============================================================

createKeyButton.addEventListener(
  "click",
  async () => {

    createKeyButton.disabled = true;

    loading.classList.remove(
      "hidden"
    );

    try {

      const response =
        await fetch("/v1/keys", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: "{}"
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Could not create API key."
        );
      }

      const newKey =
        data.apiKey;

      // Save the key permanently
      // in this browser's local storage.
      const keys =
        getSavedKeys();

      keys.push(newKey);

      saveKeys(keys);

      // Display it
      apiKeyElement.textContent =
        newKey;

      keyArea.classList.remove(
        "hidden"
      );

      createKeyButton.textContent =
        "Create Another Key";

    } catch (error) {

      alert(
        error.message ||
        "Something went wrong."
      );

    } finally {

      createKeyButton.disabled =
        false;

      loading.classList.add(
        "hidden"
      );

    }

  }
);


// ============================================================
// COPY API KEY
// ============================================================

copyButton.addEventListener(
  "click",
  async () => {

    const key =
      apiKeyElement.textContent;

    if (!key) return;

    try {

      await navigator.clipboard.writeText(
        key
      );

      copyButton.textContent =
        "Copied!";

      setTimeout(() => {

        copyButton.textContent =
          "Copy";

      }, 1500);

    } catch {

      alert(
        "Could not copy the key automatically."
      );

    }

  }
);


// ============================================================
// LOAD KEY WHEN PORTAL OPENS
// ============================================================

displayLatestKey();
