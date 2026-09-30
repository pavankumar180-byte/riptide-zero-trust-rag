import { TrustScoreState } from '../types';

export class TrustScoreManager {
  private state: TrustScoreState = {
    score: 100,
    status: 'SAFE',
    history: [
      {
        timestamp: new Date().toLocaleTimeString(),
        change: 0,
        new_score: 100,
        reason: 'Session initiated with Zero-Trust baseline 100/100'
      }
    ]
  };

  private listeners: Array<(state: TrustScoreState) => void> = [];

  public getState(): TrustScoreState {
    return { ...this.state };
  }

  public subscribe(listener: (state: TrustScoreState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach(l => l(currentState));
  }

  public evaluateThreat(params: {
    queryRisk: number;
    isQueryBlocked: boolean;
    quarantinedCount: number;
    piiLeaksCount: number;
  }): { scoreDelta: number; newScore: number } {
    let penalty = 0;
    const reasons: string[] = [];

    if (params.isQueryBlocked) {
      penalty += 25;
      reasons.push(`High risk query blocked (${params.queryRisk}% risk)`);
    } else if (params.queryRisk > 40) {
      penalty += 10;
      reasons.push(`Suspicious query probe detected (${params.queryRisk}% risk)`);
    }

    if (params.quarantinedCount > 0) {
      const chunkPenalty = params.quarantinedCount * 15;
      penalty += chunkPenalty;
      reasons.push(`${params.quarantinedCount} malicious retrieved chunk(s) quarantined`);
    }

    if (params.piiLeaksCount > 0) {
      penalty += 5;
      reasons.push(`Corpus PII exfiltration attempted (${params.piiLeaksCount} identifier(s) redacted)`);
    }

    const previousScore = this.state.score;
    const newScore = Math.max(0, previousScore - penalty);
    const scoreDelta = newScore - previousScore;

    if (penalty > 0) {
      let status: 'SAFE' | 'CAUTION' | 'COMPROMISED' = 'SAFE';
      if (newScore < 50) status = 'COMPROMISED';
      else if (newScore < 80) status = 'CAUTION';

      this.state = {
        score: newScore,
        status,
        history: [
          {
            timestamp: new Date().toLocaleTimeString(),
            change: scoreDelta,
            new_score: newScore,
            reason: reasons.join('; ')
          },
          ...this.state.history.slice(0, 19)
        ]
      };
      this.notify();
    }

    return { scoreDelta, newScore };
  }

  public resetScore() {
    this.state = {
      score: 100,
      status: 'SAFE',
      history: [
        {
          timestamp: new Date().toLocaleTimeString(),
          change: 0,
          new_score: 100,
          reason: 'Trust Score reset to pristine 100/100 baseline'
        }
      ]
    };
    this.notify();
  }
}

export const trustScoreManager = new TrustScoreManager();
