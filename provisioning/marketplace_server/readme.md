# Blog Server Image

## Build notes
The blog server image exists in both development and production variants, with
the production version additionally containing a copy of the app data, since we
won't be mounting the container host's filesystem in production like we do in
development.
