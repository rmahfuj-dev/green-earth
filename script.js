const categories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/categories"
    );
    const data = await res.json();

    const categoryList = document.getElementsByClassName("category-list")[0];
    categoryList.innerHTML = "";
    const allTree = document.createElement("li");
    allTree.className =
      "px-[10px] py-2 hover:bg-green-700 duration-500 rounded-lg";
    allTree.textContent = "All Trees";
    categoryList.append(allTree);
    data.categories.forEach((cat) => {
      const li = document.createElement("li");
      li.className =
        "category-btn px-[10px] py-2 hover:bg-green-700 hover:duration-500 rounded-lg";
      li.setAttribute("id", cat.id);
      li.textContent = `${cat.category_name}`;
      li.addEventListener("click", () => {
        const allCategoryBtns = document.querySelectorAll(".category-btn");
        allCategoryBtns.forEach((btn) =>
          btn.classList.remove("bg-green-700", "text-white")
        );
        li.classList.add("bg-green-700");
        li.classList.add("text-white");
        allPlants(cat.id);
      });
      categoryList.appendChild(li);
    });
    allPlants();
  } catch (err) {
    console.log("Can't fetch Data:", err);
  }
};

categories();

const allPlants = async (categoryId) => {
  const url = categoryId
    ? `https://openapi.programming-hero.com/api/category/${categoryId}`
    : `https://openapi.programming-hero.com/api/plants`;
  const res = await fetch(url);
  const data = await res.json();
  const cardWrapper = document.getElementsByClassName("plants-wrapper")[0];
  cardWrapper.innerHTML = "";
  data.plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className =
      "bg-white w-full max-w-[345px] shadow-sm rounded-2xl h-auto flex flex-col";
    card.innerHTML = `<figure class="flex-shrink-0 h-[186px] w-full">
    <img class="w-full h-full object-cover object-center rounded-t-2xl" 
         src="${plant.image}"
         alt="${plant.name}" />
  </figure>

 
  <div class="flex flex-col flex-grow p-4 justify-between">
    <!-- Title -->
    <h2 class="text-lg font-semibold text-gray-800">${plant.name}</h2>

    <p class="text-[12px] text-gray-500 mt-1 overflow-hidden">
      ${plant.description}
    </p>

   
    <div class="flex justify-between items-center mt-3">
      <div class="bg-green-100 text-green-700 px-3 py-1 rounded-2xl text-sm font-medium">
      ${plant.category}
      </div>
      <div class="text-[14px] font-bold">$${plant.price}</div>
    </div>

    <button class="bg-green-700 text-white w-full rounded-3xl px-5 py-3 mt-3 hover:bg-green-800 transition duration-300">
      Add To Cart
    </button>
  </div>`;
    cardWrapper.appendChild(card);
  });
};
allPlants();
