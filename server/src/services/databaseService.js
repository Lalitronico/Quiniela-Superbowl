import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// Brand Operations
// ============================================

export async function getBrandBySlug(slug) {
  return prisma.brand.findUnique({
    where: { slug, isActive: true },
  });
}

export async function getBrandById(id) {
  return prisma.brand.findUnique({
    where: { id },
  });
}

export async function getAllBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function createBrand(brandData) {
  return prisma.brand.create({
    data: brandData,
  });
}

export async function updateBrand(id, brandData) {
  return prisma.brand.update({
    where: { id },
    data: brandData,
  });
}

// ============================================
// Participant Operations (scoped by brand)
// ============================================

export async function getParticipants(brandId) {
  return prisma.participant.findMany({
    where: { brandId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getParticipantById(brandId, id) {
  return prisma.participant.findFirst({
    where: { id, brandId },
  });
}

export async function getParticipantByEmail(brandId, email) {
  return prisma.participant.findFirst({
    where: {
      brandId,
      email: { equals: email, mode: 'insensitive' },
    },
  });
}

export async function saveParticipant(brandId, participantData) {
  const { id, ...data } = participantData;

  if (id) {
    // Update existing participant
    return prisma.participant.update({
      where: { id },
      data,
    });
  }

  // Create new participant
  return prisma.participant.create({
    data: {
      ...data,
      brandId,
    },
  });
}

export async function updateParticipantScore(brandId, id, score, correctPredictions, categoryScores) {
  return prisma.participant.update({
    where: { id },
    data: {
      score,
      correctPredictions,
      categoryScores,
    },
  });
}

// ============================================
// Prediction Operations (scoped by brand)
// ============================================

export async function getPredictions(brandId) {
  const predictions = await prisma.prediction.findMany({
    where: { brandId },
    include: {
      participant: {
        select: { id: true, name: true, email: true },
      },
      question: {
        select: { questionKey: true },
      },
    },
  });

  // Group by participant for backwards compatibility
  const grouped = {};
  for (const pred of predictions) {
    if (!grouped[pred.participantId]) {
      grouped[pred.participantId] = {
        participant: pred.participant,
        predictions: {},
        updatedAt: pred.updatedAt,
      };
    }
    grouped[pred.participantId].predictions[pred.question.questionKey] = pred.answer;
    // Keep the latest updatedAt
    if (pred.updatedAt > grouped[pred.participantId].updatedAt) {
      grouped[pred.participantId].updatedAt = pred.updatedAt;
    }
  }

  return grouped;
}

export async function getPredictionsByUserId(brandId, participantId) {
  const predictions = await prisma.prediction.findMany({
    where: { brandId, participantId },
    include: {
      question: {
        select: { questionKey: true },
      },
    },
  });

  if (predictions.length === 0) return null;

  const result = {
    predictions: {},
    updatedAt: null,
  };

  for (const pred of predictions) {
    result.predictions[pred.question.questionKey] = pred.answer;
    if (!result.updatedAt || pred.updatedAt > result.updatedAt) {
      result.updatedAt = pred.updatedAt;
    }
  }

  return result;
}

export async function savePredictions(brandId, participantId, userPredictions) {
  // Get all questions to map questionKey to questionId
  const questions = await prisma.question.findMany({
    where: { isActive: true },
  });
  const questionMap = new Map(questions.map((q) => [q.questionKey, q.id]));

  // Upsert each prediction
  const operations = Object.entries(userPredictions).map(([questionKey, answer]) => {
    const questionId = questionMap.get(questionKey);
    if (!questionId) {
      console.warn(`Unknown question key: ${questionKey}`);
      return null;
    }

    return prisma.prediction.upsert({
      where: {
        participantId_questionId: {
          participantId,
          questionId,
        },
      },
      update: { answer },
      create: {
        brandId,
        participantId,
        questionId,
        answer,
      },
    });
  });

  await Promise.all(operations.filter(Boolean));
}

// ============================================
// Question Operations (global)
// ============================================

export async function getQuestions() {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  // Transform to match existing format
  return questions.map((q) => ({
    id: q.questionKey, // Use questionKey as ID for backwards compatibility
    category: q.category,
    text: q.text,
    type: q.type,
    options: q.options,
    difficulty: q.difficulty,
  }));
}

export async function saveQuestions(questions) {
  // Upsert each question
  for (const q of questions) {
    await prisma.question.upsert({
      where: { questionKey: q.id },
      update: {
        category: q.category,
        text: q.text,
        type: q.type,
        options: q.options || null,
        difficulty: q.difficulty || 'medium',
      },
      create: {
        questionKey: q.id,
        category: q.category,
        text: q.text,
        type: q.type,
        options: q.options || null,
        difficulty: q.difficulty || 'medium',
      },
    });
  }
}

// ============================================
// Results Operations (scoped by brand)
// ============================================

export async function getResults(brandId) {
  const results = await prisma.result.findMany({
    where: { brandId },
    include: {
      question: {
        select: { questionKey: true },
      },
    },
  });

  // Transform to object format for backwards compatibility
  const resultObj = {};
  for (const r of results) {
    resultObj[r.question.questionKey] = r.answer;
  }
  return resultObj;
}

export async function saveResults(brandId, results) {
  // Get all questions to map questionKey to questionId
  const questions = await prisma.question.findMany({
    where: { isActive: true },
  });
  const questionMap = new Map(questions.map((q) => [q.questionKey, q.id]));

  // Upsert each result
  const operations = Object.entries(results).map(([questionKey, answer]) => {
    const questionId = questionMap.get(questionKey);
    if (!questionId) {
      console.warn(`Unknown question key: ${questionKey}`);
      return null;
    }

    return prisma.result.upsert({
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
  });

  await Promise.all(operations.filter(Boolean));
}

// ============================================
// Leaderboard Operations (scoped by brand)
// ============================================

export async function getLeaderboard(brandId) {
  const participants = await prisma.participant.findMany({
    where: { brandId },
    orderBy: { score: 'desc' },
    select: {
      id: true,
      name: true,
      avatar: true,
      score: true,
      correctPredictions: true,
      categoryScores: true,
    },
  });

  return participants.map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.score || 0,
    correctPredictions: p.correctPredictions || 0,
    categoryScores: p.categoryScores || {},
  }));
}

// ============================================
// Utility
// ============================================

export async function disconnect() {
  await prisma.$disconnect();
}

export { prisma };

export default {
  // Brand
  getBrandBySlug,
  getBrandById,
  getAllBrands,
  createBrand,
  updateBrand,
  // Participant
  getParticipants,
  getParticipantById,
  getParticipantByEmail,
  saveParticipant,
  updateParticipantScore,
  // Predictions
  getPredictions,
  getPredictionsByUserId,
  savePredictions,
  // Questions
  getQuestions,
  saveQuestions,
  // Results
  getResults,
  saveResults,
  // Leaderboard
  getLeaderboard,
  // Utility
  disconnect,
  prisma,
};
