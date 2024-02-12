import { ReportReason } from "@prisma/client";

export interface CreateReportDto {
    reason: ReportReason
    messageId: number
}