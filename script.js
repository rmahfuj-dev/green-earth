let cart = [];

const categories = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    const categoryList = document.querySelector(".category-list");
    categoryList.innerHTML = "";

    const allTree = document.createElement("li");
    allTree.className = "category-btn px-[10px] py-2 hover:bg-green-700 duration-500 rounded-lg";
    allTree.textContent = "All Trees";
    categoryList.appendChild(allTree);
    allTree.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("bg-green-700", "text-white"));
      allTree.classList.add("bg-green-700", "text-white");
      allPlants();
    });

    data.categories.forEach(cat => {
      const li = document.createElement("li");
      li.className = "category-btn px-[10px] py-2 hover:bg-green-700 hover:duration-500 rounded-lg";
      li.setAttribute("id", cat.id);
      li.textContent = cat.category_name;
      li.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("bg-green-700", "text-white"));
        li.classList.add("bg-green-700", "text-white");
        allPlants(cat.id);
      });
      categoryList.appendChild(li);
    });

    allPlants();
  } catch (err) {
    console.log("Can't fetch categories:", err);
  }
};

const allPlants = async (categoryId) => {
  try {
    const url = categoryId
      ? `https://openapi.programming-hero.com/api/category/${categoryId}`
      : `https://openapi.programming-hero.com/api/plants`;

    const res = await fetch(url);
    const data = await res.json();
    const cardWrapper = document.querySelector(".plants-wrapper");
    cardWrapper.innerHTML = "";

    data.plants.forEach(plant => {
      const card = document.createElement("div");
      card.className = "bg-white w-full max-w-[345px] shadow-sm rounded-2xl h-auto flex flex-col";
      card.innerHTML = `
        <figure class="flex-shrink-0 h-[186px] w-full">
          <img class="w-full h-full object-cover object-center rounded-t-2xl" src="${plant.image}" alt="${plant.name}" />
        </figure>
        <div class="flex flex-col flex-grow p-4 justify-between">
          <h2 class="text-lg font-semibold text-gray-800 plant-name" style="cursor:pointer" data-id="${plant.id}">${plant.name}</h2>
          <p class="text-[12px] text-gray-500 mt-1 overflow-hidden">${plant.description}</p>
          <div class="flex justify-between items-center mt-3">
            <div class="bg-green-100 text-green-700 px-3 py-1 rounded-2xl text-sm font-medium">${plant.category}</div>
            <div class="text-[14px] font-bold">৳${plant.price}</div>
          </div>
          <button class="bg-green-700 text-white w-full rounded-3xl px-5 py-3 mt-3 hover:bg-green-800 transition duration-300 add-to-cart" data-plant-name="${plant.name}" data-plant-price="${plant.price}">Add To Cart</button>
        </div>
      `;
      cardWrapper.appendChild(card);
    });

    setupPlantModal();
  } catch (err) {
    console.log("Can't fetch plants:", err);
  }
};

const setupPlantModal = () => {
  document.querySelectorAll(".plant-name").forEach(name => {
    name.addEventListener("click", async () => {
      const id = name.dataset.id;
      const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
      const data = await res.json();
      const plant = data.plants;
      const modal = document.getElementById("my_modal_1");
      modal.querySelector(".modal-box").innerHTML = `
        <h2 class="text-lg font-semibold text-gray-800 mb-2">${plant.name}</h2>
        <figure class="flex-shrink-0 h-[186px] w-full mb-2">
          <img class="w-full h-full object-cover object-center rounded-2xl" src="${plant.image}" alt="${plant.name}" />
        </figure>
        <p class="mb-1"><strong>Category:</strong> ${plant.category}</p>
        <p class="mb-1"><strong>Price:</strong> ৳${plant.price}</p>
        <p class="mb-2"><strong>Description:</strong> ${plant.description}</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>`;
      modal.showModal();
    });
  });
};

const setupCart = () => {
  const cardWrapper = document.querySelector(".plants-wrapper");
  cardWrapper.addEventListener("click", e => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    const name = btn.dataset.plantName;
    const price = parseFloat(btn.dataset.plantPrice);

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    renderCart();
  });
};

const renderCart = () => {
  const cartWrapper = document.querySelector(".wishlists");
  cartWrapper.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center px-3 py-2 bg-green-50 rounded-xl w-full mb-2";
    li.innerHTML = `
      <div class="product-name flex flex-col gap-1">
        <p class="font-semibold text-[14px]">${item.name}</p>
        <p>৳<span>${item.price}</span>x<span>${item.quantity}</span></p>
      </div>
      <div class="remove cursor-pointer">x</div>
    `;
    cartWrapper.appendChild(li);

    li.querySelector(".remove").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter(ci => ci.name !== item.name);
      }
      renderCart();
    });
  });

  updateTotal();
};

const updateTotal = () => {
  const totalElem = document.querySelector(".amount span");
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalElem.innerText = total.toFixed(2);
};

categories();
setupCart();