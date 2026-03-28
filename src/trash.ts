import { Schema, model, Types } from 'mongoose';
import { notFound } from './app/middleware/notFound';

/* ===================== ENUMS ===================== */
const USER_ROLE = ['user', 'admin'] as const;
const ACCOUNT_STATUS = ['active', 'inactive', 'blocked'] as const;
const WORKOUT_TYPE = ['strength', 'cardio', 'hiit', 'yoga', 'stretching'] as const;
const INTENSITY = ['low', 'medium', 'high'] as const;
const MEAL_TYPE = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
const CATEGORY_TYPE = ['energy', 'digestion', 'immunity'] as const;

/* ===================== USER ===================== */
const UserSchema = new Schema(
     {
          email: {
               type: String,
               unique: true,
               lowercase: true,
          },
          phoneNumber: {
               type: String,
               default: '',
               index: true,
          },
          fullName: { type: String },
          firstName: { type: String },
          lastName: { type: String },
          image: { type: String },
          role: {
               type: String,
               enum: USER_ROLE,
               default: 'user',
          },
          password: {
               type: String,
               required: false,
               select: false,
               minlength: 8,
          },
          verified: {
               type: Boolean,
               default: false,
          },
          status: {
               type: String,
               default: 'active',
          },
          region: {
               type: String,
               default: '',
          },
          location: {
               type: String,
               default: '',
          },
          authProvider: {
               type: String,
               default: 'local',
          },
            socialId: {
               type: String,
               default: '', // Stores either Apple or Google ID
          },
          isResetPassword: {
               type: Boolean,
               default: false,
          },
          oneTimeCode: {
               type: Number,
               default: null,
          },
          OTPExpireAt: {
               type: Date,
               default: null,
          },
          isDeleted: {
               type: Boolean,
               default: false,
          },
     },
     { timestamps: true },
);

 const User = model('User', UserSchema);

/* ===================== BIOLOGICAL INFORMATION ===================== */
const BiologicalInfoSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
          gender: { type: String },
          state: { type: String },
          age: { type: String },
          height: { type: String },
          weight: { type: String },
          bodyFat: { type: String },
          muscleMass: { type: String },
     },
     { timestamps: true },
);

 const BiologicalInformation = model('BiologicalInformation', BiologicalInfoSchema);

/* ===================== ONBOARDING ASSESSMENT ===================== */
const OnboardingAssessmentSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
          fitnessGoal: { type: [String] },
          activityLevel: { type: String },
          exerciseLevel: { type: String },
          workoutsType: { type: [String] },
          eatingHabits: { type: [String] },
          dailyMeals: { type: Number },
          foodTypes: { type: [String] },
          unusualSynonyms: { type: [String] },
          medicalConditions: { type: [String] },
     },
     { timestamps: true },
);

 const OnboardingAssessment = model('OnboardingAssessment', OnboardingAssessmentSchema);

/* ===================== WORKOUT ONBOARDING QUIZ ===================== */
const WorkoutOnboardingQuizSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
          currentActiveness: { type: String },
          exerciseWantAdd: { type: String },
          consistentlyWorkoutPeriod: { type: String },
          workoutPlanGoal: { type: String },
          bodyPartOfImprovement: { type: String },
          currentWorkoutPlace: { type: String },
          isAbleToGoGym: { type: String },
          barriersToGymAccess: { type: [String] },
          availableEquipment: { type: [String] },
          weeklyTrainingDays: { type: String },
          workoutSession: { type: String },
     },
     { timestamps: true },
);

 const WorkoutOnboardingQuiz = model('WorkoutOnboardingQuiz', WorkoutOnboardingQuizSchema);

/* ===================== SHARED SUBSCHEMAS ===================== */
const TargetConsumedSchema = new Schema(
     {
          target: { type: Number, default: 0 },
          consumed: { type: Number, default: 0 },
     },
     { _id: false },
);

const MacrosSchema = new Schema(
     {
          protein: TargetConsumedSchema,
          carbs: TargetConsumedSchema,
          fat: TargetConsumedSchema,
     },
     { _id: false },
);

const WaterSchema = new Schema(
     {
          targetOz: { type: Number, default: 0 },
          consumedOz: { type: Number, default: 0 },
     },
     { _id: false },
);

/* ===================== USER GOALS ===================== */
const UserGoalsSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
          biologicalInformationId: {
               type: Types.ObjectId,
               ref: 'BiologicalInformation',
          },
          onboardingAssessmentId: {
               type: Types.ObjectId,
               ref: 'OnboardingAssessment',
          },
          date: Date,
          calories: TargetConsumedSchema,
          macros: MacrosSchema,
          waterIntake: WaterSchema,
     },
     { timestamps: true },
);

 const UserGoals = model('UserGoals', UserGoalsSchema);

/* ===================== CATEGORY ITEMS ===================== */
const CategoryItemSchema = new Schema(
     {
          goalsId: { type: Types.ObjectId, ref: 'UserGoals', required: true },
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          category: { type: String, enum: CATEGORY_TYPE },
          name: { type: String },
          target: { type: Number, default: 0 },
          consumed: { type: Number, default: 0 },
          isGoodIfHigh: { type: Boolean, default: true },
     },
     { timestamps: true },
);

 const CategoryItem = model('CategoryItem', CategoryItemSchema);

/* ===================== MEAL PLANS ===================== */
const MonthlyMealPlanSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          biologicalInformationId: {
               type: Types.ObjectId,
               ref: 'BiologicalInformation',
          },
          onboardingAssessmentId: {
               type: Types.ObjectId,
               ref: 'OnboardingAssessment',
          },
          month: { type: Number },
          year: { type: Number },
     },
     { timestamps: true },
);

 const UserMonthlyMealPlan = model('UserMonthlyMealPlan', MonthlyMealPlanSchema);

const DailyMealPlanSchema = new Schema(
     {
          mealPlanId: {
               type: Types.ObjectId,
               ref: 'UserMonthlyMealPlan',
               required: true,
          },
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          date: Date,
          mealType: { type: String, enum: MEAL_TYPE },
          notes: { type: String },
     },
     { timestamps: true },
);

 const UserDailyMealPlan = model('UserDailyMealPlan', DailyMealPlanSchema);

const FoodItemSchema = new Schema(
     {
          mealPlanId: {
               type: Types.ObjectId,
               ref: 'UserMonthlyMealPlan',
               required: true,
          },
          mealDayId: {
               type: Types.ObjectId,
               ref: 'UserDailyMealPlan',
               required: true,
          },
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          name: { type: String },
          calories: { type: Number },
          protein: { type: Number },
          carbs: { type: Number },
          fat: { type: Number },
     },
     { timestamps: true },
);

 const FoodItem = model('FoodItem', FoodItemSchema);

/* ===================== WORKOUT PLANS ===================== */
const ExerciseSchema = new Schema(
     {
          workoutSessionId: {
               type: Types.ObjectId,
               ref: 'DailyWorkoutSession',
               required: true,
          },
          workoutPlanId: {
               type: Types.ObjectId,
               ref: 'UserWeeklyWorkoutPlan',
               required: true,
          },
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          name: { type: String },
          muscleGroups: { type: [String] },
          durationMin: { type: Number },
          sets: { type: Number },
          reps: { type: Number },
          restSeconds: { type: Number },
          weight: { type: Number },
          isCompleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

 const Exercise = model('Exercise', ExerciseSchema);

const DailyWorkoutSessionSchema = new Schema(
     {
          workoutPlanId: {
               type: Types.ObjectId,
               ref: 'UserWeeklyWorkoutPlan',
               required: true,
          },
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          title: { type: String },
          workoutType: { type: String, enum: WORKOUT_TYPE },
          intensity: { type: String, enum: INTENSITY },
          estimatedCaloriesBurn: { type: Number },
          isCompleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

 const DailyWorkoutSession = model('DailyWorkoutSession', DailyWorkoutSessionSchema);

const WeeklyWorkoutPlanSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          onboardingAssessmentId: {
               type: Types.ObjectId,
               ref: 'OnboardingAssessment',
          },
          title: { type: String },
          weekStartDate: Date,
          weekEndDate: Date,
     },
     { timestamps: true },
);

 const UserWeeklyWorkoutPlan = model('UserWeeklyWorkoutPlan', WeeklyWorkoutPlanSchema);


const ProgressTrackerSchema = new Schema(
     {
          userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
          date: { type: Date, required: true },
          Image: { type: String },
          notes: { type: String },
     },
     { timestamps: true },
);


const ProgressTracker = model('ProgressTracker', ProgressTrackerSchema);


