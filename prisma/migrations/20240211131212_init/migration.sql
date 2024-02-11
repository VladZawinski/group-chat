-- CreateTable
CREATE TABLE `Subscribe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `followerId` INTEGER NOT NULL,
    `followsId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Subscribe_followerId_followsId_key`(`followerId`, `followsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subscribe` ADD CONSTRAINT `Subscribe_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscribe` ADD CONSTRAINT `Subscribe_followsId_fkey` FOREIGN KEY (`followsId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
