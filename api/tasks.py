import os
import re
import pandas as pd
import numpy as np

from flask import jsonify
from sodapy import Socrata

socrata_domain = 'data.cdc.gov'
socrata_token = os.environ.get('SODAPY_APPTOKEN')

pfizer_dataset_identifier = 'saz5-9hgg'
moderna_dataset_identifier = 'b7pe-5nws'
janssen_dataset_identifier = 'w9zu-fywh'

client = Socrata(socrata_domain, socrata_token, timeout=10)

def get_vaccine_data():
    """
    Retrieves and parses COVID-19 vaccine data.

    :return: Returns JSON containing the parsed data.
    """
    pfizer_data = client.get(pfizer_dataset_identifier)
    moderna_data = client.get(moderna_dataset_identifier)
    janssen_data = client.get(janssen_dataset_identifier)

    pfizer_df = pd.DataFrame.from_dict(pfizer_data)
    moderna_df = pd.DataFrame.from_dict(moderna_data)
    janssen_df = pd.DataFrame.from_dict(janssen_data)

    for df in [pfizer_df, moderna_df, janssen_df]:
        df.drop(list(df.filter(regex='2nd_dose')), axis=1, inplace=True)
        df.rename({'_1st_dose_allocations': 'doses'}, axis=1, inplace=True)
        df.rename({'week_of_allocations': 'week'}, axis=1, inplace=True)

    pfizer_dict = pfizer_df.to_dict(orient='records')
    moderna_dict = moderna_df.to_dict(orient='records')
    janssen_dict = janssen_df.to_dict(orient='records')

    return jsonify({'pfizer': pfizer_dict, 'moderna': moderna_dict, 'janssen': janssen_dict})
