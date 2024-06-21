-- CreateTable
CREATE TABLE `Favourite` (
    `id` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `cuisine` VARCHAR(255) NOT NULL,

    INDEX `favourite_ibfk_1`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `review_ibfk_1`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `auth0Id` VARCHAR(191) NOT NULL DEFAULT '',
    `gender` ENUM('Male', 'Female') NOT NULL DEFAULT 'Male',
    `age` INTEGER NULL,
    `location` VARCHAR(255) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_auth0Id_key`(`auth0Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `favourite_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
