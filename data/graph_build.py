# -*- coding: utf-8 -*-
import pandas as pd
import json

df = pd.read_csv("csv-clean.csv")

predicate = list(set(df['predicate'].unique()))
# rankValue = list(set(df['predicate'] = 'rankValue'))
# print rankValue
subjects = list(set(df['subject'].unique()))
# print subjects
# rankValue

json_data = {"nodes":[],"edges":[]}
count = 0

for pred in predicate:
    filtered = df[df['predicate'] == pred]
    print filtered
    
    setdata_sub = set(filtered['subject'].unique())
    # print setdata_sub
    setdata_obj = set(filtered['object'].unique())
    
    setdata  = list(setdata_sub.union(setdata_obj))
    # print setdata

    for val in setdata:
        json_data['nodes'].append({"node_id":count,"value":val})
        count += 1
    for idx,rows in filtered.iterrows():
        s_id = list(filter(lambda x:x["value"] == rows['subject'],json_data['nodes']))[0]['node_id']
        d_id = list(filter(lambda x:x["value"] == rows['object'],json_data['nodes']))[0]['node_id']
        
        json_data['edges'].append({"source":s_id,"destination":d_id,"label":pred})
        
with open('data1.json', 'w') as f:
    json.dump(json_data, f)

