export interface Exercise {
  id: number
  name: string
  difficulty: number
  repsTime: string
  cue: string
}

export interface ExerciseData {
  exercises: {
    lowerBody: Exercise[]
    upperBody: Exercise[]
    core: Exercise[]
    fullBody: Exercise[]
    cardioPlyo: Exercise[]
    mobilityBalance: Exercise[]
  }
  difficultyLevels: {
    [key: string]: string
  }
}