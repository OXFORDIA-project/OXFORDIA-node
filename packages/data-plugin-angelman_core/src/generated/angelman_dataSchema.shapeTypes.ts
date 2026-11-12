import type { ShapeType } from "@ldo/ldo";
import { angelmanDataSchemaSchema } from "./angelman_dataSchema.schema";
import { angelmanDataSchemaContext } from "./angelman_dataSchema.context";
import type {
  Person,
  ID,
  BaselineAgeMagnitude,
  StudyVisit,
  VisitAgeMagnitude,
  PedsQLFIMYoungResult,
  FIMYoungFunctioningQ1,
  FIMYoungFunctioningQ2,
  FIMYoungFunctioningQ3,
  FIMYoungFunctioningQ4,
  FIMYoungFunctioningQ5,
  FIMYoungFunctioningQ6,
  FIMYoungEmotionalQ1,
  FIMYoungEmotionalQ2,
  FIMYoungEmotionalQ3,
  FIMYoungEmotionalQ4,
  FIMYoungEmotionalQ5,
  FIMYoungSocialQ1,
  FIMYoungSocialQ2,
  FIMYoungSocialQ3,
  FIMYoungSocialQ4,
  FIMYoungCognitiveQ1,
  FIMYoungCognitiveQ2,
  FIMYoungCognitiveQ3,
  FIMYoungCognitiveQ4,
  FIMYoungCognitiveQ5,
  FIMYoungCommunicationQ1,
  FIMYoungCommunicationQ2,
  FIMYoungCommunicationQ3,
  FIMYoungWorryQ1,
  FIMYoungWorryQ2,
  FIMYoungWorryQ3,
  FIMYoungWorryQ4,
  FIMYoungWorryQ5,
  FIMYoungActivitiesQ1,
  FIMYoungActivitiesQ2,
  FIMYoungActivitiesQ3,
  FIMYoungRelationshipsQ1,
  FIMYoungRelationshipsQ2,
  FIMYoungRelationshipsQ3,
  FIMYoungRelationshipsQ4,
  FIMYoungRelationshipsQ5,
  PedsQLFIM7PlusResult,
  FIM7PhysicalQ1,
  FIM7PhysicalQ2,
  FIM7PhysicalQ3,
  FIM7PhysicalQ4,
  FIM7PhysicalQ5,
  FIM7PhysicalQ6,
  FIM7EmotionalQ1,
  FIM7EmotionalQ2,
  FIM7EmotionalQ3,
  FIM7EmotionalQ4,
  FIM7EmotionalQ5,
  FIM7SocialQ1,
  FIM7SocialQ2,
  FIM7SocialQ3,
  FIM7SocialQ4,
  FIM7CognitiveQ1,
  FIM7CognitiveQ2,
  FIM7CognitiveQ3,
  FIM7CognitiveQ4,
  FIM7CognitiveQ5,
  FIM7CommunicationQ6,
  FIM7CommunicationQ7,
  FIM7CommunicationQ8,
  FIM7WorryQ1,
  FIM7WorryQ2,
  FIM7WorryQ3,
  FIM7WorryQ4,
  FIM7WorryQ5,
  FIM7DailyActivitiesQ1,
  FIM7DailyActivitiesQ2,
  FIM7DailyActivitiesQ3,
  FIM7FamilyRelationshipsQ4,
  FIM7FamilyRelationshipsQ5,
  FIM7FamilyRelationshipsQ6,
  FIM7FamilyRelationshipsQ7,
  FIM7FamilyRelationshipsQ8,
  PedsQLAdultResult,
  AdultItemMagnitude,
} from "./angelman_dataSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes angelman_dataSchema
 * =============================================================================
 */

/**
 * Person ShapeType
 */
export const PersonShapeType: ShapeType<Person> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/PersonShape",
  context: angelmanDataSchemaContext,
};

/**
 * ID ShapeType
 */
export const IDShapeType: ShapeType<ID> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/IDShape",
  context: angelmanDataSchemaContext,
};

/**
 * BaselineAgeMagnitude ShapeType
 */
export const BaselineAgeMagnitudeShapeType: ShapeType<BaselineAgeMagnitude> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
  context: angelmanDataSchemaContext,
};

/**
 * StudyVisit ShapeType
 */
export const StudyVisitShapeType: ShapeType<StudyVisit> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/StudyVisitShape",
  context: angelmanDataSchemaContext,
};

/**
 * VisitAgeMagnitude ShapeType
 */
export const VisitAgeMagnitudeShapeType: ShapeType<VisitAgeMagnitude> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/VisitAgeMagnitude",
  context: angelmanDataSchemaContext,
};

/**
 * PedsQLFIMYoungResult ShapeType
 */
export const PedsQLFIMYoungResultShapeType: ShapeType<PedsQLFIMYoungResult> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLFIMYoungResult",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungFunctioningQ1 ShapeType
 */
export const FIMYoungFunctioningQ1ShapeType: ShapeType<FIMYoungFunctioningQ1> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q1",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungFunctioningQ2 ShapeType
 */
export const FIMYoungFunctioningQ2ShapeType: ShapeType<FIMYoungFunctioningQ2> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q2",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungFunctioningQ3 ShapeType
 */
export const FIMYoungFunctioningQ3ShapeType: ShapeType<FIMYoungFunctioningQ3> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q3",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungFunctioningQ4 ShapeType
 */
export const FIMYoungFunctioningQ4ShapeType: ShapeType<FIMYoungFunctioningQ4> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q4",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungFunctioningQ5 ShapeType
 */
export const FIMYoungFunctioningQ5ShapeType: ShapeType<FIMYoungFunctioningQ5> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q5",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungFunctioningQ6 ShapeType
 */
export const FIMYoungFunctioningQ6ShapeType: ShapeType<FIMYoungFunctioningQ6> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q6",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungEmotionalQ1 ShapeType
 */
export const FIMYoungEmotionalQ1ShapeType: ShapeType<FIMYoungEmotionalQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungEmotionalQ2 ShapeType
 */
export const FIMYoungEmotionalQ2ShapeType: ShapeType<FIMYoungEmotionalQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungEmotionalQ3 ShapeType
 */
export const FIMYoungEmotionalQ3ShapeType: ShapeType<FIMYoungEmotionalQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungEmotionalQ4 ShapeType
 */
export const FIMYoungEmotionalQ4ShapeType: ShapeType<FIMYoungEmotionalQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungEmotionalQ5 ShapeType
 */
export const FIMYoungEmotionalQ5ShapeType: ShapeType<FIMYoungEmotionalQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungSocialQ1 ShapeType
 */
export const FIMYoungSocialQ1ShapeType: ShapeType<FIMYoungSocialQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungSocialQ2 ShapeType
 */
export const FIMYoungSocialQ2ShapeType: ShapeType<FIMYoungSocialQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungSocialQ3 ShapeType
 */
export const FIMYoungSocialQ3ShapeType: ShapeType<FIMYoungSocialQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungSocialQ4 ShapeType
 */
export const FIMYoungSocialQ4ShapeType: ShapeType<FIMYoungSocialQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungCognitiveQ1 ShapeType
 */
export const FIMYoungCognitiveQ1ShapeType: ShapeType<FIMYoungCognitiveQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungCognitiveQ2 ShapeType
 */
export const FIMYoungCognitiveQ2ShapeType: ShapeType<FIMYoungCognitiveQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungCognitiveQ3 ShapeType
 */
export const FIMYoungCognitiveQ3ShapeType: ShapeType<FIMYoungCognitiveQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungCognitiveQ4 ShapeType
 */
export const FIMYoungCognitiveQ4ShapeType: ShapeType<FIMYoungCognitiveQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungCognitiveQ5 ShapeType
 */
export const FIMYoungCognitiveQ5ShapeType: ShapeType<FIMYoungCognitiveQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungCommunicationQ1 ShapeType
 */
export const FIMYoungCommunicationQ1ShapeType: ShapeType<FIMYoungCommunicationQ1> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q1",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungCommunicationQ2 ShapeType
 */
export const FIMYoungCommunicationQ2ShapeType: ShapeType<FIMYoungCommunicationQ2> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q2",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungCommunicationQ3 ShapeType
 */
export const FIMYoungCommunicationQ3ShapeType: ShapeType<FIMYoungCommunicationQ3> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q3",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungWorryQ1 ShapeType
 */
export const FIMYoungWorryQ1ShapeType: ShapeType<FIMYoungWorryQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungWorryQ2 ShapeType
 */
export const FIMYoungWorryQ2ShapeType: ShapeType<FIMYoungWorryQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungWorryQ3 ShapeType
 */
export const FIMYoungWorryQ3ShapeType: ShapeType<FIMYoungWorryQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungWorryQ4 ShapeType
 */
export const FIMYoungWorryQ4ShapeType: ShapeType<FIMYoungWorryQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungWorryQ5 ShapeType
 */
export const FIMYoungWorryQ5ShapeType: ShapeType<FIMYoungWorryQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungActivitiesQ1 ShapeType
 */
export const FIMYoungActivitiesQ1ShapeType: ShapeType<FIMYoungActivitiesQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungActivitiesQ2 ShapeType
 */
export const FIMYoungActivitiesQ2ShapeType: ShapeType<FIMYoungActivitiesQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungActivitiesQ3 ShapeType
 */
export const FIMYoungActivitiesQ3ShapeType: ShapeType<FIMYoungActivitiesQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIMYoungRelationshipsQ1 ShapeType
 */
export const FIMYoungRelationshipsQ1ShapeType: ShapeType<FIMYoungRelationshipsQ1> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q1",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungRelationshipsQ2 ShapeType
 */
export const FIMYoungRelationshipsQ2ShapeType: ShapeType<FIMYoungRelationshipsQ2> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q2",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungRelationshipsQ3 ShapeType
 */
export const FIMYoungRelationshipsQ3ShapeType: ShapeType<FIMYoungRelationshipsQ3> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q3",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungRelationshipsQ4 ShapeType
 */
export const FIMYoungRelationshipsQ4ShapeType: ShapeType<FIMYoungRelationshipsQ4> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q4",
    context: angelmanDataSchemaContext,
  };

/**
 * FIMYoungRelationshipsQ5 ShapeType
 */
export const FIMYoungRelationshipsQ5ShapeType: ShapeType<FIMYoungRelationshipsQ5> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q5",
    context: angelmanDataSchemaContext,
  };

/**
 * PedsQLFIM7PlusResult ShapeType
 */
export const PedsQLFIM7PlusResultShapeType: ShapeType<PedsQLFIM7PlusResult> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLFIM7PlusResult",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7PhysicalQ1 ShapeType
 */
export const FIM7PhysicalQ1ShapeType: ShapeType<FIM7PhysicalQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7PhysicalQ2 ShapeType
 */
export const FIM7PhysicalQ2ShapeType: ShapeType<FIM7PhysicalQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7PhysicalQ3 ShapeType
 */
export const FIM7PhysicalQ3ShapeType: ShapeType<FIM7PhysicalQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7PhysicalQ4 ShapeType
 */
export const FIM7PhysicalQ4ShapeType: ShapeType<FIM7PhysicalQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7PhysicalQ5 ShapeType
 */
export const FIM7PhysicalQ5ShapeType: ShapeType<FIM7PhysicalQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7PhysicalQ6 ShapeType
 */
export const FIM7PhysicalQ6ShapeType: ShapeType<FIM7PhysicalQ6> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q6",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7EmotionalQ1 ShapeType
 */
export const FIM7EmotionalQ1ShapeType: ShapeType<FIM7EmotionalQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7EmotionalQ2 ShapeType
 */
export const FIM7EmotionalQ2ShapeType: ShapeType<FIM7EmotionalQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7EmotionalQ3 ShapeType
 */
export const FIM7EmotionalQ3ShapeType: ShapeType<FIM7EmotionalQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7EmotionalQ4 ShapeType
 */
export const FIM7EmotionalQ4ShapeType: ShapeType<FIM7EmotionalQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7EmotionalQ5 ShapeType
 */
export const FIM7EmotionalQ5ShapeType: ShapeType<FIM7EmotionalQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7SocialQ1 ShapeType
 */
export const FIM7SocialQ1ShapeType: ShapeType<FIM7SocialQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7SocialQ2 ShapeType
 */
export const FIM7SocialQ2ShapeType: ShapeType<FIM7SocialQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7SocialQ3 ShapeType
 */
export const FIM7SocialQ3ShapeType: ShapeType<FIM7SocialQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7SocialQ4 ShapeType
 */
export const FIM7SocialQ4ShapeType: ShapeType<FIM7SocialQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CognitiveQ1 ShapeType
 */
export const FIM7CognitiveQ1ShapeType: ShapeType<FIM7CognitiveQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CognitiveQ2 ShapeType
 */
export const FIM7CognitiveQ2ShapeType: ShapeType<FIM7CognitiveQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CognitiveQ3 ShapeType
 */
export const FIM7CognitiveQ3ShapeType: ShapeType<FIM7CognitiveQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CognitiveQ4 ShapeType
 */
export const FIM7CognitiveQ4ShapeType: ShapeType<FIM7CognitiveQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CognitiveQ5 ShapeType
 */
export const FIM7CognitiveQ5ShapeType: ShapeType<FIM7CognitiveQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CommunicationQ6 ShapeType
 */
export const FIM7CommunicationQ6ShapeType: ShapeType<FIM7CommunicationQ6> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q6",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CommunicationQ7 ShapeType
 */
export const FIM7CommunicationQ7ShapeType: ShapeType<FIM7CommunicationQ7> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q7",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7CommunicationQ8 ShapeType
 */
export const FIM7CommunicationQ8ShapeType: ShapeType<FIM7CommunicationQ8> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q8",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7WorryQ1 ShapeType
 */
export const FIM7WorryQ1ShapeType: ShapeType<FIM7WorryQ1> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q1",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7WorryQ2 ShapeType
 */
export const FIM7WorryQ2ShapeType: ShapeType<FIM7WorryQ2> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q2",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7WorryQ3 ShapeType
 */
export const FIM7WorryQ3ShapeType: ShapeType<FIM7WorryQ3> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q3",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7WorryQ4 ShapeType
 */
export const FIM7WorryQ4ShapeType: ShapeType<FIM7WorryQ4> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q4",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7WorryQ5 ShapeType
 */
export const FIM7WorryQ5ShapeType: ShapeType<FIM7WorryQ5> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q5",
  context: angelmanDataSchemaContext,
};

/**
 * FIM7DailyActivitiesQ1 ShapeType
 */
export const FIM7DailyActivitiesQ1ShapeType: ShapeType<FIM7DailyActivitiesQ1> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q1",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7DailyActivitiesQ2 ShapeType
 */
export const FIM7DailyActivitiesQ2ShapeType: ShapeType<FIM7DailyActivitiesQ2> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q2",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7DailyActivitiesQ3 ShapeType
 */
export const FIM7DailyActivitiesQ3ShapeType: ShapeType<FIM7DailyActivitiesQ3> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q3",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7FamilyRelationshipsQ4 ShapeType
 */
export const FIM7FamilyRelationshipsQ4ShapeType: ShapeType<FIM7FamilyRelationshipsQ4> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q4",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7FamilyRelationshipsQ5 ShapeType
 */
export const FIM7FamilyRelationshipsQ5ShapeType: ShapeType<FIM7FamilyRelationshipsQ5> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q5",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7FamilyRelationshipsQ6 ShapeType
 */
export const FIM7FamilyRelationshipsQ6ShapeType: ShapeType<FIM7FamilyRelationshipsQ6> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q6",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7FamilyRelationshipsQ7 ShapeType
 */
export const FIM7FamilyRelationshipsQ7ShapeType: ShapeType<FIM7FamilyRelationshipsQ7> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q7",
    context: angelmanDataSchemaContext,
  };

/**
 * FIM7FamilyRelationshipsQ8 ShapeType
 */
export const FIM7FamilyRelationshipsQ8ShapeType: ShapeType<FIM7FamilyRelationshipsQ8> =
  {
    schema: angelmanDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q8",
    context: angelmanDataSchemaContext,
  };

/**
 * PedsQLAdultResult ShapeType
 */
export const PedsQLAdultResultShapeType: ShapeType<PedsQLAdultResult> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLAdultResult",
  context: angelmanDataSchemaContext,
};

/**
 * AdultItemMagnitude ShapeType
 */
export const AdultItemMagnitudeShapeType: ShapeType<AdultItemMagnitude> = {
  schema: angelmanDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/angelman/terms/AdultItemMagnitude",
  context: angelmanDataSchemaContext,
};
