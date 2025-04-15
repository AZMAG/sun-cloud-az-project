# combine MAG's current and future TDM output shapefiles, calculate v/c
# exports the result to shp/combined/travel_demand.shp
# update the values in "setup" below

library(sf)
library(data.table)


options(scipen = 99)

# SETUP ----------------------------------
current_sf <- st_read("shp/MAG_2023_NetworkLoaded.shp")
future_sf <- st_read("shp/MAG_2050_NetworkLoaded.shp")

years <- c(2023, 2050)
# END SETUP ------------------------------
yrs <- sapply(years, function(x) substr(x, nchar(x) - 1, nchar(x)))

# eliminate centroid connectors
current_sf <- current_sf[current_sf$FACTYPE %in% c(1, 2, 3, 4, 6, 9, 10), ]
future_sf <- future_sf[future_sf$FACTYPE %in% c(1, 2, 3, 4, 6, 9, 10), ]

# remove frontage roads
current_sf <- current_sf[!grepl("Frontage Road", current_sf$ST_NAME), ]

intx <- st_touches(current_sf, current_sf)
intx <- sapply(intx, length)
current_sf <- current_sf[intx > 0, ] # remove weird fragments

# reproject
current_sf <- st_transform(current_sf, crs = 2223)
future_sf <- st_transform(future_sf, crs = 2223)


attrs <- as.data.table(st_drop_geometry(current_sf))
attrs[, one_way := is.na(BA_LANES)]
attrs[, lanes := rowSums(.SD, na.rm = TRUE),.SDcols = c("AB_LANES", "BA_LANES")]
attrs[, `:=`(dir = DIR, factype = FACTYPE, st_name = ST_NAME)]

segments <- merge(current_sf[, c("ID", "geometry")], attrs[, .(ID, dir, factype, one_way, lanes, st_name)])

for(n in 1:2) {
  shp <- list(current_sf, future_sf)[[n]]
  DT <- as.data.table(st_drop_geometry(shp))
  
  DT[DT == 99999] <- NA
  DT[DT == 0] <- NA
  
  DT[, adt := rowSums(.SD, na.rm = TRUE), .SDcols = c("AB_24H_FLO", "BA_24H_FLO")]
  DT[, adt := round(adt)]
  
  DT[, min_spd := pmin(AB_AM_SPEE, BA_AM_SPEE, AB_MD_SPEE, BA_MD_SPEE, 
                       AB_PM_SPEE, BA_PM_SPEE,  AB_NT_SPEE, BA_NT_SPEE,
                       na.rm = TRUE)]

  DT[, max_spd := pmax(AB_AM_SPEE, BA_AM_SPEE,  AB_MD_SPEE, BA_MD_SPEE, 
                       AB_PM_SPEE, BA_PM_SPEE,  AB_NT_SPEE, BA_NT_SPEE,
                       na.rm = TRUE)]
  DT[, `:=`(min_spd = round(min_spd, 1), max_spd = round(max_spd, 1))]

  setnames(DT, colnames(DT), tolower(colnames(DT)))
  
  cols <- c("adt", "min_spd", "max_spd")
  ncn <- paste(cols, yrs[n], sep = "_")
  setnames(DT, cols, ncn)
  
  segments <- merge(segments, DT[, c("id", ncn), with = FALSE], by.x = "ID", by.y = "id")
}

segments[, "adt_chg"] <- segments[[paste0("adt_", yrs[2])]] - segments[[paste0("adt_", yrs[1])]]

unlink("shp/combined/", recursive = TRUE); dir.create("shp/combined")
st_write(segments, "shp/combined/travel_demand.shp")
