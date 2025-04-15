library(data.table)


# for the single line to two OSM segments features,
# we intersected the buffered feature with the OSM lines
# keep only the two largest overlaps with the buffer
DT <- fread("centroids_one_to_two_intersect.csv")
DT[, join_id := centroids_single_line_buffer_join_id]
setorder(DT, join_id, -Shape_Length)
DT[, idx := seq_len(.N), by = join_id]
table(DT$idx)

one_two <- DT[idx <= 2, .(join_id, name, osmid = osm_id2)]

one_one <- fread("centroids_dual_line_one_to_one.csv")
one_one[, osmid := osm_id2]
two_two <- fread("centroids_single_line_two_way_to_two_way.csv")
two_two[, osmid := osm_id2]

osm_ids <- c(one_two$osmid, two_two$osmid, one_one$osmid)
osm_ids <- unique(osm_ids)

# write combined OSM IDs to disk
cat(toString(sQuote(osm_ids, FALSE)), file = "osmids.txt")

# now run big query queries!

lookup <- rbindlist(
  list(
    one_one[, .(osmid, join_id)], 
    one_two[, .(osmid, join_id)],
    two_two[, .(osmid, join_id)]
    )
)

fwrite(lookup, "osmid_join_id_lookup.csv")
