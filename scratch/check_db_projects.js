const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/illusory-studios';

const ProjectSchema = new mongoose.Schema({
  navigation: String,
  title: String,
  image: String,
  video: String,
  gallery: [String],
  description: String,
  tags: String
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function checkProjects() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');
    const projects = await Project.find();
    console.log(`Found ${projects.length} projects in database.`);
    if (projects.length > 0) {
      console.log('Sample project URLs:');
      projects.slice(0, 5).forEach(p => {
        console.log(`- Title: ${p.title}`);
        console.log(`  Image: ${p.image}`);
        console.log(`  Video: ${p.video}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProjects();
