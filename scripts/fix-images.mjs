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

// URLs corrigées — toutes vérifiées et stables
const IMAGE_MAP = {
  'Tomates fraîches':       'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
  'Pommes de terre':        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  'Carottes':               'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  'Oignons':                'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  'Courgettes':             'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80',
  'Aubergines':             'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&q=80',
  'Poivrons rouges':        'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80',
  'Poivrons verts':         'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&q=80',
  'Concombres':             'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&q=80',
  'Laitue':                 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=400&q=80',
  'Menthe fraîche':         'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80',
  'Coriandre fraîche':      'https://images.unsplash.com/photo-1506802913710-b9395e1b9826?w=400&q=80',
  'Persil':                 'https://images.unsplash.com/photo-1591633471048-f0f5b04a1a98?w=400&q=80',
  'Ail':                    'https://images.unsplash.com/photo-1617692855027-33b14f061079?w=400&q=80',
  'Céleri':                 'https://images.unsplash.com/photo-1560181818-6bbdf21f5e07?w=400&q=80',
  'Épinards':               'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'Navets':                 'https://images.unsplash.com/photo-1598030473178-2c2ce4ad6b00?w=400&q=80',
  'Betteraves':             'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&q=80',
  'Oranges':                'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80',
  'Pommes Golden':          'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80',
  'Bananes':                'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
  'Pastèque':               'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
  'Raisins blancs':         'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80',
  'Figues fraîches':        'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=400&q=80',
  'Citrons':                'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80',
  'Fraises':                'https://images.unsplash.com/photo-1543528176-61b239494933?w=400&q=80',
  'Melons':                 'https://images.unsplash.com/photo-1571575173700-afb9492d30a3?w=400&q=80',
  'Dattes Mejhoul':         'https://images.unsplash.com/photo-1593460153456-6c70c6b4c97a?w=400&q=80',
  'Amandes grillées':       'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80',
  'Noix':                   'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400&q=80',
  'Raisins secs':           'https://images.unsplash.com/photo-1596591868231-05e808f28b59?w=400&q=80',
  'Figues sèches':          'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=400&q=80',
  "Huile d'olive 1L":       'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
  'Huile de table 1L':      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
  'Sucre 1kg':              'https://images.unsplash.com/photo-1610556903008-0c0ccb7b3cbb?w=400&q=80',
  'Sel fin 1kg':            'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',
  'Farine blanche 1kg':     'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
  'Riz basmati 1kg':        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'Lentilles 1kg':          'https://images.unsplash.com/photo-1624813977799-8c7f22aaada8?w=400&q=80',
  'Pois chiches 1kg':       'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&q=80',
  'Concentré de tomate':    'https://images.unsplash.com/photo-1608977546665-ded4879dce13?w=400&q=80',
  'Harissa':                'https://images.unsplash.com/photo-1532768778661-1b347e33dab2?w=400&q=80',
  'Cumin moulu':            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'Paprika':                'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&q=80',
  'Thé vert Gunpowder':     'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
  'Café moulu 250g':        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80',
  'Pain complet':           'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  'Khobz beldi':            'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=400&q=80',
  'Msemen':                 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&q=80',
  'Baghrir (crêpes marocaines)': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80',
  'Harcha':                 'https://images.unsplash.com/photo-1600326145552-327f074de667?w=400&q=80',
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
    process.stdout.write(`\r✓ ${updated}/${snap.docs.length} mis à jour — ${name}`)
  }
}

console.log(`\nDone! ${updated} produits mis à jour.`)
process.exit(0)
