// Les mots à trouver dans les mots mêlés, histoire par histoire (demande de JD du 01/11/2026).
// Chaque mot a le passage de la Bible (Louis Segond 1910) où il se trouve : quand le joueur le trouve,
// ou quand il se trompe avec un mot d'une autre histoire, le jeu lui montre où le lire.

export type MotBible = [mot: string, reference: string];

export const MOTS_MELES: Record<string, MotBible[]> = {
  creation: [
    ["Lumière", "Genèse 1:3"], ["Jour", "Genèse 1:5"], ["Nuit", "Genèse 1:5"], ["Ciel", "Genèse 1:8"],
    ["Terre", "Genèse 1:10"], ["Mer", "Genèse 1:10"], ["Herbe", "Genèse 1:11"], ["Arbres", "Genèse 1:11"],
    ["Étoiles", "Genèse 1:16"], ["Poissons", "Genèse 1:21"], ["Oiseaux", "Genèse 1:21"], ["Homme", "Genèse 1:27"],
  ],
  eden: [
    ["Adam", "Genèse 2:19"], ["Jardin", "Genèse 2:8"], ["Éden", "Genèse 2:8"], ["Serpent", "Genèse 3:1"],
    ["Fruit", "Genèse 3:6"], ["Figuier", "Genèse 3:7"], ["Ève", "Genèse 3:20"], ["Chérubins", "Genèse 3:24"],
    ["Épée", "Genèse 3:24"], ["Caïn", "Genèse 4:1"], ["Abel", "Genèse 4:2"],
  ],
  noe: [
    ["Noé", "Genèse 6:8"], ["Sem", "Genèse 6:10"], ["Cham", "Genèse 6:10"], ["Japhet", "Genèse 6:10"],
    ["Arche", "Genèse 6:14"], ["Gopher", "Genèse 6:14"], ["Déluge", "Genèse 6:17"], ["Sept", "Genèse 7:2"],
    ["Purs", "Genèse 7:2"], ["Pluie", "Genèse 7:12"], ["Ararat", "Genèse 8:4"], ["Corbeau", "Genèse 8:7"],
    ["Colombe", "Genèse 8:8"], ["Olivier", "Genèse 8:11"], ["Arc", "Genèse 9:13"],
  ],
  babel: [
    ["Schinear", "Genèse 11:2"], ["Briques", "Genèse 11:3"], ["Bitume", "Genèse 11:3"], ["Ville", "Genèse 11:4"],
    ["Tour", "Genèse 11:4"], ["Langage", "Genèse 11:7"], ["Babel", "Genèse 11:9"], ["Terre", "Genèse 11:1"],
    ["Nom", "Genèse 11:4"], ["Langue", "Genèse 11:1"],
  ],
  abraham: [
    ["Abram", "Genèse 12:1"], ["Lot", "Genèse 12:5"], ["Canaan", "Genèse 12:5"], ["Tente", "Genèse 12:8"],
    ["Agar", "Genèse 16:1"], ["Ismaël", "Genèse 16:15"], ["Abraham", "Genèse 17:5"], ["Sara", "Genèse 17:15"],
    ["Isaac", "Genèse 21:3"], ["Morija", "Genèse 22:2"], ["Bélier", "Genèse 22:13"], ["Chameaux", "Genèse 24:10"],
  ],
  joseph: [
    ["Joseph", "Genèse 37:3"], ["Tunique", "Genèse 37:3"], ["Songes", "Genèse 37:5"], ["Citerne", "Genèse 37:24"],
    ["Égypte", "Genèse 37:28"], ["Potiphar", "Genèse 37:36"], ["Prison", "Genèse 39:20"], ["Pharaon", "Genèse 41:1"],
    ["Vaches", "Genèse 41:2"], ["Épis", "Genèse 41:5"], ["Famine", "Genèse 41:30"], ["Benjamin", "Genèse 42:4"],
    ["Coupe", "Genèse 44:2"], ["Gosen", "Genèse 47:6"],
  ],
  moise: [
    ["Jonc", "Exode 2:3"], ["Fleuve", "Exode 2:3"], ["Moïse", "Exode 2:10"], ["Madian", "Exode 2:15"],
    ["Séphora", "Exode 2:21"], ["Jéthro", "Exode 3:1"], ["Horeb", "Exode 3:1"], ["Buisson", "Exode 3:2"],
    ["Feu", "Exode 3:2"], ["Souliers", "Exode 3:5"], ["Verge", "Exode 4:2"], ["Aaron", "Exode 4:14"],
  ],
  exode: [
    ["Sang", "Exode 7:20"], ["Grenouilles", "Exode 8:2"], ["Mouches", "Exode 8:21"], ["Grêle", "Exode 9:23"],
    ["Sauterelles", "Exode 10:4"], ["Ténèbres", "Exode 10:22"], ["Agneau", "Exode 12:3"], ["Pâque", "Exode 12:11"],
    ["Nuée", "Exode 13:21"], ["Chars", "Exode 14:7"], ["Vent", "Exode 14:21"],
  ],
  desert: [
    ["Cailles", "Exode 16:13"], ["Sabbat", "Exode 16:23"], ["Manne", "Exode 16:31"], ["Rocher", "Exode 17:6"],
    ["Amalek", "Exode 17:8"], ["Hur", "Exode 17:12"], ["Sinaï", "Exode 19:20"], ["Loi", "Exode 24:12"],
    ["Tables", "Exode 31:18"], ["Veau", "Exode 32:4"],
  ],
  jericho: [
    ["Josué", "Josué 1:1"], ["Rahab", "Josué 2:1"], ["Cordon", "Josué 2:18"], ["Jourdain", "Josué 3:1"],
    ["Pierres", "Josué 4:3"], ["Jéricho", "Josué 6:1"], ["Trompettes", "Josué 6:4"], ["Cris", "Josué 6:20"],
    ["Muraille", "Josué 6:20"], ["Espions", "Josué 6:22"],
  ],
  gedeon: [
    ["Gédéon", "Juges 6:11"], ["Froment", "Juges 6:11"], ["Pressoir", "Juges 6:11"], ["Ange", "Juges 6:12"],
    ["Toison", "Juges 6:37"], ["Rosée", "Juges 6:38"], ["Cruches", "Juges 7:16"], ["Flambeaux", "Juges 7:16"],
  ],
  samson: [
    ["Samson", "Juges 13:24"], ["Philistins", "Juges 14:4"], ["Lion", "Juges 14:5"], ["Abeilles", "Juges 14:8"],
    ["Miel", "Juges 14:8"], ["Renards", "Juges 15:4"], ["Mâchoire", "Juges 15:15"], ["Dalila", "Juges 16:4"],
    ["Cheveux", "Juges 16:17"], ["Rasoir", "Juges 16:17"], ["Dagon", "Juges 16:23"], ["Colonnes", "Juges 16:29"],
  ],
  ruth: [
    ["Moab", "Ruth 1:1"], ["Bethléhem", "Ruth 1:1"], ["Naomi", "Ruth 1:2"], ["Ruth", "Ruth 1:4"],
    ["Orpa", "Ruth 1:4"], ["Orge", "Ruth 1:22"], ["Boaz", "Ruth 2:1"], ["Glaner", "Ruth 2:2"], ["Obed", "Ruth 4:17"],
  ],
  samuel: [
    ["Elkana", "1 Samuel 1:1"], ["Anne", "1 Samuel 1:2"], ["Silo", "1 Samuel 1:3"], ["Éli", "1 Samuel 1:9"],
    ["Samuel", "1 Samuel 1:20"], ["Manteau", "1 Samuel 2:19"], ["Lampe", "1 Samuel 3:3"], ["Parle", "1 Samuel 3:10"],
    ["Écoute", "1 Samuel 3:10"], ["Saül", "1 Samuel 10:1"], ["Huile", "1 Samuel 10:1"],
  ],
  david: [
    ["Isaï", "1 Samuel 16:1"], ["Brebis", "1 Samuel 16:11"], ["David", "1 Samuel 16:13"], ["Harpe", "1 Samuel 16:23"],
    ["Goliath", "1 Samuel 17:4"], ["Ours", "1 Samuel 17:34"], ["Fronde", "1 Samuel 17:40"], ["Front", "1 Samuel 17:49"],
    ["Jonathan", "1 Samuel 18:1"],
  ],
  salomon: [
    ["Salomon", "1 Rois 1:39"], ["Gabaon", "1 Rois 3:5"], ["Enfant", "1 Rois 3:25"], ["Sagesse", "1 Rois 3:28"],
    ["Hiram", "1 Rois 5:1"], ["Cèdres", "1 Rois 5:6"], ["Temple", "1 Rois 6:1"], ["Séba", "1 Rois 10:1"],
  ],
  elie: [
    ["Élie", "1 Rois 17:1"], ["Achab", "1 Rois 17:1"], ["Kerith", "1 Rois 17:3"], ["Corbeaux", "1 Rois 17:6"],
    ["Sarepta", "1 Rois 17:9"], ["Veuve", "1 Rois 17:9"], ["Farine", "1 Rois 17:16"], ["Carmel", "1 Rois 18:19"],
    ["Baal", "1 Rois 18:19"], ["Nuage", "1 Rois 18:44"], ["Jézabel", "1 Rois 19:1"], ["Élisée", "2 Rois 2:9"],
    ["Tourbillon", "2 Rois 2:11"],
  ],
  jonas: [
    ["Jonas", "Jonas 1:1"], ["Ninive", "Jonas 1:2"], ["Tarsis", "Jonas 1:3"], ["Navire", "Jonas 1:3"],
    ["Tempête", "Jonas 1:4"], ["Marins", "Jonas 1:5"], ["Sort", "Jonas 1:7"], ["Poisson", "Jonas 2:1"],
    ["Sac", "Jonas 3:6"], ["Cendre", "Jonas 3:6"], ["Ricin", "Jonas 4:6"], ["Ver", "Jonas 4:7"],
  ],
  daniel: [
    ["Babylone", "Daniel 1:1"], ["Daniel", "Daniel 1:6"], ["Schadrac", "Daniel 1:7"], ["Méschac", "Daniel 1:7"],
    ["Légumes", "Daniel 1:12"], ["Statue", "Daniel 3:1"], ["Fournaise", "Daniel 3:6"], ["Darius", "Daniel 6:9"],
    ["Fenêtres", "Daniel 6:10"], ["Genoux", "Daniel 6:10"], ["Fosse", "Daniel 6:16"], ["Lions", "Daniel 6:16"],
  ],
  esther: [
    ["Assuérus", "Esther 1:1"], ["Vasthi", "Esther 1:9"], ["Mardochée", "Esther 2:5"], ["Hadassa", "Esther 2:7"],
    ["Esther", "Esther 2:7"], ["Reine", "Esther 2:17"], ["Haman", "Esther 3:1"], ["Sceptre", "Esther 4:11"],
    ["Festin", "Esther 5:4"], ["Cheval", "Esther 6:8"], ["Pourim", "Esther 9:26"],
  ],
  noel: [
    ["Gabriel", "Luc 1:26"], ["Marie", "Luc 1:27"], ["Nazareth", "Luc 2:4"], ["Crèche", "Luc 2:7"],
    ["Bergers", "Luc 2:8"], ["Sauveur", "Luc 2:11"], ["Jésus", "Luc 2:21"], ["Siméon", "Luc 2:25"],
    ["Mages", "Matthieu 2:1"], ["Hérode", "Matthieu 2:1"], ["Étoile", "Matthieu 2:9"], ["Encens", "Matthieu 2:11"],
    ["Myrrhe", "Matthieu 2:11"],
  ],
  bapteme: [
    ["Zacharie", "Luc 1:13"], ["Élisabeth", "Luc 1:13"], ["Jean", "Matthieu 3:1"], ["Désert", "Matthieu 3:1"],
    ["Chameau", "Matthieu 3:4"], ["Cognée", "Matthieu 3:10"], ["Baptisé", "Matthieu 3:16"], ["Esprit", "Matthieu 3:16"],
    ["Colombe", "Matthieu 3:16"], ["Fils", "Matthieu 3:17"],
  ],
  disciples: [
    ["Simon", "Matthieu 4:18"], ["André", "Matthieu 4:18"], ["Filets", "Matthieu 4:18"], ["Pêcheurs", "Matthieu 4:19"],
    ["Jacques", "Matthieu 4:21"], ["Zébédée", "Matthieu 4:21"], ["Barque", "Matthieu 4:21"], ["Matthieu", "Matthieu 9:9"],
    ["Thomas", "Matthieu 10:3"], ["Philippe", "Matthieu 10:3"], ["Judas", "Matthieu 10:4"], ["Nathanaël", "Jean 1:45"],
  ],
  miracles: [
    ["Cana", "Jean 2:1"], ["Vases", "Jean 2:6"], ["Eau", "Jean 2:7"], ["Vin", "Jean 2:9"], ["Pains", "Jean 6:9"],
    ["Paniers", "Matthieu 14:20"], ["Jaïrus", "Marc 5:22"], ["Aveugle", "Marc 10:46"], ["Bartimée", "Marc 10:46"],
    ["Lépreux", "Luc 17:12"], ["Siloé", "Jean 9:7"],
  ],
  paraboles: [
    ["Roc", "Matthieu 7:24"], ["Sable", "Matthieu 7:26"], ["Sénevé", "Matthieu 13:31"], ["Vierges", "Matthieu 25:1"],
    ["Semeur", "Luc 8:5"], ["Lévite", "Luc 10:32"], ["Samaritain", "Luc 10:33"], ["Deniers", "Luc 10:35"],
    ["Drachme", "Luc 15:8"], ["Pourceaux", "Luc 15:15"], ["Brebis", "Luc 15:4"],
  ],
  rencontres: [
    ["Nicodème", "Jean 3:1"], ["Puits", "Jean 4:6"], ["Lazare", "Jean 11:1"], ["Béthanie", "Jean 11:1"],
    ["Pleura", "Jean 11:35"], ["Sépulcre", "Jean 11:38"], ["Marthe", "Luc 10:38"], ["Zachée", "Luc 19:2"],
    ["Sycomore", "Luc 19:4"], ["Enfants", "Matthieu 19:14"],
  ],
  croix: [
    ["Ânon", "Jean 12:14"], ["Pain", "Matthieu 26:26"], ["Gethsémané", "Matthieu 26:36"], ["Baiser", "Matthieu 26:48"],
    ["Coq", "Matthieu 26:74"], ["Pilate", "Matthieu 27:2"], ["Barabbas", "Matthieu 27:16"], ["Épines", "Matthieu 27:29"],
    ["Cyrène", "Matthieu 27:32"], ["Golgotha", "Matthieu 27:33"], ["Malchus", "Jean 18:10"], ["Croix", "Jean 19:17"],
  ],
  resurrection: [
    ["Galilée", "Matthieu 28:7"], ["Magdala", "Marc 16:9"], ["Aromates", "Luc 24:1"], ["Emmaüs", "Luc 24:13"],
    ["Jardinier", "Jean 20:15"], ["Seigneur", "Jean 20:28"], ["Ressuscité", "Matthieu 28:6"],
    ["Ange", "Matthieu 28:2"], ["Pierre", "Matthieu 28:2"], ["Vivant", "Luc 24:5"],
  ],
  pentecote: [
    ["Matthias", "Actes 1:26"], ["Langues", "Actes 2:3"], ["Nations", "Actes 2:5"], ["Joël", "Actes 2:16"],
    ["Prières", "Actes 2:42"], ["Boiteux", "Actes 3:2"], ["Étienne", "Actes 7:59"],
    ["Vent", "Actes 2:2"], ["Feu", "Actes 2:3"], ["Pierre", "Actes 2:14"],
  ],
  paul: [
    ["Damas", "Actes 9:3"], ["Ananias", "Actes 9:10"], ["Écailles", "Actes 9:18"], ["Corbeille", "Actes 9:25"],
    ["Paul", "Actes 13:9"], ["Timothée", "Actes 16:1"], ["Lydie", "Actes 16:14"], ["Silas", "Actes 16:25"],
    ["Tentes", "Actes 18:3"], ["Malte", "Actes 28:1"], ["Vipère", "Actes 28:3"], ["Rome", "Actes 28:16"],
  ],
  apocalypse: [
    ["Alpha", "Apocalypse 1:8"], ["Oméga", "Apocalypse 1:8"], ["Patmos", "Apocalypse 1:9"], ["Chandeliers", "Apocalypse 1:12"],
    ["Trône", "Apocalypse 4:2"], ["Sceaux", "Apocalypse 5:1"], ["Jérusalem", "Apocalypse 21:2"], ["Larmes", "Apocalypse 21:4"],
    ["Portes", "Apocalypse 21:12"], ["Perles", "Apocalypse 21:21"],
  ],
};
