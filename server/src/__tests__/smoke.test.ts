import test from "node:test";
import assert from "node:assert/strict";
import { createCarSchema } from "../validators/cars.js";
import { validateSiteContent } from "../validators/site.js";
import { defaultSiteContent } from "../lib/siteContentDefaults.js";

test("createCarSchema accepts a valid payload", () => {
  const { error } = createCarSchema.validate({
    title: "Test Car",
    brand: "BMW",
    model: "X5",
    year: 2022,
    price: 5_000_000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    km_driven: 10_000,
    location: "Mumbai",
    images: ["https://example.com/1.jpg"],
    description: "Nice car",
    is_featured: false,
  });
  assert.equal(error, undefined);
});

test("validateSiteContent accepts default CMS payload", () => {
  assert.doesNotThrow(() => validateSiteContent(defaultSiteContent()));
});
