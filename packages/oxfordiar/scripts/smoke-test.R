# This smoke test is intentionally written as a readable "happy path" example.
# It assumes the required env vars exist and that the Oxfordia packages can be
# loaded from the local checkout.

# Locate the package and workspace roots so the script can load the local
# package sources instead of any older copies installed in the global R library.
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

# Load the smoke-test env file using standard R `readRenviron()` syntax.
if (file.exists(env_file)) {
  readRenviron(env_file)
}

# Load local package sources so the smoke test always reflects the current repo
# state while developing.
pkgload::load_all(
  file.path(workspace_root, "packages", "solidauthr"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar.data.nemaline"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar.stat.mean"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar.stat.kaplanmeier"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)

# Per-request logging is off by default; set `OX_DEBUG=1` to trace every
# request. Failures are reported with full context either way.
debug_enabled <- tolower(Sys.getenv("OX_DEBUG", unset = "")) %in%
  c("1", "true", "yes", "y", "on")
options(oxfordia.debug = debug_enabled, solidauthr.debug = debug_enabled)

# Fail early with a clear list if any required env vars are missing.
required_env <- c(
  "OX_MEAN_SHORTCUT",
  "OX_KAPLAN_MEIER_TIME_SHORTCUT",
  "OX_KAPLAN_MEIER_EVENT_SHORTCUT",
  "OX_KAPLAN_MEIER_GROUP_SHORTCUT",
  "OX_SOLID_ISSUER",
  "OX_SOLID_CLIENT_ID",
  "OX_SOLID_CLIENT_SECRET",
  sprintf("OX_TARGET_%d_SERVER_NAME", 1:3),
  sprintf("OX_TARGET_%d_RESOURCE_URI", 1:3)
)
missing_env <- required_env[!nzchar(trimws(Sys.getenv(required_env)))]
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

# Run one named step of the smoke test. On failure, print which step broke
# along with any request/response context the Oxfordia packages attached, then
# exit non-zero.
run_step <- function(name, expr) {
  cat("==> ", name, "\n", sep = "")
  tryCatch(
    expr,
    error = function(error) {
      cat("\n[FAILED] ", name, "\n", conditionMessage(error), "\n", sep = "")

      context <- error$ox_context %||% list()
      for (field in names(context)) {
        if (identical(field, "request_body") || is.null(context[[field]])) {
          next
        }
        cat(
          "  ",
          field,
          ": ",
          oxfordiar:::ox_render_debug_value(context[[field]], max_chars = 1200L),
          "\n",
          sep = ""
        )
      }
      if (!is.null(context$request_body)) {
        cat(
          "  request_body: ",
          oxfordiar:::ox_render_debug_value(context$request_body, max_chars = 1200L),
          "\n",
          sep = ""
        )
      }

      quit(status = 1, save = "no")
    }
  )
}

cat("Issuer:    ", Sys.getenv("OX_SOLID_ISSUER"), "\n", sep = "")
cat("Client id: ", Sys.getenv("OX_SOLID_CLIENT_ID"), "\n", sep = "")
for (i in 1:3) {
  cat(
    sprintf("Target %d:  ", i),
    Sys.getenv(sprintf("OX_TARGET_%d_SERVER_NAME", i)),
    " -> ",
    Sys.getenv(sprintf("OX_TARGET_%d_RESOURCE_URI", i)),
    "\n",
    sep = ""
  )
}
cat("\n")

# Authenticate once up front so IdP problems (discovery, credentials) are
# reported separately from problems with the pods themselves.
session <- run_step("Solid authentication", {
  session <- solidauthr::solid_session(
    issuer = Sys.getenv("OX_SOLID_ISSUER"),
    client_id = Sys.getenv("OX_SOLID_CLIENT_ID"),
    client_secret = Sys.getenv("OX_SOLID_CLIENT_SECRET")
  )
  session$token()
  session
})
print(session)
cat("\n")

# Share the authenticated session across every target in this smoke test.
auth <- oxfordiar::ox_auth_solid(session = session)

# Build the fixed set of three smoke-test targets directly from env vars.
targets <- oxfordiar::ox_targets(
  oxfordiar::ox_target(
    name = Sys.getenv("OX_TARGET_1_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_1_RESOURCE_URI")
  ),
  oxfordiar::ox_target(
    name = Sys.getenv("OX_TARGET_2_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_2_RESOURCE_URI")
  ),
  oxfordiar::ox_target(
    name = Sys.getenv("OX_TARGET_3_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_3_RESOURCE_URI")
  )
)

# Run the federated mean query and show both the overall summary and the
# original per-target rows.
mean_result <- run_step(
  "Mean query",
  oxfordiar.stat.mean::ox_mean(
    shortcut = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
      "OX_MEAN_SHORTCUT"
    )),
    targets = targets,
    auth = auth
  )
)
cat("Overall mean\n")
print(mean_result$data)
cat("\n")
cat("Per-target means\n")
print(mean_result$by_target)
cat("\n")

# Run the federated Kaplan-Meier query and log only grouped time/event rows.
kaplan_meier_result <- run_step(
  "Kaplan-Meier query",
  oxfordiar.stat.kaplanmeier::ox_kaplan_meier(
    time = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
      "OX_KAPLAN_MEIER_TIME_SHORTCUT"
    )),
    event = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
      "OX_KAPLAN_MEIER_EVENT_SHORTCUT"
    )),
    group_by = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
      "OX_KAPLAN_MEIER_GROUP_SHORTCUT"
    )),
    targets = targets,
    auth = auth
  )
)

print_kaplan_meier_groups <- function(result) {
  grouped <- if (is.null(result$grouped)) list() else result$grouped

  if (length(grouped) == 0 && is.data.frame(result$data) && nrow(result$data) > 0) {
    grouped <- list("<ungrouped>" = result$data)
  }

  for (group_name in names(grouped)) {
    group_data <- grouped[[group_name]]
    if (!is.data.frame(group_data)) {
      next
    }

    cat(group_name, "\n", sep = "")
    print(group_data[, c("time", "event"), drop = FALSE])
    cat("\n")
  }
}

print_kaplan_meier_groups(kaplan_meier_result)

# Render a survival-curve image after logging the tabular result so the smoke
# test leaves behind an artifact that is easy to inspect manually.
output_dir <- file.path(package_root, "smoke-output")
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
plot_path <- file.path(output_dir, "kaplan-meier-survival.png")
# Save a Kaplan-Meier survival plot using the standard `survival` package.
# If grouped data is present, this produces one curve per group on the same plot
save_kaplan_meier_plot <- function(result, output_path) {
  data <- result$data
  if (!is.data.frame(data) || nrow(data) == 0) {
    return(invisible(NULL))
  }

  has_groups <- "group" %in%
    names(data) &&
    any(
      !is.na(data$group) & nzchar(trimws(as.character(data$group)))
    )

  fit <- if (has_groups) {
    survival::survfit(survival::Surv(time, event) ~ group, data = data)
  } else {
    survival::survfit(survival::Surv(time, event) ~ 1, data = data)
  }

  grDevices::png(output_path, width = 1200, height = 800, res = 144)
  on.exit(grDevices::dev.off(), add = TRUE)

  plot(
    fit,
    col = seq_len(max(1, length(fit$strata))),
    lwd = 2,
    xlab = "Time",
    ylab = "Survival probability",
    main = "Kaplan-Meier Survival Curve",
    mark.time = TRUE
  )

  if (has_groups) {
    legend(
      "topright",
      legend = names(fit$strata),
      col = seq_along(fit$strata),
      lwd = 2,
      bty = "n"
    )
  }

  invisible(output_path)
}
save_kaplan_meier_plot(kaplan_meier_result, plot_path)
