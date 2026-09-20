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


createKeyButton.addEventListener(
  "click",
  async () => {

    createKeyButton.disabled = true;

    loading.classList.remove("hidden");

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

      apiKeyElement.textContent =
        data.apiKey;

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
