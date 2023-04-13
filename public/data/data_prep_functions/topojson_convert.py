# -*- coding: utf-8 -*-
"""
Created on Thu Apr 13 14:36:02 2023

@author: gordon.donald
"""

import geopandas
import pandas as pd
import topojson as tp

#Convert files to topojson format and ensure we using CRS svelte code expects
def topojson(file_in, file_out):
    shape = geopandas.read_file(file_in)
    shape = shape.to_crs('EPSG:4326')
    tp.Topology(shape).to_json(file_out)
    

topojson("LA_centroid.geojson", "LA_centroid.json")
topojson("tees_lsoas.geojson", 'tess_lsoas.json')
