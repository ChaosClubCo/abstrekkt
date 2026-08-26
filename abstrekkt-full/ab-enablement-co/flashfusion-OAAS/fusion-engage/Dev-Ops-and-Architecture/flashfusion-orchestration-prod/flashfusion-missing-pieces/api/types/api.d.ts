export type Lesson = {
  topic: string;
  level: string;
  objectives: string[];
  activities: Array<{ type: string; prompt?: string; items?: number }>;
  standards: string[];
};
