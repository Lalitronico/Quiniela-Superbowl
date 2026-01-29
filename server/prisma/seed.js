import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_QUESTIONS = [
  // Deportivas (Sports)
  {
    questionKey: 'winner',
    category: 'deportivas',
    text: '¿Quién ganará el Super Bowl LX?',
    type: 'select',
    options: ['Seattle Seahawks', 'New England Patriots'],
    difficulty: 'medium',
    sortOrder: 1,
  },
  {
    questionKey: 'score',
    category: 'deportivas',
    text: '¿Cuál será el marcador final?',
    type: 'score',
    options: null,
    difficulty: 'hard',
    sortOrder: 2,
  },
  {
    questionKey: 'mvp',
    category: 'deportivas',
    text: '¿Quién será el MVP del partido?',
    type: 'text',
    options: null,
    difficulty: 'hard',
    sortOrder: 3,
  },
  {
    questionKey: 'first_score',
    category: 'deportivas',
    text: '¿Qué equipo anotará primero?',
    type: 'select',
    options: ['Seattle Seahawks', 'New England Patriots'],
    difficulty: 'easy',
    sortOrder: 4,
  },
  // Entretenimiento (Entertainment)
  {
    questionKey: 'halftime_guest',
    category: 'entretenimiento',
    text: '¿Habrá artista invitado en el show de medio tiempo?',
    type: 'select',
    options: ['Sí', 'No'],
    difficulty: 'medium',
    sortOrder: 5,
  },
  {
    questionKey: 'first_song',
    category: 'entretenimiento',
    text: '¿Cuál será la primera canción del show de medio tiempo?',
    type: 'text',
    options: null,
    difficulty: 'hard',
    sortOrder: 6,
  },
  // Comerciales (Commercials)
  {
    questionKey: 'best_commercial',
    category: 'comerciales',
    text: '¿Qué marca tendrá el mejor comercial según USA Today Ad Meter?',
    type: 'text',
    options: null,
    difficulty: 'hard',
    sortOrder: 7,
  },
  {
    questionKey: 'most_commercials',
    category: 'comerciales',
    text: '¿Qué categoría tendrá más comerciales?',
    type: 'select',
    options: ['Cervezas', 'Autos', 'Tecnología', 'Comida rápida', 'Streaming'],
    difficulty: 'medium',
    sortOrder: 8,
  },
  // Curiosidades (Trivia)
  {
    questionKey: 'anthem_duration',
    category: 'curiosidades',
    text: '¿Cuánto durará el himno nacional? (en segundos)',
    type: 'number',
    options: null,
    difficulty: 'hard',
    sortOrder: 9,
  },
  {
    questionKey: 'gatorade_color',
    category: 'curiosidades',
    text: '¿De qué color será el Gatorade que le tiren al coach ganador?',
    type: 'select',
    options: ['Naranja', 'Azul', 'Amarillo', 'Verde', 'Morado', 'Transparente'],
    difficulty: 'easy',
    sortOrder: 10,
  },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // Seed questions (upsert to avoid duplicates)
  console.log('📝 Seeding questions...');
  for (const question of DEFAULT_QUESTIONS) {
    await prisma.question.upsert({
      where: { questionKey: question.questionKey },
      update: question,
      create: question,
    });
    console.log(`  ✓ ${question.questionKey}`);
  }

  // Create a default brand for testing
  console.log('\n🏷️ Creating default brand...');
  const defaultBrand = await prisma.brand.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      slug: 'default',
      name: 'Super Bowl LX Quiniela',
      primaryColor: '#3B82F6',
      adminApiKey: process.env.ADMIN_API_KEY || 'default-admin-key-change-me',
      predictionsLockAt: new Date('2026-02-08T18:30:00-08:00'), // 6:30 PM PT
    },
  });
  console.log(`  ✓ Brand "${defaultBrand.name}" (slug: ${defaultBrand.slug})`);

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
