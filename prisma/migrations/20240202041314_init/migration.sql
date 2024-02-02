-- DropIndex
DROP INDEX `BlockedUser_userId_key` ON `BlockedUser`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `authType` ENUM('NORMAL', 'GOOGLE', 'FACEBOOK') NOT NULL DEFAULT 'NORMAL',
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `BanKeyword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
