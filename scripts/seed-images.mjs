import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCqTLj7GLMhA6i7CF3iozwGoSYTPoaVgfA",
  authDomain: "kenzimarket.firebaseapp.com",
  projectId: "kenzimarket",
  storageBucket: "kenzimarket.firebasestorage.app",
  messagingSenderId: "581393698454",
  appId: "1:581393698454:web:41c16eba28b63ff075fcb7",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

await signInWithEmailAndPassword(auth, 'manager@kenzi.ma', 'kenzi123')
console.log('✓ Authentifié')

// Unsplash images par nom de produit (photo IDs stables)
const IMAGE_MAP = {
  'Tomates fraîches':       'https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=400&q=80',
  'Pommes de terre':        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  'Carottes':               'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  'Oignons':                'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80',
  'Courgettes':             'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
  'Aubergines':             'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80',
  'Poivrons rouges':        'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
  'Poivrons verts':         'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&q=80',
  'Concombres':             'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
  'Laitue':                 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=400&q=80',
  'Menthe fraîche':         'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80',
  'Coriandre fraîche':      'https://images.unsplash.com/photo-1506802913710-b9395e1b9826?w=400&q=80',
  'Persil':                 'https://images.unsplash.com/photo-1591633471048-f0f5b04a1a98?w=400&q=80',
  'Ail':                    'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80',
  'Céleri':                 'https://images.unsplash.com/photo-1560181818-6bbdf21f5e07?w=400&q=80',
  'Épinards':               'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'Navets':                 'https://images.unsplash.com/photo-1598030473178-2c2ce4ad6b00?w=400&q=80',
  'Betteraves':             'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&q=80',
  'Oranges':                'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80',
  'Pommes Golden':          'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&q=80',
  'Bananes':                'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
  'Pastèque':               'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80',
  'Raisins blancs':         'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=400&q=80',
  'Figues fraîches':        'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=400&q=80',
  'Citrons':                'https://images.unsplash.com/photo-1582287014914-1db51f2bf069?w=400&q=80',
  'Fraises':                'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
  'Melons':                 'https://images.unsplash.com/photo-1571575173700-afb9492d30a3?w=400&q=80',
  'Dattes Mejhoul':         'https://images.unsplash.com/photo-1638354736543-4ddbfef2ce2e?w=400&q=80',
  'Amandes grillées':       'https://images.unsplash.com/photo-1574570068036-643a24e3c059?w=400&q=80',
  'Noix':                   'https://images.unsplash.com/photo-1563591937-a5b3e2f08c8c?w=400&q=80',
  'Raisins secs':           'https://images.unsplash.com/photo-1596591868231-05e808f28b59?w=400&q=80',
  'Figues sèches':          'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=400&q=80',
  "Huile d'olive 1L":       'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
  'Huile de table 1L':      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
  'Sucre 1kg':              'https://images.unsplash.com/photo-1581798459219-3dc8d25c3f5a?w=400&q=80',
  'Sel fin 1kg':            'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',
  'Farine blanche 1kg':     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Riz basmati 1kg':        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'Lentilles 1kg':          'https://images.unsplash.com/photo-1585996546039-29baa36b51e7?w=400&q=80',
  'Pois chiches 1kg':       'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&q=80',
  'Concentré de tomate':    'https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=400&q=80',
  'Harissa':                'https://images.unsplash.com/photo-1534833783832-ff5c3a5fc1dc?w=400&q=80',
  'Cumin moulu':            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'Paprika':                'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&q=80',
  'Thé vert Gunpowder':     'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
  'Café moulu 250g':        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80',
  'Pain complet':           'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  'Khobz beldi':            'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  'Msemen':                 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&q=80',
  'Baghrir (crêpes marocaines)': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80',
  'Harcha':                 'https://images.unsplash.com/photo-1587736027427-41e0cd7c7c06?w=400&q=80',
  'Lait frais 1L':          'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
  'Yaourt nature':          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
  'Fromage frais':          'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80',
  'Beurre 250g':            'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80',
  'Smen (beurre fermenté)': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80',
}

const snap = await getDocs(collection(db, 'products'))
let updated = 0

for (const d of snap.docs) {
  const name = d.data().name
  const img = IMAGE_MAP[name]
  if (img) {
    await updateDoc(doc(db, 'products', d.id), { images: [img] })
    updated++
    process.stdout.write(`\r✓ ${updated} images assignées`)
  }
}

console.log(`\nDone! ${updated}/${snap.docs.length} produits mis à jour.`)
process.exit(0)
