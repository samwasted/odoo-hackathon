import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const db = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(" ")[0] });
    const password = await bcrypt.hash('password123', 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password,
        isPublic: Math.random() > 0.3,
        skillsOffered: faker.helpers.arrayElements([
          "PROGRAMMING", "DESIGN", "WRITING", "MARKETING", "MUSIC",
          "COOKING", "PUBLIC_SPEAKING", "VIDEO_EDITING", "DATA_ANALYSIS"
        ], faker.number.int({ min: 1, max: 4 })),
        skillsWanted: faker.helpers.arrayElements([
          "PROGRAMMING", "DESIGN", "WRITING", "MARKETING", "MUSIC",
          "COOKING", "PUBLIC_SPEAKING", "VIDEO_EDITING", "DATA_ANALYSIS"
        ], faker.number.int({ min: 1, max: 4 })),
      }
    });

    console.log(`Created user: ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
