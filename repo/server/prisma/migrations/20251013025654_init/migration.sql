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
CREATE TABLE "VirtualDomSummary" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "virtualDomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualDomSummary_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "ResourceUsage" (
    "id" SERIAL NOT NULL,
    "input" INTEGER NOT NULL,
    "output" INTEGER NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "ResourceUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualDomSummaryUsage" (
    "id" SERIAL NOT NULL,
    "virtualWebSummaryId" INTEGER NOT NULL,
    "resourceUsageId" INTEGER NOT NULL,

    CONSTRAINT "VirtualDomSummaryUsage_pkey" PRIMARY KEY ("id")
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
    "resourceUsageId" INTEGER NOT NULL,

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
CREATE UNIQUE INDEX "VirtualDomSummaryUsage_virtualWebSummaryId_key" ON "VirtualDomSummaryUsage"("virtualWebSummaryId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualDomSummaryUsage_resourceUsageId_key" ON "VirtualDomSummaryUsage"("resourceUsageId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualDomAnalysisUsage_virtualDomAnalysisId_key" ON "VirtualDomAnalysisUsage"("virtualDomAnalysisId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualDomAnalysisUsage_resourceUsageId_key" ON "VirtualDomAnalysisUsage"("resourceUsageId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueTraceId_issueId_traceId_key" ON "IssueTraceId"("issueId", "traceId");

-- AddForeignKey
ALTER TABLE "VirtualWebConfig" ADD CONSTRAINT "VirtualWebConfig_virtualWebId_fkey" FOREIGN KEY ("virtualWebId") REFERENCES "VirtualWeb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualWebConfig" ADD CONSTRAINT "VirtualWebConfig_mainVirtualDomId_fkey" FOREIGN KEY ("mainVirtualDomId") REFERENCES "VirtualDom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomSummary" ADD CONSTRAINT "VirtualDomSummary_virtualDomId_fkey" FOREIGN KEY ("virtualDomId") REFERENCES "VirtualDom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDom" ADD CONSTRAINT "VirtualDom_virtualWebId_fkey" FOREIGN KEY ("virtualWebId") REFERENCES "VirtualWeb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomSummaryUsage" ADD CONSTRAINT "VirtualDomSummaryUsage_virtualWebSummaryId_fkey" FOREIGN KEY ("virtualWebSummaryId") REFERENCES "VirtualDomSummary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomSummaryUsage" ADD CONSTRAINT "VirtualDomSummaryUsage_resourceUsageId_fkey" FOREIGN KEY ("resourceUsageId") REFERENCES "ResourceUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomAnalysis" ADD CONSTRAINT "VirtualDomAnalysis_virtualDomId_fkey" FOREIGN KEY ("virtualDomId") REFERENCES "VirtualDom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomAnalysisUsage" ADD CONSTRAINT "VirtualDomAnalysisUsage_virtualDomAnalysisId_fkey" FOREIGN KEY ("virtualDomAnalysisId") REFERENCES "VirtualDomAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualDomAnalysisUsage" ADD CONSTRAINT "VirtualDomAnalysisUsage_resourceUsageId_fkey" FOREIGN KEY ("resourceUsageId") REFERENCES "ResourceUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisIssue" ADD CONSTRAINT "AnalysisIssue_virtualDomAnalysisId_fkey" FOREIGN KEY ("virtualDomAnalysisId") REFERENCES "VirtualDomAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueTraceId" ADD CONSTRAINT "IssueTraceId_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "AnalysisIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
