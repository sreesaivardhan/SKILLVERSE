/**
 * Embedding Service for SkillVerse
 * Uses the all-MiniLM-L6-v2 model from Hugging Face for generating sentence embeddings
 */

const { pipeline } = require('@xenova/transformers');
const mongoose = require('mongoose');
const User = require('../models/User');
const Skill = require('../models/Skill');

// Cache for the embedding model to avoid reloading
let embeddingModel = null;

/**
 * Initialize the embedding model
 * @returns {Promise<Object>} The loaded model
 */
async function getEmbeddingModel() {
  if (embeddingModel) {
    return embeddingModel;
  }
  
  console.log('Loading embedding model...');
  // Load the feature-extraction pipeline with the all-MiniLM-L6-v2 model
  embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('Embedding model loaded successfully');
  
  return embeddingModel;
}

/**
 * Generate embeddings for a text or array of texts
 * @param {string|string[]} texts - Text or array of texts to embed
 * @returns {Promise<Float32Array|Float32Array[]>} The generated embeddings
 */
async function generateEmbeddings(texts) {
  const model = await getEmbeddingModel();
  
  // Handle both single text and arrays
  const isArray = Array.isArray(texts);
  const textArray = isArray ? texts : [texts];
  
  // Generate embeddings
  const output = await model(textArray, { pooling: 'mean', normalize: true });
  const embeddings = output.map(item => item.data);
  
  // Return single embedding or array based on input
  return isArray ? embeddings : embeddings[0];
}

/**
 * Find similar skills based on a query
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of similar skills with similarity scores
 */
async function findSimilarSkills(query, limit = 5) {
  const queryEmbedding = await generateEmbeddings(query);
  
  // Get all skills from the database
  const skills = await Skill.find({});
  
  // Generate embeddings for all skill descriptions
  const skillTexts = skills.map(skill => skill.description);
  const skillEmbeddings = await generateEmbeddings(skillTexts);
  
  // Calculate similarity scores
  const similarities = skillEmbeddings.map((embedding, index) => {
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    return {
      skill: skills[index],
      similarity
    };
  });
  
  // Sort by similarity and return top results
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Find instructors with similar skills to the query
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of instructors with similarity scores
 */
async function findSimilarInstructors(query, limit = 5) {
  const queryEmbedding = await generateEmbeddings(query);
  
  // Get all instructors from the database
  const instructors = await User.find({ role: 'instructor' }).populate('skills');
  
  // Generate embeddings for instructor skill descriptions
  const instructorProfiles = instructors.map(instructor => {
    const skillDescriptions = instructor.skills.map(skill => skill.description).join(' ');
    return `${instructor.name} specializes in ${skillDescriptions}`;
  });
  
  const instructorEmbeddings = await generateEmbeddings(instructorProfiles);
  
  // Calculate similarity scores
  const similarities = instructorEmbeddings.map((embedding, index) => {
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    return {
      instructor: instructors[index],
      similarity
    };
  });
  
  // Sort by similarity and return top results
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Float32Array} a - First vector
 * @param {Float32Array} b - Second vector
 * @returns {number} Cosine similarity (between -1 and 1)
 */
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
  generateEmbeddings,
  findSimilarSkills,
  findSimilarInstructors
};
