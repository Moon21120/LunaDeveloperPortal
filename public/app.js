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

const testApiButton =
  document.getElementById("testApiButton");

const testLoading =
  document.getElementById("testLoading");

const testResult =
  document.getElementById("testResult");

const testStatus =
  document.getElementById("testStatus");

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

      const keys =
        getSavedKeys();

      keys.push(newKey);

      saveKeys(keys);

      apiKeyElement.textContent =
        newKey;

      keyArea.classList.remove(
        "hidden"
      );

      createKeyButton.textContent =
        "Create Another Key";

      // Clear old test result when
      // a new key is created.
      if (testResult) {
        testResult.classList.add("hidden");
      }

      if (testStatus) {
        testStatus.textContent =
          "Your new key is ready to test.";
      }

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
// TEST LUNA API
// ============================================================

if (testApiButton) {

  testApiButton.addEventListener(
    "click",
    async () => {

      const keys =
        getSavedKeys();

      if (keys.length === 0) {

        testStatus.textContent =
          "Create a Luna API key first.";

        testStatus.classList.remove(
          "hidden"
        );

        return;
      }

      const apiKey =
        keys[keys.length - 1];

      testApiButton.disabled =
        true;

      testLoading.classList.remove(
        "hidden"
      );

      testResult.classList.add(
        "hidden"
      );

      testStatus.classList.add(
        "hidden"
      );

      try {

        const response =
          await fetch("/v1/chat", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${apiKey}`
            },

            body: JSON.stringify({
              message:
                "Hello Luna! Are you working?"
            })
          });

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.error ||
            `API request failed with status ${response.status}.`
          );
        }

        testResult.textContent =
          data.response ||
          JSON.stringify(
            data,
            null,
            2
          );

        testResult.classList.remove(
          "hidden"
        );

        testStatus.textContent =
          "✓ Luna API is working.";

        testStatus.classList.remove(
          "hidden"
        );

      } catch (error) {

        testStatus.textContent =
          `✕ Luna API test failed: ${error.message}`;

        testStatus.classList.remove(
          "hidden"
        );

      } finally {

        testApiButton.disabled =
          false;

        testLoading.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// LOAD KEY WHEN PORTAL OPENS
// ============================================================

displayLatestKey();
