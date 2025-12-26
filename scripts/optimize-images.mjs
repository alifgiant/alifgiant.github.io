import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import { globby } from 'globby';
import fs from 'fs-extra';
import path from 'path';

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

        let plugins = [];
        const ext = path.extname(filePath).toLowerCase();

        if (ext === '.jpg' || ext === '.jpeg') {
            plugins = [imageminMozjpeg({ quality: 80 })];
        } else if (ext === '.png') {
            plugins = [imageminPngquant({ quality: [0.6, 0.8] })];
        } else if (ext === '.svg') {
            plugins = [imageminSvgo({
                plugins: [
                    { name: 'removeViewBox', active: false },
                    { name: 'cleanupIDs', active: false }
                ]
            })];
        }

        if (plugins.length === 0) continue;

        try {
            const optimizedBuffer = await imagemin.buffer(originalBuffer, { plugins });
            const optimizedSize = optimizedBuffer.length;
            const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

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
