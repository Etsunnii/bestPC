const PRODUCT_FIELDS = [
  "id",
  "name",
  "price",
  "platform",
  "description",
  "image",
  "GPU",
  "processor",
  "matherboard",
  "ram",
  "storage",
  "cooling",
  "power",
  "case",
  "published",
  "sort",
  "fps_fhd",
  "fps_2k",
  "fps_4k",
  "fps_fhd_medium",
];

const SAFE_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default (router, { database, getSchema, services }) => {
    router.get("/", async (_req, res, next) => {
      try {
        const products = await database("Products")
          .select(PRODUCT_FIELDS)
          .where("published", true)
          .orderByRaw(
            "case when platform = ? then 0 when platform = ? then 1 else 2 end",
            ["INTEL", "AMD"],
          )
          .orderBy("sort", "asc")
          .orderBy("name", "asc");

        res.setHeader("Cache-Control", "no-store");
        res.json({ data: products });
      } catch (error) {
        next(error);
      }
    });

    router.get("/assets/:id", async (req, res, next) => {
      try {
        const { id } = req.params;

        if (!UUID_PATTERN.test(id)) {
          res.status(404).json({ errors: [{ message: "File not found." }] });
          return;
        }

        const fileReference = await database("Products as product")
          .join("directus_files as file", "product.image", "file.id")
          .select("file.id", "file.type")
          .where("product.published", true)
          .andWhere("file.id", id)
          .first();

        if (!fileReference || !SAFE_IMAGE_TYPES.has(fileReference.type)) {
          res.status(404).json({ errors: [{ message: "File not found." }] });
          return;
        }

        const schema = await getSchema();
        const assetsService = new services.AssetsService({
          accountability: null,
          schema,
        });
        const { stream, file, stat } = await assetsService.getAsset(
          id,
          { transformationParams: {}, acceptFormat: undefined },
          undefined,
          false,
        );

        res.setHeader("Content-Type", file.type);
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Content-Disposition", "inline");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.setHeader("X-Content-Type-Options", "nosniff");
        stream.pipe(res);
      } catch (error) {
        next(error);
      }
    });
};
