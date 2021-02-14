import os
from flask import request
from api import app
from .tasks import get_vaccine_data

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/vaccines')
def vaccine_data():
    """
    Retrieves data from COVID-19 Vaccine Distributions Allocations by Jurisdiction as provided by
    HHS ASPA and hosted by data.cdc.gov. Includes vaccine data for both Pfizer and Moderna.
    """
    return get_vaccine_data()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
