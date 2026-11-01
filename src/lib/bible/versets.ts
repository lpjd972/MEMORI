// Les versets à trous (demande de JD du 01/11/2026). Texte de la Bible Louis Segond 1910 ; les mots
// entre [crochets] peuvent devenir des trous. Classés dans l'ordre de la Bible : le jeu avance verset
// après verset, et plus on avance, plus il y a de trous et de mots-pièges.

export interface VersetATrous {
  histoire: string;
  reference: string;
  texte: string;
}

export const VERSETS: VersetATrous[] = [
  { histoire: "creation", reference: "Genèse 1:1", texte: "Au [commencement], Dieu créa les [cieux] et la [terre]." },
  { histoire: "eden", reference: "Genèse 1:27", texte: "Dieu créa l'homme à son [image], il le créa à l'image de [Dieu], il créa l'[homme] et la [femme]." },
  { histoire: "noe", reference: "Genèse 6:14", texte: "Fais-toi une [arche] de bois de [gopher]; tu disposeras cette arche en [cellules], et tu l'enduiras de [poix] en dedans et en dehors." },
  { histoire: "noe", reference: "Genèse 7:1", texte: "L'Éternel dit à [Noé]: Entre dans l'[arche], toi et toute ta [maison]; car je t'ai vu [juste] devant moi parmi cette génération." },
  { histoire: "noe", reference: "Genèse 9:13", texte: "J'ai placé mon [arc] dans la [nue], et il servira de [signe] d'[alliance] entre moi et la terre." },
  { histoire: "babel", reference: "Genèse 11:9", texte: "C'est pourquoi on l'appela du nom de [Babel], car c'est là que l'Éternel [confondit] le [langage] de toute la terre." },
  { histoire: "abraham", reference: "Genèse 12:2", texte: "Je ferai de toi une grande [nation], et je te [bénirai]; je rendrai ton [nom] grand, et tu seras une source de [bénédiction]." },
  { histoire: "abraham", reference: "Genèse 22:13", texte: "Abraham leva les yeux, et vit derrière lui un [bélier] retenu dans un [buisson] par les [cornes]; et Abraham alla prendre le bélier, et l'offrit en [holocauste] à la place de son [fils]." },
  { histoire: "joseph", reference: "Genèse 37:3", texte: "Israël aimait [Joseph] plus que tous ses autres fils, parce qu'il l'avait eu dans sa [vieillesse]; et il lui fit une [tunique] de plusieurs [couleurs]." },
  { histoire: "joseph", reference: "Genèse 50:20", texte: "Vous aviez médité de me faire du [mal]: Dieu l'a changé en [bien], pour accomplir ce qui arrive aujourd'hui, pour sauver la [vie] à un peuple nombreux." },
  { histoire: "moise", reference: "Exode 3:14", texte: "Dieu dit à [Moïse]: Je suis [celui] qui [suis]." },
  { histoire: "exode", reference: "Exode 14:14", texte: "L'Éternel [combattra] pour vous; et vous, gardez le [silence]." },
  { histoire: "exode", reference: "Exode 14:21", texte: "Moïse étendit sa [main] sur la mer. Et l'Éternel refoula la [mer] par un [vent] d'orient, qui souffla avec impétuosité toute la [nuit]; il mit la mer à [sec], et les eaux se fendirent." },
  { histoire: "desert", reference: "Exode 20:3", texte: "Tu n'auras pas d'autres [dieux] devant ma [face]." },
  { histoire: "jericho", reference: "Josué 1:9", texte: "Ne t'ai-je pas donné cet ordre: Fortifie-toi et prends [courage]? Ne t'effraie point et ne t'épouvante point, car l'[Éternel], ton Dieu, est avec toi dans tout ce que tu [entreprendras]." },
  { histoire: "gedeon", reference: "Juges 6:12", texte: "L'Éternel est avec toi, [vaillant] [héros]!" },
  { histoire: "samson", reference: "Juges 16:28", texte: "Seigneur Éternel! [souviens]-toi de moi, je te prie; ô Dieu! donne-moi de la [force] seulement cette [fois]." },
  { histoire: "ruth", reference: "Ruth 1:16", texte: "Où tu iras j'[irai], où tu demeureras je [demeurerai]; ton [peuple] sera mon peuple, et ton [Dieu] sera mon Dieu." },
  { histoire: "samuel", reference: "1 Samuel 3:10", texte: "[Parle], car ton [serviteur] [écoute]." },
  { histoire: "david", reference: "1 Samuel 17:45", texte: "Tu marches contre moi avec l'[épée], la [lance] et le [javelot]; et moi, je marche contre toi au [nom] de l'Éternel des armées." },
  { histoire: "david", reference: "1 Samuel 17:49", texte: "Il mit la main dans sa [gourde], y prit une [pierre], et la lança avec sa [fronde]; il frappa le Philistin au [front], et la pierre s'enfonça dans le front du Philistin, qui tomba le visage contre terre." },
  { histoire: "salomon", reference: "1 Rois 3:9", texte: "Accorde donc à ton serviteur un [cœur] intelligent pour [juger] ton peuple, pour discerner le [bien] du [mal]!" },
  { histoire: "salomon", reference: "Proverbes 1:7", texte: "La [crainte] de l'Éternel est le [commencement] de la [science]." },
  { histoire: "elie", reference: "1 Rois 18:39", texte: "C'est l'[Éternel] qui est [Dieu]! C'est l'Éternel qui est Dieu!" },
  { histoire: "jonas", reference: "Jonas 2:1", texte: "L'Éternel fit venir un grand [poisson] pour engloutir [Jonas], et Jonas fut dans le [ventre] du poisson [trois] jours et trois [nuits]." },
  { histoire: "daniel", reference: "Daniel 6:22", texte: "Mon Dieu a envoyé son [ange] et fermé la [gueule] des [lions], qui ne m'ont fait aucun [mal]." },
  { histoire: "esther", reference: "Esther 4:14", texte: "Et qui sait si ce n'est pas pour un [temps] comme celui-ci que tu es parvenue à la [royauté]?" },
  { histoire: "noel", reference: "Luc 2:7", texte: "Et elle enfanta son fils [premier-né]. Elle l'[emmaillota], et le coucha dans une [crèche], parce qu'il n'y avait pas de [place] pour eux dans l'[hôtellerie]." },
  { histoire: "noel", reference: "Luc 2:11", texte: "… aujourd'hui, dans la ville de [David], il vous est né un [Sauveur], qui est le [Christ], le [Seigneur]." },
  { histoire: "bapteme", reference: "Matthieu 3:17", texte: "Celui-ci est mon [Fils] [bien-aimé], en qui j'ai mis toute mon [affection]." },
  { histoire: "disciples", reference: "Matthieu 4:19", texte: "[Suivez]-moi, et je vous ferai [pêcheurs] d'[hommes]." },
  { histoire: "miracles", reference: "Marc 4:39", texte: "Il menaça le [vent], et dit à la mer: [Silence]! tais-toi! Et le vent [cessa], et il y eut un grand [calme]." },
  { histoire: "paraboles", reference: "Luc 15:24", texte: "Mon fils que voici était [mort], et il est revenu à la [vie]; il était [perdu], et il est [retrouvé]." },
  { histoire: "rencontres", reference: "Matthieu 19:14", texte: "Laissez les petits [enfants], et ne les empêchez pas de venir à [moi]; car le [royaume] des cieux est pour ceux qui leur [ressemblent]." },
  { histoire: "rencontres", reference: "Jean 3:16", texte: "Car Dieu a tant [aimé] le [monde] qu'il a donné son Fils [unique], afin que quiconque [croit] en lui ne périsse point, mais qu'il ait la vie [éternelle]." },
  { histoire: "croix", reference: "Luc 22:19", texte: "Ceci est mon [corps], qui est [donné] pour vous; faites ceci en [mémoire] de moi." },
  { histoire: "resurrection", reference: "Matthieu 28:6", texte: "Il n'est point [ici]; il est [ressuscité], comme il l'avait [dit]." },
  { histoire: "resurrection", reference: "Jean 14:6", texte: "Jésus lui dit: Je suis le [chemin], la [vérité], et la [vie]. Nul ne vient au [Père] que par moi." },
  { histoire: "pentecote", reference: "Actes 2:4", texte: "Et ils furent tous [remplis] du [Saint-Esprit], et se mirent à parler en d'autres [langues], selon que l'Esprit leur donnait de s'exprimer." },
  { histoire: "paul", reference: "Actes 9:3", texte: "Comme il était en [chemin], et qu'il approchait de [Damas], tout à coup une [lumière] venant du [ciel] resplendit autour de lui." },
  { histoire: "paul", reference: "Philippiens 4:13", texte: "Je puis [tout] par celui qui me [fortifie]." },
  { histoire: "apocalypse", reference: "Apocalypse 21:4", texte: "Il essuiera toute [larme] de leurs yeux, et la [mort] ne sera plus, et il n'y aura plus ni [deuil], ni cri, ni [douleur]." },
];

export interface Segment {
  texte: string;
  /** a word that can become a blank */
  trou: boolean;
}

/** « Au [commencement], Dieu… » → segments, with the bracketed words marked as possible blanks */
export function decouper(texte: string): Segment[] {
  return texte
    .split(/(\[[^\]]+\])/)
    .filter((s) => s !== "")
    .map((s) => (s.startsWith("[") ? { texte: s.slice(1, -1), trou: true } : { texte: s, trou: false }));
}
