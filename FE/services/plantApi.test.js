import assert from "node:assert/strict";
import test from "node:test";
import {
  filterMarketplacePlants,
  getAllMarketplacePlants,
  normalizeMarketplaceCategory,
} from "./marketplaceCatalog.js";

test("loads all 24 items from two 12-item pages", async () => {
  const calls = [];
  const fetchPage = async (params) => {
    calls.push(params);
    const page = params?.page || 1;
    return {
      items: Array.from({ length: 12 }, (_, index) => ({
        id: `item-${(page - 1) * 12 + index + 1}`,
        category: "plant",
      })),
      pagination: { page, limit: 12, total: 24, totalPages: 2 },
    };
  };

  const result = await getAllMarketplacePlants(fetchPage);

  assert.deepEqual(calls, [undefined, { page: 2 }]);
  assert.equal(result.items.length, 24);
  assert.equal(result.pagination.totalPages, 2);
});

test("removes duplicate ids while merging pages", async () => {
  const result = await getAllMarketplacePlants(async (params) => {
    const page = params?.page || 1;
    return {
      items: page === 1 ? [{ id: "one" }] : [{ id: "one" }, { id: "two" }],
      pagination: { page, limit: 12, total: 24, totalPages: 2 },
    };
  });

  assert.deepEqual(result.items.map((item) => item.id), ["one", "two"]);
});

test("loads more than two pages sequentially", async () => {
  const calls = [];
  const fetchPage = async (params) => {
    const page = params?.page || 1;
    calls.push(page);
    return {
      items: [{ id: page, category: "plant" }],
      pagination: { page, limit: 12, total: 36, totalPages: 3 },
    };
  };

  const result = await getAllMarketplacePlants(fetchPage);

  assert.deepEqual(calls, [1, 2, 3]);
  assert.equal(result.items.length, 3);
});

test("keeps direct array responses compatible", async () => {
  const result = await getAllMarketplacePlants(async () => [{ id: "one", category: "plant" }]);

  assert.deepEqual(result.items.map((item) => item.id), ["one"]);
});

test("propagates a later page error", async () => {
  await assert.rejects(
    () => getAllMarketplacePlants(async (params) => {
      if ((params?.page || 1) === 2) throw new Error("page two failed");
      return {
        items: [{ id: "one" }],
        pagination: { page: 1, limit: 12, total: 24, totalPages: 2 },
      };
    }),
    /page two failed/,
  );
});

test("normalizes marketplace category casing and whitespace without crashing", () => {
  assert.equal(normalizeMarketplaceCategory("Pot"), "pot");
  assert.equal(normalizeMarketplaceCategory(" POT "), "pot");
  assert.equal(normalizeMarketplaceCategory("pot"), "pot");
  assert.equal(normalizeMarketplaceCategory(null), "");
  assert.equal(normalizeMarketplaceCategory(undefined), "");
});

test("filters all canonical categories, then search and sort, without losing plant or other", () => {
  const plants = [
    { id: "plant", name: "Monstera", category: " Plant ", status: "Active", price: 300000 },
    { id: "pot", name: "Chậu gốm", category: "Pot", status: "Active", price: 100000 },
    { id: "other", name: "Dụng cụ", category: "other", status: "Active", price: 200000 },
    { id: "unknown", name: "Không loại", category: null, status: "Active", price: 50000 },
  ];

  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "all", sortBy: "priceAsc" }).map((item) => item.id),
    ["unknown", "pot", "other", "plant"],
  );
  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "pot", searchTerm: "gốm" }).map((item) => item.id),
    ["pot"],
  );
  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "plant" }).map((item) => item.id),
    ["plant"],
  );
  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "other" }).map((item) => item.id),
    ["other"],
  );
});

test("prioritizes canonical categories only for all plus popular without mutating input", () => {
  const plants = [
    { id: "soil", name: "Soil", category: "soil", status: "Active", price: 10 },
    { id: "accessory", name: "Accessory", category: "accessory", status: "Active", price: 20 },
    { id: "plant-first", name: "Plant first", category: " Plant ", status: "Active", price: 30 },
    { id: "unknown", name: "Unknown", category: null, status: "Active", price: 40 },
    { id: "pot", name: "Pot", category: "pot", status: "Active", price: 50 },
    { id: "plant-second", name: "Plant second", category: "PLANT", status: "Active", price: 60 },
  ];
  const originalOrder = plants.map((plant) => plant.id);

  const result = filterMarketplacePlants(plants, { category: "all", sortBy: "popular" });

  assert.deepEqual(result.map((plant) => plant.id), [
    "plant-first",
    "plant-second",
    "pot",
    "soil",
    "accessory",
    "unknown",
  ]);
  assert.deepEqual(plants.map((plant) => plant.id), originalOrder);
});

test("does not apply popular category priority to specific categories or explicit sorts", () => {
  const plants = [
    { id: "soil", name: "Soil", category: "soil", status: "Active", price: 10 },
    { id: "plant", name: "Plant", category: "plant", status: "Active", price: 30 },
    { id: "accessory", name: "Accessory", category: "accessory", status: "Active", price: 20 },
  ];

  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "soil", sortBy: "popular" }).map((plant) => plant.id),
    ["soil"],
  );
  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "all", sortBy: "priceAsc" }).map((plant) => plant.id),
    ["soil", "accessory", "plant"],
  );
  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "all", sortBy: "priceDesc" }).map((plant) => plant.id),
    ["plant", "accessory", "soil"],
  );
  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "all", sortBy: "newest" }).map((plant) => plant.id),
    ["soil", "plant", "accessory"],
  );
});

test("keeps plant priority after search within all plus popular", () => {
  const plants = [
    { id: "soil", name: "Desk soil", category: "soil", status: "Active", price: 10 },
    { id: "plant", name: "Desk plant", category: "plant", status: "Active", price: 20 },
  ];

  assert.deepEqual(
    filterMarketplacePlants(plants, { category: "all", searchTerm: "desk", sortBy: "popular" })
      .map((plant) => plant.id),
    ["plant", "soil"],
  );
});
