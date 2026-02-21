import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRefundReasonsWorkflow,
  createRegionsWorkflow,
  createReturnReasonsStep,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

const seedReturnReasonsWorkflow = createWorkflow(
  "seed-return-reasons",
  () => {
    const reasons = createReturnReasonsStep([
      { value: "wrong_size", label: "Wrong size" },
      { value: "changed_mind", label: "Changed mind" },
      { value: "damaged_defective", label: "Damaged or defective" },
      { value: "wrong_item", label: "Wrong item received" },
      { value: "not_as_described", label: "Not as described" },
      { value: "other", label: "Other" },
    ]);
    return new WorkflowResponse(reasons);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const regionModuleService = container.resolve(Modules.REGION);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const europeCountries = ["gb", "de", "dk", "se", "fr", "es", "it"];
  const allCountries = [...europeCountries, "ca"];

  try {
  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  const salesChannelName = "IYUC Store";
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: salesChannelName,
  });

  if (!defaultSalesChannel.length) {
    defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });
  }
  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: salesChannelName }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
        {
          currency_code: "cad",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  let region: { id: string };
  let regionCanada: { id: string } | null = null;
  try {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries: europeCountries,
            payment_providers: ["pp_system_default"],
          },
          {
            name: "North America",
            currency_code: "cad",
            countries: ["ca"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    regionCanada = regionResult[1] ?? null;
    logger.info("Finished seeding regions.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const full = typeof err === "object" && err !== null ? JSON.stringify(err) : msg;
    if (msg.includes("already assigned") || full.includes("already assigned")) {
      const existing = await regionModuleService.listRegions({});
      const list = Array.isArray(existing) ? existing : existing ? [existing] : [];
      const first = list[0];
      if (!first) throw new Error("No region found and create failed.");
      region = first;
      regionCanada = list[1] ?? null;
      logger.info("Regions already exist, using existing.");
    } else {
      throw err;
    }
  }

  logger.info("Seeding tax regions...");
  try {
    await createTaxRegionsWorkflow(container).run({
      input: allCountries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
    logger.info("Finished seeding tax regions.");
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : (typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : String(err));
    const full = typeof err === "object" && err !== null ? JSON.stringify(err) : msg;
    const isAlreadyExists = msg.includes("already exists") || full.includes("already exists") || full.includes("already assigned");
    if (!isAlreadyExists) throw err;
    logger.info("Tax regions already exist, skipping.");
  }

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "IYUC Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "IYUC Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: europeCountries.map((country_code) => ({
          country_code,
          type: "country" as const,
        })),
      },
      {
        name: "North America",
        geo_zones: [
          { country_code: "ca", type: "country" },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  const standardPrices = [
    { currency_code: "usd", amount: 10 },
    { currency_code: "eur", amount: 10 },
    { currency_code: "cad", amount: 12 },
    { region_id: region.id, amount: 10 },
  ];
  if (regionCanada) {
    standardPrices.push({ region_id: regionCanada.id, amount: 12 });
  }
  const expressPrices = [
    { currency_code: "usd", amount: 20 },
    { currency_code: "eur", amount: 20 },
    { currency_code: "cad", amount: 24 },
    { region_id: region.id, amount: 20 },
  ];
  if (regionCanada) {
    expressPrices.push({ region_id: regionCanada.id, amount: 24 });
  }

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: standardPrices,
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: expressPrices,
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      ...(fulfillmentSet.service_zones[1]
        ? [
            {
              name: "Standard Shipping (North America)",
              price_type: "flat",
              provider_id: "manual_manual",
              service_zone_id: fulfillmentSet.service_zones[1].id,
              shipping_profile_id: shippingProfile.id,
              type: {
                label: "Standard",
                description: "Ship in 3-5 days.",
                code: "standard",
              },
              prices: [
                { currency_code: "cad", amount: 12 },
                ...(regionCanada ? [{ region_id: regionCanada.id, amount: 12 }] : []),
              ],
              rules: [
                { attribute: "enabled_in_store", value: "true", operator: "eq" },
                { attribute: "is_return", value: "false", operator: "eq" },
              ],
            },
          ]
        : []),
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding return reasons...");
  try {
    await seedReturnReasonsWorkflow(container).run();
    logger.info("Finished seeding return reasons.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      logger.info("Return reasons already exist, skipping.");
    } else {
      throw err;
    }
  }

  logger.info("Seeding refund reasons...");
  try {
    await createRefundReasonsWorkflow(container).run({
      input: {
        data: [
          { label: "Damaged or defective", code: "damaged_defective" },
          { label: "Wrong item sent", code: "wrong_item" },
          { label: "Customer request", code: "customer_request" },
          { label: "Duplicate order", code: "duplicate" },
          { label: "Quality issue", code: "quality_issue" },
          { label: "Other", code: "other" },
        ],
      },
    });
    logger.info("Finished seeding refund reasons.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      logger.info("Refund reasons already exist, skipping.");
    } else {
      throw err;
    }
  }

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Tops", is_active: true },
        { name: "Bottoms", is_active: true },
        { name: "Statement", is_active: true },
        { name: "Footwear", is_active: true },
        { name: "Accessory", is_active: true },
      ],
    },
  });

  const topsId = categoryResult.find((c) => c.name === "Tops")!.id;
  const bottomsId = categoryResult.find((c) => c.name === "Bottoms")!.id;
  const statementId = categoryResult.find((c) => c.name === "Statement")!.id;
  const footwearId = categoryResult.find((c) => c.name === "Footwear")!.id;
  const accessoryId = categoryResult.find((c) => c.name === "Accessory")!.id;

  logger.info("Seeding product tags...");
  const tagValues = [
    "little-warriors",
    "collection-01",
    "kids",
    "streetwear",
    "amazigh",
    "limited-drop",
  ];
  const existingTags = (await productModuleService.listProductTags({})) as { id: string; value: string }[];
  const existingValues = new Set(existingTags?.map((t) => t.value) ?? []);
  const toCreate = tagValues.filter((v) => !existingValues.has(v));
  if (toCreate.length) {
    await productModuleService.createProductTags(toCreate.map((value) => ({ value })));
  }
  const allTagsRaw = await productModuleService.listProductTags({});
  const allTags = Array.isArray(allTagsRaw) ? allTagsRaw : (allTagsRaw as { data?: { id: string; value: string }[] })?.data ?? [];
  const productTagIds = (allTags as { id: string }[]).map((t) => t.id);
  logger.info("Finished seeding product tags.");

  logger.info("Seeding product types...");
  const productTypeValues = ["physical", "apparel"];
  const toProductTypeArray = (raw: unknown): { id: string; value: string }[] => {
    if (Array.isArray(raw)) return raw as { id: string; value: string }[];
    const o = raw as { data?: unknown[]; product_types?: unknown[] };
    return (o?.data ?? o?.product_types ?? []) as { id: string; value: string }[];
  };
  const existingTypesRaw = await productModuleService.listProductTypes({});
  const existingTypes = toProductTypeArray(existingTypesRaw);
  const existingTypeValues = new Set(existingTypes.map((t) => t.value));
  const typesToCreate = productTypeValues.filter((v) => !existingTypeValues.has(v));
  if (typesToCreate.length) {
    await productModuleService.createProductTypes(typesToCreate.map((value) => ({ value })));
  }
  const allTypesRaw = await productModuleService.listProductTypes({});
  const allTypes = toProductTypeArray(allTypesRaw);
  const physicalTypeId = allTypes.find((t) => t.value === "physical")?.id ?? null;
  logger.info("Finished seeding product types.");

  const variantPrices = (usd: number, eur: number, cad: number) => [
    { currency_code: "usd", amount: usd },
    { currency_code: "eur", amount: eur },
    { currency_code: "cad", amount: cad },
  ];

  const placeholderImage = (seed: string) => ({
    url: `https://picsum.photos/seed/${seed}/800/800`,
  });

  const sizes = ["S", "M", "L"];
  const teeSsColors = [
    { name: "Sand", code: "SND" },
    { name: "Clay Red", code: "CLY" },
    { name: "Midnight Black", code: "BLK" },
  ];
  const teeLsColors = [
    { name: "Sand", code: "SND" },
    { name: "Indigo", code: "IND" },
  ];
  const utilityColors = [
    { name: "Olive", code: "OLV" },
    { name: "Midnight Black", code: "BLK" },
  ];
  const sandBlackColors = [
    { name: "Sand", code: "SND" },
    { name: "Midnight Black", code: "BLK" },
  ];
  const indigoBlackColors = [
    { name: "Indigo", code: "IND" },
    { name: "Midnight Black", code: "BLK" },
  ];
  const sneakerColors = [
    { name: "Sand/Clay", code: "SNDCLY" },
    { name: "Black/Cream", code: "BLKCRM" },
  ];
  const beanieColors = [
    { name: "Midnight Black", code: "BLK" },
    { name: "Clay Red", code: "CLY" },
    { name: "Olive", code: "OLV" },
  ];

  const teeSsVariants = sizes.flatMap((size) =>
    teeSsColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-TP-ESS-SS-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(65, 60, 88),
    }))
  );
  const teeLsVariants = sizes.flatMap((size) =>
    teeLsColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-TP-ESS-LS-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(75, 70, 102),
    }))
  );
  const utilityVariants = sizes.flatMap((size) =>
    utilityColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-BT-UTL-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(95, 88, 130),
    }))
  );
  const joggerVariants = sizes.flatMap((size) =>
    sandBlackColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-BT-JOG-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(85, 78, 118),
    }))
  );
  const burnousLongVariants = sizes.flatMap((size) =>
    indigoBlackColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-JK-BRN-L-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(140, 130, 192),
    }))
  );
  const burnousShortVariants = sizes.flatMap((size) =>
    sandBlackColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-JK-BRN-S-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(140, 130, 192),
    }))
  );
  const sneakerVariants = sizes.flatMap((size) =>
    sneakerColors.map((c) => ({
      title: `${size} / ${c.name}`,
      sku: `IYUC-01-SH-DSN-${c.code}-${size}`,
      options: { Size: size, Color: c.name },
      prices: variantPrices(120, 110, 165),
    }))
  );
  const beanieVariants = beanieColors.map((c) => ({
    title: c.name,
    sku: `IYUC-01-AC-BEN-${c.code}-OS`,
    options: { Color: c.name },
    prices: variantPrices(35, 32, 48),
  }));

  const salesChannelPayload = [{ id: defaultSalesChannel[0].id }];
  const productPayload = (extra: Record<string, unknown> = {}) => ({
    ...(physicalTypeId ? { type_id: physicalTypeId } : {}),
    ...extra,
  });

  const { result: createdProducts } = await createProductsWorkflow(container).run({
    input: {
      products: [
        productPayload({
          title: "ⵣ Essential Tee (Short Sleeve)",
          category_ids: [topsId],
          tag_ids: productTagIds,
          description:
            "Amazigh heritage in one symbol. Oversized fit, 220 GSM organic cotton, small ⵣ embroidery on chest and minimal geometric line on back. Sand, Clay Red, or Midnight Black. IYUC — Wear the story. Anywhere.",
          handle: "essential-tee-ss",
          weight: 220,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-tee-ss-1"), placeholderImage("iyuc-tee-ss-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: teeSsColors.map((c) => c.name) },
          ],
          variants: teeSsVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "ⵣ Essential Tee (Long Sleeve)",
          category_ids: [topsId],
          tag_ids: productTagIds,
          description:
            "Same story, long sleeve. Ribbed cuffs, neutral base (Sand or Indigo). Small chest ⵣ, back pattern line. Amazigh culture, for the world.",
          handle: "essential-tee-ls",
          weight: 240,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-tee-ls-1"), placeholderImage("iyuc-tee-ls-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: teeLsColors.map((c) => c.name) },
          ],
          variants: teeLsVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "Desert Utility Pants",
          category_ids: [bottomsId],
          tag_ids: productTagIds,
          description:
            "Relaxed cargo fit. Side pocket with woven Amazigh patch, adjustable waist. Olive or Midnight Black. Streetwear with an Amazigh soul.",
          handle: "desert-utility-pants",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-pants-1"), placeholderImage("iyuc-pants-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: utilityColors.map((c) => c.name) },
          ],
          variants: utilityVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "Clay Joggers",
          category_ids: [bottomsId],
          tag_ids: productTagIds,
          description:
            "400 GSM brushed fleece, minimal embroidery near ankle. Sand or Black. Comfort first, symbol subtle. For everyone, everywhere.",
          handle: "clay-joggers",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-joggers-1"), placeholderImage("iyuc-joggers-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: sandBlackColors.map((c) => c.name) },
          ],
          variants: joggerVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "Modern Burnous Jacket (Long)",
          category_ids: [statementId],
          tag_ids: productTagIds,
          description:
            "Hero piece. Structured hood, clean drape, minimal front closure, subtle geometric lining. Indigo or Black. From the mountain to the city.",
          handle: "modern-burnous-long",
          weight: 450,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-burnous-long-1"), placeholderImage("iyuc-burnous-long-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: indigoBlackColors.map((c) => c.name) },
          ],
          variants: burnousLongVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "Modern Burnous Jacket (Short)",
          category_ids: [statementId],
          tag_ids: productTagIds,
          description:
            "Same language, cropped. Sand or Black. Layer over tees and joggers. Little Warriors.",
          handle: "modern-burnous-short",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-burnous-short-1"), placeholderImage("iyuc-burnous-short-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: sandBlackColors.map((c) => c.name) },
          ],
          variants: burnousShortVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "IYUC Desert Sneakers",
          category_ids: [footwearId],
          tag_ids: productTagIds,
          description:
            "Minimal low-top. Neutral suede + cotton canvas, embossed ⵣ on heel. Sand/Clay or Black/Cream. Wear the story.",
          handle: "iyuc-desert-sneakers",
          weight: 380,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-sneakers-1"), placeholderImage("iyuc-sneakers-2")],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: sneakerColors.map((c) => c.name) },
          ],
          variants: sneakerVariants,
          sales_channels: salesChannelPayload,
        }),
        productPayload({
          title: "Amazigh Beanie",
          category_ids: [accessoryId],
          tag_ids: productTagIds,
          description:
            "One main symbol, one color. Black, Clay Red, or Olive. Soft knit, unisex. For the next generation.",
          handle: "amazigh-beanie",
          weight: 80,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [placeholderImage("iyuc-beanie-1"), placeholderImage("iyuc-beanie-2")],
          options: [{ title: "Color", values: beanieColors.map((c) => c.name) }],
          variants: beanieVariants,
          sales_channels: salesChannelPayload,
        }),
      ],
    },
  });

  // "New Arrivals" / Latest drops collection (handle "new") for storefront /collections/new
  const newArrivalsHandle = "new";
  const [existingNewArrivals] = await productModuleService.listAndCountProductCollections(
    { handle: newArrivalsHandle },
    { take: 1 }
  );
  if (!existingNewArrivals?.length) {
    const products = await productModuleService.listProducts({}, { take: 10 });
    const productIds = (Array.isArray(products) ? products : []).map((p: { id: string }) => p.id).filter(Boolean).slice(0, 6);
    await productModuleService.createProductCollections([
      {
        title: "New Arrivals",
        handle: newArrivalsHandle,
        ...(productIds.length ? { product_ids: productIds } : {}),
      },
    ]);
    logger.info("Created 'New Arrivals' collection (handle: new) and linked products.");
  }

  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const full = typeof err === "object" && err !== null ? JSON.stringify(err) : "";
    if (full.includes("already exists") || full.includes("already assigned")) {
      logger.info("Seed skipped (data already present).");
      return;
    }
    throw err;
  }
}
