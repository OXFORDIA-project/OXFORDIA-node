########### 1 Federation Summary ###########

N_res <- oxfordia_count(
  # Would it be possible to have a function that just returns counts, in the
  # same way the function does the mean. 
  targets = targets,
  auth = auth
)
N_res$n #Total number of participants 
N_res$per_site #Total number of participants by site


########### 2 Baseline Table ###########


N_genetic <- oxfordia_count( 
  # For the same count function if we could count with respect to path that would 
  # be great
  targets = targets,
  auth = auth,
  group_path = "Causative gene"
)
N_genetic$value # tibble with columns corresponding to Causitive gene, 
                # and row containing count

N_gender_genetic <- oxfordia_count( 
  # For the same count function if we could count with respect to path that would 
  # be great
  targets = targets,
  auth = auth,
  group_path = "Causative gene",
  graph_path = "Gender"
)

N_genetic$value # tibble with columns corresponding to 'Causitive gene', 
                # and rows containing counts for each unique option of 'Gender'

N_ageB_genetic_mean <- oxfordia_mean(
  targets = targets,
  auth = auth,
  group_path = "Causative gene", #Could we add a grouping variable into the function?
  graph_path = "Decimal age conversion (Baseline visit)"
)

N_ageB_genetic_sd <- oxfordia_sd(
  # We have to have some measure of spread- I think the SD is easiest as it can 
  # be easily pooled?
  targets = targets,
  auth = auth,
  group_path = "Causative gene",
  graph_path = "Decimal age conversion (Baseline visit)"
)

# Height and weight Z-scores (UK-WHO reference, as sitar::LMS2z(..., "ukwhopt"))
# are computed during CSV upload, so they can be queried like any other field:
#   "ZScoreH" - height-for-age Z-score at baseline
#   "ZScoreW" - weight-for-age Z-score at baseline
# Participants over 20 years old (outside the reference) have no Z-score.

N_heightZ_genetic_mean <- oxfordia_mean(
  targets = targets,
  auth = auth,
  group_path = "Causative gene", 
  graph_path = "ZScoreH"
)

N_heightZ_genetic_sd <- oxfordia_sd(
  targets = targets,
  auth = auth,
  group_path = "Causative gene",
  graph_path = "ZScoreH"
)

# Baseline functional status is computed during CSV upload:
#   "currentFN" - "Walker" if ambulant at baseline, otherwise "Sitter" if
#                 independently sitting at baseline, otherwise "Non-Sitter"

N_BaseFN <- oxfordia_count( 
  targets = targets,
  auth = auth,
  group_path = "Causative gene",
  graph_path = "currentFN"
)
N_BaseFN$value 

########### 3 Statistical Comparison ########### 

# For continuous variables, we can get from combining the mean and SD functions for given groups 

N_ageB_mean <- oxfordia_mean(
  targets = targets,
  auth = auth,
  group_path = "Causative gene", 
  graph_path = "Decimal age conversion (Baseline visit)"
)

N_ageB_sd <- oxfordia_sd(
  targets = targets,
  auth = auth,
  group_path = "Causative gene",
  graph_path = "Decimal age conversion (Baseline visit)"
)

N_ageB_mean$per_site # tibble with columns corresponding to 'Causative gene', 
# and rows containing counts for each unique option of 'Gender'

########### 4 KM Age at attaining ambulation ##########

# The Kaplan-Meier event and time are computed during CSV upload:
#   "AmbGainEvent" - 1 if ambulation was ever achieved, otherwise 0
#   "AmbGainTime"  - age ambulation was achieved (18 if achieved but age not
#                    recorded); otherwise age at baseline visit (censored)

result <- oxfordia_kaplan_meier(
  targets = targets,
  auth = auth,
  timepath = "AmbGainTime",
  event-path = "AmbGainEvent",
  stratify_path = "Causative gene")

result <- result %>% filter(result$stratify_path %in% c("XX","XX")) 
# Crucial as some of the groups will have low incidence or events, 
# so on the graph will just be super noisy!

