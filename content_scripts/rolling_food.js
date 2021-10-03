(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "rolling") {
      insertFood(message.foodURL);
    } else if (message.command === "reset") {
      removeExistingFoods();
    }
  });

  // ここから下を外出ししたい
  const insertFood = (foodURL) => {
    removeExistingFoods();
    let foodImage = document.createElement("img");
    foodImage.setAttribute("src", foodURL);
    foodImage.className = "food-image-bottom-right";
    document.body.appendChild(foodImage);
  };

  const removeExistingFoods = () => {
    let existingFoods = document.querySelectorAll(".food-image-bottom-right");
    for (let food of existingFoods) {
      food.remove();
    }
  };
})();
