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

client = Socrata(socrata_domain, socrata_token, timeout=10)

def get_vaccine_data():
    """
    Retrieves and parses Pfizer and Moderna vaccine data.

    :returns: JSON containing the parsed data.
    """
    pfizer_data = client.get(pfizer_dataset_identifier)
    moderna_data = client.get(moderna_dataset_identifier)

    pfizer_df = pd.DataFrame.from_dict(pfizer_data)
    moderna_df = pd.DataFrame.from_dict(moderna_data)

    for df in [pfizer_df, moderna_df]:
        # Remove hhs_region column
        df.drop('hhs_region', axis=1, inplace=True)

        # Remove second dose data columns
        df.drop(list(df.filter(regex='second')), axis=1, inplace=True)

        # Rename weekly and total dose column names
        df.rename(columns=rename_date_cols, inplace=True)
        df.rename(columns=rename_total_col, inplace=True)

        # Convert NaN to 'N/A'
        df.fillna('N/A', inplace=True)

        # Replace all 'N/A' with zeroes
        df.replace(to_replace='N/A', value='0', inplace=True)

        # Remove thousands separators from numeric strings
        df.replace(',','', regex=True, inplace=True)

    pfizer_dict = pfizer_df.to_dict(orient='records')
    moderna_dict = moderna_df.to_dict(orient='records')

    return jsonify({'pfizer': pfizer_dict, 'moderna': moderna_dict})

# Private

def rename_date_cols(col_name):
    """
    Renames the date column names to a more parsable date format.

    :param col_name: The name of the current column.
    :return: Returns the new column name.
    """
    if re.search(r'[0-9]', col_name):
        if (col_name[-5:-3] == '12'):
            return f'2020_{col_name[-5:]}'
        return f'2021_{col_name[-5:]}'
    else:
        return col_name

def rename_total_col(col_name):
    """
    Renames the total first doses column names.

    :param col_name: The name of the current column.
    :return: Returns the new column name.
    """
    if re.match(r'total', col_name):
        return 'total_first_doses'
    else:
        return col_name
