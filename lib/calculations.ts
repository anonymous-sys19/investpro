import type { Contribution } from "@/lib/db";

export interface MonthProjection {
  month: number;
  label: string;
  startBalance: number;
  interest: number;
  contributions: number;
  endBalance: number;
}

/**
 * Converts annual interest rate to monthly rate.
 * e.g. 5.5% annual -> 0.4583% monthly
 */
function annualToMonthly(annualRate: number): number {
  return annualRate / 365; // Interés diario para cálculo más preciso
}

/**
 * Calculates the current balance based on:
 * - Initial capital
 * - Annual interest rate (converted to monthly internally)
 * - Creation date
 * - All contributions with their dates
 *
 * Each completed month: balance = (previousBalance * (1 + monthlyRate/100)) + contributions of that month
 */
export function calculateCurrentBalance(
  initialCapital: number,
  annualInterest: number,
  createdAt: string,
  contributions: Contribution[],
): number {
  const dailyRate = annualInterest / 365; // Tasa diaria
  const start = new Date(createdAt);
  const now = new Date();

  let balance = initialCapital;
  let currentDate = new Date(start);

  // Iterar día a día
  while (currentDate <= now) {
    // Aplicar interés diario
    balance = balance * (1 + dailyRate / 100);

    // Sumar aportes del día
    const dayContribs = contributions
      .filter((c) => {
        const cDate = new Date(c.created_at);
        return cDate.toDateString() === currentDate.toDateString();
      })
      .reduce((sum, c) => sum + c.amount, 0);

    balance += dayContribs;

    // Pasar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return balance;
}

/**
 * Generates a 12-month projection starting from the current balance.
 * Uses daily compounding for accurate projections.
 */
export function generateProjection(
  initialCapital: number,
  annualInterest: number,
  createdAt: string,
  contributions: Contribution[],
  months: number = 12,
): MonthProjection[] {
  const dailyRate = annualInterest / 365;
  const currentBalance = calculateCurrentBalance(
    initialCapital,
    annualInterest,
    createdAt,
    contributions,
  );

  const projections: MonthProjection[] = [];
  let balance = currentBalance;
  const now = new Date();

  for (let m = 1; m <= months; m++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const label = futureDate.toLocaleDateString("es-CR", {
      month: "short",
      year: "numeric",
    });

    // Project for approximately 30 days (1 month)
    let projectedBalance = balance;
    const daysInMonth = 30; // Use average of 30 days per month for projection
    let monthlyInterest = 0;

    for (let d = 0; d < daysInMonth; d++) {
      const dailyInterest = projectedBalance * (dailyRate / 100);
      projectedBalance += dailyInterest;
      monthlyInterest += dailyInterest;
    }

    const endBalance = projectedBalance;

    projections.push({
      month: m,
      label,
      startBalance: balance,
      interest: monthlyInterest,
      contributions: 0,
      endBalance,
    });

    balance = endBalance;
  }

  return projections;
}

/**
 * Builds the real month-by-month history from creation date to now.
 * Calculates day-by-day but groups results by month.
 * Each row shows: month, start balance, total interest earned that month, contributions that month, end balance.
 */
export function getMonthlyHistory(
  initialCapital: number,
  annualInterest: number,
  createdAt: string,
  contributions: Contribution[],
): MonthProjection[] {
  const dailyRate = annualInterest / 365;
  const start = new Date(createdAt);
  start.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const history: MonthProjection[] = [];
  let balance = initialCapital;
  let currentDate = new Date(start);
  let currentMonth = start.getMonth();
  let currentYear = start.getFullYear();
  let monthStartBalance = balance;
  let monthTotalInterest = 0;
  let monthTotalContributions = 0;

  // Iterate day by day
  while (currentDate <= now) {
    // Check if we've entered a new month
    if (
      currentDate.getMonth() !== currentMonth ||
      currentDate.getFullYear() !== currentYear
    ) {
      // Save previous month
      const monthDate = new Date(currentYear, currentMonth, 1);
      const label = monthDate.toLocaleDateString("es-CR", {
        month: "short",
        year: "numeric",
      });

      history.push({
        month: history.length,
        label,
        startBalance: monthStartBalance,
        interest: monthTotalInterest,
        contributions: monthTotalContributions,
        endBalance:
          monthStartBalance + monthTotalInterest + monthTotalContributions,
      });

      // Reset for new month
      currentMonth = currentDate.getMonth();
      currentYear = currentDate.getFullYear();
      monthStartBalance = balance;
      monthTotalInterest = 0;
      monthTotalContributions = 0;
    }

    // Apply daily interest
    const interestToday = balance * (dailyRate / 100);
    balance += interestToday;
    monthTotalInterest += interestToday;

    // Add contributions for this day
    const dayContribs = contributions
      .filter((c) => {
        const cDate = new Date(c.created_at);
        cDate.setHours(0, 0, 0, 0);
        return cDate.getTime() === currentDate.getTime();
      })
      .reduce((sum, c) => sum + c.amount, 0);

    balance += dayContribs;
    monthTotalContributions += dayContribs;

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add the last month
  if (
    history.length === 0 ||
    history[history.length - 1].label !==
      new Date(currentYear, currentMonth, 1).toLocaleDateString("es-CR", {
        month: "short",
        year: "numeric",
      })
  ) {
    const monthDate = new Date(currentYear, currentMonth, 1);
    const label = monthDate.toLocaleDateString("es-CR", {
      month: "short",
      year: "numeric",
    });

    history.push({
      month: history.length,
      label,
      startBalance: monthStartBalance,
      interest: monthTotalInterest,
      contributions: monthTotalContributions,
      endBalance: balance,
    });
  }

  return history;
}
// esta funcion hace lo siguiente calcula la diferencia en meses entre dos fechas, considerando solo el año y el mes (ignora el día). Por ejemplo, si d1 es "2023-01-15" y d2 es "2023-03-10", la función devolverá 2, ya que hay dos meses completos entre enero y marzo.

function monthDiff(d1: Date, d2: Date): number {
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  );
}
//

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    // en moneda CR seria
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
