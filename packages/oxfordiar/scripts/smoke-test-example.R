# Example analysis for the nemaline pilot: federation summary, baseline
# table, statistical comparison and a Kaplan-Meier curve, run against pods
# holding data uploaded with the nemaline pilot CSV importer.
#
# A simpler version of smoke-test-next.R for running in RStudio. It assumes:
#   - the packages below are installed (see "Running the smoke test without a
#     clone" in packages/oxfordiar/README.md), and
#   - your ~/.Renviron sets OX_SOLID_ISSUER, OX_SOLID_CLIENT_ID,
#     OX_SOLID_CLIENT_SECRET and, for each site n = 1, 2, 3, ...,
#     OX_TARGET_n_SERVER_NAME and OX_TARGET_n_RESOURCE_URI.
#     Restart R after editing ~/.Renviron so the values are picked up.
#
# Results come back as `result$data` (combined across sites) and
# `result$per_site` (one block of rows per site). Grouped results have one row
# per group; a site withholds any cell below its minimum count, and
# `suppressed_sites` says how many sites did so for each combined cell.
#
# Fields are nemaline shortcuts; run
# `names(ox_nemaline_shortcuts())` for the full list.

library(solidauthr)
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.count)
library(oxfordiar.stat.mean)
library(oxfordiar.stat.standarddeviation)
library(oxfordiar.stat.kaplanmeier)

########### Connect ###########

session <- solid_session(
  issuer = Sys.getenv("OX_SOLID_ISSUER"),
  client_id = Sys.getenv("OX_SOLID_CLIENT_ID"),
  client_secret = Sys.getenv("OX_SOLID_CLIENT_SECRET")
)
auth <- ox_auth_solid(session = session)

# One target per site: find every OX_TARGET_<n>_RESOURCE_URI set in
# ~/.Renviron (any number of sites) and pull out the <n>s.
uri_vars <- grep("^OX_TARGET_[0-9]+_RESOURCE_URI$", names(Sys.getenv()), value = TRUE)
site_numbers <- sort(as.integer(gsub("[^0-9]", "", uri_vars)))
targets <- do.call(ox_targets, lapply(site_numbers, function(i) {
  ox_target(
    name = Sys.getenv(sprintf("OX_TARGET_%d_SERVER_NAME", i)),
    resource_uri = Sys.getenv(sprintf("OX_TARGET_%d_RESOURCE_URI", i))
  )
}))

field <- ox_nemaline_shortcut

########### 1 Federation Summary ###########

N_res <- ox_count(field("Participant"), targets = targets, auth = auth)
print(N_res$data$count) # Total number of participants
print(N_res$per_site[, c("target", "count")]) # Participants by site

########### 2 Baseline Table ###########

N_genetic <- ox_count(
  field("Participant"),
  targets = targets,
  auth = auth,
  group_by = field("CausativeGene")
)
print(N_genetic$data) # One row per gene: count, sites, suppressed_sites

N_gender_genetic <- ox_count(
  field("Participant"),
  targets = targets,
  auth = auth,
  group_by = list(field("CausativeGene"), field("GenderAssignedAtBirth"))
)
# Gene in the columns, gender in the rows (suppressed cells are NA).
print(xtabs(
  count ~ GenderAssignedAtBirth + CausativeGene,
  data = N_gender_genetic$data,
  addNA = TRUE
))

N_ageB_genetic_mean <- ox_mean(
  field("BaselineAge"),
  targets = targets,
  auth = auth,
  group_by = field("CausativeGene")
)
print(N_ageB_genetic_mean$data)

# SD is pooled across sites, so it is the SD of the combined sample.
N_ageB_genetic_sd <- ox_standard_deviation(
  field("BaselineAge"),
  targets = targets,
  auth = auth,
  group_by = field("CausativeGene")
)
print(N_ageB_genetic_sd$data)

# Height and weight Z-scores (UK-WHO reference, as sitar::LMS2z(..., "ukwhopt"))
# are computed during CSV upload, so they can be queried like any other field:
#   "ZScoreH" - height-for-age Z-score at baseline
#   "ZScoreW" - weight-for-age Z-score at baseline
# Participants over 20 years old (outside the reference) have no Z-score.

N_heightZ_genetic_mean <- ox_mean(
  field("ZScoreH"),
  targets = targets,
  auth = auth,
  group_by = field("CausativeGene")
)
print(N_heightZ_genetic_mean$data)

N_heightZ_genetic_sd <- ox_standard_deviation(
  field("ZScoreH"),
  targets = targets,
  auth = auth,
  group_by = field("CausativeGene")
)
print(N_heightZ_genetic_sd$data)

# Baseline functional status is computed during CSV upload:
#   "currentFN" - "Walker" if ambulant at baseline, otherwise "Sitter" if
#                 independently sitting at baseline, otherwise "Non-Sitter"

N_BaseFN <- ox_count(
  field("Participant"),
  targets = targets,
  auth = auth,
  group_by = list(field("CausativeGene"), field("currentFN"))
)
print(xtabs(
  count ~ CurrentFN + CausativeGene,
  data = N_BaseFN$data,
  addNA = TRUE
))

########### 3 Statistical Comparison ###########

# For continuous variables, combine the mean and SD for each group
# (reusing the baseline age results from section 2).

comparison <- merge(
  N_ageB_genetic_mean$data[, c("CausativeGene", "mean", "count")],
  N_ageB_genetic_sd$data[, c("CausativeGene", "standard_deviation")],
  by = "CausativeGene"
)
print(comparison)
print(N_ageB_genetic_mean$per_site) # Per-site means by gene

########### 4 KM Age at attaining ambulation ##########

# The Kaplan-Meier event and time are computed during CSV upload:
#   "AmbGainEvent" - 1 if ambulation was ever achieved, otherwise 0
#   "AmbGainTime"  - age ambulation was achieved (18 if achieved but age not
#                    recorded); otherwise age at baseline visit (censored)
# Each site drops genes with fewer participants than its k-anonymity.

km <- ox_kaplan_meier(
  time = field("AmbGainTime"),
  event = field("AmbGainEvent"),
  targets = targets,
  auth = auth,
  group_by = field("CausativeGene")
)

# Keep the well-populated genes; some will have low incidence or few events,
# so their curves would just be noise.
genes_to_plot <- c("NEB", "ACTA1")
km_data <- km$data[km$data$group %in% genes_to_plot, , drop = FALSE]
print(table(km_data$group, km_data$event))
