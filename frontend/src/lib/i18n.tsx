import React, { createContext, useContext, useState, useCallback } from "react";

export type Locale = "en" | "fr" | "es" | "taq";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  taq: "Taqbaylit",
};

// Flat key-value translations
type Translations = Record<string, string>;

const en: Translations = {
  // Nav
  "nav.home": "Home",
  "nav.contact": "Contact",
  "nav.collections": "Collections",
  "nav.new": "New",
  "nav.preorder": "Pre-order",
  "nav.our_story": "Our Story",
  "nav.lookbook": "Lookbook",
  "nav.faq": "FAQ",
  "nav.all_products": "All Products",
  "nav.explore": "Explore",
  "nav.account": "Account",
  "nav.cart": "Cart",

  // Hero
  "hero.subtitle": "Streetwear with an Amazigh soul",
  "hero.title_1": "Wear the story.",
  "hero.title_2": "Anywhere.",
  "hero.desc": "Minimalist designs rooted in Amazigh heritage — made for everyone, everywhere.",
  "hero.shop": "Shop Now",
  "hero.collections": "Collections",

  // Footer
  "footer.desc": "Minimalist streetwear rooted in Amazigh culture — the indigenous heritage of North Africa.",
  "footer.for_everyone": "For everyone, everywhere.",
  "footer.shop": "Shop",
  "footer.new_arrivals": "New Arrivals",
  "footer.preorder": "Pre-order",
  "footer.all_products": "All Products",
  "footer.lookbook": "Lookbook",
  "footer.support": "Support",
  "footer.our_story": "Our Story",
  "footer.faq": "FAQ",
  "footer.my_account": "My Account",
  "footer.contact": "Contact",
  "footer.privacy": "Privacy Policy",
  "footer.returns": "Return Policy",
  "footer.tagline": "Wear the story. Anywhere.",
  "footer.rights": "All rights reserved.",

  // Collections
  "col.ixulaf": "Boys",
  "col.azekka": "Girls",
  "col.imnayen": "Men",
  "col.tigejda": "Women",
  "col.view_all": "View all",

  // Store
  "store.title": "All Products",
  "store.desc": "Explore the full IYUC collection — streetwear with an Amazigh soul.",
  "store.no_products": "No products found.",

  // Product
  "product.add_to_cart": "Add to Cart",
  "product.adding": "Adding...",
  "product.description": "Description",
  "product.not_found": "Product not found.",
  "product.ships": "ships",
  "product.preorder_note": "Pre-order — ships",

  // Cart
  "cart.title": "Cart",
  "cart.empty": "Your cart is empty",
  "cart.subtotal": "Subtotal",
  "cart.taxes_note": "Taxes and shipping calculated at checkout.",
  "cart.checkout": "Go to Checkout",

  // Checkout
  "checkout.contact_info": "Contact Information",
  "checkout.shipping_address": "Shipping Address",
  "checkout.shipping_method": "Shipping Method",
  "checkout.payment": "Payment",
  "checkout.information": "Information",
  "checkout.shipping": "Shipping",
  "checkout.continue_shipping": "Continue to Shipping",
  "checkout.continue_payment": "Continue to Payment",
  "checkout.place_order": "Place Order",
  "checkout.order_summary": "Order Summary",
  "checkout.subtotal": "Subtotal",
  "checkout.shipping_cost": "Shipping",
  "checkout.total": "Total",
  "checkout.calculated_next": "Calculated next",
  "checkout.standard": "Standard Shipping",
  "checkout.standard_desc": "5-7 business days",
  "checkout.express": "Express Shipping",
  "checkout.express_desc": "2-3 business days",
  "checkout.order_confirmed": "Order Confirmed",
  "checkout.thank_you": "Thank you for your purchase! You'll receive a confirmation email shortly.",
  "checkout.continue_shopping": "Continue Shopping",
  "checkout.empty_cart": "Your cart is empty",
  "checkout.back": "Back",

  // Account
  "account.sign_in": "Sign In",
  "account.create_account": "Create Account",
  "account.profile": "Profile",
  "account.orders": "Orders",
  "account.addresses": "Addresses",
  "account.sign_out": "Sign Out",
  "account.save": "Save Changes",
  "account.no_account": "Don't have an account?",
  "account.has_account": "Already have an account?",
  "account.create_one": "Create one",

  // Our Story
  "story.title": "Our Story",
  "story.h1": "Where heritage meets the street",
  "story.p1": "IYUC was born from a simple conviction: the Amazigh culture — one of the oldest living civilizations in North Africa — deserves a place in the global conversation of modern fashion.",
  "story.p2": "We draw from centuries of Amazigh artistry — geometric motifs, natural pigments, the rhythm of woven textiles — and translate them into contemporary streetwear that speaks to everyone, everywhere.",
  "story.p3": "Every piece tells a story. A tonal embroidery of the Yaz (ⵣ), the universal Amazigh symbol of freedom. A silhouette inspired by traditional draping. A color pulled from the Atlas Mountains at dawn.",
  "story.p4": "We believe fashion should bridge worlds, not build walls. IYUC is for the kid in Montreal and the dreamer in Tizi Ouzou. For the one who wears their roots with quiet confidence.",
  "story.values_title": "Our Values",
  "story.v1_title": "Heritage Forward",
  "story.v1_desc": "We honor tradition by making it live in the present. Every design carries a piece of Amazigh history into tomorrow.",
  "story.v2_title": "For Everyone",
  "story.v2_desc": "No gatekeeping. Our clothes are made for anyone who connects with the story — regardless of where they come from.",
  "story.v3_title": "Minimal & Intentional",
  "story.v3_desc": "We don't do excess. Every stitch, every detail, every word is chosen with care.",
  "story.amazigh_note": "The Amazigh (ⴰⵎⴰⵣⵉⵖ) — meaning \"free people\" — are the indigenous inhabitants of North Africa. Their rich culture spans thousands of years across Morocco, Algeria, Tunisia, Libya, and beyond.",

  // Lookbook
  "lookbook.title": "Lookbook",
  "lookbook.subtitle": "Season One — Roots",
  "lookbook.desc": "A visual journey through the IYUC universe. Shot between Montreal and the Atlas foothills.",

  // FAQ
  "faq.title": "FAQ",
  "faq.subtitle": "Frequently asked questions about IYUC, our products, and shipping.",
  "faq.q1": "What is IYUC?",
  "faq.a1": "IYUC is a minimalist streetwear brand rooted in Amazigh heritage. We create modern, premium clothing that carries the story of one of North Africa's oldest living cultures — designed for everyone, everywhere.",
  "faq.q2": "What does \"Amazigh\" mean?",
  "faq.a2": "Amazigh (ⴰⵎⴰⵣⵉⵖ) means \"free people\" in Tamazight. The Amazigh are the indigenous inhabitants of North Africa, with a cultural history spanning thousands of years across Morocco, Algeria, Tunisia, and beyond.",
  "faq.q3": "What does the ⵣ symbol mean?",
  "faq.a3": "The ⵣ (Yaz) is the universal symbol of Amazigh identity and freedom. You'll find it as a subtle detail in many of our pieces — embroidered, embossed, or woven.",
  "faq.q4": "How do pre-orders work?",
  "faq.a4": "Pre-order items are clearly labeled with their expected ship date. You'll be charged at the time of order, and we'll email you tracking info as soon as your item ships.",
  "faq.q5": "What sizes do you offer?",
  "faq.a5": "We offer sizes from S to XL for adults, and 4Y to 12Y for kids. Each product page includes a detailed size guide. If you're between sizes, we recommend going up.",
  "faq.q6": "Do you ship internationally?",
  "faq.a6": "Yes! We ship worldwide from Canada. Standard international shipping takes 7-14 business days. Express options are available at checkout.",
  "faq.q7": "What is your return policy?",
  "faq.a7": "We offer free returns within 30 days of delivery for unworn items in original packaging. Pre-order items are also eligible. Visit our Return Policy page for full details.",
  "faq.q8": "How can I contact you?",
  "faq.a8": "Email us at hello@iyuc.com or use our Contact page. We respond within 24 hours.",

  // Privacy
  "privacy.title": "Privacy Policy",
  "privacy.intro": "At IYUC, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.",
  "privacy.s1_title": "Information We Collect",
  "privacy.s1_text": "We collect information you provide directly — such as your name, email, shipping address, and payment details when you make a purchase. We also collect browsing data automatically through cookies and analytics tools.",
  "privacy.s2_title": "How We Use Your Information",
  "privacy.s2_text": "Your information is used to process orders, provide customer support, send order updates, and improve our products and website. We never sell your personal data to third parties.",
  "privacy.s3_title": "Cookies",
  "privacy.s3_text": "We use essential cookies for site functionality and analytics cookies to understand how visitors use our site. You can disable non-essential cookies in your browser settings.",
  "privacy.s4_title": "Data Security",
  "privacy.s4_text": "We use industry-standard encryption and security measures to protect your data. Payment processing is handled by trusted third-party providers who comply with PCI DSS standards.",
  "privacy.s5_title": "Your Rights",
  "privacy.s5_text": "You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@iyuc.com to exercise these rights.",
  "privacy.s6_title": "Contact",
  "privacy.s6_text": "For privacy-related questions, email us at privacy@iyuc.com.",

  // Returns
  "returns.title": "Return Policy",
  "returns.intro": "We want you to love what you wear. If something isn't right, we're here to help.",
  "returns.s1_title": "30-Day Returns",
  "returns.s1_text": "Return any unworn item within 30 days of delivery for a full refund. Items must be in original condition with tags attached and in their original packaging.",
  "returns.s2_title": "Pre-order Items",
  "returns.s2_text": "Pre-order items are eligible for return within 30 days of the actual delivery date. You may also cancel a pre-order before it ships for a full refund.",
  "returns.s3_title": "How to Return",
  "returns.s3_text": "Email returns@iyuc.com with your order number. We'll send you a prepaid return label within 24 hours. Once we receive your item, refunds are processed within 5 business days.",
  "returns.s4_title": "Exchanges",
  "returns.s4_text": "Need a different size or color? Contact us and we'll set up an exchange. If the new item is in stock, we'll ship it as soon as we receive your return.",
  "returns.s5_title": "Exceptions",
  "returns.s5_text": "Final sale items and gift cards are not eligible for return. Accessories (watches, sunglasses) must be returned in their original case.",

  // Contact
  "contact.title": "Contact Us",
  "contact.subtitle": "Have a question, feedback, or just want to say hello? We'd love to hear from you.",
  "contact.name": "Name",
  "contact.email": "Email",
  "contact.subject": "Subject",
  "contact.message": "Message",
  "contact.send": "Send Message",
  "contact.sent": "Message sent! We'll get back to you within 24 hours.",
  "contact.info_title": "Other Ways to Reach Us",
  "contact.email_label": "Email",
  "contact.email_value": "hello@iyuc.com",
  "contact.hours_label": "Hours",
  "contact.hours_value": "Mon–Fri, 9am–6pm EST",
  "contact.location_label": "Based in",
  "contact.location_value": "Montreal, QC, Canada",
};

const fr: Translations = {
  "nav.home": "Accueil",
  "nav.contact": "Contact",
  "nav.collections": "Collections",
  "nav.new": "Nouveau",
  "nav.preorder": "Précommande",
  "nav.our_story": "Notre histoire",
  "nav.lookbook": "Lookbook",
  "nav.faq": "FAQ",
  "nav.all_products": "Tous les produits",
  "nav.explore": "Explorer",
  "nav.account": "Compte",
  "nav.cart": "Panier",

  "hero.subtitle": "Streetwear à l'âme amazighe",
  "hero.title_1": "Porte l'histoire.",
  "hero.title_2": "Partout.",
  "hero.desc": "Des designs minimalistes enracinés dans l'héritage amazigh — faits pour tous, partout.",
  "hero.shop": "Acheter",
  "hero.collections": "Collections",

  "footer.desc": "Streetwear minimaliste enraciné dans la culture amazighe — l'héritage indigène d'Afrique du Nord.",
  "footer.for_everyone": "Pour tous, partout.",
  "footer.shop": "Boutique",
  "footer.new_arrivals": "Nouveautés",
  "footer.preorder": "Précommande",
  "footer.all_products": "Tous les produits",
  "footer.lookbook": "Lookbook",
  "footer.support": "Aide",
  "footer.our_story": "Notre histoire",
  "footer.faq": "FAQ",
  "footer.my_account": "Mon compte",
  "footer.contact": "Contact",
  "footer.privacy": "Politique de confidentialité",
  "footer.returns": "Politique de retour",
  "footer.tagline": "Porte l'histoire. Partout.",
  "footer.rights": "Tous droits réservés.",

  "col.ixulaf": "Garçons",
  "col.azekka": "Filles",
  "col.imnayen": "Hommes",
  "col.tigejda": "Femmes",
  "col.view_all": "Voir tout",

  "store.title": "Tous les produits",
  "store.desc": "Explorez la collection complète IYUC — streetwear à l'âme amazighe.",
  "store.no_products": "Aucun produit trouvé.",

  "product.add_to_cart": "Ajouter au panier",
  "product.adding": "Ajout...",
  "product.description": "Description",
  "product.not_found": "Produit non trouvé.",
  "product.ships": "livraison",
  "product.preorder_note": "Précommande — livraison",

  "cart.title": "Panier",
  "cart.empty": "Votre panier est vide",
  "cart.subtotal": "Sous-total",
  "cart.taxes_note": "Taxes et livraison calculées au paiement.",
  "cart.checkout": "Passer à la caisse",

  "checkout.contact_info": "Coordonnées",
  "checkout.shipping_address": "Adresse de livraison",
  "checkout.shipping_method": "Méthode de livraison",
  "checkout.payment": "Paiement",
  "checkout.information": "Informations",
  "checkout.shipping": "Livraison",
  "checkout.continue_shipping": "Continuer vers la livraison",
  "checkout.continue_payment": "Continuer vers le paiement",
  "checkout.place_order": "Passer la commande",
  "checkout.order_summary": "Résumé de la commande",
  "checkout.subtotal": "Sous-total",
  "checkout.shipping_cost": "Livraison",
  "checkout.total": "Total",
  "checkout.calculated_next": "Calculé à l'étape suivante",
  "checkout.standard": "Livraison standard",
  "checkout.standard_desc": "5-7 jours ouvrables",
  "checkout.express": "Livraison express",
  "checkout.express_desc": "2-3 jours ouvrables",
  "checkout.order_confirmed": "Commande confirmée",
  "checkout.thank_you": "Merci pour votre achat ! Vous recevrez un courriel de confirmation sous peu.",
  "checkout.continue_shopping": "Continuer vos achats",
  "checkout.empty_cart": "Votre panier est vide",
  "checkout.back": "Retour",

  "account.sign_in": "Se connecter",
  "account.create_account": "Créer un compte",
  "account.profile": "Profil",
  "account.orders": "Commandes",
  "account.addresses": "Adresses",
  "account.sign_out": "Se déconnecter",
  "account.save": "Enregistrer",
  "account.no_account": "Pas de compte ?",
  "account.has_account": "Déjà un compte ?",
  "account.create_one": "Créer un compte",

  "story.title": "Notre histoire",
  "story.h1": "Là où l'héritage rencontre la rue",
  "story.p1": "IYUC est né d'une conviction simple : la culture amazighe — l'une des plus anciennes civilisations vivantes d'Afrique du Nord — mérite une place dans la mode mondiale contemporaine.",
  "story.p2": "Nous puisons dans des siècles d'art amazigh — motifs géométriques, pigments naturels, le rythme des textiles tissés — pour les traduire en streetwear contemporain qui parle à tous, partout.",
  "story.p3": "Chaque pièce raconte une histoire. Une broderie tonale du Yaz (ⵣ), symbole universel amazigh de liberté. Une silhouette inspirée du drapé traditionnel. Une couleur tirée de l'Atlas à l'aube.",
  "story.p4": "Nous croyons que la mode doit rapprocher les mondes, pas ériger des murs. IYUC est pour l'enfant de Montréal et le rêveur de Tizi Ouzou.",
  "story.values_title": "Nos valeurs",
  "story.v1_title": "Héritage en avant",
  "story.v1_desc": "Nous honorons la tradition en la faisant vivre au présent. Chaque design porte un morceau d'histoire amazighe vers demain.",
  "story.v2_title": "Pour tous",
  "story.v2_desc": "Pas de barrières. Nos vêtements sont faits pour tous ceux qui se connectent à l'histoire.",
  "story.v3_title": "Minimal et intentionnel",
  "story.v3_desc": "Pas d'excès. Chaque couture, chaque détail, chaque mot est choisi avec soin.",
  "story.amazigh_note": "Les Amazighs (ⴰⵎⴰⵣⵉⵖ) — signifiant « peuple libre » — sont les habitants autochtones d'Afrique du Nord. Leur riche culture s'étend sur des milliers d'années.",

  "lookbook.title": "Lookbook",
  "lookbook.subtitle": "Saison Un — Racines",
  "lookbook.desc": "Un voyage visuel à travers l'univers IYUC. Photographié entre Montréal et les contreforts de l'Atlas.",

  "faq.title": "FAQ",
  "faq.subtitle": "Questions fréquemment posées sur IYUC, nos produits et la livraison.",
  "faq.q1": "Qu'est-ce que IYUC ?",
  "faq.a1": "IYUC est une marque de streetwear minimaliste enracinée dans l'héritage amazigh. Nous créons des vêtements modernes et premium qui portent l'histoire de l'une des plus anciennes cultures vivantes d'Afrique du Nord.",
  "faq.q2": "Que signifie « Amazigh » ?",
  "faq.a2": "Amazigh (ⴰⵎⴰⵣⵉⵖ) signifie « peuple libre » en tamazight. Les Amazighs sont les habitants autochtones d'Afrique du Nord.",
  "faq.q3": "Que signifie le symbole ⵣ ?",
  "faq.a3": "Le ⵣ (Yaz) est le symbole universel de l'identité et de la liberté amazighes. Vous le trouverez en détail subtil dans beaucoup de nos pièces.",
  "faq.q4": "Comment fonctionnent les précommandes ?",
  "faq.a4": "Les articles en précommande sont clairement étiquetés avec leur date de livraison prévue. Vous serez facturé au moment de la commande.",
  "faq.q5": "Quelles tailles proposez-vous ?",
  "faq.a5": "Nous offrons les tailles S à XL pour adultes, et 4Y à 12Y pour enfants. Chaque page produit inclut un guide des tailles détaillé.",
  "faq.q6": "Livrez-vous à l'international ?",
  "faq.a6": "Oui ! Nous livrons dans le monde entier depuis le Canada. La livraison standard internationale prend 7-14 jours ouvrables.",
  "faq.q7": "Quelle est votre politique de retour ?",
  "faq.a7": "Nous offrons des retours gratuits dans les 30 jours suivant la livraison pour les articles non portés dans leur emballage d'origine.",
  "faq.q8": "Comment vous contacter ?",
  "faq.a8": "Écrivez-nous à hello@iyuc.com ou utilisez notre page Contact. Nous répondons sous 24 heures.",

  "privacy.title": "Politique de confidentialité",
  "privacy.intro": "Chez IYUC, nous respectons votre vie privée et nous engageons à protéger vos informations personnelles.",
  "privacy.s1_title": "Informations collectées",
  "privacy.s1_text": "Nous collectons les informations que vous fournissez directement — nom, courriel, adresse de livraison et détails de paiement lors d'un achat.",
  "privacy.s2_title": "Utilisation des informations",
  "privacy.s2_text": "Vos informations sont utilisées pour traiter les commandes, fournir un support client et améliorer nos produits. Nous ne vendons jamais vos données.",
  "privacy.s3_title": "Cookies",
  "privacy.s3_text": "Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies analytiques pour comprendre l'utilisation.",
  "privacy.s4_title": "Sécurité des données",
  "privacy.s4_text": "Nous utilisons des mesures de sécurité standard de l'industrie. Le traitement des paiements est géré par des tiers conformes PCI DSS.",
  "privacy.s5_title": "Vos droits",
  "privacy.s5_text": "Vous avez le droit d'accéder, corriger ou supprimer vos données personnelles à tout moment. Contactez privacy@iyuc.com.",
  "privacy.s6_title": "Contact",
  "privacy.s6_text": "Pour les questions relatives à la vie privée, écrivez à privacy@iyuc.com.",

  "returns.title": "Politique de retour",
  "returns.intro": "Nous voulons que vous aimiez ce que vous portez. Si quelque chose ne va pas, nous sommes là pour vous aider.",
  "returns.s1_title": "Retours sous 30 jours",
  "returns.s1_text": "Retournez tout article non porté dans les 30 jours suivant la livraison pour un remboursement complet.",
  "returns.s2_title": "Articles en précommande",
  "returns.s2_text": "Les articles en précommande sont éligibles au retour dans les 30 jours suivant la date de livraison effective.",
  "returns.s3_title": "Comment retourner",
  "returns.s3_text": "Envoyez un courriel à returns@iyuc.com avec votre numéro de commande. Nous vous enverrons une étiquette de retour prépayée.",
  "returns.s4_title": "Échanges",
  "returns.s4_text": "Besoin d'une taille ou couleur différente ? Contactez-nous pour un échange.",
  "returns.s5_title": "Exceptions",
  "returns.s5_text": "Les articles en vente finale et les cartes-cadeaux ne sont pas éligibles au retour.",

  "contact.title": "Contactez-nous",
  "contact.subtitle": "Une question, un commentaire ou juste envie de dire bonjour ? Nous aimerions vous entendre.",
  "contact.name": "Nom",
  "contact.email": "Courriel",
  "contact.subject": "Sujet",
  "contact.message": "Message",
  "contact.send": "Envoyer",
  "contact.sent": "Message envoyé ! Nous vous répondrons sous 24 heures.",
  "contact.info_title": "Autres moyens de nous joindre",
  "contact.email_label": "Courriel",
  "contact.email_value": "hello@iyuc.com",
  "contact.hours_label": "Heures",
  "contact.hours_value": "Lun–Ven, 9h–18h HNE",
  "contact.location_label": "Basé à",
  "contact.location_value": "Montréal, QC, Canada",
};

// Spanish
const es: Translations = {
  "nav.home": "Inicio",
  "nav.contact": "Contacto",
  "nav.collections": "Colecciones",
  "nav.new": "Nuevo",
  "nav.preorder": "Preventa",
  "nav.our_story": "Nuestra historia",
  "nav.lookbook": "Lookbook",
  "nav.faq": "FAQ",
  "nav.all_products": "Todos los productos",
  "nav.explore": "Explorar",
  "nav.account": "Cuenta",
  "nav.cart": "Carrito",

  "hero.subtitle": "Streetwear con alma amazigh",
  "hero.title_1": "Viste la historia.",
  "hero.title_2": "En cualquier lugar.",
  "hero.desc": "Diseños minimalistas enraizados en la herencia amazigh — hechos para todos, en todas partes.",
  "hero.shop": "Comprar",
  "hero.collections": "Colecciones",

  "footer.desc": "Streetwear minimalista enraizado en la cultura amazigh — la herencia indígena del norte de África.",
  "footer.for_everyone": "Para todos, en todas partes.",
  "footer.shop": "Tienda",
  "footer.new_arrivals": "Novedades",
  "footer.preorder": "Preventa",
  "footer.all_products": "Todos los productos",
  "footer.lookbook": "Lookbook",
  "footer.support": "Soporte",
  "footer.our_story": "Nuestra historia",
  "footer.faq": "FAQ",
  "footer.my_account": "Mi cuenta",
  "footer.contact": "Contacto",
  "footer.privacy": "Política de privacidad",
  "footer.returns": "Política de devoluciones",
  "footer.tagline": "Viste la historia. En cualquier lugar.",
  "footer.rights": "Todos los derechos reservados.",

  "col.ixulaf": "Niños",
  "col.azekka": "Niñas",
  "col.imnayen": "Hombres",
  "col.tigejda": "Mujeres",
  "col.view_all": "Ver todo",

  "store.title": "Todos los productos",
  "store.desc": "Explora la colección completa de IYUC — streetwear con alma amazigh.",
  "store.no_products": "No se encontraron productos.",

  "product.add_to_cart": "Añadir al carrito",
  "product.adding": "Añadiendo...",
  "product.description": "Descripción",
  "product.not_found": "Producto no encontrado.",
  "product.ships": "envío",
  "product.preorder_note": "Preventa — envío",

  "cart.title": "Carrito",
  "cart.empty": "Tu carrito está vacío",
  "cart.subtotal": "Subtotal",
  "cart.taxes_note": "Impuestos y envío calculados en el pago.",
  "cart.checkout": "Ir al pago",

  "checkout.contact_info": "Información de contacto",
  "checkout.shipping_address": "Dirección de envío",
  "checkout.shipping_method": "Método de envío",
  "checkout.payment": "Pago",
  "checkout.information": "Información",
  "checkout.shipping": "Envío",
  "checkout.continue_shipping": "Continuar al envío",
  "checkout.continue_payment": "Continuar al pago",
  "checkout.place_order": "Realizar pedido",
  "checkout.order_summary": "Resumen del pedido",
  "checkout.subtotal": "Subtotal",
  "checkout.shipping_cost": "Envío",
  "checkout.total": "Total",
  "checkout.calculated_next": "Calculado después",
  "checkout.standard": "Envío estándar",
  "checkout.standard_desc": "5-7 días hábiles",
  "checkout.express": "Envío exprés",
  "checkout.express_desc": "2-3 días hábiles",
  "checkout.order_confirmed": "Pedido confirmado",
  "checkout.thank_you": "¡Gracias por tu compra! Recibirás un correo de confirmación pronto.",
  "checkout.continue_shopping": "Seguir comprando",
  "checkout.empty_cart": "Tu carrito está vacío",
  "checkout.back": "Volver",

  "account.sign_in": "Iniciar sesión",
  "account.create_account": "Crear cuenta",
  "account.profile": "Perfil",
  "account.orders": "Pedidos",
  "account.addresses": "Direcciones",
  "account.sign_out": "Cerrar sesión",
  "account.save": "Guardar cambios",
  "account.no_account": "¿No tienes cuenta?",
  "account.has_account": "¿Ya tienes cuenta?",
  "account.create_one": "Crear una",

  "story.title": "Nuestra historia",
  "story.h1": "Donde la herencia se encuentra con la calle",
  "story.p1": "IYUC nació de una convicción simple: la cultura amazigh — una de las civilizaciones vivas más antiguas del norte de África — merece un lugar en la moda mundial contemporánea.",
  "story.p2": "Nos inspiramos en siglos de arte amazigh — motivos geométricos, pigmentos naturales, el ritmo de los textiles tejidos — y los traducimos en streetwear contemporáneo.",
  "story.p3": "Cada pieza cuenta una historia. Un bordado tonal del Yaz (ⵣ), el símbolo universal amazigh de libertad.",
  "story.p4": "Creemos que la moda debe unir mundos, no construir muros. IYUC es para todos.",
  "story.values_title": "Nuestros valores",
  "story.v1_title": "Herencia hacia adelante",
  "story.v1_desc": "Honramos la tradición haciéndola vivir en el presente.",
  "story.v2_title": "Para todos",
  "story.v2_desc": "Sin barreras. Nuestra ropa es para todos los que se conectan con la historia.",
  "story.v3_title": "Mínimo e intencional",
  "story.v3_desc": "Sin excesos. Cada puntada, cada detalle, cada palabra está elegida con cuidado.",
  "story.amazigh_note": "Los amazigh (ⴰⵎⴰⵣⵉⵖ) — que significa «pueblo libre» — son los habitantes indígenas del norte de África.",

  "lookbook.title": "Lookbook",
  "lookbook.subtitle": "Temporada Uno — Raíces",
  "lookbook.desc": "Un viaje visual por el universo IYUC.",

  "faq.title": "FAQ",
  "faq.subtitle": "Preguntas frecuentes sobre IYUC, nuestros productos y envíos.",
  "faq.q1": "¿Qué es IYUC?",
  "faq.a1": "IYUC es una marca de streetwear minimalista enraizada en la herencia amazigh.",
  "faq.q2": "¿Qué significa «Amazigh»?",
  "faq.a2": "Amazigh significa «pueblo libre» en tamazight.",
  "faq.q3": "¿Qué significa el símbolo ⵣ?",
  "faq.a3": "El ⵣ (Yaz) es el símbolo universal de la identidad amazigh y la libertad.",
  "faq.q4": "¿Cómo funcionan las preventas?",
  "faq.a4": "Los artículos en preventa están claramente etiquetados con su fecha de envío estimada.",
  "faq.q5": "¿Qué tallas ofrecen?",
  "faq.a5": "Ofrecemos tallas de S a XL para adultos, y de 4Y a 12Y para niños.",
  "faq.q6": "¿Envían internacionalmente?",
  "faq.a6": "¡Sí! Enviamos a todo el mundo desde Canadá.",
  "faq.q7": "¿Cuál es su política de devoluciones?",
  "faq.a7": "Ofrecemos devoluciones gratuitas dentro de los 30 días posteriores a la entrega.",
  "faq.q8": "¿Cómo puedo contactarles?",
  "faq.a8": "Escríbanos a hello@iyuc.com o use nuestra página de Contacto.",

  "privacy.title": "Política de privacidad",
  "privacy.intro": "En IYUC, respetamos su privacidad y nos comprometemos a proteger su información personal.",
  "privacy.s1_title": "Información recopilada",
  "privacy.s1_text": "Recopilamos la información que proporciona directamente — nombre, correo, dirección y detalles de pago.",
  "privacy.s2_title": "Uso de la información",
  "privacy.s2_text": "Su información se usa para procesar pedidos y mejorar nuestros productos. Nunca vendemos sus datos.",
  "privacy.s3_title": "Cookies",
  "privacy.s3_text": "Usamos cookies esenciales y analíticas.",
  "privacy.s4_title": "Seguridad",
  "privacy.s4_text": "Usamos cifrado estándar de la industria para proteger sus datos.",
  "privacy.s5_title": "Sus derechos",
  "privacy.s5_text": "Tiene derecho a acceder, corregir o eliminar sus datos. Contacte privacy@iyuc.com.",
  "privacy.s6_title": "Contacto",
  "privacy.s6_text": "Para consultas de privacidad, escriba a privacy@iyuc.com.",

  "returns.title": "Política de devoluciones",
  "returns.intro": "Queremos que ames lo que vistes. Si algo no está bien, estamos aquí para ayudar.",
  "returns.s1_title": "Devoluciones en 30 días",
  "returns.s1_text": "Devuelva cualquier artículo sin usar dentro de los 30 días para un reembolso completo.",
  "returns.s2_title": "Artículos en preventa",
  "returns.s2_text": "Los artículos en preventa son elegibles para devolución dentro de los 30 días de la entrega real.",
  "returns.s3_title": "Cómo devolver",
  "returns.s3_text": "Envíe un correo a returns@iyuc.com con su número de pedido.",
  "returns.s4_title": "Cambios",
  "returns.s4_text": "¿Necesita otra talla o color? Contáctenos para un cambio.",
  "returns.s5_title": "Excepciones",
  "returns.s5_text": "Los artículos en venta final y las tarjetas de regalo no son elegibles.",

  "contact.title": "Contáctenos",
  "contact.subtitle": "¿Tiene una pregunta o simplemente quiere saludar? Nos encantaría saber de usted.",
  "contact.name": "Nombre",
  "contact.email": "Correo",
  "contact.subject": "Asunto",
  "contact.message": "Mensaje",
  "contact.send": "Enviar mensaje",
  "contact.sent": "¡Mensaje enviado! Le responderemos en 24 horas.",
  "contact.info_title": "Otras formas de contactarnos",
  "contact.email_label": "Correo",
  "contact.email_value": "hello@iyuc.com",
  "contact.hours_label": "Horario",
  "contact.hours_value": "Lun–Vie, 9am–6pm EST",
  "contact.location_label": "Ubicación",
  "contact.location_value": "Montreal, QC, Canadá",
};

// Taqbaylit (Kabyle) — using French as placeholder per user request
const taq: Translations = { ...fr };
// Override a few keys to show Taqbaylit flavor
Object.assign(taq, {
  "hero.subtitle": "Streetwear s yiman amaziɣ",
  "hero.title_1": "Ales tamacahut.",
  "hero.title_2": "Deg yal amḍiq.",
  "footer.tagline": "Ales tamacahut. Deg yal amḍiq.",
  "nav.our_story": "Tamacahut-nneɣ",
});

const translations: Record<Locale, Translations> = { en, fr, es, taq };

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_KEY = "iyuc_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    return stored && translations[stored] ? stored : "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale]?.[key] || translations.en[key] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
