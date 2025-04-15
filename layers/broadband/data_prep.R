library(data.table)
library(sf)
library(mapview)
library(tidycensus)

options(scipen = 99)
options(tigris_use_cache = TRUE)

# run for 1km, 2.5km, and 5km shapefiles
#for(resolution in c("1km", "2500m", "5km")) {
resolution <- "1km"
input_file <- paste0("hexbins/hexbin_", resolution, ".shp")
output_file <- paste0("out/broadband_hexbin_stats_", resolution, ".gpkg")

hexbin <- st_read(input_file)

hex <- st_transform(hexbin, 2223)
hex$area_hex <- st_area(hex)


if(!"pts" %in% ls()) {
  pts <- rbindlist(lapply(list.files(path = "ookla_data/", pattern = "*.csv", full.names = TRUE), fread))
  shp <- st_as_sf(pts, coords = c("attr_location_longitude", "attr_location_latitude"), crs = 4326)
} 

counties <- c("Pinal County", "Maricopa County", "Santa Cruz County", "Pima County", 
              "Cochise County")
#st_read("counties/counties.shp")
# counties <- st_transform(counties, 2223)
# area <- counties %>% # select the central parts
#   st_buffer(0.5) %>% # make a buffer of half a meter around all parts (to avoid slivers)
#   st_union() %>% # unite to a geometry object
#   st_sf()

# ovr <- st_intersects(hh, area, sparse = FALSE)
# hh <- hh[ovr[,1], ] # filter to just overlapping block groups

# filter to only hexes with populations > 0
pop20 <- get_decennial(geography = "block", variables = "P1_001N", 
                       year = 2020, state = "AZ", 
                       county = counties,
                       geometry = TRUE)
#mapview(pop20, zcol = "value")
pop20 <- pop20[pop20$value > 0, ]
pop20 <- st_transform(pop20, 2223)
pop20$area_blk <- st_area(pop20)

# apportion and count people
intx <- st_intersection(hex, pop20)
intx$area_intx <- st_area(intx)
intx_dt <- as.data.table(st_drop_geometry(intx))
intx_dt[, pct := area_intx / area_blk]
intx_dt[, pop_apportioned := value * pct]
hex_pop <- intx_dt[, .(population = as.integer(sum(pop_apportioned))), by = id]
hexbin <- merge(hexbin, hex_pop)

mapview(hexbin, zcol = "population")

# apportion and count households
hh <- get_acs(geography = "block group", variables = c("B11001A_001"), 
              year = 2020, state = "AZ", county = counties, geometry = TRUE)
hh <- st_transform(hh, 2223)
hh$area_bg <- st_area(hh)
intx <- st_intersection(hex, hh)
intx$area_intx <- st_area(intx)
intx_dt <- as.data.table(st_drop_geometry(intx))
intx_dt[, pct_of_bg := area_intx / area_bg]
intx_dt[, hh_apportioned := estimate * pct_of_bg]

hex_hh <- intx_dt[, .(households = as.integer(sum(hh_apportioned))), by = id]

# add household count to hexbins and remove unpopulated hexes
hexbin <- merge(hexbin, hex_hh)
mapview(hexbin, zcol = "households")


# Add Ookla Data ----
hexbin <- st_transform(hexbin, 4326)

pts_hex <- st_join(shp, hexbin)

stats <- as.data.table(st_drop_geometry(pts_hex))

stats[, type := "fixed"] # group tests into fixed and mobile
stats[attr_portal_categories %in% c("Mobile Broadband"), type := "mobile"]

stats <- stats[, .(count = .N,
                   download = quantile(val_download_mbps, 0.8),
                   upload = quantile(val_upload_mbps, 0.8)), 
               by = .(id, type)]

stats[download >= 0 & upload >= 0, category := "Limited"]
stats[download >= 25 & upload >= 3, category := "Basic"]
stats[download >= 100 & upload >= 10, category := "Good"]
stats[download >= 250 & upload >= 20, category := "Best"]

stats_wide <- dcast(stats, id ~ type, value.var = c("count", "download", "upload", "category"))

hexbin <- merge(hexbin, stats_wide, by = "id", all.x = TRUE)
hexbin[is.na(hexbin$category_fixed), ]$category_fixed <- "No records"
hexbin[is.na(hexbin$category_mobile), ]$category_mobile <- "No records"

table(hexbin$category_fixed, useNA = "ifany")
mapview(hexbin, zcol = "category_fixed")

st_write(hexbin, output_file, delete_dsn = TRUE)  

