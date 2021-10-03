const foodNameToURL = (foodName) => {
  switch (foodName) {
    case "Onigiri":
      return browser.extension.getURL("images/onigiri.png");
    case "Ebifry":
      return browser.extension.getURL("images/ebifry.png");
  }
};

const listenForClicks = () => {
  document.addEventListener("click", (e) => {
    const rolling = (tabs) => {
      browser.tabs
        .insertCSS({ file: "/content_scripts/rolling_food.css" })
        .then(() => {
          let url = foodNameToURL(e.target.textContent);
          browser.tabs.sendMessage(tabs[0].id, {
            command: "rolling",
            foodURL: url,
          });
        });
    };

    const reset = (tabs) => {
      browser.tabs
        .removeCSS({ file: "/content_scripts/rolling_food.css" })
        .then(() => {
          browser.tabs.sendMessage(tabs[0].id, {
            command: "reset",
          });
        });
    };

    const reportError = (error) => {
      console.error(`Could not rolling food: ${error}`);
    };

    if (e.target.classList.contains("food")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(rolling)
        .catch(reportError);
    } else if (e.target.classList.contains("reset")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(reset)
        .catch(reportError);
    }
  });
};

const reportExecuteScriptError = (error) => {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute rolling content script: ${error.message}`);
};

browser.tabs
  .executeScript({ file: "/content_scripts/rolling_food.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
