import { DayLog } from '../store/hydration.store';
import { differenceInHours } from 'date-fns';

export type HealthAlert = {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
};

export function analyzeHydration(logs: DayLog[]): HealthAlert[] {
  const alerts: HealthAlert[] = [];
  if (logs.length === 0) return alerts;

  // 1. Check Goal Consistency
  const goalMetCount = logs.filter(log => log.totalMl >= log.goalMl).length;
  const goalMetRatio = goalMetCount / logs.length;

  if (goalMetRatio < 0.3) {
    alerts.push({
      type: 'warning',
      title: 'Hydratation insuffisante',
      message: `Vous n'avez atteint votre objectif que ${goalMetCount} fois sur les ${logs.length} derniers jours. Attention à la déshydratation chronique.`
    });
  } else if (goalMetRatio >= 0.8) {
    alerts.push({
      type: 'success',
      title: 'Excellente régularité',
      message: 'Bravo ! Vous atteignez presque toujours vos objectifs.'
    });
  }

  // 2. Check Regularity within days
  let longGapsFound = false;
  logs.forEach(log => {
    if (log.entries.length > 2) {
      const sortedEntries = [...log.entries].sort((a, b) => a.ts - b.ts);
      for (let i = 1; i < sortedEntries.length; i++) {
        const gap = (sortedEntries[i].ts - sortedEntries[i-1].ts) / (1000 * 60 * 60);
        if (gap > 6) longGapsFound = true; // More than 6 hours gap during the day
      }
    }
  });

  if (longGapsFound) {
    alerts.push({
      type: 'info',
      title: 'Espaces importants',
      message: 'Certaines journées présentent de longues périodes sans boire. Essayez de boire par petites quantités tout au long de la journée.'
    });
  }

  return alerts;
}

export function generateHTMLReport(profileName: string, logs: DayLog[]): string {
  const alerts = analyzeHydration(logs);
  const rows = logs.map(log => `
    <tr>
      <td>${log.date}</td>
      <td>${log.totalMl}ml</td>
      <td>${log.goalMl}ml</td>
      <td>${log.totalMl >= log.goalMl ? '✅' : '❌'}</td>
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          h1 { color: #1EA7FD; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f8f8; }
          .alert { padding: 10px; border-radius: 5px; margin-top: 10px; margin-bottom: 10px; }
          .warning { background-color: #fee2e2; border-left: 5px solid #ef4444; }
          .success { background-color: #dcfce7; border-left: 5px solid #10b981; }
          .info { background-color: #e0f2fe; border-left: 5px solid #3b82f6; }
        </style>
      </head>
      <body>
        <h1>Rapport d'Hydratation : ${profileName}</h1>
        <p>Généré le ${new Date().toLocaleDateString()}</p>

        <h2>Analyse Santé</h2>
        ${alerts.map(a => `<div class="alert ${a.type}"><strong>${a.title}</strong>: ${a.message}</div>`).join('')}

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total bu</th>
              <th>Objectif</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}
