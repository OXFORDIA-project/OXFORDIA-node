#' Return All Nemaline Shortcuts
#'
#' @export
ox_nemaline_shortcuts <- function() {
  builders <- ox_nemaline_shortcut_builders()
  stats::setNames(
    lapply(names(builders), function(name) builders[[name]]()),
    names(builders)
  )
}

#' Look Up a Nemaline Shortcut by Name
#'
#' @param name Shortcut name.
#'
#' @export
ox_nemaline_shortcut <- function(name) {
  builders <- ox_nemaline_shortcut_builders()
  available_names <- names(builders)
  normalized_names <- vapply(
    available_names,
    ox_nemaline_normalize_name,
    character(1)
  )
  match_index <- match(ox_nemaline_normalize_name(name), normalized_names)

  if (is.na(match_index)) {
    stop(
      sprintf(
        "Unknown nemaline shortcut '%s'. Available shortcuts: %s",
        name,
        paste(available_names, collapse = ", ")
      ),
      call. = FALSE
    )
  }

  builders[[match_index]]()
}

ox_nemaline_shortcut_builders <- function() {
  rdf_type <- "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
  gist_person <- "https://w3id.org/semanticarts/ns/ontology/gist/Person"
  gist_is_identified_by <- "https://w3id.org/semanticarts/ns/ontology/gist/isIdentifiedBy"
  gist_unique_text <- "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText"
  gist_is_categorized_by <- "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy"
  gist_has_participant <- "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant"
  gist_has_magnitude <- "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude"
  gist_has_aspect <- "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect"
  gist_numeric_value <- "https://w3id.org/semanticarts/ns/ontology/gist/numericValue"
  gist_produces <- "https://w3id.org/semanticarts/ns/ontology/gist/produces"

  nm_cluster_1 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_1"
  nm_cluster_2 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_2"
  nm_cluster_3 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_3"
  nm_genetic_variant_1 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant1"
  nm_genetic_variant_2 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant2"
  nm_genetic_variant_3 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant3"
  nm_status_ambulant <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_Ambulant"
  nm_status_non_ambulant <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_NonAmbulant"
  ox_left_handed <- "https://paediatrics.ox.ac.uk/terms/LeftHanded"
  ox_right_handed <- "https://paediatrics.ox.ac.uk/terms/RightHanded"
  nm_performance_below_average <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Performance_BelowAverage"
  nm_aspect_age_at_loss_of_ambulation <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfAmbulation"
  nm_aspect_mfm32_aggregate_score <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_AggregateScore"
  nm_assessment_type_kaplan_meier <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier"
  nm_assessment_type_mfm32 <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_MFM32"
  nm_aspect_kaplan_meier_event_indicator <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierEventIndicator"
  nm_aspect_kaplan_meier_time_to_event <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierTimeToEvent"
  nm_aspect_duration_since_study_enrollment <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DurationSinceStudyEnrollment"
  nm_aspect_mfm32_visit_score <- "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_VisitScore"
  gist_aspect_age <- "https://w3id.org/semanticarts/ns/ontology/gist/Aspect_Age"

  person_start_selector <- function() {
    oxfordiar::ox_node_filter(
      predicates = list(
        oxfordiar::ox_predicate_filter(
          rdf_type,
          some = oxfordiar::ox_node_selector(
            oxfordiar::ox_node_filter(iri = gist_person)
          )
        )
      )
    )
  }

  categorized_target_path <- function(target_iris) {
    oxfordiar::ox_graph_path(
      start = person_start_selector(),
      steps = list(
        oxfordiar::ox_traversal_step(gist_is_categorized_by)
      ),
      target = oxfordiar::ox_node_selector(
        oxfordiar::ox_node_filter(iri = target_iris)
      )
    )
  }

  magnitude_path <- function(aspect_iri) {
    oxfordiar::ox_graph_path(
      start = person_start_selector(),
      steps = list(
        oxfordiar::ox_traversal_step(
          gist_has_magnitude,
          where = oxfordiar::ox_node_filter(
            predicates = list(
              oxfordiar::ox_predicate_filter(
                gist_has_aspect,
                some = oxfordiar::ox_node_selector(
                  oxfordiar::ox_node_filter(iri = aspect_iri)
                )
              )
            )
          )
        ),
        oxfordiar::ox_traversal_step(gist_numeric_value)
      )
    )
  }

  assessment_magnitude_path <- function(
    assessment_type_iri,
    aspect_iri,
    include_produces = FALSE
  ) {
    steps <- list(
      oxfordiar::ox_traversal_step(
        gist_has_participant,
        inverse = TRUE,
        where = oxfordiar::ox_node_filter(
          predicates = list(
            oxfordiar::ox_predicate_filter(
              gist_is_categorized_by,
              some = oxfordiar::ox_node_selector(
                oxfordiar::ox_node_filter(iri = assessment_type_iri)
              )
            )
          )
        )
      )
    )

    if (isTRUE(include_produces)) {
      steps <- c(steps, list(oxfordiar::ox_traversal_step(gist_produces)))
    }

    steps <- c(
      steps,
      list(
        oxfordiar::ox_traversal_step(
          gist_has_magnitude,
          where = oxfordiar::ox_node_filter(
            predicates = list(
              oxfordiar::ox_predicate_filter(
                gist_has_aspect,
                some = oxfordiar::ox_node_selector(
                  oxfordiar::ox_node_filter(iri = aspect_iri)
                )
              )
            )
          )
        ),
        oxfordiar::ox_traversal_step(gist_numeric_value)
      )
    )

    oxfordiar::ox_graph_path(start = person_start_selector(), steps = steps)
  }

  list(
    PersonId = function() {
      oxfordiar::ox_data_shortcut(
        name = "PersonId",
        path = oxfordiar::ox_graph_path(
          name = "PersonId",
          start = person_start_selector(),
          steps = list(
            oxfordiar::ox_traversal_step(gist_is_identified_by),
            oxfordiar::ox_traversal_step(gist_unique_text)
          )
        )
      )
    },
    ClusterCategory = function() {
      oxfordiar::ox_data_shortcut(
        name = "ClusterCategory",
        path = categorized_target_path(c(
          nm_cluster_1,
          nm_cluster_2,
          nm_cluster_3
        ))
      )
    },
    GeneticGroup = function() {
      oxfordiar::ox_data_shortcut(
        name = "GeneticGroup",
        path = categorized_target_path(c(
          nm_genetic_variant_1,
          nm_genetic_variant_2,
          nm_genetic_variant_3
        ))
      )
    },
    AmbulationStatus = function() {
      oxfordiar::ox_data_shortcut(
        name = "AmbulationStatus",
        path = categorized_target_path(c(
          nm_status_ambulant,
          nm_status_non_ambulant
        ))
      )
    },
    DominantHand = function() {
      oxfordiar::ox_data_shortcut(
        name = "DominantHand",
        path = categorized_target_path(c(ox_left_handed, ox_right_handed))
      )
    },
    BelowAverageFlag = function() {
      oxfordiar::ox_data_shortcut(
        name = "BelowAverageFlag",
        path = categorized_target_path(nm_performance_below_average)
      )
    },
    BaselineAge = function() {
      oxfordiar::ox_data_shortcut(
        name = "BaselineAge",
        path = magnitude_path(gist_aspect_age)
      )
    },
    LoAAge = function() {
      oxfordiar::ox_data_shortcut(
        name = "LoAAge",
        path = magnitude_path(nm_aspect_age_at_loss_of_ambulation)
      )
    },
    TotalMFM = function() {
      oxfordiar::ox_data_shortcut(
        name = "TotalMFM",
        path = magnitude_path(nm_aspect_mfm32_aggregate_score)
      )
    },
    KaplanMeierEvent = function() {
      oxfordiar::ox_data_shortcut(
        name = "KaplanMeierEvent",
        path = assessment_magnitude_path(
          assessment_type_iri = nm_assessment_type_kaplan_meier,
          aspect_iri = nm_aspect_kaplan_meier_event_indicator
        )
      )
    },
    KaplanMeierTime = function() {
      oxfordiar::ox_data_shortcut(
        name = "KaplanMeierTime",
        path = assessment_magnitude_path(
          assessment_type_iri = nm_assessment_type_kaplan_meier,
          aspect_iri = nm_aspect_kaplan_meier_time_to_event
        )
      )
    },
    MFMVisitTimeFromBaseline = function() {
      oxfordiar::ox_data_shortcut(
        name = "MFMVisitTimeFromBaseline",
        path = assessment_magnitude_path(
          assessment_type_iri = nm_assessment_type_mfm32,
          aspect_iri = nm_aspect_duration_since_study_enrollment
        )
      )
    },
    MFMVisitScore = function() {
      oxfordiar::ox_data_shortcut(
        name = "MFMVisitScore",
        path = assessment_magnitude_path(
          assessment_type_iri = nm_assessment_type_mfm32,
          aspect_iri = nm_aspect_mfm32_visit_score,
          include_produces = TRUE
        )
      )
    }
  )
}

ox_nemaline_normalize_name <- function(value) {
  value <- trimws(value)
  value <- gsub("[_[:space:]-]+", "", value)
  tolower(value)
}
