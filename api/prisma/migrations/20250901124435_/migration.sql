/*
  Warnings:

  - You are about to drop the column `description` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_url` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `naver_blog_url` on the `companies` table. All the data in the column will be lost.
  - Added the required column `address` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagram` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `naver` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "instagram_url",
DROP COLUMN "naver_blog_url",
ADD COLUMN     "address" VARCHAR(255) NOT NULL,
ADD COLUMN     "business" VARCHAR(100) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "instagram" TEXT NOT NULL,
ADD COLUMN     "naver" TEXT NOT NULL,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "phone" VARCHAR(20) NOT NULL;
