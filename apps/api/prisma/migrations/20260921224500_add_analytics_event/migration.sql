-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('profile_view', 'cv_download', 'contact_click', 'project_click', 'social_link_click');

-- CreateEnum
CREATE TYPE "AnalyticsVisitorType" AS ENUM ('authenticated', 'anonymous');

-- CreateTable
CREATE TABLE "analytics_event" (
    "id" SERIAL NOT NULL,
    "portfolioOwnerId" INTEGER NOT NULL,
    "visitorUserId" INTEGER,
    "anonymousVisitorId" VARCHAR(100),
    "visitorType" "AnalyticsVisitorType" NOT NULL,
    "eventType" "AnalyticsEventType" NOT NULL,
    "projectId" INTEGER,
    "target" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_event_portfolioOwnerId_idx" ON "analytics_event"("portfolioOwnerId");

-- CreateIndex
CREATE INDEX "analytics_event_eventType_idx" ON "analytics_event"("eventType");

-- CreateIndex
CREATE INDEX "analytics_event_createdAt_idx" ON "analytics_event"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_event_portfolioOwnerId_eventType_createdAt_idx" ON "analytics_event"("portfolioOwnerId", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_event_portfolioOwnerId_visitorType_idx" ON "analytics_event"("portfolioOwnerId", "visitorType");

-- CreateIndex
CREATE INDEX "analytics_event_portfolioOwnerId_visitorUserId_idx" ON "analytics_event"("portfolioOwnerId", "visitorUserId");

-- CreateIndex
CREATE INDEX "analytics_event_portfolioOwnerId_anonymousVisitorId_idx" ON "analytics_event"("portfolioOwnerId", "anonymousVisitorId");

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_portfolioOwnerId_fkey" FOREIGN KEY ("portfolioOwnerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_visitorUserId_fkey" FOREIGN KEY ("visitorUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projecct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
