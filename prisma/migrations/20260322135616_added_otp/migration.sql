-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginOtp" TEXT,
ADD COLUMN     "otpExpires" TIMESTAMP(3);
