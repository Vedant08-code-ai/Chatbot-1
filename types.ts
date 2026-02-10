
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export enum PhysicsTopic {
  KINEMATICS = 'Kinematics',
  DYNAMICS = 'Dynamics',
  ENERGY = 'Energy & Work',
  MOMENTUM = 'Momentum',
  THERMODYNAMICS = 'Thermodynamics',
  WAVES = 'Waves & Optics',
  ELECTROMAGNETISM = 'Electromagnetism'
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  topic?: PhysicsTopic;
}
