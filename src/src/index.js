import jwt from 'jsonwebtoken';

function parseWarningPeriod(s) {
  try {
    return parseInt(s, 10);
  } catch (e) {
    return null;
  }
}

function getCurrentEpochInSeconds() {
  const currentDate = new Date();
  const currentEpochInMs = currentDate.getTime();
  return Math.floor(currentEpochInMs / 1000);
}

function main() {
  const token = process.argv[2];
  const warningPeriodInDays = parseWarningPeriod(process.argv[3]) || 0;

  if (!token) {
    console.error('no token specified');
    process.exit(1);
  }

  const tokenPayload = jwt.decode(token);
  const expiryTimestamp = tokenPayload.exp;

  if (!expiryTimestamp) {
    console.log('token has no expiry information');
    return;
  }

  const currentTimestamp = getCurrentEpochInSeconds();
  const warningPeriodInSeconds = warningPeriodInDays * 24 * 60 * 60;

  if (expiryTimestamp < currentTimestamp + warningPeriodInSeconds) {
    console.error(`token expires in less than ${warningPeriodInDays} days`);
    process.exit(2);
  }
}

main();
