/*
  Warnings:

  - You are about to drop the `IssueTraceId` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."IssueTraceId" DROP CONSTRAINT "IssueTraceId_issueId_fkey";

-- AlterTable
ALTER TABLE "AnalysisIssue" ADD COLUMN     "traceIds" TEXT[];

-- DropTable
DROP TABLE "public"."IssueTraceId";
