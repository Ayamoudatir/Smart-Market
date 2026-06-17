import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCqTLj7GLMhA6i7CF3iozwGoSYTPoaVgfA",
  authDomain: "kenzimarket.firebaseapp.com",
  projectId: "kenzimarket",
  storageBucket: "kenzimarket.firebasestorage.app",
  messagingSenderId: "581393698454",
  appId: "1:581393698454:web:41c16eba28b63ff075fcb7",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function status(qty, threshold) {
  if (qty === 0) return 'rupture'
  if (qty <= threshold) return 'bas'
  return 'en_stock'
}

const PRODUCTS = [
  // Légumes
  { name: 'Tomates fraîches',      categoryName: 'Légumes',     price: 4,   unit: 'kg',    quantity: 50,  alertThreshold: 10, description: 'Tomates mûres cueillie du jour' },
  { name: 'Pommes de terre',       categoryName: 'Légumes',     price: 3,   unit: 'kg',    quantity: 80,  alertThreshold: 15 },
  { name: 'Carottes',              categoryName: 'Légumes',     price: 3,   unit: 'kg',    quantity: 40,  alertThreshold: 10 },
  { name: 'Oignons',               categoryName: 'Légumes',     price: 2,   unit: 'kg',    quantity: 60,  alertThreshold: 10 },
  { name: 'Courgettes',            categoryName: 'Légumes',     price: 4,   unit: 'kg',    quantity: 30,  alertThreshold: 8  },
  { name: 'Aubergines',            categoryName: 'Légumes',     price: 5,   unit: 'kg',    quantity: 25,  alertThreshold: 8  },
  { name: 'Poivrons rouges',       categoryName: 'Légumes',     price: 6,   unit: 'kg',    quantity: 20,  alertThreshold: 5  },
  { name: 'Poivrons verts',        categoryName: 'Légumes',     price: 5,   unit: 'kg',    quantity: 20,  alertThreshold: 5  },
  { name: 'Concombres',            categoryName: 'Légumes',     price: 3,   unit: 'kg',    quantity: 35,  alertThreshold: 8  },
  { name: 'Laitue',                categoryName: 'Légumes',     price: 3,   unit: 'u',     quantity: 30,  alertThreshold: 8  },
  { name: 'Menthe fraîche',        categoryName: 'Légumes',     price: 2,   unit: 'botte', quantity: 40,  alertThreshold: 10 },
  { name: 'Coriandre fraîche',     categoryName: 'Légumes',     price: 2,   unit: 'botte', quantity: 40,  alertThreshold: 10 },
  { name: 'Persil',                categoryName: 'Légumes',     price: 2,   unit: 'botte', quantity: 35,  alertThreshold: 8  },
  { name: 'Ail',                   categoryName: 'Légumes',     price: 20,  unit: 'kg',    quantity: 15,  alertThreshold: 5  },
  { name: 'Céleri',                categoryName: 'Légumes',     price: 4,   unit: 'botte', quantity: 15,  alertThreshold: 5  },
  { name: 'Épinards',              categoryName: 'Légumes',     price: 5,   unit: 'kg',    quantity: 20,  alertThreshold: 6  },
  { name: 'Navets',                categoryName: 'Légumes',     price: 3,   unit: 'kg',    quantity: 25,  alertThreshold: 8  },
  { name: 'Betteraves',            categoryName: 'Légumes',     price: 4,   unit: 'kg',    quantity: 20,  alertThreshold: 5  },

  // Fruits
  { name: 'Oranges',               categoryName: 'Fruits',      price: 5,   unit: 'kg',    quantity: 60,  alertThreshold: 10 },
  { name: 'Pommes Golden',         categoryName: 'Fruits',      price: 8,   unit: 'kg',    quantity: 40,  alertThreshold: 10 },
  { name: 'Bananes',               categoryName: 'Fruits',      price: 7,   unit: 'kg',    quantity: 30,  alertThreshold: 8  },
  { name: 'Pastèque',              categoryName: 'Fruits',      price: 3,   unit: 'kg',    quantity: 10,  alertThreshold: 3  },
  { name: 'Raisins blancs',        categoryName: 'Fruits',      price: 12,  unit: 'kg',    quantity: 20,  alertThreshold: 5  },
  { name: 'Figues fraîches',       categoryName: 'Fruits',      price: 15,  unit: 'kg',    quantity: 10,  alertThreshold: 3  },
  { name: 'Citrons',               categoryName: 'Fruits',      price: 6,   unit: 'kg',    quantity: 30,  alertThreshold: 8  },
  { name: 'Fraises',               categoryName: 'Fruits',      price: 15,  unit: 'kg',    quantity: 15,  alertThreshold: 5  },
  { name: 'Melons',                categoryName: 'Fruits',      price: 6,   unit: 'kg',    quantity: 12,  alertThreshold: 4  },

  // Fruits secs
  { name: 'Dattes Mejhoul',        categoryName: 'Fruits secs', price: 60,  unit: 'kg',    quantity: 10,  alertThreshold: 3  },
  { name: 'Amandes grillées',      categoryName: 'Fruits secs', price: 80,  unit: 'kg',    quantity: 8,   alertThreshold: 2  },
  { name: 'Noix',                  categoryName: 'Fruits secs', price: 70,  unit: 'kg',    quantity: 8,   alertThreshold: 2  },
  { name: 'Raisins secs',          categoryName: 'Fruits secs', price: 35,  unit: 'kg',    quantity: 12,  alertThreshold: 3  },
  { name: 'Figues sèches',         categoryName: 'Fruits secs', price: 40,  unit: 'kg',    quantity: 10,  alertThreshold: 3  },

  // Épicerie
  { name: 'Huile d\'olive 1L',     categoryName: 'Épicerie',    price: 45,  unit: 'L',     quantity: 20,  alertThreshold: 5  },
  { name: 'Huile de table 1L',     categoryName: 'Épicerie',    price: 18,  unit: 'L',     quantity: 30,  alertThreshold: 8  },
  { name: 'Sucre 1kg',             categoryName: 'Épicerie',    price: 8,   unit: 'kg',    quantity: 50,  alertThreshold: 10 },
  { name: 'Sel fin 1kg',           categoryName: 'Épicerie',    price: 3,   unit: 'kg',    quantity: 40,  alertThreshold: 10 },
  { name: 'Farine blanche 1kg',    categoryName: 'Épicerie',    price: 5,   unit: 'kg',    quantity: 40,  alertThreshold: 10 },
  { name: 'Riz basmati 1kg',       categoryName: 'Épicerie',    price: 12,  unit: 'kg',    quantity: 30,  alertThreshold: 8  },
  { name: 'Lentilles 1kg',         categoryName: 'Épicerie',    price: 10,  unit: 'kg',    quantity: 25,  alertThreshold: 6  },
  { name: 'Pois chiches 1kg',      categoryName: 'Épicerie',    price: 10,  unit: 'kg',    quantity: 25,  alertThreshold: 6  },
  { name: 'Concentré de tomate',   categoryName: 'Épicerie',    price: 5,   unit: 'u',     quantity: 30,  alertThreshold: 8  },
  { name: 'Harissa',               categoryName: 'Épicerie',    price: 8,   unit: 'u',     quantity: 20,  alertThreshold: 5  },
  { name: 'Cumin moulu',           categoryName: 'Épicerie',    price: 10,  unit: 'u',     quantity: 20,  alertThreshold: 5  },
  { name: 'Paprika',               categoryName: 'Épicerie',    price: 10,  unit: 'u',     quantity: 15,  alertThreshold: 4  },
  { name: 'Thé vert Gunpowder',    categoryName: 'Épicerie',    price: 20,  unit: 'u',     quantity: 25,  alertThreshold: 5  },
  { name: 'Café moulu 250g',       categoryName: 'Épicerie',    price: 25,  unit: 'u',     quantity: 20,  alertThreshold: 5  },

  // Boulangerie
  { name: 'Pain complet',          categoryName: 'Boulangerie', price: 2,   unit: 'u',     quantity: 40,  alertThreshold: 10 },
  { name: 'Khobz beldi',           categoryName: 'Boulangerie', price: 2,   unit: 'u',     quantity: 50,  alertThreshold: 10 },
  { name: 'Msemen',                categoryName: 'Boulangerie', price: 2,   unit: 'u',     quantity: 30,  alertThreshold: 8  },
  { name: 'Baghrir (crêpes marocaines)', categoryName: 'Boulangerie', price: 3, unit: 'u', quantity: 20, alertThreshold: 5  },
  { name: 'Harcha',                categoryName: 'Boulangerie', price: 3,   unit: 'u',     quantity: 15,  alertThreshold: 5  },

  // Laitiers
  { name: 'Lait frais 1L',         categoryName: 'Laitiers',    price: 7,   unit: 'L',     quantity: 30,  alertThreshold: 8  },
  { name: 'Yaourt nature',         categoryName: 'Laitiers',    price: 4,   unit: 'u',     quantity: 30,  alertThreshold: 8  },
  { name: 'Fromage frais',         categoryName: 'Laitiers',    price: 12,  unit: 'u',     quantity: 15,  alertThreshold: 5  },
  { name: 'Beurre 250g',           categoryName: 'Laitiers',    price: 18,  unit: 'u',     quantity: 20,  alertThreshold: 5  },
  { name: 'Smen (beurre fermenté)', categoryName: 'Laitiers',   price: 30,  unit: 'u',     quantity: 10,  alertThreshold: 3  },
]

let ok = 0
for (const p of PRODUCTS) {
  await addDoc(collection(db, 'products'), {
    ...p,
    categoryId: p.categoryName.toLowerCase().replace(/[éèê]/g, 'e').replace(/\s+/g, '_'),
    images: [],
    status: status(p.quantity, p.alertThreshold),
    description: p.description ?? '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  ok++
  process.stdout.write(`\r✓ ${ok}/${PRODUCTS.length} produits ajoutés`)
}

console.log(`\n\nDone! ${ok} produits dans Firestore.`)
process.exit(0)
