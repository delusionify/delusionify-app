const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load .env.local
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const templatesPath = path.join(__dirname, "public", "templates");

async function uploadTemplates() {
  console.log("🚀 STARTING TEMPLATE IMAGE UPLOAD TO SUPABASE\n");
  console.log("=" + "=".repeat(70));

  try {
    const categories = fs.readdirSync(templatesPath).filter((file) => {
      const filePath = path.join(templatesPath, file);
      return fs.statSync(filePath).isDirectory();
    });

    console.log(`\n📁 Found ${categories.length} categories\n`);

    let totalUploaded = 0;
    let totalErrors = 0;

    for (const category of categories) {
      const categoryPath = path.join(templatesPath, category);
      const images = fs
        .readdirSync(categoryPath)
        .filter((file) =>
          /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
        )
        .sort();

      if (images.length === 0) {
        console.log(`⏭️  ${category}: No images found\n`);
        continue;
      }

      console.log(`📦 ${category.toUpperCase()} (${images.length} images)`);

      for (const imageName of images) {
        const imagePath = path.join(categoryPath, imageName);
        const fileBuffer = fs.readFileSync(imagePath);
        const fileExtension = path.extname(imageName);
        const imageNumber = parseInt(path.basename(imageName, fileExtension));

        // Upload to storage
        const storagePath = `${category}/${imageName}`;
        const { error: uploadError, data: uploadData } =
          await supabase.storage
            .from("template-library")
            .upload(storagePath, fileBuffer, {
              upsert: true,
              contentType: `image/${fileExtension.slice(1)}`,
            });

        if (uploadError) {
          console.log(`  ❌ ${imageName}: ${uploadError.message}`);
          totalErrors++;
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("template-library")
          .getPublicUrl(storagePath);

        // Insert into database
        const { error: dbError } = await supabase
          .from("template_images")
          .insert({
            category: category,
            image_number: imageNumber,
            image_name: imageName,
            file_path: storagePath,
            storage_url: publicUrl,
          });

        if (dbError) {
          console.log(`  ❌ ${imageName}: DB error - ${dbError.message}`);
          totalErrors++;
          continue;
        }

        console.log(`  ✅ ${imageName} (${(fileBuffer.length / 1024).toFixed(1)}KB)`);
        totalUploaded++;
      }

      console.log("");
    }

    console.log("=" + "=".repeat(70));
    console.log("\n📊 UPLOAD SUMMARY");
    console.log(`   ✅ Successfully uploaded: ${totalUploaded} images`);
    console.log(`   ❌ Errors: ${totalErrors}`);
    console.log(`   📁 Categories: ${categories.length}`);

    // Verify database entries
    const { count, error: countError } = await supabase
      .from("template_images")
      .select("*", { count: "exact", head: true });

    if (!countError) {
      console.log(`   📦 Database entries: ${count} records\n`);
    }

    if (totalErrors === 0) {
      console.log("✅ ALL TEMPLATES UPLOADED SUCCESSFULLY!");
      console.log("🚀 Ready for template generation\n");
    } else {
      console.log(
        `⚠️  Some uploads failed. Check errors above.\n`
      );
    }

    console.log("=" + "=".repeat(70));
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error.message);
    process.exit(1);
  }
}

uploadTemplates();
