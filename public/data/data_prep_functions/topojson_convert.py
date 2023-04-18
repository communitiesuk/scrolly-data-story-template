# -*- coding: utf-8 -*-
"""
Created on Thu Apr 13 14:36:02 2023

@author: gordon.donald
"""

import geopandas
import pandas as pd
import topojson as tp

#Use Regex to find the column with the ONS area codes. 
#This means we can change it to 'GeoCode' for all geographies and use the same svelte function to look at boundaries.

def get_code_column(dataset):
    col = dataset.columns[dataset.stack().str.match('[ESWN][0-9]{8}').groupby(level=1, sort=False).any()]
    if len(col)==0:
        print("ERROR: No columns that look like the contain geography codes found. Checking if the flag entered matches the expected pattern")
        return(0)
    return(col[0])

#Convert files to topojson format and ensure we using CRS svelte code expects
def topojson(file_in, file_out, code_col="auto"):
    shape = geopandas.read_file(file_in)
    shape = shape.to_crs('EPSG:4326')
    if code_col == 'auto':
        code_col = get_code_column(shape)
    shape.columns = shape.columns.str.replace(code_col, "GeoCode")
    tp.Topology(shape).to_json(file_out)
    

topojson("LA_centroid.geojson", "LA_centroid.json")
topojson("tees_lsoas.geojson", 'tess_lsoas.json')
topojson("Local_Authority_Districts_December_2021_GB_BUC_2022_1023427260691650215.geojson", "LAD.json")
