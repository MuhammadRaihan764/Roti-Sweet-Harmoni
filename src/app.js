document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Toast", img: "1.jpg", price: 8000 },
      { id: 2, name: "Pretzel", img: "2.jpg", price: 10000 },
      { id: 3, name: "Bagel", img: "3.jpg", price: 12000 },
      { id: 4, name: "Donut", img: "4.jpg", price: 8000 },
      { id: 5, name: "Pain au", img: "5.jpg", price: 15000 },
      { id: 6, name: "Chocolate Cake", img: "6.jpg", price: 18000 },
      { id: 7, name: "Vanilla Cake", img: "7.jpg", price: 15000 },
      { id: 8, name: "Blueberry Cake", img: "8.jpg", price: 18000 },
      { id: 9, name: "Oreo Sandwich", img: "9.jpg", price: 12000 },
      { id: 10, name: "Dalgona Coffe", img: "10.jpg", price: 18000 },
      { id: 11, name: "Flat White Coffe", img: "11.jpg", price: 20000 },
      { id: 12, name: "Espresso", img: "12.jpg", price: 12000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newitem) {
      // cek apakah ada barang yang sama di cart
      const cartitem = this.items.find((item) => item.id === newitem.id);

      // jika belum ada / cart masih kosong
      if (!cartitem) {
        this.items.push({ ...newitem, quantity: 1, total: newitem.price });
        this.quantity++;
        this.total += newitem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newitem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartitem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartitem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartitem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartitem.price;
      }
    },
  });
});

// form validation
const checkoutbutton = document.querySelector(".checkout-button");
checkoutbutton.disabled = true;

const form = document.querySelector("#checkoutform");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutbutton.classList.remove("disabled");
      checkoutbutton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutbutton.disabled = false;
  checkoutbutton.classList.remove("disabled");
});

//kirim data ketika tombol checkout diklik
checkoutbutton.addEventListener("click", function (e) {
  e.preventDefault();
  const formdata = new FormData(form);
  const data = new URLSearchParams(formdata);
  const objdata = Object.fromEntries(data);
  const massage = formatmassage(objdata);
  window.open(
    "https://wa.me/6285157945488?text=" + encodeURIComponent(massage)
  );
});

// format pesan massage
const formatmassage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No HP: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
TOTAL: ${rupiah(obj.total)}
Terima Kasih.`;
};

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
