import { globby } from 'globby';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminSvgo from 'imagemin-svgo';
import imageminOptipng from 'imagemin-optipng';

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

    for (const filePath of paths) {
        const originalBuffer = await fs.readFile(filePath);
        const originalSize = originalBuffer.length;
        let optimizedBuffer;

        const ext = path.extname(filePath).toLowerCase();

        try {
            if (ext === '.jpg' || ext === '.jpeg') {
                // Sharp with fixed quality is idempotent
                optimizedBuffer = await sharp(originalBuffer)
                    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
                    .toBuffer();
            } else if (ext === '.png') {
                // Optipng is lossless and guaranteed to stabilize after 1-2 runs
                optimizedBuffer = await imagemin.buffer(originalBuffer, {
                    plugins: [
                        imageminOptipng({ optimizationLevel: 3 })
                    ]
                });
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

    console.log(`Finished optimization.`);
    console.log(`Optimized ${optimizedCount} images.`);
    console.log(`Total space saved: ${(totalSaved / 1024).toFixed(2)} KB.`);
}

optimizeImages().catch(err => {
    console.error(err);
    process.exit(1);
});
