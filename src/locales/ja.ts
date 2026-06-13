import type { Translations } from "./en";

export const ja: Translations = {
  meta: {
    title: "寄り添いAI | 高齢者ケア・インテリジェンス・プラットフォーム",
    description:
      "ケアをつなぐ、あなたに寄り添うAI。高齢者ケアをコーディネートする統合マルチエージェントシステム。",
  },

  nav: {
    brand: "寄り添いAI",
    tagline: "ケアをつなぐ、あなたに寄り添うAI。",
    liveRefresh: "AIライブ分析",
  },

  hero: {
    eyebrow: "高齢者ケア・インテリジェンス・プラットフォーム",
    headline: "あなたに寄り添うAI。",
    subheadline:
      "健康・安全・ケア・マネージャーの4つの専門エージェントがリアルタイムで連携し、高齢者の安全と家族への情報共有を実現します。",
    lastCapture: "最新健康記録",
  },

  patientCard: {
    label: "患者",
    arrangement: "居住形態未登録。",
  },

  stats: {
    targetPatient: "対象患者",
    latestRisk: "リスクレベル",
    overallScore: "総合スコア",
    medicationAdherence: "服薬遵守率",
    medicationsTracked: "件の服薬管理",
    monitoringStatus: "見守り状態",
    actionRequired: "要対応",
    stable: "安定",
    assignedTo: "担当者",
    caregivers: "名",
  },

  riskLabels: {
    LOW: "安定",
    MODERATE: "注意",
    HIGH: "警戒",
    CRITICAL: "緊急",
  },

  managerCard: {
    description: "AIケアマネージャー サマリー",
    overallRisk: "総合リスク",
    health: "健康",
    safety: "安全",
    care: "ケア",
    noActiveIncident: "インシデントなし",
    viewCarePlan: "ケアプランを確認",
    runLiveAnalysis: "ライブ分析を実行",
  },

  problemSolution: {
    title: "寄り添いAIについて",
    problem: {
      badge: "課題",
      body: "日本の高齢化社会では、介護者不足、高齢者の孤立、服薬不遵守、緊急対応の遅延が深刻な問題です。",
    },
    system: {
      badge: "解決策",
      body: "4つのAIエージェントが専門的に連携し、分散したデータを協調したケアへと変換します。",
    },
    value: {
      badge: "効果",
      body: "1つのダッシュボードが複雑なケアシグナルを、家族・介護者・ケアコーディネーターへの明確なアクションに変換します。",
    },
  },

  agentFlow: {
    title: "エージェントの連携フロー",
    description: "エージェント連携フロー",
    patientData: "患者データ",
    carePlan: "ケアプラン",
    agents: {
      health: {
        name: "健康エージェント",
        role: "リスク・健康管理",
        description: "バイタルトレンド、服薬遵守率、健康記録を分析してリスクスコアを算出します。",
      },
      safety: {
        name: "安全エージェント",
        role: "インシデント・緊急対応",
        description: "インシデント、転倒リスク、緊急シグナルを監視します。必要に応じてエスカレーションを実施します。",
      },
      care: {
        name: "ケアエージェント",
        role: "コーディネーション",
        description: "健康・安全情報をもとに介護者を割り当て、訪問スケジュールを管理し、家族に通知します。",
      },
      manager: {
        name: "マネージャーエージェント",
        role: "オーケストレーション",
        description: "全エージェントの出力を統合し、統一されたケアプランとエグゼクティブサマリーを生成します。",
      },
    },
  },

  agentCards: {
    title: "4エージェント、1つのケアループ",
    description: "エージェントステータス",
    active: "稼働中",
    health: {
      label: "健康エージェント",
    },
    safety: {
      label: "安全エージェント",
      noOpenIncident: "インシデントなし",
    },
    care: {
      label: "ケアエージェント",
      unassigned: "担当者未割当",
      scheduleVisit: "次回訪問を予定",
    },
    manager: {
      label: "マネージャーエージェント",
      reviewFollowups: "フォローアップを確認",
    },
    risk: "リスク",
    adherence: "遵守率",
    emergencyLevel: "緊急レベル",
    priority: "優先度",
    overall: "総合",
    score: "スコア",
  },

  activityFeed: {
    title: "最近のコーディネーションシグナル",
    description: "エージェント活動ログ",
    toneLabels: {
      health: "健康",
      safety: "安全",
      care: "ケア",
      manager: "マネージャー",
    },
  },

  analytics: {
    title: "リスク・服薬遵守トレンド",
    description: "健康分析",
    avgRisk: "平均リスクスコア",
    avgAdherence: "平均服薬遵守率",
    snapshots: "記録数",
    chartLoading: "グラフを読み込んでいます。",
    riskScore: "リスクスコア",
    adherence: "服薬遵守率",
  },

  patientDetails: {
    title: "患者詳細",
    description: "患者プロフィール",
    ageContext: "年齢情報",
    genderNotProvided: "性別未登録",
    latestStatus: "最新状態",
    addressNotProvided: "住所未登録",
    medicationAdherence: "服薬遵守率",
    overallRisk: "総合リスク",
    conditions: "病名・状態",
    caregivers: "担当介護者",
    medications: "服薬中の薬",
    recentIncident: "最近のインシデント",
    noRecentIncident: "インシデントなし",
    noIncidentSignals: "安全シグナルは検出されていません。",
  },

  liveRefresh: {
    title: "オンデマンドAI分析",
    description: "ライブAPIブリッジ",
    subtitle: "ライブデータに対してフルエージェントパイプラインをオンデマンドで実行します。",
    riskScore: "リスクスコア",
    riskLevel: "リスクレベル",
    priority: "優先度",
    idle: "待機中",
    liveConnected: "ライブ接続中",
    liveUnavailable: "ライブ利用不可",
    loadButton: "ライブAI分析を実行",
    loadingButton: "分析中...",
    liveApiLabel: "ライブAPI",
  },

  valueProposition: {
    title: "なぜ寄り添いAIが選ばれるのか",
    description: "インパクト",
    points: [
      "審査員はすぐに課題を理解できます：分断された高齢者ケア、遅延したエスカレーション、過剰な手動コーディネーション。",
      "インターフェースはエージェントの役割を明確にし、ケアプランを読みやすく、患者への影響を具体的に示します。",
      "ライブAPIブリッジはこれが静的なモックアップではなく、リアルなオーケストレーションサーフェスであることを証明します。",
    ],
  },

  footer: {
    built: "制作",
    hackathon: "ハッカソン 2026",
    tagline: "ケアをつなぐ、あなたに寄り添うAI。",
  },
};
