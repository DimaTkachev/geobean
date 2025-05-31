import * as fs from "node:fs";
import * as path from "node:path";

const createEnvFile = (
  targetPath: string,
  content: string,
  description: string,
): void => {
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, content);
    console.log(`✅ Created ${description}`);
  } else {
    console.log(`⚠️ ${description} already exists, skipping...`);
  }
};

// Backend environment files
const backendEnvExample = `# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=geobean
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
`;

const backendEnvDev = `# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=geobean_dev
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRES_IN=24h

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
`;

// Frontend environment files
const frontendEnvExample = `# API Configuration
VITE_API_URL=http://localhost:5001/api

# External Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
`;

const frontendEnvDev = `# API Configuration
VITE_API_URL=http://localhost:5001/api

# External Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
`;

const main = (): void => {
  // Create backend environment files
  createEnvFile(
    path.resolve(__dirname, "../backend/.env.example"),
    backendEnvExample,
    "Backend .env.example",
  );
  createEnvFile(
    path.resolve(__dirname, "../backend/.env.development"),
    backendEnvDev,
    "Backend .env.development",
  );

  // Create frontend environment files
  createEnvFile(
    path.resolve(__dirname, "../frontend/.env.example"),
    frontendEnvExample,
    "Frontend .env.example",
  );
  createEnvFile(
    path.resolve(__dirname, "../frontend/.env.development"),
    frontendEnvDev,
    "Frontend .env.development",
  );

  console.log("\n🎉 Environment setup complete!");
  console.log("\nNext steps:");
  console.log("1. Review the created .env files");
  console.log("2. Update any sensitive values in .env.development");
  console.log("3. Never commit .env.development to version control\n");
};

main();
