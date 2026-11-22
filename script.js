// ==========================================
// SUPABASE CONFIG
// ==========================================

const SUPABASE_URL = "https://ymvvzdsybqgstopfvprn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_drbwvaO_9rEa2txTWKJ_mw_VufIwVFk";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// ELEMENTS
// ==========================================

const modal =
    document.getElementById("sellModal");

const productGrid =
    document.getElementById("productGrid");

const toast =
    document.getElementById("toast");


// ==========================================
// OPEN SELL MODAL
// ==========================================

async function openSell() {

    const {
        data: { user }
    } =
        await supabaseClient.auth.getUser();

    if (!user) {

        alert(
            "🔐 Please login first to sell an item."
        );

        openAuth();

        return;
    }

    modal.style.display = "flex";
}


// ==========================================
// CLOSE SELL MODAL
// ==========================================

function closeSell() {

    modal.style.display = "none";
}


// ==========================================
// CLOSE SELL MODAL WHEN CLICKING OUTSIDE
// ==========================================

modal.addEventListener("click", function (e) {

    if (e.target === modal) {

        closeSell();
    }
});


// ==========================================
// PRODUCT DETAILS
// ==========================================

let selectedProduct = null;


function showMessage(itemName) {

    const products =
        document.querySelectorAll(".product");

    let found = false;


    products.forEach(product => {

        const productName =
            product.querySelector("h3")?.innerText || "";


        if (
            productName.toLowerCase() ===
            itemName.toLowerCase()
        ) {

            found = true;


           selectedProduct = {

    id:
        product.dataset.id,

    name:
        productName,

    price:
        product.querySelector("strong")?.innerText
        || "Price unavailable",

    category:
        product.querySelector(".tag")?.innerText
        || "Others",

    description:
        product.querySelector("p")?.innerText
        || "No description available.",

    seller:
        product.dataset.seller
        || "Campus Seller",

    sellerEmail:
        product.dataset.sellerEmail
        || "",

    phone:
        product.dataset.phone
        || "",

    image:
        product.dataset.image
        || null
};;


            document.getElementById(
                "detailName"
            ).innerText =
                selectedProduct.name;


            document.getElementById(
                "detailPrice"
            ).innerText =
                selectedProduct.price;


            document.getElementById(
                "detailCategory"
            ).innerText =
                selectedProduct.category;


            document.getElementById(
                "detailDescription"
            ).innerText =
                selectedProduct.description;


            document.getElementById(
                "detailSeller"
            ).innerText =
                selectedProduct.seller;


            // SHOW IMAGE

            const detailEmoji =
                document.getElementById(
                    "detailEmoji"
                );


            if (selectedProduct.image) {

                detailEmoji.innerHTML =
                    `<img
                        src="${selectedProduct.image}"
                        alt="${selectedProduct.name}"
                    >`;

            } else {

                detailEmoji.innerText =
                    getEmoji(
                        selectedProduct.category.toLowerCase()
                    );
            }


            document.getElementById(
                "productModal"
            ).style.display =
                "flex";
        }
    });


    if (!found) {

        alert(
            "Product details not found."
        );
    }
}


// ==========================================
// CLOSE PRODUCT POPUP
// ==========================================

function closeProduct() {

    document.getElementById(
        "productModal"
    ).style.display =
        "none";
}


// ==========================================
// CONTACT SELLER - WHATSAPP
// ==========================================

function contactSeller() {

    if (!selectedProduct) {

        return;
    }


    if (!selectedProduct.phone) {

        alert(
            "📩 Seller has not added a contact number yet."
        );

        return;
    }


    let phone =
        selectedProduct.phone
            .replace(/\D/g, "");


    // INDIA NUMBER SUPPORT
    // If seller enters 10 digit number,
    // automatically add +91

    if (phone.length === 10) {

        phone = "91" + phone;
    }


    const message =
        "Hi! I found your " +
        selectedProduct.name +
        " on CampusKart. Is it still available?";


    const whatsappURL =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterItems(
    category,
    button
) {

    const products =
        document.querySelectorAll(".product");


    document
        .querySelectorAll(
            ".categories button"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );
        });


    button.classList.add(
        "active"
    );


    products.forEach(product => {

        if (
            category === "all" ||
            product.dataset.category ===
                category
        ) {

            product.style.display =
                "block";

        } else {

            product.style.display =
                "none";
        }
    });
}


// ==========================================
// SEARCH
// ==========================================

function searchItems() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const products =
        document.querySelectorAll(
            ".product"
        );


    products.forEach(product => {

        const name =
            product.dataset.name || "";


        if (name.includes(search)) {

            product.style.display =
                "block";

        } else {

            product.style.display =
                "none";
        }
    });
}


// ==========================================
// GET EMOJI
// ==========================================

function getEmoji(category) {

    if (category === "books")
        return "📚";

    if (category === "electronics")
        return "💻";

    if (category === "fashion")
        return "👕";

    if (category === "hostel")
        return "🪑";

    return "✨";
}


// ==========================================
// CREATE PRODUCT CARD
// ==========================================

function createProductCard(item) {

    const newProduct =
        document.createElement("div");


    newProduct.className =
        "product";


    // PRODUCT DATA

    newProduct.dataset.category =
        item.category || "others";


    newProduct.dataset.name =
        (item.name || "")
            .toLowerCase();


    newProduct.dataset.id =
    item.id;

newProduct.dataset.seller =
    item.seller ||
    "Campus Seller";

newProduct.dataset.sellerEmail =
    item.seller_email ||
    "";

newProduct.dataset.phone =
    item.phone ||
    "";

newProduct.dataset.image =
    item.image_url ||
    "";


    const emoji =
        getEmoji(
            item.category
        );


    const imageHTML =
        item.image_url

            ? `
                <img
                    src="${item.image_url}"
                    alt="${item.name}"
                    loading="lazy"
                >
              `

            : emoji;


    newProduct.innerHTML = `

        <div class="product-image code">

            ${imageHTML}

        </div>


        <div class="product-info">

            <span class="tag">

                ${item.category}

            </span>


            <h3>

                ${item.name}

            </h3>


            <p>

                ${
                    item.description ||
                    "Listed by " +
                    item.seller
                }

            </p>


            <div class="bottom">

                <strong>

                    ₹${item.price}

                </strong>


                <button
                    class="view-product-btn"
                    type="button"
                >

                    View →

                </button>

            </div>

        </div>

    `;


    // VIEW BUTTON

    const viewButton =
        newProduct.querySelector(
            ".view-product-btn"
        );


    viewButton.addEventListener(
        "click",
        function () {

            showMessage(
                item.name
            );

        }
    );


    return newProduct;
}


// ==========================================
// ADD NEW ITEM
// ==========================================

async function addItem() {

    const name =
        document
            .getElementById(
                "itemName"
            )
            .value
            .trim();


    const price =
        document
            .getElementById(
                "itemPrice"
            )
            .value;


    const category =
        document
            .getElementById(
                "itemCategory"
            )
            .value;


    const seller =
        document
            .getElementById(
                "sellerName"
            )
            .value
            .trim();
    const {
    data: { user }
} = await supabaseClient.auth.getUser();

if (!user) {
    alert("🔐 Please login first.");
    openAuth();
    return;
}

const sellerEmail = user.email;


    const phone =
        document
            .getElementById(
                "sellerPhone"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "itemDescription"
            )
            .value
            .trim();


    const imageFile =
        document
            .getElementById(
                "itemImage"
            )
            .files[0];


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !name ||
        !price ||
        !seller
    ) {

        alert(
            "Please fill Item Name, Price and Your Name!"
        );

        return;
    }


    // ======================================
    // UPLOAD IMAGE
    // ======================================

    let imageUrl = null;


    if (imageFile) {

        const fileExt =
            imageFile.name
                .split(".")
                .pop()
                .toLowerCase();


        const fileName =
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2) +
            "." +
            fileExt;


        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(
                    "product-images"
                )
                .upload(
                    fileName,
                    imageFile
                );


        if (uploadError) {

            console.error(
                uploadError
            );


            alert(
                "❌ Image upload failed: " +
                uploadError.message
            );


            return;
        }


        const {
            data: publicData
        } =
            supabaseClient
                .storage
                .from(
                    "product-images"
                )
                .getPublicUrl(
                    fileName
                );


        imageUrl =
            publicData.publicUrl;
    }


    // ======================================
    // SAVE TO SUPABASE
    // ======================================

    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .insert([
                {

                    name: name,

                    price:
                        Number(price),

                    category:
                        category,

                    seller: seller,
                    seller_email: sellerEmail,
                    phone: phone,

                    description:
                        description,

                    image_url:
                        imageUrl
                }
            ])
            .select();


    // ======================================
    // DATABASE ERROR
    // ======================================

    if (error) {

        console.error(
            error
        );


        alert(
            "❌ Item save nahi hua: " +
            error.message
        );


        return;
    }


    // ======================================
    // ADD PRODUCT TO SCREEN
    // ======================================

    const savedItem =
        data[0];


    const newProduct =
        createProductCard(
            savedItem
        );


    productGrid.prepend(
        newProduct
    );


    // ======================================
    // CLOSE FORM
    // ======================================

    closeSell();


    // ======================================
    // CLEAR FORM
    // ======================================

    document.getElementById(
        "itemName"
    ).value = "";


    document.getElementById(
        "itemPrice"
    ).value = "";


    document.getElementById(
        "sellerName"
    ).value = "";


    document.getElementById(
        "sellerPhone"
    ).value = "";


    document.getElementById(
        "itemDescription"
    ).value = "";


    document.getElementById(
        "itemImage"
    ).value = "";


    // ======================================
    // SUCCESS MESSAGE
    // ======================================

    toast.innerText =
        "🚀 Item successfully listed!";


    toast.style.display =
        "block";


    setTimeout(
        () => {

            toast.style.display =
                "none";

        },
        3000
    );
}


// ==========================================
// LOAD PRODUCTS FROM SUPABASE
// ==========================================

async function loadProducts() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Error loading products:",
            error
        );

        return;
    }


    // ADD DATABASE PRODUCTS

    data.forEach(item => {

        const newProduct =
            createProductCard(
                item
            );


        productGrid.prepend(
            newProduct
        );

    });
}


// ==========================================
// LOAD DATABASE PRODUCTS
// ==========================================

loadProducts();

// ==========================================
// AUTHENTICATION
// ==========================================

function openAuth() {

    document
        .getElementById(
            "authModal"
        )
        .style.display =
        "flex";
}


function closeAuth() {

    document
        .getElementById(
            "authModal"
        )
        .style.display =
        "none";
}


// ==========================================
// SIGN UP
// ==========================================

async function signupUser() {

    const email =
        document
            .getElementById(
                "authEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "authPassword"
            )
            .value;


    if (
        !email ||
        !password
    ) {

        alert(
            "Please enter email and password."
        );

        return;
    }


    if (
        password.length < 6
    ) {

        alert(
            "Password must be at least 6 characters."
        );

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .signUp({
                email:
                    email,

                password:
                    password
            });


    if (error) {

        alert(
            "❌ " +
            error.message
        );

        return;
    }


    alert(
        "🎉 Account created successfully!"
    );
}


// ==========================================
// LOGIN
// ==========================================

async function loginUser() {

    const email =
        document
            .getElementById(
                "authEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "authPassword"
            )
            .value;


    if (
        !email ||
        !password
    ) {

        alert(
            "Please enter email and password."
        );

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .signInWithPassword({

                email:
                    email,

                password:
                    password

            });


    if (error) {

        alert(
            "❌ " +
            error.message
        );

        return;
    }


    alert(
        "🎉 Login successful!"
    );


    closeAuth();


    updateLoginButton();
}


// ==========================================
// LOGIN BUTTON
// ==========================================

async function updateLoginButton() {

    const {
        data: { user }
    } =
        await supabaseClient
            .auth
            .getUser();


    const button =
        document.querySelector(
            ".login-btn"
        );


    if (!button) {

        return;
    }


    if (user) {

        button.innerText =
            "👤 " +
            user.email
                .split("@")[0];


        button.onclick =
            logoutUser;

    } else {

        button.innerText =
            "Login / Sign Up";


        button.onclick =
            openAuth;
    }
}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    const {
        error
    } =
        await supabaseClient
            .auth
            .signOut();


    if (error) {

        alert(
            "Logout failed: " +
            error.message
        );

        return;
    }


    alert(
        "👋 Logged out successfully!"
    );


    updateLoginButton();
}


// ==========================================
// CHECK LOGIN
// ==========================================

updateLoginButton();


// ==========================================
// AUTH STATE LISTENER
// ==========================================

supabaseClient
    .auth
    .onAuthStateChange(
        () => {

            updateLoginButton();

        }
    );
// ==========================================
// CAMPUS CHAT
// ==========================================

const chatModal =
    document.getElementById("chatModal");

const chatMessages =
    document.getElementById("chatMessages");

const chatInput =
    document.getElementById("chatInput");

const chatSellerName =
    document.getElementById("chatSellerName");


// OPEN CHAT
async function openChat() {

    if (!selectedProduct) {
        alert("Please select a product first.");
        return;
    }

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
        alert("🔐 Please login first to chat with the seller.");
        openAuth();
        return;
    }

    if (!selectedProduct.sellerEmail) {
        alert("⚠️ Seller chat is not available for this item.");
        return;
    }

    chatSellerName.innerText =
        "Chat with " +
        selectedProduct.seller;

    chatModal.style.display = "flex";

    await loadMessages();
}


// CLOSE CHAT
function closeChat() {

    chatModal.style.display = "none";
}


// LOAD MESSAGES
async function loadMessages() {

    if (!selectedProduct) return;

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    chatMessages.innerHTML =
        '<p class="empty-chat">Loading messages...</p>';

    const { data, error } =
        await supabaseClient
            .from("messages")
            .select("*")
            .eq("product_id", selectedProduct.id)
            .or(
                `sender_email.eq.${user.email},receiver_email.eq.${user.email}`
            )
            .order("created_at", {
                ascending: true
            });

    if (error) {

        console.error(error);

        chatMessages.innerHTML =
            '<p class="empty-chat">Unable to load messages.</p>';

        return;
    }

    if (!data || data.length === 0) {

        chatMessages.innerHTML =
            '<p class="empty-chat">Start a conversation with the seller 💬</p>';

        return;
    }

    chatMessages.innerHTML = "";

    data.forEach(message => {

        const div =
            document.createElement("div");

        div.classList.add("chat-message");

        if (message.sender_email === user.email) {

            div.classList.add("my-message");

        } else {

            div.classList.add("their-message");
        }

        div.innerText =
            message.message;

        chatMessages.appendChild(div);
    });

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// SEND MESSAGE
async function sendMessage() {

    if (!selectedProduct) return;

    const message =
        chatInput.value.trim();

    if (!message) return;

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        alert("🔐 Please login first.");

        return;
    }

    if (!selectedProduct.sellerEmail) {

        alert("⚠️ Seller email not available.");

        return;
    }

    const { error } =
        await supabaseClient
            .from("messages")
            .insert([
                {
                    product_id:
                        selectedProduct.id,

                    sender_email:
                        user.email,

                    receiver_email:
                        selectedProduct.sellerEmail,

                    message:
                        message
                }
            ]);

    if (error) {

        console.error(error);

        alert(
            "❌ Message send nahi hua: " +
            error.message
        );

        return;
    }

    chatInput.value = "";

    await loadMessages();
}


// ENTER KEY
function handleChatKey(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


// CLOSE CHAT WHEN CLICKING OUTSIDE
if (chatModal) {

    chatModal.addEventListener(
        "click",
        function (e) {

            if (e.target === chatModal) {

                closeChat();
            }
        }
    );
}