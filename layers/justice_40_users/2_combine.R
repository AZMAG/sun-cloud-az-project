# after running both BQ queries and saving results from Google Drive into this folder

library(data.table)
options(scipen = 99)

j40_results <- fread("replica_bq_j40_results.csv")
j40_results[, osmid := as.character(osmid)]
j40_trips <- j40_results[, .(j40_trips = sum(trips)), by = osmid]


all_trips <- fread("replica_bq_all_trips_results.csv")
all_trips[, osmid := as.character(osmid)]
all_trips[, all_trips := trips]

both <- merge(all_trips[, .(osmid, all_trips)], 
              j40_trips[, .(osmid, j40_trips)], 
              by = "osmid", all.x = TRUE)

both[!is.na(all_trips) & is.na(j40_trips), j40_trips := 0]
both[, percent_j40 := j40_trips / all_trips]
hist(both$percent_j40)

join_id_lookup <- fread("osmid_join_id_lookup.csv")
join_id_lookup[, osmid := as.character(osmid)]
DT <- merge(both, join_id_lookup, by = "osmid", all.x = TRUE)

by_jid <- DT[, .(trips = sum(all_trips),
                 j40_trips = sum(j40_trips)),
             by = join_id]
hist(by_jid$trips)
by_jid[, percent_j40 := round(j40_trips / trips, 3)]
hist(by_jid$percent_j40)

fwrite(by_jid, "trips_by_join_id.csv")
