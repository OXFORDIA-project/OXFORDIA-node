ox_builtin_data_plugin <- function(name) {
  normalized <- ox_normalize_name(name)

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
    ox_node_filter(
      predicates = list(
        ox_predicate_filter(
          rdf_type,
          some = ox_node_selector(ox_node_filter(iri = gist_person))
        )
      )
    )
  }

  categorized_target_path <- function(target_iris) {
    ox_graph_path(
      start = person_start_selector(),
      steps = list(
        ox_traversal_step(gist_is_categorized_by)
      ),
      target = ox_node_selector(ox_node_filter(iri = target_iris))
    )
  }

  magnitude_path <- function(aspect_iri) {
    ox_graph_path(
      start = person_start_selector(),
      steps = list(
        ox_traversal_step(
          gist_has_magnitude,
          where = ox_node_filter(
            predicates = list(
              ox_predicate_filter(
                gist_has_aspect,
                some = ox_node_selector(ox_node_filter(iri = aspect_iri))
              )
            )
          )
        ),
        ox_traversal_step(gist_numeric_value)
      )
    )
  }

  assessment_magnitude_path <- function(assessment_type_iri, aspect_iri, include_produces = FALSE) {
    steps <- list(
      ox_traversal_step(
        gist_has_participant,
        inverse = TRUE,
        where = ox_node_filter(
          predicates = list(
            ox_predicate_filter(
              gist_is_categorized_by,
              some = ox_node_selector(ox_node_filter(iri = assessment_type_iri))
            )
          )
        )
      )
    )

    if (ox_is_true(include_produces)) {
      steps <- c(steps, list(ox_traversal_step(gist_produces)))
    }

    steps <- c(
      steps,
      list(
        ox_traversal_step(
          gist_has_magnitude,
          where = ox_node_filter(
            predicates = list(
              ox_predicate_filter(
                gist_has_aspect,
                some = ox_node_selector(ox_node_filter(iri = aspect_iri))
              )
            )
          )
        ),
        ox_traversal_step(gist_numeric_value)
      )
    )

    ox_graph_path(
      start = person_start_selector(),
      steps = steps
    )
  }

  if (normalized == "nemaline") {
    return(
      ox_data_plugin(
        name = "nemaline",
        description = "Built-in nemaline data plugin shortcut catalog.",
        shortcuts = list(
          PersonId = function() {
            ox_graph_path(
              name = "PersonId",
              start = person_start_selector(),
              steps = list(
                ox_traversal_step(gist_is_identified_by),
                ox_traversal_step(gist_unique_text)
              )
            )
          },
          ClusterCategory = function() {
            path <- categorized_target_path(c(nm_cluster_1, nm_cluster_2, nm_cluster_3))
            path$name <- "ClusterCategory"
            path
          },
          GeneticGroup = function() {
            path <- categorized_target_path(c(
              nm_genetic_variant_1,
              nm_genetic_variant_2,
              nm_genetic_variant_3
            ))
            path$name <- "GeneticGroup"
            path
          },
          AmbulationStatus = function() {
            path <- categorized_target_path(c(nm_status_ambulant, nm_status_non_ambulant))
            path$name <- "AmbulationStatus"
            path
          },
          DominantHand = function() {
            path <- categorized_target_path(c(ox_left_handed, ox_right_handed))
            path$name <- "DominantHand"
            path
          },
          BelowAverageFlag = function() {
            path <- categorized_target_path(nm_performance_below_average)
            path$name <- "BelowAverageFlag"
            path
          },
          BaselineAge = function() {
            path <- magnitude_path(gist_aspect_age)
            path$name <- "BaselineAge"
            path
          },
          LoAAge = function() {
            path <- magnitude_path(nm_aspect_age_at_loss_of_ambulation)
            path$name <- "LoAAge"
            path
          },
          TotalMFM = function() {
            path <- magnitude_path(nm_aspect_mfm32_aggregate_score)
            path$name <- "TotalMFM"
            path
          },
          KaplanMeierEvent = function() {
            path <- assessment_magnitude_path(
              assessment_type_iri = nm_assessment_type_kaplan_meier,
              aspect_iri = nm_aspect_kaplan_meier_event_indicator
            )
            path$name <- "KaplanMeierEvent"
            path
          },
          KaplanMeierTime = function() {
            path <- assessment_magnitude_path(
              assessment_type_iri = nm_assessment_type_kaplan_meier,
              aspect_iri = nm_aspect_kaplan_meier_time_to_event
            )
            path$name <- "KaplanMeierTime"
            path
          },
          MFMVisitTimeFromBaseline = function() {
            path <- assessment_magnitude_path(
              assessment_type_iri = nm_assessment_type_mfm32,
              aspect_iri = nm_aspect_duration_since_study_enrollment
            )
            path$name <- "MFMVisitTimeFromBaseline"
            path
          },
          MFMVisitScore = function() {
            path <- assessment_magnitude_path(
              assessment_type_iri = nm_assessment_type_mfm32,
              aspect_iri = nm_aspect_mfm32_visit_score,
              include_produces = TRUE
            )
            path$name <- "MFMVisitScore"
            path
          }
        )
      )
    )
  }

  stop(sprintf("Unknown built-in data plugin '%s'.", name), call. = FALSE)
}

ox_builtin_stat_plugin <- function(name) {
  normalized <- ox_normalize_name(name)

  if (normalized == "mean") {
    return(
      ox_stat_plugin(
        name = "mean",
        route = "mean",
        description = "Built-in mean statistic plugin.",
        fields = list(
          ox_query_field(
            name = "graph_path",
            json_key = "graphPath",
            kind = "graph_path",
            required = TRUE,
            shortcutable = TRUE
          )
        ),
        parse_result = function(payload, target, spec) {
          data.frame(
            mean = as.numeric(payload$mean %||% NA_real_),
            count = as.integer(round(payload$count %||% NA_real_)),
            stringsAsFactors = FALSE,
            check.names = FALSE
          )
        }
      )
    )
  }

  if (normalized == "kaplan-meier") {
    return(
      ox_stat_plugin(
        name = "kaplan-meier",
        route = "kaplan-meier",
        description = "Built-in Kaplan-Meier statistic plugin.",
        fields = list(
          ox_query_field(
            name = "time_path",
            json_key = "timePath",
            kind = "graph_path",
            required = TRUE,
            shortcutable = TRUE
          ),
          ox_query_field(
            name = "event_path",
            json_key = "eventPath",
            kind = "graph_path",
            required = TRUE,
            shortcutable = TRUE
          ),
          ox_query_field(
            name = "group_by_path",
            json_key = "groupByPath",
            kind = "graph_path",
            required = FALSE,
            shortcutable = TRUE
          )
        ),
        parse_result = function(payload, target, spec) {
          observations <- payload$observations
          if (is.null(observations) || length(observations) == 0) {
            return(ox_empty_df(c("time", "event", "group")))
          }

          rows <- lapply(observations, function(row) {
            data.frame(
              time = as.numeric(row$time %||% NA_real_),
              event = as.logical(row$event %||% NA),
              group = if (is.null(row$group)) NA_character_ else as.character(row$group),
              stringsAsFactors = FALSE,
              check.names = FALSE
            )
          })

          ox_bind_rows_fill(rows)
        }
      )
    )
  }

  stop(sprintf("Unknown built-in statistic plugin '%s'.", name), call. = FALSE)
}
