# TG Development - Comandi utili #
 1. ng serve
 2. gulp generate-sprites &  gulp generate-assetslist (crea le sprites e genera la lista di tutti gli assets per poterli passare al componente di preload).
 3. node git-version.js (setta la versione sulla base del tag settato via git).
 
# TG BUILD

### Server test
 1. ng build --configuration development --base-href /wclientv2/ --rebase-root-relative-css-urls true
### Server produzione
#Prod
 1. ng build --prod