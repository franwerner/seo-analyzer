-- CreateEnum
CREATE TYPE "ValidationType" AS ENUM ('scheme', 'semantic', 'spelling', 'resource', 'structure');

-- CreateTable
CREATE TABLE "VirtualWeb" (
    "id" SERIAL NOT NULL,
    "host" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualWeb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualWebConfig" (
    "id" SERIAL NOT NULL,
    "virtualWebId" INTEGER NOT NULL,
    "mainVirtualDomId" INTEGER NOT NULL,

    CONSTRAINT "VirtualWebConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualWebSummary" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "virtualWebId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualWebSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualDom" (
    "id" SERIAL NOT NULL,
    "virtualWebId" INTEGER NOT NULL,
    "pathname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualDom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIUsage" (
    "id" SERIAL NOT NULL,
    "input" INTEGER NOT NULL,
    "output" INTEGER NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "AIUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualWebSummaryUsage" (
    "id" SERIAL NOT NULL,
    "virtualWebSummaryId" INTEGER NOT NULL,
    "AIUsageId" INTEGER NOT NULL,

    CONSTRAINT "VirtualWebSummaryUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualDomAnalysis" (
    "id" SERIAL NOT NULL,
    "virtualDomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualDomAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualDomAnalysisUsage" (
    "id" SERIAL NOT NULL,
    "virtualDomAnalysisId" INTEGER NOT NULL,
    "AIUsageId" INTEGER NOT NULL,

    CONSTRAINT "VirtualDomAnalysisUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisIssue" (
    "id" SERIAL NOT NULL,
    "virtualDomAnalysisId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "ValidationType" NOT NULL,

    CONSTRAINT "AnalysisIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueTraceId" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "traceId" TEXT NOT NULL,

    CONSTRAINT "IssueTraceId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualWeb_host_key" ON "VirtualWeb"("host");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualWebConfig_virtualWebId_key" ON "VirtualWebConfig"("virtualWebId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualWebConfig_mainVirtualDomId_key" ON "VirtualWebConfig"("mainVirtualDomId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualDom_virtualWebId_pathname_key" ON "VirtualDom"("virtualWebId", "pathname");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualWebSummaryUsage_virtualWebSummaryId_key" ON "VirtualWebSummaryUsage"("virtualWebSummaryId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualWebSummaryUsage_AIUsageId_key" ON "VirtualWebSummaryUsage"("AIUsageId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualDomAnalysisUsage_virtualDomAnalysisId_key" ON "VirtualDomAnalysisUsage"("virtualDomAnalysisId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualDomAnalysisUsage_AIUsageId_key" ON "VirtualDomAnalysisUsage"("AIUsageId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueTraceId_issueId_traceId_key" ON "IssueTraceId"("issueId", "traceId");

-- AddForeignKey
ALTER TABLE "VirtualWebConfig" ADD CONSTRAINT "VirtualWebConfig_virtualWebId_fkey" FOREIGN KEY ("virtualWebId") REFERENCES "VirtualWeb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualWebConfig" ADD CONSTRAINT "VirtualWebConfig_mainVirtualDomId_fkey" FOREIGN KEY ("mainVirtualDomId") REFERENCES "VirtualDom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualWebSummary" ADD CONSTRAINT "VirtualWebSummary_virtualWebId_fkey" FOREIGN KEY ("virtualWebId") REFERENCES "VirtualWeb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDom" ADD CONSTRAINT "VirtualDom_virtualWebId_fkey" FOREIGN KEY ("virtualWebId") REFERENCES "VirtualWeb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualWebSummaryUsage" ADD CONSTRAINT "VirtualWebSummaryUsage_virtualWebSummaryId_fkey" FOREIGN KEY ("virtualWebSummaryId") REFERENCES "VirtualWebSummary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualWebSummaryUsage" ADD CONSTRAINT "VirtualWebSummaryUsage_AIUsageId_fkey" FOREIGN KEY ("AIUsageId") REFERENCES "AIUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomAnalysis" ADD CONSTRAINT "VirtualDomAnalysis_virtualDomId_fkey" FOREIGN KEY ("virtualDomId") REFERENCES "VirtualDom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomAnalysisUsage" ADD CONSTRAINT "VirtualDomAnalysisUsage_virtualDomAnalysisId_fkey" FOREIGN KEY ("virtualDomAnalysisId") REFERENCES "VirtualDomAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomAnalysisUsage" ADD CONSTRAINT "VirtualDomAnalysisUsage_AIUsageId_fkey" FOREIGN KEY ("AIUsageId") REFERENCES "AIUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisIssue" ADD CONSTRAINT "AnalysisIssue_virtualDomAnalysisId_fkey" FOREIGN KEY ("virtualDomAnalysisId") REFERENCES "VirtualDomAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueTraceId" ADD CONSTRAINT "IssueTraceId_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "AnalysisIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
