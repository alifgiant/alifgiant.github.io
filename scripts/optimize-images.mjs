import { globby } from 'globby';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminSvgo from 'imagemin-svgo';

async function optimizeImages() {
    const paths = await globby([
        'assets/images/**/*.{jpg,jpeg,png,svg}',
        'src/assets/images/**/*.{jpg,jpeg,png,svg}',
        '!node_modules/**',
        '!_site/**'
    ]);

    console.log(`Found ${paths.length} images to check.`);

    let optimizedCount = 0;
    let totalSaved = 0;
    let webpConvertCount = 0;
    let webpSaved = 0;
    let deletedOriginalCount = 0;
    let deletedOriginalBytes = 0;

    async function convertToWebpAndDeleteOriginal({
        originalBuffer,
        originalSize,
        filePath,
        dir,
        basename,
        quality,
        sourceLabel
    }) {
        const webpBuffer = await sharp(originalBuffer)
            .webp({ quality })
            .toBuffer();

        const webpPath = path.join(dir, `${basename}.webp`);
        await fs.writeFile(webpPath, webpBuffer);

        const webpSize = webpBuffer.length;
        webpConvertCount++;
        webpSaved += (originalSize - webpSize);

        const sizeReduction = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
        const conversionPrefix = sourceLabel === 'png' ? 'Generated WebP from PNG' : 'Generated WebP';
        console.log(`${conversionPrefix}: ${webpPath} (${originalSize} -> ${webpSize}, -${sizeReduction}%)`);

        await fs.remove(filePath);
        deletedOriginalCount++;
        deletedOriginalBytes += originalSize;
        console.log(`Deleted original: ${filePath}`);
    }

    for (const filePath of paths) {
        const originalBuffer = await fs.readFile(filePath);
        const originalSize = originalBuffer.length;
        let optimizedBuffer;

        const ext = path.extname(filePath).toLowerCase();
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath, ext);

        try {
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
                // Generate WebP variant and remove original raster file.
                const quality = ext === '.png' ? 85 : 80;
                const sourceLabel = ext === '.png' ? 'png' : 'jpeg';

                try {
                    await convertToWebpAndDeleteOriginal({
                        originalBuffer,
                        originalSize,
                        filePath,
                        dir,
                        basename,
                        quality,
                        sourceLabel
                    });
                } catch (webpErr) {
                    console.warn(`Failed to generate WebP for ${filePath}:`, webpErr.message);
                }
                continue;
            } else if (ext === '.svg') {
                optimizedBuffer = await imagemin.buffer(originalBuffer, {
                    plugins: [
                        imageminSvgo({
                            plugins: [
                                { name: 'removeViewBox', active: false },
                                { name: 'cleanupIds', active: false }
                            ]
                        })
                    ]
                });
            }

            if (!optimizedBuffer) continue;

            const optimizedSize = optimizedBuffer.length;

            if (optimizedSize >= originalSize) continue;

            const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

            // Only save if reduction is significant (> 5%)
            if (reduction > 5) {
                await fs.writeFile(filePath, optimizedBuffer);
                console.log(`Optimized: ${filePath} (${originalSize} -> ${optimizedSize}, -${reduction.toFixed(2)}%)`);
                optimizedCount++;
                totalSaved += (originalSize - optimizedSize);
            }
        } catch (err) {
            console.error(`Error optimizing ${filePath}:`, err.message);
        }
    }

    console.log(`\n=== Optimization Summary ===`);
    console.log(`Optimized ${optimizedCount} images.`);
    console.log(`Total space saved: ${(totalSaved / 1024).toFixed(2)} KB.`);
    console.log(`Generated ${webpConvertCount} WebP variants.`);
    console.log(`Total WebP space saved vs originals: ${(webpSaved / 1024).toFixed(2)} KB.`);
    console.log(`Deleted ${deletedOriginalCount} original JPG/PNG files (${(deletedOriginalBytes / 1024).toFixed(2)} KB removed).`);
}

optimizeImages().catch(err => {
    console.error(err);
    process.exit(1);
});
