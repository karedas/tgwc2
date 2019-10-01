# TG BUILD

# Development #
 ng build --configuration development --base-href /wclientv2/ --rebase-root-relative-css-urls true

# Prod #
ng build --prod

## Performance Stats ##
source-map-explorer .\main-es2015.*.js

### Book ###
Add user experience  to call page by number


### Make revision ###
ts-node -O '{\"module\": \"commonjs\"}' git.version.ts

