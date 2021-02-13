from flask import request
from api import app
from .tasks import get_vaccine_data

@app.route('/vaccines')
def vaccine_data():
    """
    Retrieves data from COVID-19 Vaccine Distributions Allocations by Jurisdiction as provided by
    HHS ASPA and hosted by data.cdc.gov. Includes vaccine data for both Pfizer and Moderna.
    """
    return get_vaccine_data()
