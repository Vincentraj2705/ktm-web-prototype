/* Sample catalogue data.
   Replace with real product photos + details — see README.md.
   Each item: id (article number), name, category ("gold" | "silver"),
   images (array of paths), description. */

const jewels = [
  {
    id: "G001",
    name: "Antique Temple Necklace",
    category: "gold",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80"
    ],
    description: "A traditional temple-style necklace in 22K gold with antique finish, BIS 916 hallmarked. Ideal for bridal and festive wear."
  },
  {
    id: "G002",
    name: "Kasu Mala Coin Chain",
    category: "gold",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80"
    ],
    description: "Classic coin-motif chain (kasu mala) crafted in hallmark gold, a timeless piece rooted in South Indian tradition."
  },
  {
    id: "G003",
    name: "Jhumka Drop Earrings",
    category: "gold",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
    ],
    description: "Elegant bell-shaped jhumka earrings in 22K gold with fine filigree detailing."
  },
  {
    id: "G004",
    name: "Bridal Vanki Armlet",
    category: "gold",
    images: [
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80"
    ],
    description: "A statement vanki armlet with intricate handwork, designed for bridal ensembles."
  },
  {
    id: "S001",
    name: "Sterling Silver Anklets",
    category: "silver",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"
    ],
    description: "Handcrafted sterling silver anklets (payal) with ghungroo bells, finished to a bright polish."
  },
  {
    id: "S002",
    name: "Silver Oxidised Choker",
    category: "silver",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
    ],
    description: "An oxidised-finish silver choker with traditional motifs, a versatile everyday-to-festive piece."
  }
];
