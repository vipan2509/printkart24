import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PRINTKART24 database seed...');

  // Clean existing data in reverse dependency order
  await prisma.adminActivity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.savedDesign.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bulkQuote.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productOptionValue.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCustomization.deleteMany();
  await prisma.customizationTemplate.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@printkart24.com',
      passwordHash,
      firstName: 'Vikram',
      lastName: 'Sharma',
      phone: '+91 98765 43210',
      role: 'SUPER_ADMIN',
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      email: 'customer@printkart24.com',
      passwordHash: customerPasswordHash,
      firstName: 'Aarav',
      lastName: 'Mehta',
      phone: '+91 98111 22334',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            fullName: 'Aarav Mehta',
            phone: '+91 98111 22334',
            addressLine1: 'Plot 42, Cyber City, Phase 2',
            addressLine2: 'DLF Sector 25',
            city: 'Gurugram',
            state: 'Haryana',
            postalCode: '122002',
            country: 'India',
            type: 'SHIPPING',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('👤 Created Super Admin and Demo Customer.');

  // 2. Seed 20+ Categories (Parent and Nested Children)
  const parentCategoriesData = [
    {
      name: 'Business Printing',
      slug: 'business-printing',
      description: 'Essential corporate stationery, cards, brochures, and marketing collateral.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
      sortOrder: 1,
      children: [
        { name: 'Business Cards', slug: 'business-cards', description: 'Standard, Matte, Gloss, Spot UV & Gold Foil visiting cards.' },
        { name: 'Letterheads', slug: 'letterheads', description: 'Executive watermark and bond letterheads.' },
        { name: 'Envelopes', slug: 'envelopes', description: 'Custom branded security and mailing envelopes.' },
        { name: 'Brochures & Flyers', slug: 'brochures-flyers', description: 'Bi-fold, tri-fold, and gloss promotional flyers.' },
        { name: 'Stickers & Labels', slug: 'stickers-labels', description: 'Die-cut vinyl, waterproof, and paper product labels.' },
        { name: 'ID Cards & Lanyards', slug: 'id-cards', description: 'PVC employee identity cards and sublimated lanyards.' },
        { name: 'Office Stationery', slug: 'office-stationery', description: 'Custom bill books, folders, certificates, and registers.' },
        { name: 'Signage & Posters', slug: 'signage-posters', description: 'Foam boards, roll-up standees, and vinyl banners.' },
      ],
    },
    {
      name: 'Corporate Gifts',
      slug: 'corporate-gifts',
      description: 'Premium branded executive gifts, welcome kits, and luxury corporate hampers.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      sortOrder: 2,
      children: [
        { name: 'Corporate Diaries', slug: 'corporate-diaries', description: 'Hardbound executive organizers and vegan leather notebooks.' },
        { name: 'Corporate Gift Sets', slug: 'corporate-gift-sets', description: 'Curated hampers with bottle, diary, pen & keychain in gift box.' },
        { name: 'Executive Pens', slug: 'executive-pens', description: 'Metal engraved pens in magnetic gift presentation cases.' },
        { name: 'Welcome Kits', slug: 'welcome-kits', description: 'Complete employee onboarding starter boxes.' },
        { name: 'Tech Gifts', slug: 'tech-gifts', description: 'Custom powerbanks, wireless chargers, and USB hubs.' },
      ],
    },
    {
      name: 'Packaging Solutions',
      slug: 'packaging',
      description: 'Custom retail, food-grade, and e-commerce shipping boxes and packaging.',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=1200&auto=format&fit=crop&q=80',
      sortOrder: 3,
      children: [
        { name: 'Packaging Boxes', slug: 'packaging-boxes', description: 'Rigid magnetic boxes, mailer boxes, and corrugated cartons.' },
        { name: 'Paper Bags', slug: 'paper-bags', description: 'Kraft paper luxury shopping bags with rope handles.' },
        { name: 'Coffee & Paper Cups', slug: 'paper-cups', description: 'Insulated double-wall disposable coffee and beverage cups.' },
        { name: 'Pouches & Sleeves', slug: 'pouches', description: 'Stand-up zipper pouches and food safe poly wrappers.' },
      ],
    },
    {
      name: 'Promotional Products',
      slug: 'promotional-products',
      description: 'High-impact trade show merchandise, branded swag, and event giveaways.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80',
      sortOrder: 4,
      children: [
        { name: 'Custom T-Shirts', slug: 't-shirts', description: '100% combed cotton screen printed and embroidered polo t-shirts.' },
        { name: 'Custom Bottles', slug: 'bottles', description: 'Stainless steel vacuum flasks and temperature display bottles.' },
        { name: 'Mouse Pads', slug: 'mouse-pads', description: 'Extended gaming and non-slip rubber base desktop mats.' },
        { name: 'Custom Keychains', slug: 'keychains', description: 'Metal, leather, and acrylic engraved key holders.' },
      ],
    },
    {
      name: 'Personalized Products',
      slug: 'personalized-products',
      description: 'Individual custom gifts, photo prints, customized homeware, and memories.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80',
      sortOrder: 5,
      children: [
        { name: 'Photo Mugs', slug: 'mugs', description: 'Ceramic coffee mugs, magic color changing mugs, and tumblers.' },
        { name: 'Photo Frames & Canvases', slug: 'photo-frames', description: 'Museum-grade stretched canvas prints and wooden frames.' },
        { name: 'Personalized Cushions', slug: 'cushions', description: 'Sequins, velvet, and satin photo printed decorative pillows.' },
      ],
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const parent of parentCategoriesData) {
    const createdParent = await prisma.category.create({
      data: {
        name: parent.name,
        slug: parent.slug,
        description: parent.description,
        image: parent.image,
        bannerImage: parent.bannerImage,
        sortOrder: parent.sortOrder,
      },
    });
    categoryMap.set(parent.slug, createdParent.id);

    for (const child of parent.children) {
      const createdChild = await prisma.category.create({
        data: {
          name: child.name,
          slug: child.slug,
          description: child.description,
          parentId: createdParent.id,
          sortOrder: 0,
        },
      });
      categoryMap.set(child.slug, createdChild.id);
    }
  }

  console.log(`📁 Seeded ${categoryMap.size} categories.`);

  // 3. Seed 35+ Rich Products with Vistaprint-Style Options and Pricing
  const productsData = [
    // --- BUSINESS PRINTING ---
    {
      name: 'Standard Premium Business Cards',
      slug: 'premium-business-cards',
      sku: 'PK-BC-001',
      categorySlug: 'business-cards',
      basePrice: 399,
      salePrice: 299,
      description: 'Make an unforgettable first impression with our premium 350gsm business cards. Available in luxurious matte, glossy, or soft-touch finishes with crisp offset printing precision.',
      shortDescription: '350gsm high-grade cardstock with dual-side HD printing.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 342,
      minQuantity: 100,
      images: [
        { url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Business cards stack matte' },
        { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80', isPrimary: false, altText: 'Business cards angled view' },
      ],
      options: [
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '100 Cards', value: '100', priceModifier: 0, isDefault: true },
            { label: '250 Cards', value: '250', priceModifier: 249 },
            { label: '500 Cards', value: '500', priceModifier: 499 },
            { label: '1,000 Cards (Best Value)', value: '1000', priceModifier: 899 },
            { label: '2,500 Cards', value: '2500', priceModifier: 1899 },
          ],
        },
        {
          name: 'Paper Stock',
          type: 'SELECT',
          values: [
            { label: 'Standard 300 GSM', value: 'standard_300', priceModifier: 0, isDefault: true },
            { label: 'Premium Heavyweight 350 GSM', value: 'premium_350', priceModifier: 75 },
            { label: 'Ultra Luxury Cotton 400 GSM', value: 'cotton_400', priceModifier: 199 },
          ],
        },
        {
          name: 'Finish',
          type: 'SELECT',
          values: [
            { label: 'Velvet Matte Finish', value: 'matte', priceModifier: 0, isDefault: true },
            { label: 'High Gloss UV Finish', value: 'gloss', priceModifier: 50 },
            { label: 'Raised Spot UV', value: 'spot_uv', priceModifier: 250 },
            { label: 'Metallic Gold Foil Accents', value: 'gold_foil', priceModifier: 450 },
          ],
        },
        {
          name: 'Corner Style',
          type: 'SELECT',
          values: [
            { label: 'Standard Square Corners', value: 'square', priceModifier: 0, isDefault: true },
            { label: 'Rounded Corners (6mm radius)', value: 'rounded', priceModifier: 60 },
          ],
        },
      ],
      customizationMockup: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Executive Corporate Letterheads',
      slug: 'corporate-letterheads',
      sku: 'PK-LH-002',
      categorySlug: 'letterheads',
      basePrice: 699,
      salePrice: 599,
      description: 'Official corporate letterhead printed on 100gsm premium executive bond paper. Laser and inkjet compatible for all daily corporate communications and contracts.',
      shortDescription: '100gsm sunshine bond paper with ultra-crisp color consistency.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 118,
      minQuantity: 100,
      images: [
        { url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Corporate letterhead layout' },
      ],
      options: [
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '100 Sheets', value: '100', priceModifier: 0, isDefault: true },
            { label: '250 Sheets', value: '250', priceModifier: 399 },
            { label: '500 Sheets', value: '500', priceModifier: 749 },
            { label: '1,000 Sheets', value: '1000', priceModifier: 1299 },
          ],
        },
        {
          name: 'Paper Type',
          type: 'SELECT',
          values: [
            { label: '100 GSM Executive Bond', value: 'bond_100', priceModifier: 0, isDefault: true },
            { label: '120 GSM Royal Textured Paper', value: 'textured_120', priceModifier: 150 },
          ],
        },
      ],
    },
    {
      name: 'Custom Branded Mailing Envelopes',
      slug: 'custom-branded-envelopes',
      sku: 'PK-ENV-003',
      categorySlug: 'envelopes',
      basePrice: 549,
      salePrice: 479,
      description: 'Peel and seal branded envelopes tailored for corporate invoices, checks, and formal letters. Available in standard 9.5"x4.25" and A4 document sizes.',
      shortDescription: 'High opacity 100gsm paper with self-adhesive peel & seal.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 65,
      minQuantity: 100,
      images: [
        { url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Branded envelopes stack' },
      ],
      options: [
        {
          name: 'Size',
          type: 'SELECT',
          values: [
            { label: 'Standard Letter (9.5" x 4.25")', value: 'standard_9_4', priceModifier: 0, isDefault: true },
            { label: 'A4 Document Size (12.5" x 9")', value: 'a4_document', priceModifier: 300 },
          ],
        },
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '100 Envelopes', value: '100', priceModifier: 0, isDefault: true },
            { label: '250 Envelopes', value: '250', priceModifier: 320 },
            { label: '500 Envelopes', value: '500', priceModifier: 599 },
          ],
        },
      ],
    },
    {
      name: 'Bi-Fold Marketing Brochures',
      slug: 'bi-fold-marketing-brochures',
      sku: 'PK-BR-004',
      categorySlug: 'brochures-flyers',
      basePrice: 899,
      salePrice: 799,
      description: 'High-impact 4-panel folded brochures on 170gsm glossy art paper. Vivid multi-color printing ideal for real estate, product catalogs, and corporate portfolios.',
      shortDescription: '170gsm gloss art paper with precision machine creasing.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 94,
      minQuantity: 100,
      images: [
        { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Bi-fold brochures spread' },
      ],
      options: [
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '100 Brochures', value: '100', priceModifier: 0, isDefault: true },
            { label: '250 Brochures', value: '250', priceModifier: 650 },
            { label: '500 Brochures', value: '500', priceModifier: 1199 },
            { label: '1,000 Brochures', value: '1000', priceModifier: 1999 },
          ],
        },
        {
          name: 'Folding Format',
          type: 'SELECT',
          values: [
            { label: 'Bi-Fold (4 Panels)', value: 'bifold', priceModifier: 0, isDefault: true },
            { label: 'Tri-Fold (6 Panels)', value: 'trifold', priceModifier: 100 },
          ],
        },
      ],
    },
    {
      name: 'Custom Die-Cut Vinyl Stickers',
      slug: 'die-cut-vinyl-stickers',
      sku: 'PK-STK-005',
      categorySlug: 'stickers-labels',
      basePrice: 449,
      salePrice: 349,
      description: 'Weatherproof, UV-resistant, scratch-proof vinyl stickers cut precisely to your logo shape. Perfect for laptops, bottles, product packaging, and swag handouts.',
      shortDescription: 'Thick durable vinyl protects against scratches, water & sunlight.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 5.0,
      reviewCount: 521,
      minQuantity: 50,
      images: [
        { url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Die-cut vinyl stickers' },
      ],
      options: [
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '50 Stickers', value: '50', priceModifier: 0, isDefault: true },
            { label: '100 Stickers', value: '100', priceModifier: 180 },
            { label: '250 Stickers', value: '250', priceModifier: 380 },
            { label: '500 Stickers', value: '500', priceModifier: 650 },
            { label: '1,000 Stickers', value: '1000', priceModifier: 1100 },
          ],
        },
        {
          name: 'Finish',
          type: 'SELECT',
          values: [
            { label: 'Gloss Vinyl', value: 'gloss', priceModifier: 0, isDefault: true },
            { label: 'Matte Vinyl', value: 'matte', priceModifier: 30 },
            { label: 'Holographic Rainbow Sheen', value: 'holographic', priceModifier: 120 },
            { label: 'Transparent Clear Vinyl', value: 'clear', priceModifier: 80 },
          ],
        },
      ],
    },
    {
      name: 'Custom PVC Employee ID Cards with Lanyard',
      slug: 'pvc-employee-id-cards',
      sku: 'PK-ID-006',
      categorySlug: 'id-cards',
      basePrice: 199,
      salePrice: 149,
      description: 'Standard credit card size PVC cards with dual-sided thermal sublimation printing. Includes custom satin lanyard with company logo printing and metal lobster hook.',
      shortDescription: 'CR80 standard credit card thickness with vibrant satin lanyard.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 42,
      minQuantity: 10,
      images: [
        { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Employee ID card and lanyard' },
      ],
      options: [
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '10 Sets', value: '10', priceModifier: 0, isDefault: true },
            { label: '25 Sets', value: '25', priceModifier: 180 },
            { label: '50 Sets', value: '50', priceModifier: 320 },
            { label: '100 Sets', value: '100', priceModifier: 550 },
          ],
        },
      ],
    },
    {
      name: 'Roll-Up Aluminum Banner Standee',
      slug: 'rollup-banner-standee',
      sku: 'PK-SGN-007',
      categorySlug: 'signage-posters',
      basePrice: 1499,
      salePrice: 1299,
      description: 'Heavy duty retractable aluminum standee with 280gsm tear-resistant non-curl vinyl banner. Includes durable oxford carry bag for convenient event travel.',
      shortDescription: '6ft x 2.5ft retractable aluminum base with non-curl vinyl.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 78,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Roll up banner standee' },
      ],
      options: [
        {
          name: 'Standee Size',
          type: 'SELECT',
          values: [
            { label: 'Standard (6 ft x 2.5 ft)', value: 'standard_6_25', priceModifier: 0, isDefault: true },
            { label: 'Wide (6 ft x 3 ft)', value: 'wide_6_3', priceModifier: 300 },
          ],
        },
      ],
    },

    // --- CORPORATE GIFTS ---
    {
      name: 'Vegan Leather Executive Corporate Diary',
      slug: 'executive-corporate-diary',
      sku: 'PK-DIR-008',
      categorySlug: 'corporate-diaries',
      basePrice: 599,
      salePrice: 499,
      description: 'Refined A5 corporate diary bound in dual-tone vegan PU leather. Includes ribbon bookmark, elastic closure band, document sleeve, and blind debossed or gold foil logo.',
      shortDescription: '192 ruled natural shade pages, 80gsm paper with pen loop.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 215,
      minQuantity: 10,
      images: [
        { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Leather corporate diary' },
      ],
      options: [
        {
          name: 'Color',
          type: 'COLOR',
          values: [
            { label: 'Navy Blue', value: 'navy', priceModifier: 0, isDefault: true },
            { label: 'Charcoal Black', value: 'black', priceModifier: 0 },
            { label: 'Cognac Brown', value: 'brown', priceModifier: 0 },
            { label: 'Olive Green', value: 'olive', priceModifier: 0 },
          ],
        },
        {
          name: 'Branding Method',
          type: 'SELECT',
          values: [
            { label: 'Blind Emboss Debossing', value: 'deboss', priceModifier: 0, isDefault: true },
            { label: 'Metallic Gold Foil Stamping', value: 'gold_foil', priceModifier: 50 },
            { label: 'Full Color UV Direct Print', value: 'uv_print', priceModifier: 75 },
          ],
        },
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '10 Diaries', value: '10', priceModifier: 0, isDefault: true },
            { label: '25 Diaries', value: '25', priceModifier: 600 },
            { label: '50 Diaries', value: '50', priceModifier: 1100 },
            { label: '100 Diaries', value: '100', priceModifier: 2000 },
          ],
        },
      ],
    },
    {
      name: 'Luxury 4-in-1 Corporate Gift Hamper',
      slug: 'luxury-corporate-gift-set',
      sku: 'PK-GFT-009',
      categorySlug: 'corporate-gift-sets',
      basePrice: 1699,
      salePrice: 1449,
      description: 'Premium curated gift box packed in a magnetic hardboard box with custom foam inserts. Contains a custom vacuum flask, executive diary, metal rollerball pen, and leather keychain.',
      shortDescription: 'Complete 4-piece coordinated executive corporate gift set.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 5.0,
      reviewCount: 184,
      minQuantity: 5,
      images: [
        { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Corporate gift box set' },
      ],
      options: [
        {
          name: 'Color Theme',
          type: 'SELECT',
          values: [
            { label: 'Royal Midnight Blue', value: 'blue', priceModifier: 0, isDefault: true },
            { label: 'Matte Jet Black & Gold', value: 'black_gold', priceModifier: 50 },
            { label: 'Steel Grey', value: 'grey', priceModifier: 0 },
          ],
        },
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '5 Sets', value: '5', priceModifier: 0, isDefault: true },
            { label: '10 Sets', value: '10', priceModifier: 650 },
            { label: '25 Sets', value: '25', priceModifier: 1550 },
            { label: '50 Sets', value: '50', priceModifier: 2900 },
          ],
        },
      ],
    },
    {
      name: 'Metal Matte Engraved Rollerball Pen',
      slug: 'metal-engraved-rollerball-pen',
      sku: 'PK-PEN-010',
      categorySlug: 'executive-pens',
      basePrice: 299,
      salePrice: 249,
      description: 'Solid brass body executive rollerball pen with smooth German ink cartridge and precision laser engraved personalization. Packaged in a cushioned magnetic case.',
      shortDescription: 'Solid brass with high-precision fiber laser name/logo engraving.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 96,
      minQuantity: 5,
      images: [
        { url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Executive engraved pen' },
      ],
      options: [
        {
          name: 'Pen Body Color',
          type: 'COLOR',
          values: [
            { label: 'Matte Black with Gold Trims', value: 'black_gold', priceModifier: 0, isDefault: true },
            { label: 'Silver Chrome', value: 'silver', priceModifier: 0 },
            { label: 'Navy Blue & Rose Gold', value: 'navy_rose', priceModifier: 20 },
          ],
        },
      ],
    },
    {
      name: 'New Hire Employee Welcome Kit',
      slug: 'new-hire-welcome-kit',
      sku: 'PK-WEL-011',
      categorySlug: 'welcome-kits',
      basePrice: 2299,
      salePrice: 1999,
      description: 'Inspire and delight your new hires from day one. Includes custom cotton polo t-shirt, temperature smart water bottle, branded notebook, aluminum pen, and welcome card.',
      shortDescription: 'Complete onboarding welcome kit in a personalized corporate box.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 88,
      minQuantity: 5,
      images: [
        { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Onboarding welcome kit' },
      ],
      options: [
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '5 Kits', value: '5', priceModifier: 0, isDefault: true },
            { label: '10 Kits', value: '10', priceModifier: 900 },
            { label: '25 Kits', value: '25', priceModifier: 2150 },
            { label: '50 Kits', value: '50', priceModifier: 4000 },
          ],
        },
      ],
    },

    // --- PACKAGING SOLUTIONS ---
    {
      name: 'Custom Printed Rigid Magnetic Gift Box',
      slug: 'rigid-magnetic-gift-box',
      sku: 'PK-BOX-012',
      categorySlug: 'packaging-boxes',
      basePrice: 349,
      salePrice: 299,
      description: '1200gsm heavy kappa board luxury boxes with magnetic snap closure. Finished with anti-scratch matte lamination and custom spot foil stamping for luxury unboxing.',
      shortDescription: '1200gsm rigid kappa board with concealed magnetic flap.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 142,
      minQuantity: 50,
      images: [
        { url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Rigid luxury magnetic box' },
      ],
      options: [
        {
          name: 'Box Dimensions',
          type: 'SELECT',
          values: [
            { label: 'Medium (8" x 6" x 3")', value: 'med_8_6_3', priceModifier: 0, isDefault: true },
            { label: 'Large (10" x 8" x 4")', value: 'lg_10_8_4', priceModifier: 90 },
            { label: 'Extra Large (12" x 10" x 4.5")', value: 'xl_12_10_45', priceModifier: 180 },
          ],
        },
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '50 Boxes', value: '50', priceModifier: 0, isDefault: true },
            { label: '100 Boxes', value: '100', priceModifier: 350 },
            { label: '250 Boxes', value: '250', priceModifier: 800 },
            { label: '500 Boxes', value: '500', priceModifier: 1500 },
          ],
        },
      ],
    },
    {
      name: 'Eco-Friendly Kraft Luxury Paper Bags',
      slug: 'kraft-luxury-paper-bags',
      sku: 'PK-BAG-013',
      categorySlug: 'paper-bags',
      basePrice: 299,
      salePrice: 249,
      description: 'Recyclable 250gsm virgin kraft paper shopping bags with reinforced bottom card and premium twisted cotton rope handles. Printed with plant-based soy inks.',
      shortDescription: '250gsm virgin kraft paper with cotton rope handles.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 210,
      minQuantity: 100,
      images: [
        { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Eco kraft paper bag' },
      ],
      options: [
        {
          name: 'Size',
          type: 'SELECT',
          values: [
            { label: 'Small (8" x 10" x 3.5")', value: 'small', priceModifier: 0, isDefault: true },
            { label: 'Medium (10" x 12" x 4")', value: 'medium', priceModifier: 50 },
            { label: 'Large (13" x 16" x 5")', value: 'large', priceModifier: 110 },
          ],
        },
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '100 Bags', value: '100', priceModifier: 0, isDefault: true },
            { label: '250 Bags', value: '250', priceModifier: 290 },
            { label: '500 Bags', value: '500', priceModifier: 550 },
            { label: '1,000 Bags', value: '1000', priceModifier: 990 },
          ],
        },
      ],
    },
    {
      name: 'Custom Double-Wall Insulated Coffee Cups',
      slug: 'insulated-coffee-paper-cups',
      sku: 'PK-CUP-014',
      categorySlug: 'paper-cups',
      basePrice: 699,
      salePrice: 599,
      description: 'Keep beverages hot and fingers cool with heat-insulating double wall corrugated paper cups. Certified food-safe, leakproof, and biodegradable interior lining.',
      shortDescription: 'Double-wall heat insulation, PLA biodegradable lining.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 53,
      minQuantity: 250,
      images: [
        { url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Custom branded coffee cup' },
      ],
      options: [
        {
          name: 'Capacity',
          type: 'SELECT',
          values: [
            { label: '250 ml (8 oz)', value: '8oz', priceModifier: 0, isDefault: true },
            { label: '350 ml (12 oz)', value: '12oz', priceModifier: 120 },
          ],
        },
        {
          name: 'Quantity',
          type: 'QUANTITY_TIER',
          values: [
            { label: '250 Cups', value: '250', priceModifier: 0, isDefault: true },
            { label: '500 Cups', value: '500', priceModifier: 480 },
            { label: '1,000 Cups', value: '1000', priceModifier: 890 },
          ],
        },
      ],
    },

    // --- PROMOTIONAL PRODUCTS ---
    {
      name: 'Custom Branded Premium Cotton Polo T-Shirt',
      slug: 'custom-cotton-polo-tshirt',
      sku: 'PK-TSH-015',
      categorySlug: 't-shirts',
      basePrice: 599,
      salePrice: 499,
      description: '220gsm bio-washed 100% combed cotton pique polo t-shirt with knitted ribbed collar and cuffs. High-density embroidery or sharp digital direct-to-garment (DTG) print.',
      shortDescription: '220gsm heavy pique bio-washed cotton polo.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 412,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Polo t-shirt front view' },
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80', isPrimary: false, altText: 'Polo t-shirt fabric texture' },
      ],
      options: [
        {
          name: 'Size',
          type: 'SELECT',
          values: [
            { label: 'S (38")', value: 'S', priceModifier: 0 },
            { label: 'M (40")', value: 'M', priceModifier: 0, isDefault: true },
            { label: 'L (42")', value: 'L', priceModifier: 0 },
            { label: 'XL (44")', value: 'XL', priceModifier: 30 },
            { label: 'XXL (46")', value: 'XXL', priceModifier: 50 },
          ],
        },
        {
          name: 'Color',
          type: 'COLOR',
          values: [
            { label: 'Royal Navy Blue', value: 'navy', priceModifier: 0, isDefault: true },
            { label: 'Solid Jet Black', value: 'black', priceModifier: 0 },
            { label: 'Crisp White', value: 'white', priceModifier: 0 },
            { label: 'Deep Maroon', value: 'maroon', priceModifier: 0 },
            { label: 'Heather Grey', value: 'grey', priceModifier: 0 },
          ],
        },
        {
          name: 'Print Location',
          type: 'SELECT',
          values: [
            { label: 'Front Chest Logo Only', value: 'front_only', priceModifier: 0, isDefault: true },
            { label: 'Back Full Print Only', value: 'back_only', priceModifier: 60 },
            { label: 'Front Chest + Back Print', value: 'front_and_back', priceModifier: 120 },
          ],
        },
      ],
      customizationMockup: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Smart Temperature LED Stainless Steel Bottle',
      slug: 'smart-temperature-stainless-bottle',
      sku: 'PK-BOT-016',
      categorySlug: 'bottles',
      basePrice: 699,
      salePrice: 549,
      description: '500ml double-wall vacuum insulated 304 stainless steel thermos. Touch the LED cap to see real-time liquid temperature. Keeps drinks icy cold for 24h or steaming hot for 12h.',
      shortDescription: 'Touch screen LED temperature cap, 304 food-grade stainless steel.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 326,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Temperature display stainless bottle' },
      ],
      options: [
        {
          name: 'Color',
          type: 'COLOR',
          values: [
            { label: 'Matte Stealth Black', value: 'black', priceModifier: 0, isDefault: true },
            { label: 'Brushed Silver Steel', value: 'silver', priceModifier: 0 },
            { label: 'Midnight Blue', value: 'blue', priceModifier: 0 },
            { label: 'Ruby Red', value: 'red', priceModifier: 0 },
          ],
        },
        {
          name: 'Personalization Style',
          type: 'SELECT',
          values: [
            { label: 'Laser Etched Silver Logo', value: 'laser', priceModifier: 0, isDefault: true },
            { label: 'Vibrant UV Color Print', value: 'uv_color', priceModifier: 60 },
          ],
        },
      ],
      customizationMockup: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Extended Anti-Slip Gaming & Office Desk Mat',
      slug: 'extended-anti-slip-desk-mat',
      sku: 'PK-MP-017',
      categorySlug: 'mouse-pads',
      basePrice: 499,
      salePrice: 399,
      description: 'Extra-large 800mm x 300mm ultra-smooth micro-weave cloth mat with stitched anti-fray edges and heavy natural rubber grip base. High-definition thermal dye-sublimation print.',
      shortDescription: '800x300mm micro-weave surface with stitched anti-fraying border.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 167,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Desk mouse pad mat' },
      ],
      options: [
        {
          name: 'Size',
          type: 'SELECT',
          values: [
            { label: 'Standard Mouse Pad (220mm x 180mm)', value: 'standard', priceModifier: -100 },
            { label: 'Extended Desk Mat (800mm x 300mm)', value: 'extended_800', priceModifier: 0, isDefault: true },
            { label: 'Mega Desk Mat (900mm x 400mm)', value: 'mega_900', priceModifier: 120 },
          ],
        },
      ],
    },
    {
      name: 'Heavy Metal & Leather Custom Keychain',
      slug: 'metal-leather-custom-keychain',
      sku: 'PK-KEY-018',
      categorySlug: 'keychains',
      basePrice: 249,
      salePrice: 199,
      description: 'Zinc alloy electroplated body fused with genuine leather strap. Custom fiber-laser engraved on both metal badge and leather band.',
      shortDescription: 'Heavyweight zinc alloy with stitched leather strap.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 79,
      minQuantity: 5,
      images: [
        { url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Custom metal keychain' },
      ],
      options: [
        {
          name: 'Metal Finish',
          type: 'SELECT',
          values: [
            { label: 'Gunmetal Smoke Grey', value: 'gunmetal', priceModifier: 0, isDefault: true },
            { label: 'Polished Silver Chrome', value: 'silver', priceModifier: 0 },
            { label: 'Matte Rose Gold', value: 'rose_gold', priceModifier: 20 },
          ],
        },
      ],
    },

    // --- PERSONALIZED PRODUCTS ---
    {
      name: 'Custom Personalized Ceramic Coffee Mug',
      slug: 'custom-ceramic-coffee-mug',
      sku: 'PK-MUG-019',
      categorySlug: 'mugs',
      basePrice: 299,
      salePrice: 229,
      description: 'Grade-A 330ml glossy ceramic mug microwave and dishwasher safe. 360-degree wrap-around full-color sublimation printing with vibrant, fade-resistant color fidelity.',
      shortDescription: '330ml high-gloss ceramic with 360-degree edge-to-edge printing.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 689,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Custom coffee mug mockup' },
        { url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80', isPrimary: false, altText: 'Ceramic mug lifestyle shot' },
      ],
      options: [
        {
          name: 'Mug Type',
          type: 'SELECT',
          values: [
            { label: 'Classic Pure White 330ml', value: 'white', priceModifier: 0, isDefault: true },
            { label: 'Two-Tone Inner Color Mug', value: 'inner_color', priceModifier: 40 },
            { label: 'Magic Heat Color Changing Mug', value: 'magic', priceModifier: 120 },
            { label: 'Frosted Beer Stein Mug', value: 'frosted', priceModifier: 150 },
          ],
        },
        {
          name: 'Inner Color Accent',
          type: 'COLOR',
          values: [
            { label: 'Solid White', value: 'white', priceModifier: 0, isDefault: true },
            { label: 'Royal Blue', value: 'blue', priceModifier: 0 },
            { label: 'Crimson Red', value: 'red', priceModifier: 0 },
            { label: 'Canary Yellow', value: 'yellow', priceModifier: 0 },
          ],
        },
      ],
      customizationMockup: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Museum Stretched Canvas Photo Print',
      slug: 'museum-stretched-canvas-print',
      sku: 'PK-CNV-020',
      categorySlug: 'photo-frames',
      basePrice: 899,
      salePrice: 699,
      description: 'Turn your favorite moments into gallery art. 380gsm archival-grade poly-cotton canvas hand-stretched over kiln-dried 1-inch solid pine wood stretcher bars with hanging hardware.',
      shortDescription: '380gsm archival poly-cotton canvas on solid pine wood frame.',
      isCustomizable: true,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 156,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Canvas wall art print' },
      ],
      options: [
        {
          name: 'Canvas Size',
          type: 'SELECT',
          values: [
            { label: 'Square (12" x 12")', value: '12x12', priceModifier: 0, isDefault: true },
            { label: 'Classic (16" x 20")', value: '16x20', priceModifier: 300 },
            { label: 'Statement Large (24" x 36")', value: '24x36', priceModifier: 750 },
          ],
        },
      ],
    },
    {
      name: 'Custom Personalized Satin Velvet Cushion',
      slug: 'personalized-satin-cushion',
      sku: 'PK-CSH-021',
      categorySlug: 'cushions',
      basePrice: 499,
      salePrice: 399,
      description: '16" x 16" luxury satin velvet cushion with concealed zipper and plush virgin microfiber filler. Vibrant edge-to-edge photo printing that stays soft wash after wash.',
      shortDescription: '16x16" satin velvet with concealed zipper and hypoallergenic filler.',
      isCustomizable: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 203,
      minQuantity: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', isPrimary: true, altText: 'Printed satin cushion' },
      ],
      options: [
        {
          name: 'Material Type',
          type: 'SELECT',
          values: [
            { label: 'Silky Gloss Satin', value: 'satin', priceModifier: 0, isDefault: true },
            { label: 'Plush Micro Velvet', value: 'velvet', priceModifier: 50 },
            { label: 'Reversible Magic Sequins', value: 'sequins', priceModifier: 120 },
          ],
        },
      ],
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        description: prod.description,
        shortDescription: prod.shortDescription,
        basePrice: prod.basePrice,
        salePrice: prod.salePrice,
        stock: 500,
        isCustomizable: prod.isCustomizable,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isNewArrival: prod.isNewArrival,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        minQuantity: prod.minQuantity,
        categoryId,
        images: {
          create: prod.images.map((img, idx) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            altText: img.altText,
            sortOrder: idx,
          })),
        },
        inventory: {
          create: {
            sku: prod.sku,
            currentStock: 450,
            reservedStock: 15,
            soldStock: 85,
            lowStockThreshold: 25,
          },
        },
      },
    });

    // Create Options and Values
    for (let oIdx = 0; oIdx < prod.options.length; oIdx++) {
      const opt = prod.options[oIdx];
      const createdOpt = await prisma.productOption.create({
        data: {
          productId: createdProduct.id,
          name: opt.name,
          type: opt.type,
          sortOrder: oIdx,
          isRequired: true,
        },
      });

      for (let vIdx = 0; vIdx < opt.values.length; vIdx++) {
        const val = opt.values[vIdx];
        await prisma.productOptionValue.create({
          data: {
            optionId: createdOpt.id,
            label: val.label,
            value: val.value,
            priceModifier: val.priceModifier,
            isDefault: val.isDefault || false,
            sortOrder: vIdx,
          },
        });
      }
    }

    // Create Customization Template if customizable
    if (prod.isCustomizable) {
      await prisma.productCustomization.create({
        data: {
          productId: createdProduct.id,
          sidesJson: JSON.stringify(['front', 'back']),
          defaultMockup: prod.customizationMockup || prod.images[0].url,
        },
      });

      await prisma.customizationTemplate.create({
        data: {
          productId: createdProduct.id,
          canvasWidth: 800,
          canvasHeight: 800,
          printableAreaJson: JSON.stringify({ x: 200, y: 150, width: 400, height: 450 }),
          sidesConfigJson: JSON.stringify({
            front: {
              mockupUrl: prod.customizationMockup || prod.images[0].url,
              printableArea: { x: 200, y: 150, width: 400, height: 450 },
            },
            back: {
              mockupUrl: prod.images[1]?.url || prod.images[0].url,
              printableArea: { x: 200, y: 150, width: 400, height: 450 },
            },
          }),
        },
      });
    }

    // Seed sample reviews for top products
    if (prod.isBestSeller || prod.isFeatured) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: demoCustomer.id,
          rating: 5,
          title: 'Exceptional print quality & fast shipping!',
          comment: `Ordered 500 units for our office launch. The color accuracy, paper weight, and texture exceeded expectations. Will definitely reorder with PRINTKART24!`,
          isVerifiedPurchase: true,
          isApproved: true,
        },
      });
    }
  }

  console.log('📦 Seeded 21+ high-fidelity products with full options, variants & customization templates.');

  // 4. Seed Coupons
  const couponsData = [
    {
      code: 'WELCOME10',
      description: 'Get 10% OFF on your first purchase over ₹499.',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 499,
      maxDiscount: 500,
    },
    {
      code: 'PRINTKART20',
      description: 'Special 20% discount on orders above ₹1,499.',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 1499,
      maxDiscount: 1000,
    },
    {
      code: 'BULK50',
      description: 'Flat ₹500 discount for corporate orders above ₹2,999.',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderAmount: 2999,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }
  console.log('🎟️ Seeded promotional coupons.');

  // 5. Seed Sample Orders with Custom Designs for the Demo Customer
  const firstProduct = await prisma.product.findFirst({
    where: { slug: 'premium-business-cards' },
    include: { images: true },
  });

  if (firstProduct) {
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: 'PK10234',
        userId: demoCustomer.id,
        customerName: 'Aarav Mehta',
        customerEmail: demoCustomer.email,
        customerPhone: '+91 98111 22334',
        shippingAddressJson: JSON.stringify({
          fullName: 'Aarav Mehta',
          phone: '+91 98111 22334',
          addressLine1: 'Plot 42, Cyber City, Phase 2',
          addressLine2: 'DLF Sector 25',
          city: 'Gurugram',
          state: 'Haryana',
          postalCode: '122002',
          country: 'India',
        }),
        subtotal: 1198,
        discount: 119.8,
        tax: 194.07,
        shippingFee: 0,
        totalAmount: 1272.27,
        paymentStatus: 'COMPLETED',
        paymentMethod: 'RAZORPAY',
        orderStatus: 'PRINTING',
        trackingNumber: 'BD982348123IN',
        trackingCarrier: 'BlueDart Air',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              productId: firstProduct.id,
              productName: firstProduct.name,
              productSku: firstProduct.sku,
              productImage: firstProduct.images[0]?.url,
              quantity: 500,
              unitPrice: 1.8,
              totalPrice: 899,
              configurationJson: JSON.stringify({
                Quantity: '500 Cards',
                'Paper Stock': 'Premium Heavyweight 350 GSM',
                Finish: 'Velvet Matte Finish',
                'Corner Style': 'Rounded Corners',
              }),
              customDesignJson: JSON.stringify({
                layers: [
                  { type: 'text', text: 'AARAV MEHTA', font: 'Outfit', size: 28, color: '#0B132B', x: 220, y: 260 },
                  { type: 'text', text: 'Chief Technology Officer | Nova Labs', font: 'Inter', size: 14, color: '#1E60D5', x: 220, y: 300 },
                ],
              }),
              customDesignPreviewUrl: firstProduct.images[0]?.url,
            },
          ],
        },
        payments: {
          create: {
            razorpayOrderId: 'order_PK10234_rzp',
            razorpayPaymentId: 'pay_PK10234_demo',
            razorpaySignature: 'sig_mock_verified',
            amount: 1272.27,
            status: 'COMPLETED',
            method: 'UPI',
          },
        },
      },
    });

    console.log(`📑 Seeded sample order ${sampleOrder.orderNumber} in PRINTING state.`);
  }

  // 6. Seed Sample Bulk Quotes
  await prisma.bulkQuote.createMany({
    data: [
      {
        quoteNumber: 'BQ-2026-001',
        name: 'Priya Nambiar',
        companyName: 'Zeta Financial Technologies',
        email: 'priya.nambiar@zetafin.com',
        phone: '+91 99887 76655',
        productCategory: 'Corporate Gifts',
        quantity: 250,
        requiredDate: '2026-10-15',
        message: 'Looking for 250 premium welcome kits for our Q4 engineering summit in Bangalore.',
        status: 'NEW',
        estimatedAmount: 375000,
      },
      {
        quoteNumber: 'BQ-2026-002',
        name: 'Rohan Kapoor',
        companyName: 'Urban Grind Cafe Chain',
        email: 'rohan@urbangrind.in',
        phone: '+91 97766 55443',
        productCategory: 'Packaging Solutions',
        quantity: 10000,
        requiredDate: '2026-10-01',
        message: 'Require 10,000 double-wall coffee cups with custom matte foil branding for 8 outlets.',
        status: 'QUOTED',
        estimatedAmount: 85000,
        adminNotes: 'Sent quote tier at ₹8.50 per cup with free freight.',
      },
    ],
  });

  console.log('💼 Seeded B2B bulk quotes.');
  console.log('✅ PRINTKART24 database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
