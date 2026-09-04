import { PrismaClient } from '@prisma/client';
import {
  school,
  majors,
  achievements,
  news,
  facilities,
} from '../src/data/mockData.js';

const prisma = new PrismaClient();

const DEFAULT_MAJOR_PINS = {
  PPLG: "1010",
  TJKT: "2020",
  "Busana": "3030",
  "Kuliner": "4040",
  "Kecantikan dan Spa": "5050",
  "Usaha Layanan Pariwisata": "6060",
  "Perhotelan": "7070",
};

async function main() {
  console.log("Seeding database...");

  // Seed School
  const schoolCount = await prisma.school.count();
  if (schoolCount === 0) {
    await prisma.school.create({
      data: {
        id: 1,
        name: school.name,
        location: school.location,
        tagline: school.tagline,
        description: school.description,
        studentCount: school.studentCount,
        teacherCount: school.teacherCount,
        achievementCount: school.achievementCount,
        majorCount: school.majorCount,
        coverPhoto: school.coverPhoto || "",
        principalName: school.principal.name,
        principalPhoto: school.principal.photo,
        principalGreeting: school.principal.greeting,
        vicePrincipalName: school.vicePrincipal.name,
        vicePrincipalPhoto: school.vicePrincipal.photo,
      }
    });
    console.log("School seeded.");
  }

  // Seed Majors
  const majorCount = await prisma.major.count();
  if (majorCount === 0) {
    for (const m of majors) {
      await prisma.major.create({
        data: {
          short: m.short,
          name: m.name,
          description: m.description,
          skills: m.skills,
          career: m.career,
          image: m.image || "",
        }
      });
    }
    console.log("Majors seeded.");
  }

  // Seed Achievements
  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    for (const a of achievements) {
      await prisma.achievement.create({
        data: {
          title: a.title,
          category: a.category,
          year: String(a.year),
          description: a.description,
          image: a.image || "",
        }
      });
    }
    console.log("Achievements seeded.");
  }

  // Seed News
  const newsCount = await prisma.news.count();
  if (newsCount === 0) {
    for (const n of news) {
      await prisma.news.create({
        data: {
          title: n.title,
          date: n.date,
          category: n.category,
          excerpt: n.excerpt,
          content: n.content,
          image: n.image || "",
          uploader: n.uploader || "Sekolah",
          uploaderType: n.uploaderType || "admin",
        }
      });
    }
    console.log("News seeded.");
  }

  // Seed Facilities
  const facilityCount = await prisma.facility.count();
  if (facilityCount === 0) {
    for (const f of facilities) {
      await prisma.facility.create({
        data: {
          name: f.name,
          description: f.description,
          image: f.image || "",
        }
      });
    }
    console.log("Facilities seeded.");
  }

  // Seed Pins
  const pinCount = await prisma.pin.count();
  if (pinCount === 0) {
    await prisma.pin.create({
      data: {
        role: "admin",
        name: "Admin",
        pin: "2323",
      }
    });
    for (const [name, pin] of Object.entries(DEFAULT_MAJOR_PINS)) {
      await prisma.pin.create({
        data: {
          role: "major",
          name: name,
          pin: pin,
        }
      });
    }
    console.log("Pins seeded.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
