import "dotenv/config";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "../configs/db.js";
import connectCloudinary from "../configs/cloudinary.js";
import Product from "../models/Product.js";

const catalogPath = new URL("../data/demo-products.json", import.meta.url);
const imageDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../frontend/src/assets",
);
const dryRun = process.argv.includes("--dry-run");
const forceImageRepair = process.argv.includes("--repair-images");

const makeProductId = (seedKey) =>
  new mongoose.Types.ObjectId(
    createHash("sha256").update(seedKey).digest("hex").slice(0, 24),
  );

const uploadProductImages = (product) =>
  Promise.all(
    product.image.map(async (imageName, index) => {
      const upload = await cloudinary.uploader.upload(
        path.join(imageDirectory, imageName),
        {
          folder: "grocery-delivery/demo-products",
          public_id: `${product.seedKey}-${index + 1}`,
          overwrite: true,
          resource_type: "image",
        },
      );
      return upload.secure_url;
    }),
  );

const hasValidDemoImageUrls = (images, expectedCount) =>
  Array.isArray(images) &&
  images.length === expectedCount &&
  images.every((image) => {
    try {
      const url = new URL(image);
      return (
        url.protocol === "https:" &&
        url.hostname === "res.cloudinary.com" &&
        url.pathname.includes("/image/upload/")
      );
    } catch {
      return false;
    }
  });

const run = async () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is required to seed product images.");
  }

  const products = JSON.parse(await readFile(catalogPath, "utf8"));
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("The demo product catalog is empty or invalid.");
  }

  for (const product of products) {
    if (!product.seedKey || !product.name || !Array.isArray(product.image)) {
      throw new Error("The demo product catalog contains an invalid product.");
    }
    for (const imageName of product.image) {
      await access(path.join(imageDirectory, imageName));
    }
  }

  await connectDB();
  await connectCloudinary();

  let inserted = 0;
  let skipped = 0;
  let repaired = 0;

  for (const product of products) {
    const _id = makeProductId(product.seedKey);
    const existing = await Product.findById(_id).select("name legacyId image");
    if (existing) {
      if (existing.name !== product.name) {
        throw new Error(
          `Seed ID collision detected for product "${product.name}".`,
        );
      }
      if (
        !forceImageRepair &&
        hasValidDemoImageUrls(existing.image, product.image.length)
      ) {
        if (!existing.legacyId && !dryRun) {
          await Product.updateOne(
            { _id },
            { $set: { legacyId: product.seedKey } },
          );
        }
        skipped += 1;
        continue;
      }

      repaired += 1;
      if (!dryRun) {
        const imageUrls = await uploadProductImages(product);
        await Product.updateOne(
          { _id },
          { $set: { image: imageUrls, legacyId: product.seedKey } },
        );
      }
      continue;
    }

    if (dryRun) {
      inserted += 1;
      continue;
    }

    const imageUrls = await uploadProductImages(product);

    const {
      seedKey: _seedKey,
      image: _sourceImages,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...productData
    } = product;
    await Product.create({
      ...productData,
      _id,
      legacyId: product.seedKey,
      image: imageUrls,
    });
    inserted += 1;
  }

  console.log(
    `${dryRun ? "Dry run complete" : "Seed complete"}: ${inserted} ${dryRun ? "would be inserted" : "inserted"}, ${repaired} ${dryRun ? "would be repaired" : "repaired"}, ${skipped} already present with valid images, ${products.length} total.`,
  );
};

try {
  await run();
} catch (error) {
  console.error("Product catalog seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
