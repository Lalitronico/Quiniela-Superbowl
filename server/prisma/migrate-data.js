/**
 * Data Migration Script
 *
 * Migrates existing JSON data from file storage to PostgreSQL.
 * Run this after setting up the database and running migrations.
 *
 * Usage: node prisma/migrate-data.js
 *
 * Prerequisites:
 * 1. DATABASE_URL environment variable set
 * 2. Prisma migrations applied (npm run db:migrate:deploy)
 * 3. Default brand created (npm run db:seed)
 */

import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');

const prisma = new PrismaClient();

async function readJsonFile(filename) {
  const filepath = join(DATA_DIR, filename);

  if (!existsSync(filepath)) {
    console.log(`  ⚠ File not found: ${filename}`);
    return null;
  }

  try {
    const data = await readFile(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`  ✗ Error reading ${filename}:`, err.message);
    return null;
  }
}

async function migrateParticipants(brandId) {
  console.log('\n📦 Migrating participants...');

  const participants = await readJsonFile('participants.json');
  if (!participants || participants.length === 0) {
    console.log('  ⚠ No participants to migrate');
    return {};
  }

  const idMap = {}; // Map old ID to new ID

  for (const p of participants) {
    try {
      // Check if participant already exists (by email for this brand)
      const existing = await prisma.participant.findFirst({
        where: {
          brandId,
          email: { equals: p.email, mode: 'insensitive' },
        },
      });

      if (existing) {
        console.log(`  ⚠ Participant already exists: ${p.email}`);
        idMap[p.id] = existing.id;
        continue;
      }

      const newParticipant = await prisma.participant.create({
        data: {
          brandId,
          name: p.name,
          email: p.email.toLowerCase(),
          avatar: p.avatar || '🏈',
          score: p.score || 0,
          correctPredictions: p.correctPredictions || 0,
          categoryScores: p.categoryScores || {},
        },
      });

      idMap[p.id] = newParticipant.id;
      console.log(`  ✓ Migrated: ${p.name} (${p.email})`);
    } catch (err) {
      console.error(`  ✗ Failed to migrate ${p.email}:`, err.message);
    }
  }

  console.log(`  Total: ${Object.keys(idMap).length} participants migrated`);
  return idMap;
}

async function migratePredictions(brandId, participantIdMap) {
  console.log('\n📦 Migrating predictions...');

  const predictions = await readJsonFile('predictions.json');
  if (!predictions || Object.keys(predictions).length === 0) {
    console.log('  ⚠ No predictions to migrate');
    return;
  }

  // Get question ID map
  const questions = await prisma.question.findMany();
  const questionMap = new Map(questions.map((q) => [q.questionKey, q.id]));

  let migratedCount = 0;
  let errorCount = 0;

  for (const [oldParticipantId, data] of Object.entries(predictions)) {
    const newParticipantId = participantIdMap[oldParticipantId];

    if (!newParticipantId) {
      console.log(`  ⚠ Skipping predictions for unknown participant: ${oldParticipantId.slice(0, 8)}...`);
      continue;
    }

    const userPredictions = data.predictions || {};

    for (const [questionKey, answer] of Object.entries(userPredictions)) {
      const questionId = questionMap.get(questionKey);

      if (!questionId) {
        console.log(`  ⚠ Unknown question key: ${questionKey}`);
        continue;
      }

      try {
        await prisma.prediction.upsert({
          where: {
            participantId_questionId: {
              participantId: newParticipantId,
              questionId,
            },
          },
          update: { answer },
          create: {
            brandId,
            participantId: newParticipantId,
            questionId,
            answer,
          },
        });
        migratedCount++;
      } catch (err) {
        console.error(`  ✗ Failed to migrate prediction ${questionKey}:`, err.message);
        errorCount++;
      }
    }
  }

  console.log(`  Total: ${migratedCount} predictions migrated, ${errorCount} errors`);
}

async function migrateResults(brandId) {
  console.log('\n📦 Migrating results...');

  const results = await readJsonFile('results.json');
  if (!results || Object.keys(results).length === 0) {
    console.log('  ⚠ No results to migrate');
    return;
  }

  // Get question ID map
  const questions = await prisma.question.findMany();
  const questionMap = new Map(questions.map((q) => [q.questionKey, q.id]));

  let migratedCount = 0;

  for (const [questionKey, answer] of Object.entries(results)) {
    const questionId = questionMap.get(questionKey);

    if (!questionId) {
      console.log(`  ⚠ Unknown question key: ${questionKey}`);
      continue;
    }

    try {
      await prisma.result.upsert({
        where: {
          brandId_questionId: {
            brandId,
            questionId,
          },
        },
        update: { answer },
        create: {
          brandId,
          questionId,
          answer,
        },
      });
      console.log(`  ✓ Migrated result: ${questionKey}`);
      migratedCount++;
    } catch (err) {
      console.error(`  ✗ Failed to migrate result ${questionKey}:`, err.message);
    }
  }

  console.log(`  Total: ${migratedCount} results migrated`);
}

async function main() {
  console.log('🚀 Starting data migration...\n');

  // Get or create the default brand
  let brand = await prisma.brand.findUnique({
    where: { slug: 'default' },
  });

  if (!brand) {
    console.log('Creating default brand...');
    brand = await prisma.brand.create({
      data: {
        slug: 'default',
        name: 'Super Bowl LX Quiniela',
        primaryColor: '#3B82F6',
        adminApiKey: process.env.ADMIN_API_KEY || 'default-admin-key-change-me',
        predictionsLockAt: new Date('2026-02-08T18:30:00-08:00'),
      },
    });
  }

  console.log(`Using brand: ${brand.name} (${brand.slug})`);

  // Migrate data
  const participantIdMap = await migrateParticipants(brand.id);
  await migratePredictions(brand.id, participantIdMap);
  await migrateResults(brand.id);

  console.log('\n✅ Migration complete!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
