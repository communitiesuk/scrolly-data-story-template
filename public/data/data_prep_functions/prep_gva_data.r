
#Libraries
library(readxl)
library(sf)
library(nomisr)
library(dplyr)


#Read and convert data
#The LSOA GVA data is this one
#https://www.ons.gov.uk/economy/grossvalueaddedgva/datasets/uksmallareagvaestimates
gva_lsoa=read_excel("./uksmallareagvaestimates1998to202023012023150255.xlsx", sheet="Table 1", skip=1)

#We will also get workplace population for the 2011 census from the NOMIS api 
workplace = nomis_get_data(id="NM_1300_1", time="latest", geography="1249902593...1249937345", measures=20100)

#We don't want all of the LSOAs in England, so filter.
tees_valley_LAs = c("Hartlepool", "County Durham", "Middlesbrough", "Darlington",
                    "Stockton-on-Tees", "Redcar and Cleveland")

#This test if any of our list and in the LSOA name
gva_tesside = gva_lsoa[grepl(paste(tees_valley_LAs, collapse="|"), gva_lsoa$`LSOA name`),]

our_lsoas = gva_tesside$`LSOA code`

#For the LSOA map, we don't want the full set, just the ones we will display when we zoom into Teesside.
#We can read from DLUHC Q drive, but super generalised LSOA boundaries are on ONS geoportal 
#https://geoportal.statistics.gov.uk/search?collection=Dataset&sort=name&tags=all(BDY_LSOA%2CDEC_2011)
shape_lsoa = st_read("Q:/GI_Data/Boundaries/LSOA/LSOA_Super_Generalised_2011.shp")
our_shapes = shape_lsoa[shape_lsoa$LSOA11CD %in% our_lsoas,]

#Save our LSOA boundaries. Format doesn't really matter because we'll be compressing anyway.
st_write(our_shapes, "tees_lsoas.geojson")

workplace_reduced=workplace[,c(8,9,15)]
lsoa_data = left_join(gva_tesside, workplace_reduced, by=c('LSOA code'='GEOGRAPHY_CODE'))

#A few column renames.
colnames(lsoa_data)[colnames(lsoa_data) == 'LSOA code'] <- 'code'
colnames(lsoa_data)[colnames(lsoa_data) == 'LSOA name'] <- 'name'
colnames(lsoa_data)[colnames(lsoa_data) == 'OBS_VALUE'] <- 'workplace_pop'

lsoa_data = lsoa_data %>% mutate(across(where(is.numeric), round, digits=2))

lsoa_data$rank = rank(lsoa_data$`2020`)/ max(rank(lsoa_data$`2020`))

#Adjust colnames to make sure they're all strings.
library(stringr)
names(lsoa_data)  = str_replace(names(lsoa_data), "20", "GVA20")
names(lsoa_data)  = str_replace(names(lsoa_data), "19", "GVA19")

#I would also like to create a plot of LSOAs dived into swimlanes.
lsoa_data$jitter = as.numeric(as.factor(lsoa_data$`LAD name`)) + runif(nrow(lsoa_data), -0.25, 0.25)
#And order so they appear alphabetically
lsoa_data = lsoa_data[order(lsoa_data$`LAD name`),]

write.csv(lsoa_data, "../data_lsoa.csv", row.names=F)

#LAD data
#For our app we want to look at different geographies, so get GVA at local authorites
#Can use the ONS subnational indicators explorer for this -- I used the March 2023 version
#https://www.ons.gov.uk/peoplepopulationandcommunity/wellbeing/datasets/subnationalindicatorsdataset
gva_lad = read_excel("humanreadable.xlsx", sheet = "GVA per hour", skip=6)


#These use the 2021 LAD boundaries, which we have downloaded from the ONS geoportal
#https://geoportal.statistics.gov.uk/datasets/ons::local-authority-districts-december-2021-gb-buc-1/explore?location=55.218188%2C-3.265344%2C6.73

#Make sure the GVA data matches the boundaries we'll be using.
la_shape = st_read("Local_Authority_Districts_December_2021_GB_BUC_2022_1023427260691650215.geojson")
la_data = left_join(la_shape, gva_lad, by = c('LAD21CD'='Area Code'))
la_data = st_drop_geometry(la_data[c("LAD21CD", "LAD21NM", "Gross Value Added (GVA) per hour worked (£)")])
#And convert to simpler names to use in the app.
names(la_data) = c("code", "name", "GVA")

#Also want to create some dummy data for LAs to show some map spread. Do north to south?
lat_quintiles = ntile(la_shape$LAT, 5)
la_data$lat1 = as.integer(lat_quintiles<= 1)
la_data$lat2 = as.integer(lat_quintiles<= 2)
la_data$lat3 = as.integer(lat_quintiles<= 3)
la_data$lat4 = as.integer(lat_quintiles<= 4)
la_data$lat5 = as.integer(lat_quintiles<= 5)

#Also add in a column for the rank of GVA, scaled from 0 to 1 for LADs.
la_data$rank = rank(la_data$GVA) / max(rank(la_data$GVA))

write.csv(la_data, "../data_lad.csv", row.names=F)

#I also want some points to plot on our maps.
#Not meaningful, but I will use the centroid of the LAs in Teeside.
teesside_la = la_shape[la_shape$LAD21NM %in% tees_valley_LAs,]
points = st_centroid(teesside_la)
st_write(points, "LA_centroid.geojson")

#Also want a CSV. No useful data here, but we can use the name as our data.
points_data = st_drop_geometry(points[,c(2,3)])
names(points_data) = c('code', 'name')
write.csv(points_data, "../data_points.csv", row.names = F)

#Also, let's use the rank data for both LSOAs and LADs together.

lad_cut = la_data[,c('code', 'name', 'GVA', 'rank')]
lsoa_cut = lsoa_data[,c('code', 'name', 'GVA2020', 'rank')]
lsoa_cut$GVA = -500
lad_cut$GVA2020 = -500
rank_data = rbind(lad_cut, lsoa_cut)
write.csv(rank_data, "../data_scatter.csv", row.names=F)


###FIND VALUES FOR APP.
#These don't go into the data prep
#For reference, let's check which LADs have the 5 lowest GVA.
#We will use the app to look at the lowest and highest areas.
gva_lad[order(gva_lad$`Gross Value Added (GVA) per hour worked (£)`)[1:5],]
#And the 5 highest
gva_lad[order(gva_lad$`Gross Value Added (GVA) per hour worked (£)`, decreasing = T)[1:5],]


#Also good to know what the quintiles for our data are.
#If we wany maps with equal numbers in each colour, use these values.
quantile(lsoa_data$workplace_pop, probs = seq(.0,1.0, by=.2), na.rm = T)
quantile(lsoa_data$`2020`, probs = seq(.0,1.0, by=.2), na.rm = T)

quantile(la_data$GVA, probs = seq(.0,1.0, by=.2), na.rm = T)


