-- AddColumn
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "create_at" TIMESTAMPTZ;

-- AddColumn
ALTER TABLE "Vote" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
    ON DELETE NO ACTION ON UPDATE NO ACTION;