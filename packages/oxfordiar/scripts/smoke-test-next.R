# Smoke test for the nemaline pilot analysis: federation summary, baseline
# table, statistical comparison and a Kaplan-Meier curve, run against pods
# holding data uploaded with the nemaline pilot CSV importer.
#
# Uses the same env file as smoke-test.R (OX_SOLID_* and OX_TARGET_n_*), with
# one to three targets. Fields are nemaline shortcuts; run
# `names(oxfordiar.data.nemaline::ox_nemaline_shortcuts())` for the full list.
#
# Results come back as `result$data` (combined across sites) and
# `result$per_site` (one block of rows per site). Grouped results have one row
# per group; a site withholds any cell below its minimum count, and
# `suppressed_sites` says how many sites did so for each combined cell.

script_path <- sub(
  "^--file=",
  "",
  grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)[[1]]
)
package_root <- normalizePath(
  file.path(dirname(script_path), ".."),
  mustWork = TRUE
)
workspace_root <- normalizePath(
  file.path(package_root, "..", ".."),
  mustWork = TRUE
)
env_file <- Sys.getenv("OX_ENV_FILE", unset = file.path(package_root, ".env"))
if (file.exists(env_file)) {
  readRenviron(env_file)
}

# Load local package sources so the smoke test reflects the current checkout.
for (package_name in c(
  "solidauthr",
  "oxfordiar",
  "oxfordiar.data.nemaline",
  "oxfordiar.stat.count",
  "oxfordiar.stat.mean",
  "oxfordiar.stat.standarddeviation",
  "oxfordiar.stat.kaplanmeier"
)) {
  pkgload::load_all(
    file.path(workspace_root, "packages", package_name),
    export_all = FALSE,
    helpers = FALSE,
    quiet = TRUE
  )
}

debug_enabled <- tolower(Sys.getenv("OX_DEBUG", unset = "")) %in%
  c("1", "true", "yes", "y", "on")
options(oxfordia.debug = debug_enabled, solidauthr.debug = debug_enabled)

target_indices <- which(nzchar(Sys.getenv(sprintf(
  "OX_TARGET_%d_RESOURCE_URI",
  1:3
))))
required_env <- c(
  "OX_SOLID_ISSUER",
  "OX_SOLID_CLIENT_ID",
  "OX_SOLID_CLIENT_SECRET",
  sprintf("OX_TARGET_%d_SERVER_NAME", target_indices)
)
missing_env <- required_env[!nzchar(trimws(Sys.getenv(required_env)))]
if (length(target_indices) == 0) {
  missing_env <- c(missing_env, "OX_TARGET_1_RESOURCE_URI")
}
if (length(missing_env) > 0) {
  stop(
    sprintf(
      "Missing env vars (from %s): %s",
      env_file,
      paste(missing_env, collapse = ", ")
    ),
    call. = FALSE
  )
}

`%||%` <- function(x, y) if (is.null(x)) y else x

# Run one named step; on failure print the request/response context the
# Oxfordia packages attached and exit non-zero.
run_step <- function(name, expr) {
  cat("\n==> ", name, "\n", sep = "")
  tryCatch(
    expr,
    error = function(error) {
      cat("\n[FAILED] ", name, "\n", conditionMessage(error), "\n", sep = "")
      context <- error$ox_context %||% list()
      for (field in names(context)) {
        if (is.null(context[[field]])) {
          next
        }
        cat(
          "  ",
          field,
          ": ",
          oxfordiar:::ox_render_debug_value(
            context[[field]],
            max_chars = 1200L
          ),
          "\n",
          sep = ""
        )
      }
      quit(status = 1, save = "no")
    }
  )
}

session <- run_step("Solid authentication", {
  session <- solidauthr::solid_session(
    issuer = Sys.getenv("OX_SOLID_ISSUER"),
    client_id = Sys.getenv("OX_SOLID_CLIENT_ID"),
    client_secret = Sys.getenv("OX_SOLID_CLIENT_SECRET")
  )
  session$token()
  session
})
auth <- oxfordiar::ox_auth_solid(session = session)
targets <- do.call(
  oxfordiar::ox_targets,
  lapply(target_indices, function(i) {
    oxfordiar::ox_target(
      name = Sys.getenv(sprintf("OX_TARGET_%d_SERVER_NAME", i)),
      resource_uri = Sys.getenv(sprintf("OX_TARGET_%d_RESOURCE_URI", i))
    )
  })
)

field <- oxfordiar.data.nemaline::ox_nemaline_shortcut

########### 1 Federation Summary ###########

N_res <- run_step("Participant count", {
  ox_count(field("Participant"), targets = targets, auth = auth)
})
print(N_res$data$count) # Total number of participants
print(N_res$per_site[, c("target", "count")]) # Participants by site

########### 2 Baseline Table ###########

N_genetic <- run_step("Participants by causative gene", {
  ox_count(
    field("Participant"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})
print(N_genetic$data) # One row per gene: count, sites, suppressed_sites

N_gender_genetic <- run_step("Participants by causative gene and gender", {
  ox_count(
    field("Participant"),
    targets = targets,
    auth = auth,
    group_by = list(field("CausativeGene"), field("GenderAssignedAtBirth"))
  )
})
# Gene in the columns, gender in the rows (suppressed cells are NA).
print(xtabs(
  count ~ GenderAssignedAtBirth + CausativeGene,
  data = N_gender_genetic$data,
  addNA = TRUE
))

N_ageB_genetic_mean <- run_step("Mean baseline age by gene", {
  ox_mean(
    field("BaselineAge"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})
print(N_ageB_genetic_mean$data)

# SD is pooled across sites, so it is the SD of the combined sample.
N_ageB_genetic_sd <- run_step("SD of baseline age by gene", {
  ox_standard_deviation(
    field("BaselineAge"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})
print(N_ageB_genetic_sd$data)

# Height and weight Z-scores (UK-WHO reference, as sitar::LMS2z(..., "ukwhopt"))
# are computed during CSV upload, so they can be queried like any other field:
#   "ZScoreH" - height-for-age Z-score at baseline
#   "ZScoreW" - weight-for-age Z-score at baseline
# Participants over 20 years old (outside the reference) have no Z-score.

N_heightZ_genetic_mean <- run_step("Mean height Z-score by gene", {
  ox_mean(
    field("ZScoreH"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})
print(N_heightZ_genetic_mean$data)

N_heightZ_genetic_sd <- run_step("SD of height Z-score by gene", {
  ox_standard_deviation(
    field("ZScoreH"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})
print(N_heightZ_genetic_sd$data)

# Baseline functional status is computed during CSV upload:
#   "currentFN" - "Walker" if ambulant at baseline, otherwise "Sitter" if
#                 independently sitting at baseline, otherwise "Non-Sitter"

N_BaseFN <- run_step("Participants by gene and functional status", {
  ox_count(
    field("Participant"),
    targets = targets,
    auth = auth,
    group_by = list(field("CausativeGene"), field("currentFN"))
  )
})
print(xtabs(
  count ~ CurrentFN + CausativeGene,
  data = N_BaseFN$data,
  addNA = TRUE
))

########### 3 Statistical Comparison ###########

# For continuous variables, combine the mean and SD for each group.

N_ageB_mean <- run_step("Mean baseline age by gene (comparison)", {
  ox_mean(
    field("BaselineAge"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})
N_ageB_sd <- run_step("SD of baseline age by gene (comparison)", {
  ox_standard_deviation(
    field("BaselineAge"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})

comparison <- merge(
  N_ageB_mean$data[, c("CausativeGene", "mean", "count")],
  N_ageB_sd$data[, c("CausativeGene", "standard_deviation")],
  by = "CausativeGene"
)
print(comparison)
print(N_ageB_mean$per_site) # Per-site means by gene

########### 4 KM Age at attaining ambulation ##########

# The Kaplan-Meier event and time are computed during CSV upload:
#   "AmbGainEvent" - 1 if ambulation was ever achieved, otherwise 0
#   "AmbGainTime"  - age ambulation was achieved (18 if achieved but age not
#                    recorded); otherwise age at baseline visit (censored)
# Each site drops genes with fewer participants than its k-anonymity.

result <- run_step("Kaplan-Meier: age at attaining ambulation by gene", {
  ox_kaplan_meier(
    time = field("AmbGainTime"),
    event = field("AmbGainEvent"),
    targets = targets,
    auth = auth,
    group_by = field("CausativeGene")
  )
})

# Keep the well-populated genes; some will have low incidence or few events,
# so their curves would just be noise.
genes_to_plot <- Sys.getenv("OX_KM_GENES", unset = "NEB,ACTA1")
genes_to_plot <- trimws(strsplit(genes_to_plot, ",")[[1]])
km_data <- result$data[result$data$group %in% genes_to_plot, , drop = FALSE]
print(table(km_data$group, km_data$event))

cat("\nAll smoke-test-next steps completed.\n")
