import { alertError, alertSuccess } from './alerts';


const endpoint = "http://localhost:3000/products";

// To get HTML elements
const form = document.getElementById("form");
const message = document.getElementById("message");
const btnForm = document.getElementById("btnForm");
const btnInventary = document.getElementById("showInventory");
const sectionForm = document.getElementById("formSection");
const sectionInventory = document.getElementById("inventorySection");
const bodyTable = document.getElementById("bodyTable");

// To change internal windows 
btnForm.addEventListener("click", () => {
    btnForm.classList.add("active");
    btnInventary.classList.remove("active");
    sectionForm.classList.add("active-tab");
    sectionInventory.classList.remove("active-tab");
});

btnInventary.addEventListener("click", () => {
    btnForm.classList.remove("active");
    btnInventary.classList.add("active");
    sectionForm.classList.remove("active-tab");
    sectionInventory.classList.add("active-tab");
    getInventary(); // Call function and show inventory table
});

// Hidden button to click to update a product
const updateBtn = document.getElementById("updateBtn");
const submitBtn = form.querySelector("button[type='submit']");
updateBtn.style.display = "none";


// Send form and save product in the inventory table
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    ;

    const id = document.getElementById("productID").value.trim();
    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const category = document.getElementById("category").value.trim();

    try {
        // Validate if Name/Category are letters
        const response = await fetch(endpoint);
        const products = await response.json();

        if (!/^[a-zA-Z\s]+$/.test(name) || !/^[a-zA-Z\s]+$/.test(category)) {
            throw new Error("El nombre y la categoría deben contener solo letras.");
        }
        //Validate if ID/Price are numbers
        if (isNaN(id) || isNaN(price) || id <= 0 || price <= 0) {
            throw new Error("ID y precio deben ser números válidos y mayores a 0.");
        }

        // Validate if ID and Name already exist in the inventory table taking into account case-insensitive
        const idVerification = await fetch(`${endpoint}?id=${id}`);
        const nameVerification = await fetch(`${endpoint}?name=${name}`);

        const existID = await idVerification.json();
        const existName = await nameVerification.json();

        if (existID.length > 0 || existName.length > 0 || products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            throw new Error("Ya existe un producto con ese ID/Nombre.");
        }

        // Create new product inside the inventory
        const newProduct = { id, name, price, category };

        const postVerification = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        });

        if (!postVerification.ok) throw new Error("Error al guardar producto, intente nuevamente.");

        alertSuccess(`Producto "${name}" guardado exitosamente.`);
        form.reset();

    } catch (err) {
        alertError(`Error: ${err.message}`);
    }
});

//Show inventory
async function getInventary() {
    bodyTable.innerHTML = "";

    try {
        const response = await fetch(endpoint);
        const products = await response.json();

        if (products.length === 0) {
            bodyTable.innerHTML = `<tr><td colspan="5">Inventario vacío.</td></tr>`;
            return;
        }
        //Add to the table products with the information and buttons for edit and delete
        products.forEach((product) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>$${product.price.toLocaleString("es-CO")}</td>
        <td>${product.category}</td>
        <td>
          <button type="click" class="btn-update" data-id="${product.id}">Update</button>
          <button type="click" class="btn-delete" data-id="${product.id}">Delete</button>
        </td>
      `;
            bodyTable.appendChild(row);
        });
        //To delete the product
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                //console.log(id)
                if (confirm("¿Estás seguro de eliminar este producto?")) {
                    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
                    getInventary();
                }
            });
        });
        // To update the product
        document.querySelectorAll(".btn-update").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                const response = await fetch(`${endpoint}/${id}`);
                const product = await response.json();

                document.getElementById("productID").value = product.id;
                document.getElementById("productName").value = product.name;
                document.getElementById("productPrice").value = product.price;
                document.getElementById("category").value = product.category;
                document.getElementById("productID").disabled = true;

                const submitBtn = form.querySelector("button[type='submit']");
                //To make hidden button appears and add product button get hide
                submitBtn.style.display = "none";
                updateBtn.style.display = "inline-block";

                //To redirect user to internal to modify content
                btnForm.classList.add("active");
                btnInventary.classList.remove("active");
                sectionForm.classList.add("active-tab");
                sectionInventory.classList.remove("active-tab");

                updateBtn.onclick = async () => {
                    const updated = {
                        id: product.id,
                        name: document.getElementById("productName").value.trim(),
                        price: parseFloat(document.getElementById("productPrice").value),
                        category: document.getElementById("category").value.trim()
                    };
                    if (confirm("¿Estás seguro de guardar los cambios?")) {
                        const updateResponse = await fetch(`${endpoint}/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updated)
                        });

                        if (updateResponse.ok) {
                            alertSuccess("Producto actualizado.");
                            form.reset();
                            document.getElementById("productID").disabled = false;
                            submitBtn.style.display = "inline-block";
                            updateBtn.style.display = "none";
                            getInventary();
                        } else {
                            alertError("Error al actualizar el producto, intentelo mas tarde.");
                        }
                    }
                };
            });
        });

    } catch (error) {
        bodyTable.innerHTML = `<tr><td colspan="5">Error al cargar el inventario.</td></tr>`;
        console.error("Error al cargar inventario:", error);
    }
}
