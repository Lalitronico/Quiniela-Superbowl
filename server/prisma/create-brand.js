import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function createBrand() {
  console.log('🏷️  Creando nuevo brand QBEJ...\n');

  // Generar API key segura
  const adminApiKey = crypto.randomBytes(32).toString('hex');

  try {
    const brand = await prisma.brand.upsert({
      where: { slug: 'qbej' },
      update: {
        name: 'Que Bonilla es Juárez',
        logoUrl: 'https://scontent.fcjs2-1.fna.fbcdn.net/v/t39.30808-6/612857389_122119856703027609_4680507542588740895_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=02FqxyOGq7IQ7kNvwHjyLtO&_nc_oc=Admq7H5_COyHpwOfVWhZ_psH--Sn3SGUXPRoD-z6O87OKd8YiOlT5tddOC6kAlWw95wdv6G9plQwZyYQROBpR7E8&_nc_zt=23&_nc_ht=scontent.fcjs2-1.fna&_nc_gid=07BTPgGQM2flLBLMulgc-g&oh=00_Afs4CVO0os7nGF7gA24A9FDtQZRiPXFmTUzUFzRj8d4T8A&oe=698337D8',
        primaryColor: '#255C99',
        isActive: true,
      },
      create: {
        slug: 'qbej',
        name: 'Que Bonilla es Juárez',
        logoUrl: 'https://scontent.fcjs2-1.fna.fbcdn.net/v/t39.30808-6/612857389_122119856703027609_4680507542588740895_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=02FqxyOGq7IQ7kNvwHjyLtO&_nc_oc=Admq7H5_COyHpwOfVWhZ_psH--Sn3SGUXPRoD-z6O87OKd8YiOlT5tddOC6kAlWw95wdv6G9plQwZyYQROBpR7E8&_nc_zt=23&_nc_ht=scontent.fcjs2-1.fna&_nc_gid=07BTPgGQM2flLBLMulgc-g&oh=00_Afs4CVO0os7nGF7gA24A9FDtQZRiPXFmTUzUFzRj8d4T8A&oe=698337D8',
        primaryColor: '#255C99',
        adminApiKey: adminApiKey,
        predictionsLockAt: new Date('2026-02-08T18:30:00-08:00'), // Cierre: 6:30 PM PT del Super Bowl
        isActive: true,
      },
    });

    console.log('✅ Brand creado exitosamente!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  DATOS DEL CLIENTE: Que Bonilla es Juárez');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ID:           ${brand.id}`);
    console.log(`  Slug:         ${brand.slug}`);
    console.log(`  Nombre:       ${brand.name}`);
    console.log(`  Color:        ${brand.primaryColor}`);
    console.log(`  Activo:       ${brand.isActive ? 'Sí' : 'No'}`);
    console.log(`  Cierre:       ${brand.predictionsLockAt}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Solo mostrar API key si es nuevo (en update no la cambiamos)
    if (brand.adminApiKey === adminApiKey) {
      console.log('🔐 API KEY (GUARDAR EN LUGAR SEGURO):');
      console.log(`   ${adminApiKey}`);
      console.log('\n⚠️  Esta clave solo se muestra UNA VEZ. ¡Guárdala!\n');
    }

    console.log('📱 URLs de acceso:');
    console.log('   Landing:   https://tu-dominio.com/qbej');
    console.log('   Quiniela:  https://tu-dominio.com/qbej/quiniela');
    console.log('   Admin:     https://tu-dominio.com/qbej/admin');
    console.log('');

  } catch (error) {
    console.error('❌ Error creando brand:', error.message);
    throw error;
  }
}

createBrand()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
