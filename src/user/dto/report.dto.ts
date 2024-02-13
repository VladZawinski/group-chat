import { ReportReason } from "@prisma/client";

export interface CreateReportDto {
    reason: ReportReason
    messageId: number
}

export interface HasAlreadyReportDto {
    alreadyReported: boolean
    reportedAt?: Date
}