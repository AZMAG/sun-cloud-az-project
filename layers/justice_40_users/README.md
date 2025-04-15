# Disadvantaged Facility Users Layer

Author: Mark Egge
Last Updated: 2/25/2023

This layer estimated the portion of users with a home location in a Justice40 designated disadvantaged area on each facility.

1. Join OSM IDs to Sun Cloud segments. This is a bit tricky, as some roadways represented by a single feature in the Sun Cloud routes layer are represented by two features (dual carriageway) in OSM. In these instances, it is necessary to join OSM IDs of the roads on both sides.

2. Run the Replica queries
https://console.cloud.google.com/bigquery?project=replica-customer

3. Join the replica data back to the segments