/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Favourite` DROP FOREIGN KEY `favourite_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `review_ibfk_1`;

-- AlterTable
ALTER TABLE `Favourite` MODIFY `userId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Review` MODIFY `userId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `favourite_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
